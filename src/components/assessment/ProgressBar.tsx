import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  const timeRemaining = Math.max(1, Math.ceil((totalSteps - currentStep) * 0.2)); // ~12 seconds per question

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Question {currentStep} of {totalSteps}</span>
        <span>~{timeRemaining} min left</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
