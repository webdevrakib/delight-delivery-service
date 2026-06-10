
CREATE TABLE public.helpline_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  problem text NOT NULL,
  reply text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  replied_at timestamptz
);

GRANT SELECT, INSERT, UPDATE ON public.helpline_tickets TO authenticated;
GRANT ALL ON public.helpline_tickets TO service_role;

ALTER TABLE public.helpline_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own tickets" ON public.helpline_tickets
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create their own tickets" ON public.helpline_tickets
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update their own tickets" ON public.helpline_tickets
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER helpline_set_updated_at
  BEFORE UPDATE ON public.helpline_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.notify_helpline_reply()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.reply IS NOT NULL AND NEW.reply IS DISTINCT FROM OLD.reply THEN
    INSERT INTO public.notifications (sender_id, recipient_id, sender_name, message)
    VALUES (NEW.user_id, NEW.user_id, 'সাপোর্ট টিম', NEW.reply);
    NEW.replied_at = now();
    NEW.status = 'replied';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER helpline_notify_on_reply
  BEFORE UPDATE ON public.helpline_tickets
  FOR EACH ROW EXECUTE FUNCTION public.notify_helpline_reply();
