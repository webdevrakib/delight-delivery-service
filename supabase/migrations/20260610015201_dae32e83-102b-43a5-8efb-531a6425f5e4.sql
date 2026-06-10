
-- 1. farmer_crop_listings table
CREATE TABLE public.farmer_crop_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  quantity NUMERIC NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  price_per_unit NUMERIC NOT NULL CHECK (price_per_unit >= 0),
  area TEXT,
  description TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','removed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.farmer_crop_listings TO authenticated;
GRANT ALL ON public.farmer_crop_listings TO service_role;

ALTER TABLE public.farmer_crop_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view active listings"
  ON public.farmer_crop_listings FOR SELECT
  TO authenticated
  USING (status = 'active' OR farmer_id = auth.uid());

CREATE POLICY "Farmers can insert own listings"
  ON public.farmer_crop_listings FOR INSERT
  TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can update own listings"
  ON public.farmer_crop_listings FOR UPDATE
  TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "Farmers can delete own listings"
  ON public.farmer_crop_listings FOR DELETE
  TO authenticated
  USING (farmer_id = auth.uid());

CREATE TRIGGER set_updated_at_farmer_crop_listings
  BEFORE UPDATE ON public.farmer_crop_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Ensure machines has needed columns (image_url, price_per_hour, price_per_day, available_from)
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS price_per_hour NUMERIC;
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS price_per_day NUMERIC;
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS available_from DATE;
ALTER TABLE public.machines ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- 3. buyers logo_url
ALTER TABLE public.buyers ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 4. crop_sales link to listing (optional bridge)
ALTER TABLE public.crop_sales ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES public.farmer_crop_listings(id) ON DELETE SET NULL;
