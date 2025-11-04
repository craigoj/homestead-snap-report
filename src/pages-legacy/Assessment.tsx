import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, CreditCard, TrendingUp } from 'lucide-react';
import { Navigation } from '@/components/landing/Navigation';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/SEOHead';

const Assessment = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Free Insurance Preparedness Assessment | SnapAsset AI"
        description="Take our 3-minute assessment to discover your Insurance Preparedness Score and learn how to protect your $200,000+ in home assets from insurance undervaluation."
        canonicalUrl="/assessment"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-16 space-y-16">
          {/* Hero Section */}
          <section className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Are you ready to protect your home's{' '}
              <span className="text-primary">$200,000+ in assets</span> from insurance undervaluation?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Answer 15 quick questions to find out if you're prepared for an insurance claim—and what to do to protect yourself before it's too late.
            </p>
          </section>

          {/* Value Proposition */}
          <section className="grid md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Documentation Preparedness</h3>
                <p className="text-muted-foreground">Do you have proof of ownership?</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Valuation Accuracy</h3>
                <p className="text-muted-foreground">Can you prove replacement costs?</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Claim Response Speed</h3>
                <p className="text-muted-foreground">Are you organized for quick payouts?</p>
              </CardContent>
            </Card>
          </section>

          {/* Statistics */}
          <section className="bg-muted/50 rounded-2xl p-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <h2 className="text-3xl font-bold text-center">The Reality of Insurance Claims</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">59%</div>
                <p className="text-muted-foreground">of homeowners have NO home inventory</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$18,000</div>
                <p className="text-muted-foreground">MORE recovered with proper documentation</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">40+</div>
                <p className="text-muted-foreground">hours/month spent by property managers tracking assets</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <Button 
              size="lg" 
              className="text-xl py-8 px-12"
              onClick={() => navigate('/assessment/quiz')}
            >
              Start My 3-Minute Assessment
            </Button>
            
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Takes only 3 minutes</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Completely free—no credit card required</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Get immediate, personalized recommendations</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Receive your Insurance Preparedness Score (0-100)</span>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Assessment;
