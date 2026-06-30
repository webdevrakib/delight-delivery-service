DROP POLICY IF EXISTS "View profiles of active crop sellers" ON public.profiles;

CREATE OR REPLACE VIEW public.public_seller_profiles
WITH (security_invoker = false) AS
SELECT p.id, p.full_name, p.phone, p.district, p.village, p.avatar_url
FROM public.profiles p
WHERE EXISTS (
  SELECT 1 FROM public.farmer_crop_listings l
  WHERE l.farmer_id = p.id AND l.status = 'active'
);

REVOKE ALL ON public.public_seller_profiles FROM PUBLIC, anon;
GRANT SELECT ON public.public_seller_profiles TO authenticated;