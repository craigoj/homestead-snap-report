-- Phase 1: Critical Database Optimizations and Security Fixes

-- 1.1 Performance Indexes for Dashboard Queries
-- Search optimization using full-text search
CREATE INDEX IF NOT EXISTS idx_assets_search 
ON public.assets USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Category + user filtering (most common dashboard query)
CREATE INDEX IF NOT EXISTS idx_assets_category_user 
ON public.assets(user_id, category, created_at DESC);

-- Property-based queries with value sorting
CREATE INDEX IF NOT EXISTS idx_assets_property_user 
ON public.assets(property_id, user_id, estimated_value DESC NULLS LAST);

-- OCR confidence filtering for quality metrics
CREATE INDEX IF NOT EXISTS idx_assets_ocr_confidence 
ON public.assets(ocr_confidence) WHERE ocr_confidence IS NOT NULL;

-- Equipment type filtering (JSONB index)
CREATE INDEX IF NOT EXISTS idx_assets_equipment_type_category 
ON public.assets USING GIN((equipment_type->>'category'));

-- 1.2 Materialized View for Dashboard Performance
CREATE MATERIALIZED VIEW IF NOT EXISTS public.dashboard_stats AS
SELECT 
  user_id,
  COUNT(*) as total_assets,
  COALESCE(SUM(estimated_value), 0) as total_value,
  COUNT(DISTINCT property_id) as property_count,
  ROUND(AVG(ocr_confidence), 2) as avg_ocr_confidence,
  COUNT(*) FILTER (WHERE category = 'electronics') as electronics_count,
  COUNT(*) FILTER (WHERE category = 'appliances') as appliances_count,
  COUNT(*) FILTER (WHERE category = 'tools') as tools_count,
  COUNT(*) FILTER (WHERE category = 'automotive') as automotive_count
FROM public.assets 
GROUP BY user_id;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats_user 
ON public.dashboard_stats(user_id);

-- 1.3 Dashboard Stats Refresh Function and Trigger
CREATE OR REPLACE FUNCTION public.refresh_dashboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh stats when assets change
DROP TRIGGER IF EXISTS trigger_refresh_dashboard_stats ON public.assets;
CREATE TRIGGER trigger_refresh_dashboard_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.assets
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.refresh_dashboard_stats();

-- 1.4 Storage Security Policies (Fix security warnings)
-- Create policies for asset-photos bucket with proper user isolation
CREATE POLICY "Users can upload their own asset photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'asset-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own asset photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'asset-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own asset photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'asset-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own asset photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'asset-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 1.5 API Rate Limiting and Performance Tracking Tables
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for efficient rate limit lookups
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_user_endpoint 
ON public.api_rate_limits(user_id, endpoint, window_start DESC);

-- Performance monitoring table
CREATE TABLE IF NOT EXISTS public.query_performance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_type TEXT NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  result_count INTEGER,
  user_id UUID,
  endpoint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for performance analysis
CREATE INDEX IF NOT EXISTS idx_query_performance_logs_type_time 
ON public.query_performance_logs(query_type, created_at DESC);

-- 1.6 API Response Cache Table
CREATE TABLE IF NOT EXISTS public.api_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  response_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for cache lookups
CREATE INDEX IF NOT EXISTS idx_api_cache_key_expires 
ON public.api_cache(cache_key, expires_at);

-- Cleanup function for expired cache entries
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.api_cache WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- 1.7 Enhanced Error Tracking (extend existing error_logs)
ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS correlation_id TEXT;
ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS endpoint TEXT;
ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;

-- Index for error analysis
CREATE INDEX IF NOT EXISTS idx_error_logs_correlation_id 
ON public.error_logs(correlation_id);

-- 1.8 Storage Cleanup Tracking
CREATE TABLE IF NOT EXISTS public.storage_cleanup_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cleanup_type TEXT NOT NULL, -- 'orphaned', 'expired', 'compressed'
  files_processed INTEGER DEFAULT 0,
  files_deleted INTEGER DEFAULT 0,
  bytes_freed BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Initial refresh of materialized view
REFRESH MATERIALIZED VIEW public.dashboard_stats;