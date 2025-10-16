import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Star, Users, DollarSign, Clock, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DemoModal } from './DemoModal';

export const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fullText = "Never Lose Money on Insurance Claims Again";

  // Typewriter effect
  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentText(fullText.slice(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [textIndex, fullText]);

  // Counter animation
  const [counters, setCounters] = useState({
    savings: 0,
    users: 0,
    claims: 0
  });

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      const targets = { savings: 15000, users: 50000, claims: 98 };
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          savings: Math.floor(targets.savings * progress),
          users: Math.floor(targets.users * progress),
          claims: Math.floor(targets.claims * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepDuration);
    };

    // Start animation when component mounts
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });

    const heroElement = document.getElementById('hero-section');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28">
      {/* Background with gradient and animated blobs */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-warning/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Main Headline with Typewriter Effect */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                <span className="gradient-text">{currentText}</span>
                <span className="animate-pulse">|</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up stagger-2 max-w-2xl">
                AI-powered home inventory that automatically documents your belongings, 
                estimates values, and streamlines insurance claims. Save thousands when disaster strikes.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up stagger-3">
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="font-semibold">${counters.savings.toLocaleString()}+ saved</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">{counters.users.toLocaleString()}+ users</span>
              </div>
              <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-semibold">{counters.claims}% success rate</span>
              </div>
            </div>

            {/* Email Capture Form */}
            <div className="animate-fade-in-up stagger-4">
              <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-card border border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 h-12 border-2 border-border focus:border-primary rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button 
                    className="btn-premium h-12 px-8 rounded-xl group"
                    disabled={isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true);
                      if (email) {
                        localStorage.setItem('snapassetai-email', email);
                      }
                      // Add slight delay for better UX
                      await new Promise(resolve => setTimeout(resolve, 500));
                      window.location.href = '/assessment';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Taking You to Assessment...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Join early access waitlist</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Get priority access</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>No commitment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment CTA */}
            <div className="animate-fade-in-up stagger-5">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-semibold"
                  onClick={() => window.location.href = '/assessment'}
                >
                  Take Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Get your Insurance Preparedness Score in 3 minutes
                </p>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="animate-fade-in-up stagger-6">
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary-glow animate-underline"
                onClick={() => setShowDemoModal(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch 2-minute demo
              </Button>
            </div>
          </div>

          {/* Right Column - Interactive Mockup */}
          <div className="relative animate-slide-in-right">
            {/* Phone Mockup Container */}
            <div className="relative max-w-sm mx-auto">
              {/* Floating UI Elements */}
              <div className="absolute -top-4 -left-4 glass-card p-3 rounded-xl animate-float z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium">AI Scanning</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 glass-card p-3 rounded-xl animate-float z-10" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">$2,450 estimated</span>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 glass-card p-3 rounded-xl animate-float z-10" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">3 min setup</span>
                </div>
              </div>

              {/* Phone Frame */}
              <div className="relative bg-gray-900 p-2 rounded-[2.5rem] shadow-2xl pulse-glow">
                <div className="bg-white dark:bg-gray-100 rounded-[2rem] overflow-hidden aspect-[9/19.5]">
                  {/* Mock App Interface */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">SnapAssetAI</div>
                      <div className="w-8 h-8 bg-primary rounded-full"></div>
                    </div>
                    
                    <div className="bg-gradient-primary rounded-xl p-4 text-white">
                      <div className="text-sm opacity-90">Total Value</div>
                      <div className="text-2xl font-bold">$47,392</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          📱
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">iPhone 14 Pro</div>
                          <div className="text-sm text-gray-600">$1,099</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          💻
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">MacBook Pro</div>
                          <div className="text-sm text-gray-600">$2,399</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          📺
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Samsung TV</div>
                          <div className="text-sm text-gray-600">$899</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      <DemoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />
    </section>
  );
};