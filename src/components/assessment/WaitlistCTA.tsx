import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { CTAData } from '@/lib/resultGenerator';

interface WaitlistCTAProps {
  ctaData: CTAData;
  onJoinWaitlist: () => void;
}

export const WaitlistCTA: React.FC<WaitlistCTAProps> = ({ ctaData, onJoinWaitlist }) => {
  return (
    <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
      <CardContent className="p-8 space-y-6">
        <h3 className="text-2xl font-bold text-center">{ctaData.heading}</h3>
        <ul className="space-y-3">
          {ctaData.benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button
          size="lg"
          className="w-full text-lg py-6"
          onClick={onJoinWaitlist}
        >
          {ctaData.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
