
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  district TEXT,
  village TEXT,
  land_size_acres NUMERIC,
  primary_crops TEXT[],
  preferred_language TEXT NOT NULL DEFAULT 'bn',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SCHEMES
CREATE TABLE public.schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_bn TEXT NOT NULL,
  description_en TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility_bn TEXT,
  eligibility_en TEXT,
  link TEXT,
  ministry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.schemes TO authenticated;
GRANT ALL ON public.schemes TO service_role;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read schemes" ON public.schemes FOR SELECT TO authenticated USING (true);

-- TIPS
CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_bn TEXT NOT NULL,
  content_en TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tips TO authenticated;
GRANT ALL ON public.tips TO service_role;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read tips" ON public.tips FOR SELECT TO authenticated USING (true);

-- MARKET PRICES
CREATE TABLE public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_bn TEXT NOT NULL,
  crop_en TEXT NOT NULL,
  market_bn TEXT NOT NULL,
  market_en TEXT NOT NULL,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  price_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.market_prices TO authenticated;
GRANT ALL ON public.market_prices TO service_role;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users read prices" ON public.market_prices FOR SELECT TO authenticated USING (true);
