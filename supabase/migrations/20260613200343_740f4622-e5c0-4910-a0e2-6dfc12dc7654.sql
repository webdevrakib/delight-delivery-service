ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS division text,
  ADD COLUMN IF NOT EXISTS ward_no text,
  ADD COLUMN IF NOT EXISTS krishi_card_no text;

CREATE TABLE public.labor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 15),
  categories text[] NOT NULL DEFAULT '{}',
  daily_rate numeric(10,2) NOT NULL CHECK (daily_rate >= 0),
  division text NOT NULL CHECK (char_length(division) <= 60),
  district text NOT NULL CHECK (char_length(district) <= 60),
  upazila text NOT NULL CHECK (char_length(upazila) <= 60),
  village text NOT NULL CHECK (char_length(village) <= 100),
  description text CHECK (description IS NULL OR char_length(description) <= 500),
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.labor_profiles TO authenticated;
GRANT ALL ON public.labor_profiles TO service_role;
ALTER TABLE public.labor_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users view available labor profiles"
  ON public.labor_profiles FOR SELECT TO authenticated
  USING (available = true OR auth.uid() = user_id);
CREATE POLICY "Users create own labor profile"
  ON public.labor_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own labor profile"
  ON public.labor_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own labor profile"
  ON public.labor_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE TRIGGER set_labor_profiles_updated_at
  BEFORE UPDATE ON public.labor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();