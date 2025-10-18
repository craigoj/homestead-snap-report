-- Widen assets.ocr_confidence to store 0-100 safely
ALTER TABLE public.assets 
  ALTER COLUMN ocr_confidence TYPE numeric(5,2)
  USING CASE 
    WHEN ocr_confidence IS NULL THEN NULL 
    ELSE ROUND(ocr_confidence::numeric, 2) 
  END;