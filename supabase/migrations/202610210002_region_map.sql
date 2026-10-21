BEGIN;
CREATE TABLE IF NOT EXISTS public.gs_map_regions(
  id text PRIMARY KEY, name text NOT NULL, members jsonb NOT NULL
);
ALTER TABLE public.gs_map_regions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gs_map_regions FROM anon,authenticated;
GRANT ALL ON public.gs_map_regions TO service_role;
INSERT INTO public.gs_map_regions(id,name,members) VALUES ('west','서부권','["수곡면", "대평면", "명석면"]'::jsonb),('north','북부권','["집현면", "미천면", "대곡면"]'::jsonb),('east','동부권','["지수면", "사봉면", "일반성면", "이반성면"]'::jsonb),('southeast','금산·진성권','["금산면", "진성면"]'::jsonb),('south','남부권','["내동면", "정촌면", "문산읍", "금곡면"]'::jsonb),('4817067300','상대동','["상대동"]'::jsonb),('4817067800','하대동','["하대동"]'::jsonb),('4817068000','상평동','["상평동"]'::jsonb),('4817069500','초장동','["초장동"]'::jsonb),('4817071000','평거동','["평거동"]'::jsonb),('4817071500','신안동','["신안동"]'::jsonb),('4817072000','이현동','["이현동"]'::jsonb),('4817073000','판문동','["판문동"]'::jsonb),('4817074000','가호동','["가호동"]'::jsonb),('4817051500','천전동','["천전동"]'::jsonb),('4817055500','성북동','["성북동"]'::jsonb),('4817056500','중앙동','["중앙동"]'::jsonb),('4817059500','상봉동','["상봉동"]'::jsonb),('4817075000','충무공동','["충무공동"]'::jsonb) ON CONFLICT(id) DO UPDATE SET name=excluded.name,members=excluded.members;
ALTER TABLE public.gs_participations ADD COLUMN IF NOT EXISTS map_region text REFERENCES public.gs_map_regions(id);
CREATE INDEX IF NOT EXISTS gs_map_region_completed ON public.gs_participations(map_region,completed_at) WHERE status='completed';

CREATE OR REPLACE FUNCTION public.gs_complete_in_region(p_id uuid,p_image text,p_region text,p_baseline numeric DEFAULT NULL,p_actual numeric DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r public.gs_participations; result jsonb;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
  IF p_region IS NULL OR NOT EXISTS(SELECT 1 FROM public.gs_map_regions WHERE id=p_region) THEN RAISE EXCEPTION '실천 지역을 선택해주세요'; END IF;
  SELECT * INTO r FROM public.gs_participations WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION '참여 기록을 찾을 수 없습니다'; END IF;
  IF r.status='completed' THEN RETURN to_jsonb(r); END IF;
  result:=public.gs_complete(p_id,p_image,p_baseline,p_actual);
  UPDATE public.gs_participations SET map_region=p_region WHERE id=p_id RETURNING * INTO r;
  RETURN to_jsonb(r);
END $$;
REVOKE ALL ON FUNCTION public.gs_complete_in_region(uuid,text,text,numeric,numeric) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_complete_in_region(uuid,text,text,numeric,numeric) TO authenticated;

CREATE OR REPLACE FUNCTION public.gs_region_map(p_days integer DEFAULT 30,p_mine boolean DEFAULT true)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb; period_end timestamptz; period_start timestamptz; previous_start timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
  IF p_days IS NULL OR p_days NOT IN(7,30,365) OR p_mine IS NULL THEN RAISE EXCEPTION '집계 조건을 확인해주세요'; END IF;
  period_end:=(((now() AT TIME ZONE 'Asia/Seoul')::date+1)::timestamp AT TIME ZONE 'Asia/Seoul');
  period_start:=period_end-make_interval(days=>p_days);
  previous_start:=period_start-make_interval(days=>p_days);
  WITH activity AS (
    SELECT a.*,a.completed_at>=period_start AS current_period
    FROM public.gs_participations a JOIN public.gs_profiles p ON p.id=a.user_id
    WHERE a.status='completed' AND a.completed_at>=previous_start AND a.completed_at<=now()
      AND ((p_mine AND a.user_id=auth.uid()) OR (NOT p_mine AND p.share_activity))
  ), grouped AS (
    SELECT map_region,
      count(*) FILTER(WHERE current_period) AS actions,
      count(*) FILTER(WHERE NOT current_period) AS previous,
      count(DISTINCT user_id) FILTER(WHERE current_period) AS people,
      count(DISTINCT user_id) FILTER(WHERE NOT current_period) AS previous_people,
      coalesce(sum(carbon_saved) FILTER(WHERE current_period AND carbon_estimate->>'status'='estimated'),0) AS estimated,
      count(*) FILTER(WHERE current_period AND carbon_estimate->>'status'='estimated') AS measured
    FROM activity WHERE map_region IS NOT NULL GROUP BY map_region
  ), visible AS (
    SELECT * FROM grouped WHERE p_mine OR (people>=3 AND (previous=0 OR previous_people>=3))
  )
  SELECT jsonb_build_object(
    'unmapped',(SELECT count(*) FROM activity WHERE current_period AND map_region IS NULL),
    'hidden',(SELECT coalesce(sum(actions),0) FROM grouped WHERE NOT p_mine AND NOT(people>=3 AND(previous=0 OR previous_people>=3))),
    'regions',(SELECT coalesce(jsonb_agg(jsonb_build_object(
      'id',v.map_region,'actions',v.actions,'previous',v.previous,'estimated',v.estimated,'measured',v.measured,
      'challenges',(SELECT coalesce(jsonb_agg(jsonb_build_object('id',c.challenge_id,'count',c.n)),'[]'::jsonb)
        FROM (SELECT challenge_id,count(*) AS n FROM activity WHERE current_period AND map_region=v.map_region GROUP BY challenge_id) c)
    ) ORDER BY v.map_region),'[]'::jsonb) FROM visible v)
  ) INTO result;
  RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.gs_region_map(integer,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_region_map(integer,boolean) TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
