import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceMetrics {
  loadTime: number;
  errorCount: number;
  cacheHitRate: number;
  apiResponseTime: number;
}

interface OptimizationSuggestion {
  type: 'cache' | 'query' | 'ui' | 'general';
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export function useDashboardOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    errorCount: 0,
    cacheHitRate: 0,
    apiResponseTime: 0
  });
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    let startTime = performance.now();
    
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    window.addEventListener('load', measureLoadTime);
    
    if (document.readyState === 'complete') {
      measureLoadTime();
    }

    return () => {
      window.removeEventListener('load', measureLoadTime);
    };
  }, []);

  useEffect(() => {
    async function fetchErrorMetrics() {
      try {
        const { data: errors } = await supabase
          .from('error_logs')
          .select('id')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
        setMetrics(prev => ({ 
          ...prev, 
          errorCount: errors?.length || 0 
        }));
      } catch (error) {
        console.error('Failed to fetch error metrics:', error);
      }
    }

    fetchErrorMetrics();
    const interval = setInterval(fetchErrorMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const generateSuggestions = (metrics: PerformanceMetrics): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];

    if (metrics.loadTime > 3000) {
      suggestions.push({
        type: 'ui',
        message: 'Page load time is slow. Consider lazy loading components.',
        priority: 'high'
      });
    }

    if (metrics.errorCount > 10) {
      suggestions.push({
        type: 'general',
        message: 'High error count detected. Check error logs for patterns.',
        priority: 'high'
      });
    }

    if (metrics.cacheHitRate < 0.5) {
      suggestions.push({
        type: 'cache',
        message: 'Low cache hit rate. Consider implementing more aggressive caching.',
        priority: 'medium'
      });
    }

    if (metrics.apiResponseTime > 2000) {
      suggestions.push({
        type: 'query',
        message: 'API responses are slow. Consider optimizing database queries.',
        priority: 'medium'
      });
    }

    return suggestions;
  };

  useEffect(() => {
    const newSuggestions = generateSuggestions(metrics);
    setSuggestions(newSuggestions);
  }, [metrics]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    
    // Monitor navigation timing
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const responseTime = navEntry.responseEnd - navEntry.requestStart;
          setMetrics(prev => ({ ...prev, apiResponseTime: responseTime }));
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => {
      observer.disconnect();
      setIsMonitoring(false);
    };
  };

  const clearMetrics = () => {
    setMetrics({
      loadTime: 0,
      errorCount: 0,
      cacheHitRate: 0,
      apiResponseTime: 0
    });
    setSuggestions([]);
  };

  return {
    metrics,
    suggestions,
    isMonitoring,
    startMonitoring,
    clearMetrics
  };
}