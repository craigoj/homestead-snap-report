import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from './useAuth';
import { JumpstartMode, Prompt, getPromptsForMode } from '@/lib/jumpstart/prompts';
import { toast } from 'sonner';

interface JumpstartSession {
  id: string;
  user_id: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
  items_target: number;
  items_completed: number;
  total_value: number;
  completed: boolean;
  skipped: boolean;
}

interface UseJumpstartSessionReturn {
  session: JumpstartSession | null;
  currentPrompt: Prompt | null;
  currentPromptIndex: number;
  progress: number;
  startSession: (mode: JumpstartMode) => Promise<void>;
  completePrompt: (assetId: string, value: number) => Promise<void>;
  skipPrompt: () => Promise<void>;
  completeSession: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export const useJumpstartSession = (): UseJumpstartSessionReturn => {
  const { user } = useAuth();
  const [session, setSession] = useState<JumpstartSession | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get current prompt based on session mode and index
  const currentPrompt = session 
    ? getPromptsForMode(session.mode)[currentPromptIndex] || null
    : null;

  // Calculate progress percentage
  const progress = session 
    ? Math.round((session.items_completed / session.items_target) * 100)
    : 0;

  // Load active session on mount
  useEffect(() => {
    const loadActiveSession = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('jumpstart_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', false)
          .eq('skipped', false)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSession(data);
          
          // Load current prompt index from completed prompts
          const { data: prompts, error: promptsError } = await supabase
            .from('jumpstart_prompts')
            .select('*')
            .eq('session_id', data.id)
            .order('prompt_index', { ascending: true });

          if (promptsError) throw promptsError;

          // Find the first incomplete prompt
          const incompleteIndex = prompts?.findIndex(p => !p.completed && !p.skipped) ?? -1;
          if (incompleteIndex >= 0) {
            setCurrentPromptIndex(incompleteIndex);
          } else {
            // All prompts complete or skipped, set to next index
            setCurrentPromptIndex(prompts?.length ?? 0);
          }
        }
      } catch (err) {
        console.error('Error loading jumpstart session:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveSession();
  }, [user]);

  // Start a new session
  const startSession = useCallback(async (mode: JumpstartMode) => {
    if (!user) {
      toast.error('Please sign in to start a jumpstart session');
      return;
    }

    try {
      setIsLoading(true);

      // Create session
      const { data: newSession, error: sessionError } = await supabase
        .from('jumpstart_sessions')
        .insert({
          user_id: user.id,
          mode: mode.id,
          items_target: mode.items,
          items_completed: 0,
          total_value: 0,
          completed: false,
          skipped: false
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create prompt tracking records
      const promptRecords = mode.prompts.map((prompt, index) => ({
        session_id: newSession.id,
        prompt_index: index,
        prompt_id: prompt.id,
        completed: false,
        skipped: false
      }));

      const { error: promptsError } = await supabase
        .from('jumpstart_prompts')
        .insert(promptRecords);

      if (promptsError) throw promptsError;

      setSession(newSession);
      setCurrentPromptIndex(0);
      toast.success('Jumpstart session started!');
    } catch (err) {
      console.error('Error starting jumpstart session:', err);
      setError(err as Error);
      toast.error('Failed to start session');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Complete a prompt
  const completePrompt = useCallback(async (assetId: string, value: number) => {
    if (!session || !currentPrompt) return;

    try {
      setIsLoading(true);

      const prompts = getPromptsForMode(session.mode);
      const newItemsCompleted = session.items_completed + 1;
      const newTotalValue = session.total_value + value;

      // Update prompt record
      const { error: promptError } = await supabase
        .from('jumpstart_prompts')
        .update({
          completed: true,
          asset_id: assetId,
          completed_at: new Date().toISOString()
        })
        .eq('session_id', session.id)
        .eq('prompt_index', currentPromptIndex);

      if (promptError) throw promptError;

      // Update session
      const { data: updatedSession, error: sessionError } = await supabase
        .from('jumpstart_sessions')
        .update({
          items_completed: newItemsCompleted,
          total_value: newTotalValue
        })
        .eq('id', session.id)
        .select()
        .single();

      if (sessionError) throw sessionError;

      setSession(updatedSession);

      // Move to next prompt
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      }
    } catch (err) {
      console.error('Error completing prompt:', err);
      setError(err as Error);
      toast.error('Failed to save progress');
    } finally {
      setIsLoading(false);
    }
  }, [session, currentPrompt, currentPromptIndex]);

  // Skip a prompt
  const skipPrompt = useCallback(async () => {
    if (!session || !currentPrompt) return;

    try {
      const prompts = getPromptsForMode(session.mode);

      // Update prompt record
      const { error: promptError } = await supabase
        .from('jumpstart_prompts')
        .update({
          skipped: true,
          completed_at: new Date().toISOString()
        })
        .eq('session_id', session.id)
        .eq('prompt_index', currentPromptIndex);

      if (promptError) throw promptError;

      // Move to next prompt
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(currentPromptIndex + 1);
      }
    } catch (err) {
      console.error('Error skipping prompt:', err);
      setError(err as Error);
      toast.error('Failed to skip prompt');
    }
  }, [session, currentPrompt, currentPromptIndex]);

  // Complete the entire session
  const completeSession = useCallback(async () => {
    if (!session) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('jumpstart_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', session.id);

      if (error) throw error;

      toast.success('Jumpstart session completed! 🎉');
    } catch (err) {
      console.error('Error completing session:', err);
      setError(err as Error);
      toast.error('Failed to complete session');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return {
    session,
    currentPrompt,
    currentPromptIndex,
    progress,
    startSession,
    completePrompt,
    skipPrompt,
    completeSession,
    isLoading,
    error
  };
};
