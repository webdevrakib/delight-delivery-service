DROP VIEW IF EXISTS public.public_seller_profiles;

CREATE OR REPLACE FUNCTION public.get_public_seller_profiles(seller_ids uuid[])
RETURNS TABLE (
  id uuid,
  full_name text,
  phone text,
  district text,
  village text,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name, p.phone, p.district, p.village, p.avatar_url
  FROM public.profiles p
  WHERE p.id = ANY(seller_ids)
    AND EXISTS (
      SELECT 1 FROM public.farmer_crop_listings l
      WHERE l.farmer_id = p.id AND l.status = 'active'
    );
$$;

REVOKE ALL ON FUNCTION public.get_public_seller_profiles(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_seller_profiles(uuid[]) TO authenticated;