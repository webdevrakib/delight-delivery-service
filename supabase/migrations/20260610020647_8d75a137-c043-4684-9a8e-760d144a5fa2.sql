CREATE POLICY "View profiles of active crop sellers"
  ON public.profiles FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.farmer_crop_listings l
    WHERE l.farmer_id = profiles.id AND l.status = 'active'
  ));