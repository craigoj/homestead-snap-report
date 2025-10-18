-- Create validation trigger function for loss_events numeric fields
CREATE OR REPLACE FUNCTION public.validate_loss_events_numeric_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate estimated_total_loss
  IF NEW.estimated_total_loss IS NOT NULL AND (
    NEW.estimated_total_loss < 0 OR 
    NEW.estimated_total_loss > 999999999
  ) THEN
    RAISE EXCEPTION 'loss_events.estimated_total_loss out of range: must be between 0 and 999,999,999'
      USING HINT = 'Please enter a value between $0 and $999,999,999';
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_loss_events_numeric_trigger ON public.loss_events;

-- Attach trigger to loss_events table for INSERT and UPDATE
CREATE TRIGGER validate_loss_events_numeric_trigger
  BEFORE INSERT OR UPDATE ON public.loss_events
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_loss_events_numeric_fields();

-- Create validation trigger function for claim_reports numeric fields
CREATE OR REPLACE FUNCTION public.validate_claim_reports_numeric_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate total_value
  IF NEW.total_value IS NOT NULL AND (
    NEW.total_value < 0 OR 
    NEW.total_value > 999999999
  ) THEN
    RAISE EXCEPTION 'claim_reports.total_value out of range: must be between 0 and 999,999,999'
      USING HINT = 'Please enter a value between $0 and $999,999,999';
  END IF;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_claim_reports_numeric_trigger ON public.claim_reports;

-- Attach trigger to claim_reports table for INSERT and UPDATE
CREATE TRIGGER validate_claim_reports_numeric_trigger
  BEFORE INSERT OR UPDATE ON public.claim_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_claim_reports_numeric_fields();