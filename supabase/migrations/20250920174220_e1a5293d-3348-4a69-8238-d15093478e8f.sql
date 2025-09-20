-- Create storage buckets for asset photos and receipts
INSERT INTO storage.buckets (id, name, public) VALUES ('asset-photos', 'asset-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Create storage policies for asset photos bucket
CREATE POLICY "Users can view their own asset photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'asset-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own asset photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'asset-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own asset photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'asset-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own asset photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'asset-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for receipts bucket  
CREATE POLICY "Users can view their own receipts" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own receipts" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own receipts" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);