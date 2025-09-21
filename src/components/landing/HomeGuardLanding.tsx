import React from 'react';
import { Navigation } from './Navigation';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { LazyFeaturesWrapper, LazyPricingWrapper, LazyTestimonialsWrapper } from './LazyComponents';
import { Footer } from './Footer';

export const HomeGuardLanding = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <LazyFeaturesWrapper />
        <LazyTestimonialsWrapper />
        <LazyPricingWrapper />
      </main>
      <Footer />
    </div>
  );
};