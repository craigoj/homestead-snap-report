import { useNavigate } from 'react-router-dom';
import { JumpstartModeSelector } from '@/components/jumpstart/JumpstartModeSelector';
import { getModeById } from '@/lib/jumpstart/prompts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function JumpstartMode() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleModeSelect = async (modeId: 'quick-win' | 'high-value' | 'room-blitz') => {
    if (!user) {
      toast.error('Please log in to use Jumpstart');
      navigate('/auth');
      return;
    }

    // Get full mode details
    const mode = getModeById(modeId);
    if (!mode) {
      toast.error('Invalid mode selected');
      return;
    }

    try {
      // Create jumpstart session in database
      const { data: session, error } = await supabase
        .from('jumpstart_sessions')
        .insert({
          user_id: user.id,
          mode: mode.id,
          items_target: mode.items,
          items_completed: 0,
          total_value: 0,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to jumpstart guide with mode and session
      navigate(`/jumpstart/guide?mode=${mode.id}&session=${session.id}`);
    } catch (error) {
      console.error('Error starting jumpstart session:', error);
      toast.error('Failed to start Jumpstart. Please try again.');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('jumpstart_skipped', 'true');
    navigate('/dashboard');
  };

  return (
    <JumpstartModeSelector 
      onModeSelect={handleModeSelect}
      onSkip={handleSkip}
    />
  );
}
