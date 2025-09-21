-- Phase 1B: Essential Performance Indexes Only

-- Standard B-tree indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_assets_category_user 
ON public.assets(user_id, category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assets_property_user 
ON public.assets(property_id, user_id, estimated_value DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_assets_ocr_confidence 
ON public.assets(ocr_confidence) WHERE ocr_confidence IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_assets_brand_model 
ON public.assets(brand, model) WHERE brand IS NOT NULL;

-- Title search using ILIKE patterns (common dashboard search)
CREATE INDEX IF NOT EXISTS idx_assets_title_search 
ON public.assets(user_id, title);

-- API Rate Limiting Table
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_user_endpoint 
ON public.api_rate_limits(user_id, endpoint, window_start DESC);

-- API Response Cache Table  
CREATE TABLE IF NOT EXISTS public.api_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  response_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_cache_key_expires 
ON public.api_cache(cache_key, expires_at);

-- Enhanced Error Tracking
ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS correlation_id TEXT;
ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS endpoint TEXT;
ALTER TABLE public.error_logs ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;

CREATE INDEX IF NOT EXISTS idx_error_logs_correlation_id 
ON public.error_logs(correlation_id) WHERE correlation_id IS NOT NULL;