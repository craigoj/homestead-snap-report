-- Create validation trigger function for assets numeric fields
CREATE OR REPLACE FUNCTION public.validate_assets_numeric_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate estimated_value
  IF NEW.estimated_value IS NOT NULL AND (
    NEW.estimated_value < 0 OR 
    NEW.estimated_value > 999999999
  ) THEN
    RAISE EXCEPTION 'assets.estimated_value out of range: must be between 0 and 999,999,999'
      USING HINT = 'Please enter a value between $0 and $999,999,999';
  END IF;

  -- Validate purchase_price
  IF NEW.purchase_price IS NOT NULL AND (
    NEW.purchase_price < 0 OR 
    NEW.purchase_price > 999999999
  ) THEN
    RAISE EXCEPTION 'assets.purchase_price out of range: must be between 0 and 999,999,999'
      USING HINT = 'Please enter a value between $0 and $999,999,999';
  END IF;

  -- Validate ocr_confidence (should be 0-100 percentage)
  IF NEW.ocr_confidence IS NOT NULL AND (
    NEW.ocr_confidence < 0 OR 
    NEW.ocr_confidence > 100
  ) THEN
    RAISE EXCEPTION 'assets.ocr_confidence out of range: must be between 0 and 100'
      USING HINT = 'OCR confidence should be a percentage between 0 and 100';
  END IF;

  -- Validate appraisal_value
  IF NEW.appraisal_value IS NOT NULL AND (
    NEW.appraisal_value < 0 OR 
    NEW.appraisal_value > 999999999
  ) THEN
    RAISE EXCEPTION 'assets.appraisal_value out of range: must be between 0 and 999,999,999'
      USING HINT = 'Please enter a value between $0 and $999,999,999';
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_assets_numeric_trigger ON public.assets;

-- Attach trigger to assets table for INSERT and UPDATE
CREATE TRIGGER validate_assets_numeric_trigger
  BEFORE INSERT OR UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_assets_numeric_fields();