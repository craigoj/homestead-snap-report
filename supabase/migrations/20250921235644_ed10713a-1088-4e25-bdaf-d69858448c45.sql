-- Phase 1A: Critical Database Performance Indexes (Fixed)

-- 1.1 Performance Indexes for Dashboard Queries
-- Search optimization using full-text search (fixed GIN index)
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

-- Brand and model searches
CREATE INDEX IF NOT EXISTS idx_assets_brand_model 
ON public.assets(brand, model) WHERE brand IS NOT NULL;

-- 1.2 API Rate Limiting and Performance Tracking Tables
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

-- 1.3 API Response Cache Table
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