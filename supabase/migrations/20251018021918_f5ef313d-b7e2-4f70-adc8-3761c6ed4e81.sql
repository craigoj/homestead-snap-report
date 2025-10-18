-- Fix security warnings: Add search_path to functions

-- Update create_asset_version function with proper search_path
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
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- Update flag_high_value_assets function with proper search_path
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
$$ LANGUAGE plpgsql
SET search_path = public;