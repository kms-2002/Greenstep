BEGIN;
CREATE TABLE public.gs_profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 nickname text NOT NULL CHECK(length(nickname) BETWEEN 1 AND 40),
 member_type text NOT NULL CHECK(member_type IN ('student','citizen')),
 university text NOT NULL DEFAULT '', college text NOT NULL DEFAULT '', department text NOT NULL DEFAULT '',
 grade text NOT NULL DEFAULT '', student_id text NOT NULL DEFAULT '', avatar_id text NOT NULL DEFAULT 'avatar-hamo',
 share_activity boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.gs_challenges (
 id text PRIMARY KEY, title text NOT NULL, points integer NOT NULL CHECK(points >= 0),
 incentive_id text, active boolean NOT NULL DEFAULT true
);
CREATE TABLE public.gs_participations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 challenge_id text NOT NULL REFERENCES public.gs_challenges(id), status text NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','completed')),
 joined_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz, image_path text,
 carbon_estimate jsonb, carbon_saved numeric NOT NULL DEFAULT 0 CHECK(carbon_saved >= 0), points integer NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX gs_one_open_challenge ON public.gs_participations(user_id,challenge_id) WHERE status='in_progress';
CREATE TABLE public.gs_points (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 event_key text NOT NULL, amount integer NOT NULL CHECK(amount>=0), reason text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,event_key)
);
CREATE TABLE public.gs_invites (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid()
);
CREATE TABLE public.gs_friends (
 user_a uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, user_b uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_a,user_b), CHECK(user_a < user_b)
);
CREATE TABLE public.gs_quizzes (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, day date NOT NULL,
 question jsonb NOT NULL, PRIMARY KEY(user_id,day)
);
CREATE TABLE public.gs_quiz_answers (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, day date NOT NULL,
 selected_index integer NOT NULL CHECK(selected_index BETWEEN 0 AND 3), correct boolean NOT NULL,
 points integer NOT NULL, messages jsonb NOT NULL DEFAULT '[]', PRIMARY KEY(user_id,day)
);

ALTER TABLE public.gs_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gs_quiz_answers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gs_profiles, public.gs_challenges, public.gs_participations, public.gs_points, public.gs_invites, public.gs_friends, public.gs_quizzes, public.gs_quiz_answers FROM anon, authenticated;
GRANT SELECT ON public.gs_profiles, public.gs_challenges, public.gs_participations, public.gs_points, public.gs_quiz_answers TO authenticated;
GRANT ALL ON public.gs_profiles, public.gs_challenges, public.gs_participations, public.gs_points, public.gs_invites, public.gs_friends, public.gs_quizzes, public.gs_quiz_answers TO service_role;
CREATE POLICY own_profile ON public.gs_profiles FOR SELECT TO authenticated USING(id=(SELECT auth.uid()));
CREATE POLICY catalog ON public.gs_challenges FOR SELECT TO authenticated USING(true);
CREATE POLICY own_participations ON public.gs_participations FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()));
CREATE POLICY own_points ON public.gs_points FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()));
CREATE POLICY own_answers ON public.gs_quiz_answers FOR SELECT TO authenticated USING(user_id=(SELECT auth.uid()));

CREATE FUNCTION public.gs_new_member() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE m jsonb := new.raw_user_meta_data;
BEGIN
 INSERT INTO public.gs_profiles(id,nickname,member_type,university,college,department,grade,student_id,avatar_id)
 VALUES(new.id,left(coalesce(nullif(m->>'nickname',''),'그린스텝 회원'),40),
 CASE WHEN m->>'memberType'='citizen' THEN 'citizen' ELSE 'student' END,
 left(coalesce(m->>'university',''),120),left(coalesce(m->>'college',''),120),left(coalesce(m->>'department',''),120),
 left(coalesce(m->>'grade',''),30),left(coalesce(m->>'studentId',''),40),left(coalesce(m->>'profileAvatarId','avatar-hamo'),40));
 INSERT INTO public.gs_invites(user_id) VALUES(new.id);
 RETURN new;
END $$;
CREATE TRIGGER gs_after_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.gs_new_member();
-- Existing Auth accounts also need a profile; local demo accounts are never imported.
INSERT INTO public.gs_profiles(id,nickname,member_type,university,college,department,grade,student_id,avatar_id)
SELECT id,left(coalesce(nullif(raw_user_meta_data->>'nickname',''),'그린스텝 회원'),40),
 CASE WHEN raw_user_meta_data->>'memberType'='citizen' THEN 'citizen' ELSE 'student' END,
 left(coalesce(raw_user_meta_data->>'university',''),120),left(coalesce(raw_user_meta_data->>'college',''),120),left(coalesce(raw_user_meta_data->>'department',''),120),
 left(coalesce(raw_user_meta_data->>'grade',''),30),left(coalesce(raw_user_meta_data->>'studentId',''),40),left(coalesce(raw_user_meta_data->>'profileAvatarId','avatar-hamo'),40)
FROM auth.users ON CONFLICT(id) DO NOTHING;
INSERT INTO public.gs_invites(user_id) SELECT id FROM public.gs_profiles ON CONFLICT DO NOTHING;

CREATE FUNCTION public.gs_update_profile(p jsonb) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 UPDATE public.gs_profiles SET
 nickname=left(coalesce(p->>'nickname',nickname),40), university=left(coalesce(p->>'university',university),120),
 college=left(coalesce(p->>'college',college),120), department=left(coalesce(p->>'department',department),120),
 grade=left(coalesce(p->>'grade',grade),30),student_id=left(coalesce(p->>'studentId',student_id),40),
 avatar_id=left(coalesce(p->>'profileAvatarId',avatar_id),40), member_type=coalesce(p->>'memberType',member_type),
 share_activity=coalesce((p->>'shareActivity')::boolean,share_activity) WHERE id=auth.uid();
END $$;

CREATE FUNCTION public.gs_join(p_challenge text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE result uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.gs_challenges WHERE id=p_challenge AND active) THEN RAISE EXCEPTION '진행 중인 챌린지가 아닙니다'; END IF;
 INSERT INTO public.gs_participations(user_id,challenge_id) VALUES(auth.uid(),p_challenge)
 ON CONFLICT(user_id,challenge_id) WHERE status='in_progress' DO UPDATE SET challenge_id=excluded.challenge_id RETURNING id INTO result;
 RETURN result;
END $$;

CREATE FUNCTION public.gs_complete(p_id uuid,p_image text,p_baseline numeric DEFAULT NULL,p_actual numeric DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r public.gs_participations; c public.gs_challenges; carbon numeric:=0; estimate jsonb; factor numeric; factor_id text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 SELECT * INTO r FROM public.gs_participations WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION '참여 기록을 찾을 수 없습니다'; END IF;
 IF r.status='completed' THEN RETURN to_jsonb(r); END IF;
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

CREATE FUNCTION public.gs_invite(p_rotate boolean DEFAULT false) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE t uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 INSERT INTO public.gs_invites(user_id) VALUES(auth.uid()) ON CONFLICT DO NOTHING;
 IF p_rotate THEN UPDATE public.gs_invites SET token=gen_random_uuid() WHERE user_id=auth.uid(); END IF;
 SELECT token INTO t FROM public.gs_invites WHERE user_id=auth.uid(); RETURN t;
END $$;
CREATE FUNCTION public.gs_invite_preview(p_token uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 SELECT jsonb_build_object('id',p.id,'nickname',p.nickname,'university',p.university,'department',p.department,'profileAvatarId',p.avatar_id)
 INTO result FROM public.gs_invites i JOIN public.gs_profiles p ON p.id=i.user_id WHERE i.token=p_token;
 IF result IS NULL THEN RAISE EXCEPTION '초대 코드가 만료되었거나 존재하지 않습니다'; END IF;
 RETURN result;
END $$;
CREATE FUNCTION public.gs_add_friend(p_token uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE other uuid;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 SELECT user_id INTO other FROM public.gs_invites WHERE token=p_token FOR SHARE;
 IF other IS NULL OR other=auth.uid() THEN RAISE EXCEPTION '추가할 수 없는 초대 코드입니다'; END IF;
 INSERT INTO public.gs_friends(user_a,user_b) VALUES(least(auth.uid(),other),greatest(auth.uid(),other)) ON CONFLICT DO NOTHING;
END $$;
CREATE FUNCTION public.gs_remove_friend(p_friend uuid) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path='' AS $$
 DELETE FROM public.gs_friends WHERE user_a=least(auth.uid(),p_friend) AND user_b=greatest(auth.uid(),p_friend);
$$;
CREATE FUNCTION public.gs_members() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT coalesce(jsonb_agg(jsonb_build_object('id',p.id,'nickname',p.nickname,'memberType',p.member_type,'university',p.university,
 'department',p.department,'profileAvatarId',p.avatar_id,'shareActivity',p.share_activity,
 'points',coalesce((SELECT sum(amount) FROM public.gs_points WHERE user_id=p.id),0),
 'carbonReduction',coalesce((SELECT sum(carbon_saved) FROM public.gs_participations WHERE user_id=p.id),0),
 'isFriend',EXISTS(SELECT 1 FROM public.gs_friends WHERE user_a=least(auth.uid(),p.id) AND user_b=greatest(auth.uid(),p.id)))), '[]')
 FROM public.gs_profiles p WHERE auth.uid() IS NOT NULL;
$$;
CREATE FUNCTION public.gs_friend_activity(p_friend uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT coalesce(jsonb_agg(to_jsonb(a)),'[]') FROM (
 SELECT c.title,r.completed_at,r.points FROM public.gs_participations r JOIN public.gs_challenges c ON c.id=r.challenge_id
 JOIN public.gs_profiles p ON p.id=r.user_id
 WHERE r.user_id=p_friend AND r.status='completed' AND p.share_activity AND EXISTS(
 SELECT 1 FROM public.gs_friends WHERE user_a=least(auth.uid(),p_friend) AND user_b=greatest(auth.uid(),p_friend))
 ORDER BY r.completed_at DESC LIMIT 30) a;
$$;

CREATE FUNCTION public.gs_quiz_submit(p_index integer) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE d date:=(now() AT TIME ZONE 'Asia/Seoul')::date; q jsonb; a public.gs_quiz_answers; n integer:=0; reward integer:=0; msgs jsonb:='[]'; k text; added integer;
BEGIN
 IF auth.uid() IS NULL OR p_index NOT BETWEEN 0 AND 3 THEN RAISE EXCEPTION '올바른 답안을 선택해주세요'; END IF;
 PERFORM 1 FROM public.gs_profiles WHERE id=auth.uid() FOR UPDATE;
 SELECT * INTO a FROM public.gs_quiz_answers WHERE user_id=auth.uid() AND day=d;
 IF FOUND THEN RETURN to_jsonb(a); END IF;
 SELECT question INTO q FROM public.gs_quizzes WHERE user_id=auth.uid() AND day=d;
 IF q IS NULL THEN RAISE EXCEPTION '오늘의 문제를 먼저 불러와주세요'; END IF;
 IF p_index=(q->>'answerIndex')::integer THEN reward:=10; msgs:=msgs||'"오늘의 퀴즈 정답 +10P"'::jsonb; END IF;
 INSERT INTO public.gs_quiz_answers(user_id,day,selected_index,correct,points) VALUES(auth.uid(),d,p_index,p_index=(q->>'answerIndex')::integer,0);
 WHILE EXISTS(SELECT 1 FROM public.gs_quiz_answers WHERE user_id=auth.uid() AND day=d-n) LOOP n:=n+1; END LOOP;
 IF n IN (3,7) THEN
   k:='quiz-streak:'||n; added:=CASE WHEN n=3 THEN 30 ELSE 100 END;
   INSERT INTO public.gs_points(user_id,event_key,amount,reason) VALUES(auth.uid(),k,added,n||'일 연속 퀴즈 참여') ON CONFLICT DO NOTHING;
   IF FOUND THEN reward:=reward+added; msgs:=msgs||to_jsonb(n||'일 연속 참여 +'||added||'P'); END IF;
 END IF;
 IF (SELECT count(*) FROM public.gs_quiz_answers WHERE user_id=auth.uid() AND day>=date_trunc('week',d::timestamp)::date AND day<=d)>=5 THEN
   INSERT INTO public.gs_points(user_id,event_key,amount,reason) VALUES(auth.uid(),'quiz-week:'||to_char(d,'IYYY-IW'),50,'주간 퀴즈 5개 완료') ON CONFLICT DO NOTHING;
   IF FOUND THEN reward:=reward+50; msgs:=msgs||'"주간 퀴즈 5개 +50P"'::jsonb; END IF;
 END IF;
 IF p_index=(q->>'answerIndex')::integer THEN INSERT INTO public.gs_points(user_id,event_key,amount,reason) VALUES(auth.uid(),'quiz:'||d,10,'오늘의 퀴즈 정답') ON CONFLICT DO NOTHING; END IF;
 UPDATE public.gs_quiz_answers SET points=reward,messages=msgs WHERE user_id=auth.uid() AND day=d RETURNING * INTO a;
 RETURN to_jsonb(a);
END $$;
CREATE FUNCTION public.gs_quiz_history() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT coalesce(jsonb_agg(to_jsonb(a)||jsonb_build_object('question',q.question)),'[]') FROM public.gs_quiz_answers a
 JOIN public.gs_quizzes q USING(user_id,day) WHERE a.user_id=auth.uid();
$$;

-- Explicit allowlist: default PUBLIC execution would expose privileged functions.
REVOKE ALL ON FUNCTION public.gs_new_member() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.gs_update_profile(jsonb),public.gs_join(text),public.gs_complete(uuid,text,numeric,numeric),public.gs_invite(boolean),public.gs_invite_preview(uuid),public.gs_add_friend(uuid),public.gs_remove_friend(uuid),public.gs_members(),public.gs_friend_activity(uuid),public.gs_quiz_submit(integer),public.gs_quiz_history() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_update_profile(jsonb),public.gs_join(text),public.gs_complete(uuid,text,numeric,numeric),public.gs_invite(boolean),public.gs_invite_preview(uuid),public.gs_add_friend(uuid),public.gs_remove_friend(uuid),public.gs_members(),public.gs_friend_activity(uuid),public.gs_quiz_submit(integer),public.gs_quiz_history() TO authenticated;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('greenstep-evidence','greenstep-evidence',false,5242880,ARRAY['image/jpeg','image/png','image/webp']) ON CONFLICT(id) DO NOTHING;
CREATE POLICY gs_upload_own ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='greenstep-evidence' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
CREATE POLICY gs_read_own ON storage.objects FOR SELECT TO authenticated USING(bucket_id='greenstep-evidence' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
COMMIT;
