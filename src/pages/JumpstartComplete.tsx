import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useJumpstartSession } from '@/hooks/useJumpstartSession';
import confetti from 'canvas-confetti';

export default function JumpstartComplete() {
  const navigate = useNavigate();
  const { session, completeSession } = useJumpstartSession();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedItems, setAnimatedItems] = useState(0);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Mark session as complete
    completeSession();
  }, [completeSession]);

  // Animate numbers counting up
  useEffect(() => {
    if (!session) return;

    const valueDuration = 1500;
    const valueIncrement = session.total_value / (valueDuration / 16);
    const itemIncrement = session.items_completed / (valueDuration / 16);

    const interval = setInterval(() => {
      setAnimatedValue(prev => {
        const next = prev + valueIncrement;
        return next >= session.total_value ? session.total_value : next;
      });
      setAnimatedItems(prev => {
        const next = prev + itemIncrement;
        return next >= session.items_completed ? session.items_completed : next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [session]);

  const handleExploreDashboard = () => {
    navigate('/dashboard');
  };

  const handleAddMore = () => {
    navigate('/assets/add');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const startTime = new Date(session.started_at);
  const endTime = new Date();
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Trophy Icon */}
        <div className="text-center">
          <div className="inline-block animate-scale-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Amazing! You're all set! 🎉
          </h1>
          
          <p className="text-xl text-muted-foreground">
            You've successfully protected your valuable items
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center bg-card/80 backdrop-blur">
            <div className="text-3xl font-bold mb-2">
              {Math.round(animatedItems)}
            </div>
            <div className="text-sm text-muted-foreground">
              Items Documented
            </div>
          </Card>

          <Card className="p-6 text-center bg-card/80 backdrop-blur">
            <div className="text-3xl font-bold mb-2 text-green-600">
              ${animatedValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Protected
            </div>
          </Card>

          <Card className="p-6 text-center bg-card/80 backdrop-blur">
            <div className="text-3xl font-bold mb-2">
              ⏱️ {durationMinutes}m
            </div>
            <div className="text-sm text-muted-foreground">
              Time Taken
            </div>
          </Card>
        </div>

        {/* Achievement Badge */}
        <div className="flex justify-center">
          <Badge className="px-6 py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 animate-slide-up">
            🏆 Quick Start Champion
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleExploreDashboard}
          >
            Explore Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleAddMore}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add More Items
          </Button>
        </div>

        {/* Encouragement Message */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <p className="text-center text-muted-foreground">
            💡 <strong>Pro tip:</strong> Regular updates keep your inventory accurate. 
            We recommend reviewing your items every 6 months.
          </p>
        </Card>
      </div>
    </div>
  );
}
