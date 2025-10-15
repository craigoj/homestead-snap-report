import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  maxScore: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  maxScore,
  size = 200,
  strokeWidth = 12,
  className,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (animatedScore / maxScore) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = Math.ceil(score / 30);
      if (animatedScore < score) {
        setAnimatedScore(Math.min(animatedScore + increment, score));
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [animatedScore, score]);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000 ease-out', className)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold">{animatedScore}</span>
        <span className="text-xl text-muted-foreground">/ {maxScore}</span>
      </div>
    </div>
  );
};
