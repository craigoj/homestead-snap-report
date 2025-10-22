import { useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  estimatedValue: number;
  itemNumber: number;
  totalItems: number;
  runningTotal: number;
  onContinue: () => void;
}

export const CelebrationModal = ({
  isOpen,
  onClose,
  itemName,
  estimatedValue,
  itemNumber,
  totalItems,
  runningTotal,
  onContinue
}: CelebrationModalProps) => {
  
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti animation
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF6347']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6 py-4">
          {/* Checkmark Icon */}
          <div className="flex justify-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-3xl font-bold mb-2">Great job! 🎉</h2>
            <p className="text-lg text-muted-foreground">
              You added <span className="font-semibold text-foreground">{itemName}</span>
            </p>
          </div>

          {/* Value Display - Conditional based on whether we have a value */}
          {estimatedValue && estimatedValue > 0 ? (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-success">
                ${estimatedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Item value added
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="text-lg text-muted-foreground italic">
                Calculating value...
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Value estimation in progress
              </div>
            </div>
          )}

          {/* Running Total */}
          <div className="space-y-2">
            <div className="text-lg">
              💎 You've protected{' '}
              <span className="font-bold text-primary">
                ${runningTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>{' '}
              so far!
            </div>
            
            {/* Progress */}
            <div className="text-sm text-muted-foreground">
              Item {itemNumber} of {totalItems} complete
            </div>
          </div>

          {/* Continue Button */}
          <Button
            size="lg"
            className="w-full h-12"
            onClick={onContinue}
          >
            {itemNumber < totalItems ? 'Scan Next Item' : 'View Summary'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
