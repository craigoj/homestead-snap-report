import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Diamond } from 'lucide-react';

interface HighValueAlertProps {
  estimatedValue: number;
  category?: string;
}

export const HighValueAlert = ({ estimatedValue, category }: HighValueAlertProps) => {
  const isHighValue = estimatedValue > 5000 || (category === 'jewelry' && estimatedValue > 2500);

  if (!isHighValue) return null;

  return (
    <Alert className="border-amber-500/50 bg-amber-500/10">
      <Diamond className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900 dark:text-amber-100">High-Value Item Detected</AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <p className="mb-2">
          This item qualifies as a high-value asset (${estimatedValue.toLocaleString()}). 
          Insurance companies typically require professional appraisals for high-value items.
        </p>
        <p className="text-sm">
          <strong>Recommended:</strong> Upload a professional appraisal to ensure full coverage in case of a claim.
        </p>
      </AlertDescription>
    </Alert>
  );
};
