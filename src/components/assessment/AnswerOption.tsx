import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerOptionProps {
  text: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  text,
  value,
  selected,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(value)}
      className={cn(
        'w-full p-4 text-left rounded-lg border-2 transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-md',
        selected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-background hover:border-primary/50'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-medium">{text}</span>
        {selected && (
          <Check className="h-5 w-5 text-primary animate-scale-in" />
        )}
      </div>
    </button>
  );
};
