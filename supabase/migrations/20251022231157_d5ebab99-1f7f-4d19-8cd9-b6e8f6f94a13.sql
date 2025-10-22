-- Fix critical security issues

-- 1. Fix waitlist public exposure - restrict to admin-only SELECT
DROP POLICY IF EXISTS "Users can view their own waitlist entry" ON public.waitlist;

CREATE POLICY "Only admins can view waitlist"
ON public.waitlist
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Fix eBay tokens public exposure - remove public policy entirely
-- Access should only be through SECURITY DEFINER functions
DROP POLICY IF EXISTS "System can manage tokens" ON public.ebay_tokens;

-- Note: ebay_tokens will now only be accessible through:
-- - get_valid_ebay_token() function (SECURITY DEFINER)
-- - upsert_ebay_token() function (SECURITY DEFINER)