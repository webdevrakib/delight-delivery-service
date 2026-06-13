CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, phone, nid_number, krishi_card_no, date_of_birth,
    division, district, upazila, post_office, village, ward_no
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', ''),
    NULLIF(NEW.raw_user_meta_data->>'nid_number', ''),
    NULLIF(NEW.raw_user_meta_data->>'krishi_card_no', ''),
    CASE WHEN COALESCE(NEW.raw_user_meta_data->>'date_of_birth', '') ~ '^\d{4}-\d{2}-\d{2}$'
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date ELSE NULL END,
    NULLIF(NEW.raw_user_meta_data->>'division', ''),
    NULLIF(NEW.raw_user_meta_data->>'district', ''),
    NULLIF(NEW.raw_user_meta_data->>'upazila', ''),
    NULLIF(NEW.raw_user_meta_data->>'post_office', ''),
    NULLIF(NEW.raw_user_meta_data->>'village', ''),
    NULLIF(NEW.raw_user_meta_data->>'ward_no', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    nid_number = COALESCE(EXCLUDED.nid_number, profiles.nid_number),
    krishi_card_no = COALESCE(EXCLUDED.krishi_card_no, profiles.krishi_card_no),
    date_of_birth = COALESCE(EXCLUDED.date_of_birth, profiles.date_of_birth),
    division = COALESCE(EXCLUDED.division, profiles.division),
    district = COALESCE(EXCLUDED.district, profiles.district),
    upazila = COALESCE(EXCLUDED.upazila, profiles.upazila),
    post_office = COALESCE(EXCLUDED.post_office, profiles.post_office),
    village = COALESCE(EXCLUDED.village, profiles.village),
    ward_no = COALESCE(EXCLUDED.ward_no, profiles.ward_no);
  RETURN NEW;
END;
$$;