import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { HowToStructuredData } from '@/components/StructuredData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Camera, Scan, FileText, Shield, CheckCircle } from 'lucide-react';

const HowToGuide = () => {
  const navigate = useNavigate();

  const steps = [
    {
      name: 'Create Your Account',
      text: 'Sign up for HomeGuard using your email address. You\'ll get instant access to start documenting your belongings.',
      image: 'https://homeguard.lovable.app/og-image.jpg',
      icon: Shield
    },
    {
      name: 'Add Your Property',
      text: 'Create entries for each property you want to track - your home, vacation property, or rental units.',
      icon: FileText
    },
    {
      name: 'Scan or Upload Photos',
      text: 'Use your phone camera to scan barcodes or take photos of your items. HomeGuard\'s AI automatically extracts details like brand, model, and estimated value.',
      icon: Camera
    },
    {
      name: 'Organize by Room',
      text: 'Assign each item to specific rooms for easy organization and faster insurance claims processing.',
      icon: Scan
    },
    {
      name: 'Generate Reports',
      text: 'Export comprehensive PDF reports with photos, values, and documentation ready for insurance companies.',
      icon: CheckCircle
    }
  ];

  return (
    <>
      <SEOHead
        title="How to Use HomeGuard - Step-by-Step Home Inventory Guide"
        description="Learn how to create a complete home inventory with HomeGuard in 5 simple steps. AI-powered scanning, automatic valuations, and insurance-ready reports."
        keywords={['how to create home inventory', 'home inventory guide', 'insurance documentation', 'asset tracking tutorial']}
        canonicalUrl="/how-to"
        ogType="article"
      />
      
      <HowToStructuredData
        name="How to Create a Home Inventory with HomeGuard"
        description="Complete guide to documenting your home belongings for insurance protection using AI-powered scanning and valuation."
        totalTime="PT30M"
        steps={steps.map(step => ({
          name: step.name,
          text: step.text,
          image: step.image,
          url: `https://homeguard.lovable.app/how-to#${step.name.toLowerCase().replace(/\s+/g, '-')}`
        }))}
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              How to Create Your Home Inventory
            </h1>
            <p className="text-xl text-muted-foreground">
              Follow these 5 simple steps to protect your assets and streamline insurance claims
            </p>
          </header>

          <div className="space-y-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} id={step.name.toLowerCase().replace(/\s+/g, '-')} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-2 text-foreground">
                        Step {index + 1}: {step.name}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8"
            >
              Start Your Free Trial
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • 30-day free trial
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToGuide;
