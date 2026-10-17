BEGIN;
CREATE TABLE public.gs_capture_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 participation_id uuid NOT NULL REFERENCES public.gs_participations(id) ON DELETE CASCADE,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','approved','rejected','expired')),
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL DEFAULT now()+interval '5 minutes',
 image_hash text, image_path text, reason text
);
CREATE UNIQUE INDEX gs_unique_approved_photo ON public.gs_capture_sessions(image_hash) WHERE status='approved';
CREATE INDEX gs_capture_user_time ON public.gs_capture_sessions(user_id,created_at);
ALTER TABLE public.gs_capture_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gs_capture_sessions FROM anon,authenticated;
GRANT ALL ON public.gs_capture_sessions TO service_role;
CREATE FUNCTION public.gs_start_capture(p_user uuid,p_participation uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE t public.gs_capture_sessions;
BEGIN
 PERFORM 1 FROM public.gs_profiles WHERE id=p_user FOR UPDATE;
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM public.gs_participations WHERE id=p_participation AND user_id=p_user AND status='in_progress') THEN RAISE EXCEPTION '참여 기록을 확인해주세요'; END IF;
 IF (SELECT count(*) FROM public.gs_capture_sessions WHERE user_id=p_user AND created_at>now()-interval '1 hour')>=20 THEN RAISE EXCEPTION '시간당 촬영 요청 한도에 도달했습니다'; END IF;
 UPDATE public.gs_capture_sessions SET status='expired' WHERE user_id=p_user AND status='pending';
 INSERT INTO public.gs_capture_sessions(user_id,participation_id) VALUES(p_user,p_participation) RETURNING * INTO t;
 RETURN jsonb_build_object('ticket',t.id,'expiresAt',t.expires_at);
END $$;
REVOKE ALL ON FUNCTION public.gs_start_capture(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.gs_start_capture(uuid,uuid) TO service_role;
DROP POLICY IF EXISTS gs_upload_own ON storage.objects;
CREATE OR REPLACE FUNCTION public.gs_complete(p_id uuid,p_image text,p_baseline numeric DEFAULT NULL,p_actual numeric DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r public.gs_participations; c public.gs_challenges; carbon numeric:=0; estimate jsonb; factor numeric; factor_id text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 SELECT * INTO r FROM public.gs_participations WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION '참여 기록을 찾을 수 없습니다'; END IF;
 IF r.status='completed' THEN RETURN to_jsonb(r); END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gs_capture_sessions WHERE participation_id=p_id AND user_id=auth.uid() AND status='approved' AND image_path=p_image) THEN RAISE EXCEPTION 'AI 사진 승인이 필요합니다'; END IF;
 SELECT * INTO c FROM public.gs_challenges WHERE id=r.challenge_id AND active;
 IF NOT FOUND THEN RAISE EXCEPTION '종료된 챌린지입니다'; END IF;
 IF p_image NOT LIKE auth.uid()::text || '/' || p_id::text || '/%' OR NOT EXISTS(
   SELECT 1 FROM storage.objects WHERE bucket_id='greenstep-evidence' AND name=p_image
 ) THEN RAISE EXCEPTION '본인의 인증 사진이 필요합니다'; END IF;
 estimate:=jsonb_build_object('status','not_calculated','estimatedKgCO2e',NULL,'calculationVersion','changwon-20261016-v1','reason','적용 계수 또는 측정 무게가 없습니다.');
 IF c.incentive_id='zero-leftover-meal' AND (p_baseline IS NOT NULL OR p_actual IS NOT NULL) THEN
   IF p_baseline IS NULL OR p_actual IS NULL OR p_actual<0 OR p_baseline<p_actual OR p_baseline>100000 OR p_baseline::text IN ('NaN','Infinity','-Infinity') OR p_actual::text IN ('NaN','Infinity','-Infinity') THEN RAISE EXCEPTION '잔반 무게를 확인해주세요'; END IF;
   SELECT f.id,f.factor_kg_co2e_per_unit INTO factor_id,factor FROM public.greenstep_carbon_factors f WHERE source_number=214 AND dataset_id='changwon-supplied-20261016' AND app_status='conditional_mass_estimate';
   IF factor IS NULL THEN RAISE EXCEPTION '감축 계수 설정이 필요합니다'; END IF;
   carbon:=round((p_baseline-p_actual)/1000*factor,6);
   estimate:=jsonb_build_object('status','estimated','estimatedKgCO2e',carbon,'calculationVersion','changwon-20261016-v1','factorId',factor_id,'factorKgCO2ePerUnit',factor,'baselineWasteKg',p_baseline/1000,'actualWasteKg',p_actual/1000,'reducedQuantityKg',(p_baseline-p_actual)/1000);
 END IF;
 UPDATE public.gs_participations SET status='completed',completed_at=now(),image_path=p_image,carbon_saved=carbon,carbon_estimate=estimate,points=c.points WHERE id=r.id RETURNING * INTO r;
 INSERT INTO public.gs_points(user_id,event_key,amount,reason) VALUES(auth.uid(),'challenge:'||r.id,c.points,c.title) ON CONFLICT DO NOTHING;
 RETURN to_jsonb(r);
END $$;


COMMIT;
