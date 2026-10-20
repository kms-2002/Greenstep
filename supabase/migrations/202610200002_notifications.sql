BEGIN;
CREATE TABLE public.gs_notifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 event_key text NOT NULL,
 title text NOT NULL,
 body text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 read_at timestamptz,
 UNIQUE(user_id,event_key)
);
CREATE INDEX ON public.gs_notifications(user_id,created_at DESC);
ALTER TABLE public.gs_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.gs_notifications FROM PUBLIC,anon,authenticated;

CREATE FUNCTION public.gs_notify_activity() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF TG_TABLE_NAME='gs_points' THEN
  INSERT INTO public.gs_notifications(user_id,event_key,title,body)
  VALUES(new.user_id,'points:'||new.id,
   CASE WHEN new.amount>0 THEN '포인트 적립 완료' ELSE '실천 인증 완료' END,
   new.reason||CASE WHEN new.amount>0 THEN ' 활동으로 '||new.amount||'P가 적립됐어요.' ELSE ' 활동 인증을 완료했어요.' END)
  ON CONFLICT DO NOTHING;
 ELSIF TG_TABLE_NAME='gs_attendance' THEN
  INSERT INTO public.gs_notifications(user_id,event_key,title,body)
  VALUES(new.user_id,'attendance:'||new.day,'오늘 출석 완료',
   to_char(new.day,'MM월 DD일')||' 출석 도장을 찍었어요. 오늘도 함께해주셔서 고마워요!') ON CONFLICT DO NOTHING;
 END IF;
 RETURN new;
END $$;
CREATE TRIGGER gs_points_notification AFTER INSERT ON public.gs_points FOR EACH ROW EXECUTE FUNCTION public.gs_notify_activity();
CREATE TRIGGER gs_attendance_notification AFTER INSERT ON public.gs_attendance FOR EACH ROW EXECUTE FUNCTION public.gs_notify_activity();

CREATE FUNCTION public.gs_notification_list() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 RETURN jsonb_build_object(
 'unread',(SELECT count(*) FROM public.gs_notifications WHERE user_id=auth.uid() AND read_at IS NULL),
 'items',coalesce((SELECT jsonb_agg(to_jsonb(n) ORDER BY (n.read_at IS NULL) DESC,n.created_at DESC,n.id DESC)
 FROM (SELECT id,title,body,created_at,read_at FROM public.gs_notifications WHERE user_id=auth.uid() ORDER BY (read_at IS NULL) DESC,created_at DESC,id DESC LIMIT 100) n),'[]'::jsonb));
END $$;
CREATE FUNCTION public.gs_notification_read(p_ids uuid[]) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION '로그인이 필요합니다'; END IF;
 UPDATE public.gs_notifications SET read_at=now()
 WHERE user_id=auth.uid() AND id=ANY(p_ids) AND read_at IS NULL;
END $$;
REVOKE ALL ON FUNCTION public.gs_notify_activity() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.gs_notification_list(),public.gs_notification_read(uuid[]) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_notification_list(),public.gs_notification_read(uuid[]) TO authenticated;
-- Do not backfill past activity: notifications start with new successful events.
COMMIT;
