import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuestionCardProps {
  question: string;
  children: React.ReactNode;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, children }) => {
  return (
    <Card className="w-full border-none shadow-lg">
      <CardContent className="p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground leading-tight">
          {question}
        </h2>
        <div className="space-y-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
