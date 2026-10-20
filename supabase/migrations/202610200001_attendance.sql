-- Attendance is dated by the server in Korea; repeated calls do not add records.
CREATE TABLE IF NOT EXISTS public.gs_attendance (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Seoul')::date),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,day)
);
ALTER TABLE public.gs_attendance ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gs_attendance FROM anon,authenticated;
CREATE OR REPLACE FUNCTION public.gs_attendance_status() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 RETURN jsonb_build_object('today',(now() AT TIME ZONE 'Asia/Seoul')::date,
   'days',coalesce((SELECT jsonb_agg(day ORDER BY day) FROM public.gs_attendance WHERE user_id=auth.uid()),'[]'::jsonb));
END $$;
CREATE OR REPLACE FUNCTION public.gs_check_in() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 INSERT INTO public.gs_attendance(user_id) VALUES(auth.uid()) ON CONFLICT DO NOTHING;
 RETURN public.gs_attendance_status();
END $$;
REVOKE ALL ON FUNCTION public.gs_attendance_status(),public.gs_check_in() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_attendance_status(),public.gs_check_in() TO authenticated;
