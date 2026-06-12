-- Smart Cards table
CREATE TABLE public.smart_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number text NOT NULL UNIQUE,
  issued_at date NOT NULL DEFAULT CURRENT_DATE,
  expires_at date NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '2 years'),
  balance numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.smart_cards TO authenticated;
GRANT ALL ON public.smart_cards TO service_role;

ALTER TABLE public.smart_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own card" ON public.smart_cards
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER smart_cards_updated BEFORE UPDATE ON public.smart_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Transactions table
CREATE TABLE public.smart_card_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.smart_cards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('government_payment','withdrawal')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','rejected','received')),
  payment_method text,
  payment_number text,
  is_own_number boolean DEFAULT true,
  request_name text,
  request_nid text,
  request_birthdate date,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.smart_card_transactions TO authenticated;
GRANT ALL ON public.smart_card_transactions TO service_role;

ALTER TABLE public.smart_card_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own tx" ON public.smart_card_transactions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER smart_card_tx_updated BEFORE UPDATE ON public.smart_card_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_sct_card_created ON public.smart_card_transactions(card_id, created_at DESC);

-- Auto-create smart card for new profile
CREATE OR REPLACE FUNCTION public.create_smart_card_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  digits text;
BEGIN
  -- 10-digit deterministic-ish number from uuid
  digits := lpad((abs(hashtext(NEW.id::text)) % 10000000000)::text, 10, '0');
  INSERT INTO public.smart_cards (user_id, card_number)
  VALUES (NEW.id, digits)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_smart_card_after_profile
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_smart_card_for_user();

-- Backfill existing profiles
INSERT INTO public.smart_cards (user_id, card_number)
SELECT p.id, lpad((abs(hashtext(p.id::text)) % 10000000000)::text, 10, '0')
FROM public.profiles p
WHERE NOT EXISTS (SELECT 1 FROM public.smart_cards sc WHERE sc.user_id = p.id)
ON CONFLICT DO NOTHING;