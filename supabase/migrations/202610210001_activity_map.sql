BEGIN;
ALTER TABLE public.gs_participations ADD COLUMN IF NOT EXISTS map_lat numeric;
ALTER TABLE public.gs_participations ADD COLUMN IF NOT EXISTS map_lng numeric;

-- Coarse, self-reported locations only. Original precise coordinates are never stored.
CREATE OR REPLACE FUNCTION public.gs_complete_at_location(
  p_id uuid, p_image text, p_lat numeric, p_lng numeric,
  p_baseline numeric DEFAULT NULL, p_actual numeric DEFAULT NULL
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r public.gs_participations; result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
  IF p_lat IS NULL OR p_lng IS NULL OR NOT (p_lat BETWEEN 35 AND 35.4 AND p_lng BETWEEN 127.85 AND 128.4) THEN
    RAISE EXCEPTION '진주 지도 범위 안의 위치를 선택해주세요';
  END IF;
  SELECT * INTO r FROM public.gs_participations WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION '참여 기록을 찾을 수 없습니다'; END IF;
  IF r.status='completed' THEN RETURN to_jsonb(r); END IF;
  -- Existing completion enforces approved capture, ownership and reward idempotency.
  result := public.gs_complete(p_id,p_image,p_baseline,p_actual);
  UPDATE public.gs_participations SET map_lat=round(p_lat,2),map_lng=round(p_lng,2)
    WHERE id=p_id RETURNING * INTO r;
  RETURN to_jsonb(r);
END $$;
REVOKE ALL ON FUNCTION public.gs_complete_at_location(uuid,text,numeric,numeric,numeric,numeric) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_complete_at_location(uuid,text,numeric,numeric,numeric,numeric) TO authenticated;

CREATE OR REPLACE FUNCTION public.gs_activity_map(p_days integer DEFAULT 30,p_mine boolean DEFAULT true)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
  IF p_days IS NULL OR p_days NOT IN (7,30,365) OR p_mine IS NULL THEN RAISE EXCEPTION '집계 조건을 확인해주세요'; END IF;
  WITH activity AS (
    SELECT a.* FROM public.gs_participations a JOIN public.gs_profiles p ON p.id=a.user_id
    WHERE a.status='completed'
      AND a.completed_at >= (((now() AT TIME ZONE 'Asia/Seoul')::date-(p_days-1))::timestamp AT TIME ZONE 'Asia/Seoul')
      AND a.completed_at <= now()
      AND ((p_mine AND a.user_id=auth.uid()) OR (NOT p_mine AND p.share_activity))
  ), cells AS (
    SELECT map_lat,map_lng,count(*) AS actions,count(DISTINCT user_id) AS people,
      coalesce(sum(carbon_saved) FILTER (WHERE carbon_estimate->>'status'='estimated'),0) AS estimated,
      count(*) FILTER (WHERE carbon_estimate->>'status'='estimated') AS estimated_count
    FROM activity WHERE map_lat IS NOT NULL AND map_lng IS NOT NULL GROUP BY map_lat,map_lng
  )
  SELECT jsonb_build_object(
    'total',(SELECT count(*) FROM activity),
    'unmapped',(SELECT count(*) FROM activity WHERE map_lat IS NULL OR map_lng IS NULL),
    'hidden',(SELECT coalesce(sum(actions),0) FROM cells WHERE NOT p_mine AND people<3),
    'cells',(SELECT coalesce(jsonb_agg(jsonb_build_object(
      'lat',map_lat,'lng',map_lng,'actions',actions,'estimated',estimated,'estimatedCount',estimated_count
    ) ORDER BY map_lat,map_lng),'[]'::jsonb) FROM cells WHERE p_mine OR people>=3)
  ) INTO result;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.gs_activity_map(integer,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_activity_map(integer,boolean) TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
