-- eBay API Integration Schema
-- Store eBay OAuth tokens
CREATE TABLE IF NOT EXISTS ebay_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_type TEXT NOT NULL CHECK (token_type IN ('application', 'user')),
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ebay_tokens_expires ON ebay_tokens(expires_at DESC);
CREATE INDEX idx_ebay_tokens_type ON ebay_tokens(token_type);

-- Store eBay valuation results
CREATE TABLE IF NOT EXISTS ebay_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Search parameters
  search_query TEXT,
  search_method TEXT CHECK (search_method IN ('upc', 'epid', 'brand_model', 'title', 'ai_fallback')),
  
  -- eBay data (stored as JSON for flexibility)
  ebay_data JSONB,
  
  -- Calculated valuation
  estimated_value NUMERIC(10,2),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  value_range_min NUMERIC(10,2),
  value_range_max NUMERIC(10,2),
  
  -- Metadata
  data_source TEXT DEFAULT 'ebay' CHECK (data_source IN ('ebay', 'ai', 'hybrid')),
  market_trend TEXT CHECK (market_trend IN ('stable', 'appreciating', 'depreciating')),
  reasoning TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ebay_valuations_asset ON ebay_valuations(asset_id);
CREATE INDEX idx_ebay_valuations_user ON ebay_valuations(user_id);
CREATE INDEX idx_ebay_valuations_created ON ebay_valuations(created_at DESC);

-- Add eBay identifiers to assets table
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS upc TEXT,
ADD COLUMN IF NOT EXISTS gtin TEXT,
ADD COLUMN IF NOT EXISTS ebay_epid TEXT,
ADD COLUMN IF NOT EXISTS ebay_valuation_id UUID REFERENCES ebay_valuations(id),
ADD COLUMN IF NOT EXISTS valuation_data_source TEXT DEFAULT 'ai' CHECK (
  valuation_data_source IN ('ebay', 'ai', 'hybrid', 'manual')
),
ADD COLUMN IF NOT EXISTS valuation_last_updated TIMESTAMP WITH TIME ZONE;

-- Function to get valid non-expired token
CREATE OR REPLACE FUNCTION get_valid_ebay_token()
RETURNS TABLE (access_token TEXT, expires_at TIMESTAMP WITH TIME ZONE) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT t.access_token, t.expires_at
  FROM ebay_tokens t
  WHERE t.token_type = 'application'
    AND t.expires_at > NOW() + INTERVAL '5 minutes'
  ORDER BY t.expires_at DESC
  LIMIT 1;
END;
$$;

-- Function to store/update OAuth token
CREATE OR REPLACE FUNCTION upsert_ebay_token(
  p_token_type TEXT,
  p_access_token TEXT,
  p_expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_id UUID;
BEGIN
  INSERT INTO ebay_tokens (token_type, access_token, expires_at)
  VALUES (p_token_type, p_access_token, p_expires_at)
  RETURNING id INTO v_token_id;
  
  RETURN v_token_id;
END;
$$;

-- Function to check if asset needs revaluation
CREATE OR REPLACE FUNCTION should_revalue_asset(p_asset_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT COALESCE(
      valuation_last_updated < NOW() - INTERVAL '7 days',
      TRUE
    )
    FROM assets
    WHERE id = p_asset_id
  );
END;
$$;

-- Enable RLS on new tables
ALTER TABLE ebay_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebay_valuations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ebay_tokens (system-level access only)
CREATE POLICY "System can manage tokens"
ON ebay_tokens
FOR ALL
USING (true);

-- RLS Policies for ebay_valuations
CREATE POLICY "Users can view their own valuations"
ON ebay_valuations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert valuations for their assets"
ON ebay_valuations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM assets
    WHERE assets.id = ebay_valuations.asset_id
    AND assets.user_id = auth.uid()
  )
);