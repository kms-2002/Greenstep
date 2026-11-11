-- Environment Ministry household guide, practice 32, p.59: 25 kg CO2e / 533 avoided bags.
CREATE OR REPLACE FUNCTION public.gs_complete_bag(p_id uuid, p_image text, p_bags integer, p_region text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
  participation public.gs_participations;
  saved numeric;
BEGIN
  SELECT * INTO participation FROM public.gs_participations
    WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION '참여 기록을 찾을 수 없습니다'; END IF;
  IF participation.status='completed' THEN RETURN to_jsonb(participation); END IF;
  IF p_bags IS NULL OR p_bags<0 OR NOT EXISTS (
    SELECT 1 FROM public.gs_challenges WHERE id=participation.challenge_id AND incentive_id='shopping-bag'
  ) THEN RAISE EXCEPTION '장바구니 챌린지와 봉투 수량을 확인해주세요'; END IF;
  IF p_region IS NULL THEN
    PERFORM public.gs_complete(p_id,p_image,NULL,NULL);
  ELSE
    PERFORM public.gs_complete_in_region(p_id,p_image,p_region,NULL,NULL);
  END IF;
  saved := round(p_bags::numeric * 25 / 533, 6);
  UPDATE public.gs_participations SET carbon_saved=saved, carbon_estimate=jsonb_build_object(
    'status','estimated','estimatedKgCO2e',saved,'calculationVersion','household-guide-bag-v1',
    'factorId','household-guide-practice-32','factorKgCO2ePerUnit',25::numeric/533,'avoidedBags',p_bags
  ) WHERE id=p_id RETURNING * INTO participation;
  RETURN to_jsonb(participation);
END $$;
REVOKE ALL ON FUNCTION public.gs_complete_bag(uuid,text,integer,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.gs_complete_bag(uuid,text,integer,text) TO authenticated;
