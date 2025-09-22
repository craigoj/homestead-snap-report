import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export const useWebVitals = (reportWebVitals?: (metric: WebVitalsMetric) => void) => {
  useEffect(() => {
    if (!reportWebVitals) return;

    // Dynamic import to avoid loading web-vitals in production if not needed
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onINP(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    }).catch(() => {
      // Fallback: Manual performance measurement
      if ('performance' in window) {
        // Measure key metrics manually
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              
              // First Contentful Paint approximation
              const fcp = navEntry.responseEnd - navEntry.fetchStart;
              reportWebVitals({
                name: 'FCP',
                value: fcp,
                rating: fcp < 1800 ? 'good' : fcp < 3000 ? 'needs-improvement' : 'poor',
                delta: fcp,
                id: 'manual-fcp'
              });

              // Largest Contentful Paint approximation
              const lcp = navEntry.loadEventEnd - navEntry.fetchStart;
              reportWebVitals({
                name: 'LCP',
                value: lcp,
                rating: lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor',
                delta: lcp,
                id: 'manual-lcp'
              });
            }
          });
        });

        observer.observe({ entryTypes: ['navigation'] });
      }
    });
  }, [reportWebVitals]);
};

// Default analytics reporting function
export const defaultWebVitalsReporter = (metric: WebVitalsMetric) => {
  // Send to analytics service (Google Analytics, etc.)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Web Vital ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta
    });
  }
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            console.warn('⚠️ Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }

      return () => longTaskObserver.disconnect();
    }
  }, []);
};