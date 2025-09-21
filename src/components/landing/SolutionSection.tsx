import React, { useEffect, useState } from 'react';
import { Camera, Zap, FileCheck, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SolutionSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: Camera,
      title: "Scan & Capture",
      description: "Simply point your phone camera at any item. Our AI instantly recognizes and catalogs everything.",
      features: ["AI-powered recognition", "Auto-categorization", "Brand & model detection"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Zap,
      title: "AI Valuation",
      description: "Get instant, accurate valuations based on current market data and condition assessment.",
      features: ["Real-time pricing", "Depreciation calculation", "Market comparison"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: FileCheck,
      title: "Insurance Ready",
      description: "Generate comprehensive reports that insurance companies accept and trust.",
      features: ["Professional documentation", "Legal compliance", "Cloud backup"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <section id="solution" className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold mb-6">
            How HomeGuard Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Three Simple Steps to
            <span className="block gradient-text">Complete Protection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered system makes home inventory effortless. From scanning to insurance claims, 
            we've got you covered every step of the way.
          </p>
        </div>

        {/* Interactive Demo Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-500 cursor-pointer
                ${activeStep === index 
                  ? `${step.bgColor} ${step.borderColor} scale-105 shadow-2xl` 
                  : 'bg-card border-border hover:shadow-lg'
                }
              `}
              onClick={() => setActiveStep(index)}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
                ${activeStep === index ? step.bgColor : 'bg-muted'}
              `}>
                <step.icon className={`h-8 w-8 transition-all duration-300
                  ${activeStep === index ? 'text-primary scale-110' : 'text-muted-foreground'}
                `} />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Indicator */}
              {activeStep === index && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeStep === index ? 'w-12 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Demo Results */}
        <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-card border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Before */}
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">😰</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Before HomeGuard</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>No inventory documentation</li>
                <li>Uncertain item values</li>
                <li>Claims often rejected</li>
                <li>Average recovery: 40%</li>
              </ul>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <ArrowRight className="h-12 w-12 text-primary" />
            </div>

            {/* After */}
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <h4 className="text-xl font-bold mb-2">With HomeGuard</h4>
              <ul className="text-foreground space-y-1">
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Complete documentation</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Accurate AI valuations</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Claims approved faster</span>
                </li>
                <li className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-bold text-success">Average recovery: 97%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button 
            className="btn-premium text-lg px-8 py-4 rounded-full group"
            onClick={() => window.location.href = '/auth'}
          >
            Start Your Free Trial Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-muted-foreground mt-4">
            Join thousands of protected families. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};