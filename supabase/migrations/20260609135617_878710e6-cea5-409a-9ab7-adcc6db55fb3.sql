
-- profile updates
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS land_unit text NOT NULL DEFAULT 'acre' CHECK (land_unit IN ('acre','shotok'));

-- machines
CREATE TABLE public.machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_type text NOT NULL,
  title text NOT NULL,
  description text,
  district text NOT NULL,
  upazila text,
  rate_per_day numeric NOT NULL,
  contact_phone text NOT NULL,
  available boolean NOT NULL DEFAULT true,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.machines TO authenticated;
GRANT ALL ON public.machines TO service_role;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read machines" ON public.machines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner insert machine" ON public.machines FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update machine" ON public.machines FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete machine" ON public.machines FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER trg_machines_updated BEFORE UPDATE ON public.machines FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- machine_bookings
CREATE TABLE public.machine_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.machine_bookings TO authenticated;
GRANT ALL ON public.machine_bookings TO service_role;
ALTER TABLE public.machine_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmer or owner read booking" ON public.machine_bookings FOR SELECT TO authenticated
  USING (auth.uid() = farmer_id OR auth.uid() IN (SELECT owner_id FROM public.machines WHERE id = machine_id));
CREATE POLICY "Farmer create booking" ON public.machine_bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmer update booking" ON public.machine_bookings FOR UPDATE TO authenticated USING (auth.uid() = farmer_id);
CREATE POLICY "Farmer delete booking" ON public.machine_bookings FOR DELETE TO authenticated USING (auth.uid() = farmer_id);

-- buyers
CREATE TABLE public.buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn text NOT NULL,
  name_en text NOT NULL,
  buyer_type text NOT NULL,
  district text NOT NULL,
  address text,
  phone text NOT NULL,
  whatsapp text,
  crops_buying text[] NOT NULL DEFAULT '{}',
  offered_price_note text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.buyers TO authenticated;
GRANT ALL ON public.buyers TO service_role;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read buyers" ON public.buyers FOR SELECT TO authenticated USING (true);

-- crop_sales
CREATE TABLE public.crop_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES public.buyers(id) ON DELETE SET NULL,
  crop text NOT NULL,
  quantity_kg numeric NOT NULL,
  price_per_kg numeric NOT NULL,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crop_sales TO authenticated;
GRANT ALL ON public.crop_sales TO service_role;
ALTER TABLE public.crop_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own crop sales" ON public.crop_sales FOR ALL TO authenticated USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);

-- disease_questions
CREATE TABLE public.disease_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop text NOT NULL,
  question text NOT NULL,
  answer text,
  answered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.disease_questions TO authenticated;
GRANT ALL ON public.disease_questions TO service_role;
ALTER TABLE public.disease_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own disease questions" ON public.disease_questions FOR ALL TO authenticated USING (auth.uid() = farmer_id) WITH CHECK (auth.uid() = farmer_id);
