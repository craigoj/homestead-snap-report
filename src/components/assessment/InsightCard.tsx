import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  index: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, description, index }) => {
  return (
    <Card className="border-l-4 border-l-primary animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
