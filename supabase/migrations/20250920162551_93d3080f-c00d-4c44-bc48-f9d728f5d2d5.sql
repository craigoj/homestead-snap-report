-- Create enum types for better data integrity
CREATE TYPE public.asset_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
CREATE TYPE public.asset_category AS ENUM ('electronics', 'furniture', 'appliances', 'jewelry', 'clothing', 'art', 'books', 'tools', 'sports', 'other');
CREATE TYPE public.report_status AS ENUM ('generating', 'ready', 'expired', 'failed');
CREATE TYPE public.event_type AS ENUM ('asset_created', 'ocr_success', 'ocr_fail', 'export_generated', 'user_signup', 'property_created');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table for organization within properties
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assets table (main inventory items)
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category public.asset_category NOT NULL DEFAULT 'other',
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  condition public.asset_condition NOT NULL DEFAULT 'good',
  estimated_value DECIMAL(10,2),
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  ocr_extracted BOOLEAN DEFAULT false,
  ocr_confidence DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create asset_photos table for multiple photos per asset
CREATE TABLE public.asset_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receipts table for receipt attachments
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claim_reports table for generated reports
CREATE TABLE public.claim_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'pdf',
  file_path TEXT,
  share_token TEXT UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  status public.report_status DEFAULT 'generating',
  total_value DECIMAL(12,2),
  asset_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table for analytics events
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type public.event_type NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_user_id ON public.properties(user_id);
CREATE INDEX idx_rooms_property_id ON public.rooms(property_id);
CREATE INDEX idx_assets_user_id ON public.assets(user_id);
CREATE INDEX idx_assets_property_id ON public.assets(property_id);
CREATE INDEX idx_assets_room_id ON public.assets(room_id);
CREATE INDEX idx_assets_category ON public.assets(category);
CREATE INDEX idx_assets_estimated_value ON public.assets(estimated_value);
CREATE INDEX idx_asset_photos_asset_id ON public.asset_photos(asset_id);
CREATE INDEX idx_receipts_asset_id ON public.receipts(asset_id);
CREATE INDEX idx_claim_reports_user_id ON public.claim_reports(user_id);
CREATE INDEX idx_claim_reports_share_token ON public.claim_reports(share_token);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON public.audit_logs(event_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for properties table
CREATE POLICY "Users can view their own properties" 
ON public.properties FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
ON public.properties FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
ON public.properties FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
ON public.properties FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for rooms table
CREATE POLICY "Users can view rooms in their properties" 
ON public.rooms FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = rooms.property_id 
  AND properties.user_id = auth.uid()
));

CREATE POLICY "Users can create rooms in their properties" 
ON public.rooms FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = rooms.property_id 
  AND properties.user_id = auth.uid()
));

CREATE POLICY "Users can update rooms in their properties" 
ON public.rooms FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = rooms.property_id 
  AND properties.user_id = auth.uid()
));

CREATE POLICY "Users can delete rooms in their properties" 
ON public.rooms FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = rooms.property_id 
  AND properties.user_id = auth.uid()
));

-- Create RLS policies for assets table
CREATE POLICY "Users can view their own assets" 
ON public.assets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assets" 
ON public.assets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets" 
ON public.assets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets" 
ON public.assets FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for asset_photos table
CREATE POLICY "Users can view photos of their assets" 
ON public.asset_photos FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = asset_photos.asset_id 
  AND assets.user_id = auth.uid()
));

CREATE POLICY "Users can create photos for their assets" 
ON public.asset_photos FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = asset_photos.asset_id 
  AND assets.user_id = auth.uid()
));

CREATE POLICY "Users can update photos of their assets" 
ON public.asset_photos FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = asset_photos.asset_id 
  AND assets.user_id = auth.uid()
));

CREATE POLICY "Users can delete photos of their assets" 
ON public.asset_photos FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = asset_photos.asset_id 
  AND assets.user_id = auth.uid()
));

-- Create RLS policies for receipts table
CREATE POLICY "Users can view receipts of their assets" 
ON public.receipts FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = receipts.asset_id 
  AND assets.user_id = auth.uid()
));

CREATE POLICY "Users can create receipts for their assets" 
ON public.receipts FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = receipts.asset_id 
  AND assets.user_id = auth.uid()
));

CREATE POLICY "Users can update receipts of their assets" 
ON public.receipts FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = receipts.asset_id 
  AND assets.user_id = auth.uid()
));

CREATE POLICY "Users can delete receipts of their assets" 
ON public.receipts FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.assets 
  WHERE assets.id = receipts.asset_id 
  AND assets.user_id = auth.uid()
));

-- Create RLS policies for claim_reports table
CREATE POLICY "Users can view their own reports" 
ON public.claim_reports FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports" 
ON public.claim_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" 
ON public.claim_reports FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" 
ON public.claim_reports FOR DELETE 
USING (auth.uid() = user_id);

-- Public access to shared reports via token
CREATE POLICY "Public access to shared reports" 
ON public.claim_reports FOR SELECT 
USING (share_token IS NOT NULL AND expires_at > now());

-- Create RLS policies for audit_logs table
CREATE POLICY "Users can view their own audit logs" 
ON public.audit_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Log user signup event
  INSERT INTO public.audit_logs (user_id, event_type, entity_type, entity_id, metadata)
  VALUES (NEW.id, 'user_signup', 'user', NEW.id, jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_event_type public.event_type,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, event_type, entity_type, entity_id, metadata)
  VALUES (auth.uid(), p_event_type, p_entity_type, p_entity_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;