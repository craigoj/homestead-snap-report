import { Zap, Trophy, Home, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JumpstartMode, QUICK_WIN_PROMPTS, HIGH_VALUE_PROMPTS, ROOM_BLITZ_PROMPTS } from "@/lib/jumpstart/prompts";

interface JumpstartModeSelectorProps {
  onModeSelect: (mode: 'quick-win' | 'high-value' | 'room-blitz') => void;
  onSkip: () => void;
}

const modes: JumpstartMode[] = [
  {
    id: 'quick-win',
    name: 'Quick Win',
    description: 'Perfect for getting started',
    time: '3 minutes',
    items: 3,
    value: '$2,000-5,000',
    icon: Zap,
    popular: true,
    prompts: QUICK_WIN_PROMPTS
  },
  {
    id: 'high-value',
    name: 'High-Value Hunt',
    description: 'Focus on expensive items',
    time: '5 minutes',
    items: 5,
    value: '$5,000-15,000',
    icon: Trophy,
    popular: false,
    prompts: HIGH_VALUE_PROMPTS
  },
  {
    id: 'room-blitz',
    name: 'Room Blitz',
    description: 'Complete one room',
    time: '10 minutes',
    items: 15,
    value: '$10,000-30,000',
    icon: Home,
    popular: false,
    prompts: ROOM_BLITZ_PROMPTS
  }
];

export const JumpstartModeSelector = ({ onModeSelect, onSkip }: JumpstartModeSelectorProps) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Let's protect your first items! 📱
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose how much time you have. We'll guide you through scanning your most important items.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Card 
              key={mode.id} 
              className="relative hover-scale cursor-pointer transition-all hover:shadow-lg border-2 hover:border-primary/50"
              onClick={() => onModeSelect(mode.id)}
            >
              {mode.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{mode.name}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{mode.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items:</span>
                    <span className="font-medium">{mode.items} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected value:</span>
                    <span className="font-medium">{mode.value}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onModeSelect(mode.id);
                  }}
                >
                  Start Scanning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={onSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};
