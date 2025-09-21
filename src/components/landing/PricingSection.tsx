import React, { useState } from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: "Starter",
    description: "Perfect for apartments and small homes",
    monthlyPrice: 9,
    annualPrice: 7,
    features: [
      "Up to 500 items",
      "AI scanning & valuation",
      "Basic reports",
      "Cloud storage",
      "Mobile app access",
      "Email support"
    ],
    popular: false
  },
  {
    name: "Family",
    description: "Ideal for family homes and collections",
    monthlyPrice: 19,
    annualPrice: 15,
    features: [
      "Up to 2,000 items",
      "Advanced AI features",
      "Professional reports",
      "Priority support",
      "Multiple properties",
      "Team collaboration",
      "Insurance integration",
      "Custom categories"
    ],
    popular: true
  },
  {
    name: "Professional",
    description: "For large homes and property managers",
    monthlyPrice: 39,
    annualPrice: 31,
    features: [
      "Unlimited items",
      "White-label reports",
      "API access",
      "Advanced analytics",
      "Bulk operations",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee"
    ],
    popular: false
  }
];

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Simple Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Protection Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free for 30 days. No credit card required. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-muted p-2 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full transition-all ${
                !isAnnual ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                isAnnual ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 animate-pulse">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass-card p-8 rounded-2xl border transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${
                plan.popular
                  ? 'border-primary/50 shadow-lg scale-105'
                  : 'border-border/50 hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-6 py-2 rounded-full border-0 animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-success mt-2">
                    Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-3 font-semibold ${
                  plan.popular
                    ? 'btn-premium'
                    : 'bg-background border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
                onClick={() => window.location.href = '/auth'}
              >
                Start Free Trial
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            All plans include a 30-day free trial and 30-day money-back guarantee
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              No setup fees
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};