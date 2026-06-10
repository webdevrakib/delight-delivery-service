ALTER TABLE public.farmer_crop_listings
  ADD COLUMN IF NOT EXISTS seller_type text NOT NULL DEFAULT 'farmer',
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS company_name text;

ALTER TABLE public.farmer_crop_listings
  DROP CONSTRAINT IF EXISTS farmer_crop_listings_seller_type_check;
ALTER TABLE public.farmer_crop_listings
  ADD CONSTRAINT farmer_crop_listings_seller_type_check
  CHECK (seller_type IN ('farmer','company'));