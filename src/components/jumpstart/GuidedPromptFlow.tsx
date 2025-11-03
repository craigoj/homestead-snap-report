'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, X, Lightbulb, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { JumpstartMode } from '@/lib/jumpstart/prompts';
import { useJumpstartSession } from '@/hooks/useJumpstartSession';
import { toast } from 'sonner';

interface GuidedPromptFlowProps {
  mode: JumpstartMode;
  onComplete: () => void;
  onSkip: () => void;
}

export const GuidedPromptFlow = ({ mode, onComplete, onSkip }: GuidedPromptFlowProps) => {
  const router = useRouter();
  const { 
    session, 
    currentPrompt, 
    currentPromptIndex,
    progress,
    startSession,
    skipPrompt,
    isLoading 
  } = useJumpstartSession();
  
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      if (!session) {
        await startSession(mode);
      }
      setIsInitializing(false);
    };

    initSession();
  }, [mode, session, startSession]);

  // Check if all prompts are complete
  useEffect(() => {
    if (session && !isLoading && currentPromptIndex >= mode.prompts.length) {
      onComplete();
    }
  }, [session, currentPromptIndex, mode.prompts.length, isLoading, onComplete]);

  const handleStartScan = () => {
    if (!session) return;

    router.push(`/assets/add?jumpstart=true&mode=${mode.id}&prompt=${currentPromptIndex + 1}&sessionId=${session.id}`);
  };

  const handleSkipPrompt = async () => {
    await skipPrompt();
    toast.info('Prompt skipped');
  };

  const handleSkipAll = () => {
    if (window.confirm('Are you sure you want to skip the jumpstart guide? You can always come back later.')) {
      onSkip();
    }
  };

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Setting up your scan guide...</p>
        </div>
      </div>
    );
  }

  if (!currentPrompt || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No prompts available</p>
          <Button onClick={onSkip}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const totalValue = session.total_value || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      {/* Header with progress */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Progress: {session.items_completed} of {session.items_target}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkipAll}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Large emoji */}
          <div className="text-center">
            <div className="text-8xl mb-6 animate-scale-in">
              {currentPrompt.emoji}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Scan your {currentPrompt.item}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              {currentPrompt.rationale}
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">Where to look</p>
                  <p className="text-sm text-muted-foreground">
                    {currentPrompt.locationHint}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-success/5 border-success/20">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm mb-1">Typical value</p>
                  <p className="text-sm text-muted-foreground">
                    {currentPrompt.typicalValue}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handleStartScan}
            >
              <Camera className="mr-2 h-5 w-5" />
              Start Scan
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleSkipPrompt}
            >
              I don't have this item
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with total */}
      <div className="border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">💎</span>
            <span className="text-lg font-semibold">
              Total Protected: ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
