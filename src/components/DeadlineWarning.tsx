import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DeadlineWarningProps {
  daysRemaining: number;
  eventId: string;
  eventType: string;
  eventDate: string;
}

export const DeadlineWarning = ({ daysRemaining, eventId, eventType, eventDate }: DeadlineWarningProps) => {
  const navigate = useNavigate();
  const isUrgent = daysRemaining <= 7;
  const isWarning = daysRemaining <= 30 && daysRemaining > 7;

  return (
    <Alert variant={isUrgent ? 'destructive' : isWarning ? 'default' : 'default'} className="mb-4">
      {isUrgent ? <AlertTriangle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
      <AlertTitle className="font-semibold">
        {isUrgent ? '⚠️ URGENT: ' : ''}Insurance Claim Deadline Approaching
      </AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          You have <strong>{daysRemaining} days</strong> remaining to file your {eventType} claim from {new Date(eventDate).toLocaleDateString()}.
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          Most insurance policies require claims to be filed within 60 days of the loss event.
        </p>
        <Button 
          size="sm" 
          variant={isUrgent ? 'default' : 'secondary'}
          onClick={() => navigate(`/proof-of-loss?eventId=${eventId}`)}
        >
          File Claim Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};
