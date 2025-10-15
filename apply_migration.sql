-- Migration: add increment_points rpc
-- Purpose: atomically increment points, co2 and scan count for profiles

CREATE OR REPLACE FUNCTION public.increment_points(
  p_user_id uuid,
  p_points integer DEFAULT 0,
  p_co2 numeric DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  total_scans integer,
  total_points integer,
  co2_saved_kg numeric,
  trees_saved numeric,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  UPDATE public.profiles
  SET
    total_points = COALESCE(total_points,0) + COALESCE(p_points,0),
    co2_saved_kg = COALESCE(co2_saved_kg,0) + COALESCE(p_co2,0),
    total_scans = COALESCE(total_scans,0) + 1,
    updated_at = now()
  WHERE id = p_user_id
  RETURNING id, username, full_name, avatar_url, total_scans, total_points, co2_saved_kg, trees_saved, created_at, updated_at
  INTO id, username, full_name, avatar_url, total_scans, total_points, co2_saved_kg, trees_saved, created_at, updated_at;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.increment_points(uuid, integer, numeric) TO authenticated;
