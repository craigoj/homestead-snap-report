import React from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { LazyFeaturesSection, LazyPricingSection, LazyTestimonialsSection } from './LazyComponents';
import { Footer } from './Footer';

export const HomeGuardLanding = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <LazyFeaturesSection />
        <LazyTestimonialsSection />
        <LazyPricingSection />
      </main>
      <Footer />
    </div>
  );
};