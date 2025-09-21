import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components for better performance
const FeaturesSection = React.lazy(() => import('./FeaturesSection').then(module => ({ default: module.FeaturesSection })));
const PricingSection = React.lazy(() => import('./PricingSection').then(module => ({ default: module.PricingSection })));
const TestimonialsSection = React.lazy(() => import('./TestimonialsSection').then(module => ({ default: module.TestimonialsSection })));

// Loading skeletons for each section
const FeaturesSkeleton = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PricingSkeleton = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-6 p-8 border rounded-2xl">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[600px] mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 p-6 border rounded-xl">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Wrapper components with Suspense
export const LazyFeaturesSection = () => (
  <Suspense fallback={<FeaturesSkeleton />}>
    <FeaturesSection />
  </Suspense>
);

export const LazyPricingSection = () => (
  <Suspense fallback={<PricingSkeleton />}>
    <PricingSection />
  </Suspense>
);

export const LazyTestimonialsSection = () => (
  <Suspense fallback={<TestimonialsSkeleton />}>
    <TestimonialsSection />
  </Suspense>
);