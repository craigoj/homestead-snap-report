import React from 'react';
import { Shield, Camera, FileText, Zap, Brain, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Camera,
    title: "Smart AI Scanning",
    description: "Take a photo and our AI instantly identifies, categorizes, and values your items with 95% accuracy.",
    size: "large"
  },
  {
    icon: Shield,
    title: "Insurance Ready",
    description: "Generate comprehensive reports that insurance companies accept instantly.",
    size: "medium"
  },
  {
    icon: Brain,
    title: "AI Valuations",
    description: "Get real-time market values for every item in your home.",
    size: "medium"
  },
  {
    icon: FileText,
    title: "Instant Reports",
    description: "Create detailed inventory reports in seconds, not hours.",
    size: "large"
  },
  {
    icon: Zap,
    title: "Bulk Operations",
    description: "Process multiple items at once with batch scanning and editing.",
    size: "medium"
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "Your data is encrypted and stored with military-grade security.",
    size: "medium"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Protect Your Home</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform makes home inventory management effortless, accurate, and insurance-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.size === "large";
            
            return (
              <div
                key={index}
                className={`group glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${
                  isLarge ? 'md:col-span-2' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary p-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                    {isLarge && (
                      <Button 
                        variant="ghost" 
                        className="mt-4 text-primary hover:text-primary/80 p-0 h-auto font-medium"
                      >
                        Learn more →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="btn-premium px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = '/auth'}
          >
            Start Your Free Trial
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};