import React from 'react';
import { Shield, Camera, FileText, Zap, Brain, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Camera,
    title: "Smart AI Scanning",
    description: "Take a photo and our AI instantly identifies, categorizes, and values your items with 95% accuracy."
  },
  {
    icon: Shield,
    title: "Insurance Ready",
    description: "Generate comprehensive reports that insurance companies accept instantly."
  },
  {
    icon: Brain,
    title: "AI Valuations",
    description: "Get real-time market values for every item in your home."
  },
  {
    icon: FileText,
    title: "Instant Reports",
    description: "Create detailed inventory reports in seconds, not hours."
  },
  {
    icon: Zap,
    title: "Bulk Operations",
    description: "Process multiple items at once with batch scanning and editing."
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "Your data is encrypted and stored with military-grade security."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Everything You Need to{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Protect Your Home</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform makes home inventory management effortless,
            accurate, and insurance-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary p-4 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <Button 
            size="lg" 
            className="btn-premium px-12 py-4 text-lg font-semibold rounded-2xl"
            onClick={() => window.location.href = '/assessment'}
          >
            Get Your Preparedness Score
          </Button>
        </div>
      </div>
    </section>
  );
};