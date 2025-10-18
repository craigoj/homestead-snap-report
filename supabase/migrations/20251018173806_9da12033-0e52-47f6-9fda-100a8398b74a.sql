-- Attach validation trigger to assets to enforce safe numeric ranges
-- Use existing function public.validate_assets_numeric_fields()

-- Drop existing trigger if present
DROP TRIGGER IF EXISTS validate_assets_numeric_trigger ON public.assets;

-- Create BEFORE INSERT OR UPDATE trigger
CREATE TRIGGER validate_assets_numeric_trigger
  BEFORE INSERT OR UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_assets_numeric_fields();