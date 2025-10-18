-- ============================================
-- CRITICAL PRIORITY: Immutable Timestamps & Photo Integrity
-- ============================================

-- Add EXIF and integrity fields to asset_photos table
ALTER TABLE asset_photos 
ADD COLUMN IF NOT EXISTS exif_data jsonb,
ADD COLUMN IF NOT EXISTS photo_taken_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS photo_hash text,
ADD COLUMN IF NOT EXISTS gps_coordinates jsonb,
ADD COLUMN IF NOT EXISTS camera_make text,
ADD COLUMN IF NOT EXISTS camera_model text,
ADD COLUMN IF NOT EXISTS original_filename text;

-- Create asset version history table
CREATE TABLE IF NOT EXISTS asset_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  version_number integer NOT NULL,
  changes jsonb NOT NULL,
  changed_by uuid NOT NULL,
  changed_at timestamp with time zone DEFAULT now() NOT NULL,
  snapshot jsonb NOT NULL,
  reason text,
  CONSTRAINT asset_versions_unique UNIQUE (asset_id, version_number)
);

-- Enable RLS on asset_versions
ALTER TABLE asset_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their assets"
ON asset_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM assets 
    WHERE assets.id = asset_versions.asset_id 
    AND assets.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create versions for their assets"
ON asset_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM assets 
    WHERE assets.id = asset_versions.asset_id 
    AND assets.user_id = auth.uid()
  )
);

-- Create trigger to auto-create versions on asset updates
CREATE OR REPLACE FUNCTION create_asset_version()
RETURNS TRIGGER AS $$
DECLARE
  v_version_number integer;
  v_changes jsonb;
BEGIN
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO v_version_number
  FROM asset_versions
  WHERE asset_id = NEW.id;

  v_changes := jsonb_build_object(
    'updated_at', NEW.updated_at,
    'changes', jsonb_strip_nulls(
      jsonb_build_object(
        'title', CASE WHEN OLD.title != NEW.title THEN jsonb_build_object('old', OLD.title, 'new', NEW.title) ELSE NULL END,
        'estimated_value', CASE WHEN OLD.estimated_value != NEW.estimated_value THEN jsonb_build_object('old', OLD.estimated_value, 'new', NEW.estimated_value) ELSE NULL END,
        'condition', CASE WHEN OLD.condition != NEW.condition THEN jsonb_build_object('old', OLD.condition, 'new', NEW.condition) ELSE NULL END
      )
    )
  );

  INSERT INTO asset_versions (
    asset_id, user_id, version_number, changes, changed_by, snapshot
  ) VALUES (
    NEW.id, NEW.user_id, v_version_number, v_changes, auth.uid(), 
    row_to_json(NEW)::jsonb
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS asset_version_trigger ON assets;
CREATE TRIGGER asset_version_trigger
AFTER UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION create_asset_version();

-- ============================================
-- CRITICAL PRIORITY: Proof of Loss & Deadline Tracking
-- ============================================

-- Create loss_events table
CREATE TABLE IF NOT EXISTS loss_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_date date NOT NULL,
  discovery_date date NOT NULL,
  description text NOT NULL,
  police_report_number text,
  fire_department_report text,
  estimated_total_loss numeric,
  deadline_60_days date GENERATED ALWAYS AS (discovery_date + INTERVAL '60 days') STORED,
  deadline_notified boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'filed', 'closed')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE loss_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own loss events"
ON loss_events FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create proof_of_loss_forms table
CREATE TABLE IF NOT EXISTS proof_of_loss_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  loss_event_id uuid REFERENCES loss_events(id) ON DELETE CASCADE,
  form_data jsonb NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at timestamp with time zone,
  insurer_name text,
  policy_number text,
  claim_number text,
  sworn_statement_text text,
  signature_data text,
  signature_date timestamp with time zone,
  notary_info jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE proof_of_loss_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own proof of loss forms"
ON proof_of_loss_forms FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ============================================
-- HIGH PRIORITY: High-Value Item Flagging
-- ============================================

-- Add appraisal fields to assets table
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS is_high_value boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_appraisal boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS appraisal_value numeric,
ADD COLUMN IF NOT EXISTS appraisal_date date,
ADD COLUMN IF NOT EXISTS appraiser_name text,
ADD COLUMN IF NOT EXISTS appraisal_document_path text;

-- Create trigger for automatic high-value flagging
CREATE OR REPLACE FUNCTION flag_high_value_assets()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.estimated_value > 5000) OR 
     (NEW.category = 'jewelry' AND NEW.estimated_value > 2500) THEN
    NEW.is_high_value := true;
    NEW.requires_appraisal := true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_high_value_asset ON assets;
CREATE TRIGGER check_high_value_asset
BEFORE INSERT OR UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION flag_high_value_assets();

-- ============================================
-- HIGH PRIORITY: Video Walkthrough Support
-- ============================================

-- Create room_walkthroughs table
CREATE TABLE IF NOT EXISTS room_walkthroughs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  video_path text NOT NULL,
  video_filename text NOT NULL,
  video_size integer,
  duration_seconds integer,
  thumbnail_path text,
  recorded_at timestamp with time zone DEFAULT now(),
  description text,
  linked_asset_ids uuid[],
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE room_walkthroughs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own walkthroughs"
ON room_walkthroughs FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-walkthroughs', 'room-walkthroughs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for videos
CREATE POLICY "Users can upload their own videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'room-walkthroughs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'room-walkthroughs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'room-walkthroughs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- HIGH PRIORITY: Enhanced Report Templates
-- ============================================

-- Create report_templates table
CREATE TABLE IF NOT EXISTS report_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  insurer_name text,
  template_type text NOT NULL,
  template_config jsonb NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view report templates"
ON report_templates FOR SELECT
USING (true);

-- Seed default templates
INSERT INTO report_templates (template_name, insurer_name, template_type, template_config, is_default) VALUES
('Generic Insurance Claim', 'Generic', 'claim', '{"layout": "standard", "sections": ["cover", "summary", "items", "photos", "sworn_statement"]}', true),
('State Farm Proof of Loss', 'State Farm', 'proof_of_loss', '{"layout": "state_farm", "required_fields": ["policy_number", "claim_number", "event_date"]}', false),
('Allstate Inventory Report', 'Allstate', 'inventory', '{"layout": "allstate", "grouping": "by_room"}', false)
ON CONFLICT DO NOTHING;