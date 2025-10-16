-- Allow users to view their own waitlist entry
CREATE POLICY "Users can view their own waitlist entry"
ON public.waitlist
FOR SELECT
TO anon, authenticated
USING (true);