import { supabase } from '@/integrations/supabase/client';

interface CacheEntry {
  data: any;
  expires_at: string;
}

interface RateLimitEntry {
  request_count: number;
  window_start: string;
}

export class RateLimiter {
  private limits: Map<string, { count: number; resetTime: number }> = new Map();

  async checkRateLimit(endpoint: string, maxRequests: number = 60, windowMs: number = 60000): Promise<boolean> {
    const now = Date.now();
    const key = endpoint;
    const current = this.limits.get(key);
    
    if (!current || now > current.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs });
      
      // Log to database for persistence
      try {
        await supabase.from('api_rate_limits').upsert({
          endpoint,
          request_count: 1,
          window_start: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to log rate limit:', error);
      }
      
      return true;
    }
    
    if (current.count >= maxRequests) {
      return false;
    }
    
    current.count++;
    this.limits.set(key, current);
    
    // Update database
    try {
      await supabase.from('api_rate_limits')
        .update({ request_count: current.count })
        .eq('endpoint', endpoint);
    } catch (error) {
      console.error('Failed to update rate limit:', error);
    }
    
    return true;
  }
}

export class ApiCache {
  async get(key: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('api_cache')
        .select('response_data, expires_at')
        .eq('cache_key', key)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) return null;
      
      return data.response_data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, data: any, ttlMs: number = 300000): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + ttlMs);
      
      await supabase.from('api_cache').upsert({
        cache_key: key,
        response_data: data,
        expires_at: expiresAt.toISOString()
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      await supabase
        .from('api_cache')
        .delete()
        .like('cache_key', `${pattern}%`);
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }
}

export async function logApiError(
  errorType: string,
  error: any,
  endpoint?: string,
  context?: Record<string, any>,
  retryCount?: number
): Promise<void> {
  try {
    await supabase.from('error_logs').insert({
      error_type: errorType,
      error_message: error?.message || String(error),
      endpoint,
      error_context: context || {},
      retry_count: retryCount || 0
    });
  } catch (logError) {
    console.error('Failed to log API error:', logError);
  }
}

export const rateLimiter = new RateLimiter();
export const apiCache = new ApiCache();