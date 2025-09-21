-- Add enhanced OCR columns to assets table
ALTER TABLE public.assets 
ADD COLUMN ocr_provider TEXT,
ADD COLUMN ocr_raw_text TEXT,
ADD COLUMN ocr_metadata JSONB DEFAULT '{}'::jsonb;