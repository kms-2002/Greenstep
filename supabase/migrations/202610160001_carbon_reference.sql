-- Catalog and future private calculation records. No personal data is seeded.
BEGIN;
CREATE TABLE IF NOT EXISTS public.greenstep_carbon_factors (
  id text PRIMARY KEY, dataset_id text NOT NULL, source_row integer NOT NULL,
  source_number integer NOT NULL, sector text NOT NULL, subsector text NOT NULL,
  activity_name text NOT NULL, original_value numeric NOT NULL CHECK (original_value >= 0),
  original_unit text NOT NULL, indicator text NOT NULL, source_citation text NOT NULL,
  source_years text NOT NULL, factor_kg_co2e_per_unit numeric NOT NULL CHECK (factor_kg_co2e_per_unit >= 0),
  quantity_unit text NOT NULL, period_basis text NOT NULL,
  app_status text NOT NULL CHECK (app_status IN ('conditional_mass_estimate','reference_only')),
  review_notes text NOT NULL,
  UNIQUE(dataset_id,source_number),
  CHECK (factor_kg_co2e_per_unit = original_value * 1000)
);
CREATE TABLE IF NOT EXISTS public.greenstep_carbon_activity_mapping (
  activity_key text PRIMARY KEY,
  factor_id text REFERENCES public.greenstep_carbon_factors(id),
  status text NOT NULL CHECK (status IN ('conditional','review_required','no_matching_factor')),
  required_inputs text NOT NULL, reason text NOT NULL,
  CHECK (status <> 'conditional' OR factor_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS public.greenstep_carbon_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participation_id text NOT NULL, activity_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('estimated','not_calculated')),
  factor_id text REFERENCES public.greenstep_carbon_factors(id),
  factor_kg_co2e_per_unit numeric,
  baseline_waste_kg numeric CHECK (baseline_waste_kg >= 0),
  actual_waste_kg numeric CHECK (actual_waste_kg >= 0),
  reduced_quantity_kg numeric CHECK (reduced_quantity_kg >= 0),
  estimated_kg_co2e numeric CHECK (estimated_kg_co2e >= 0),
  calculation_version text NOT NULL, evidence_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, participation_id),
  CHECK ((status = 'not_calculated' AND estimated_kg_co2e IS NULL) OR
    (status = 'estimated' AND factor_id IS NOT NULL AND factor_kg_co2e_per_unit IS NOT NULL
      AND baseline_waste_kg IS NOT NULL AND actual_waste_kg IS NOT NULL
      AND reduced_quantity_kg IS NOT NULL AND estimated_kg_co2e IS NOT NULL
      AND baseline_waste_kg >= actual_waste_kg
      AND reduced_quantity_kg = baseline_waste_kg - actual_waste_kg
      AND estimated_kg_co2e = round(reduced_quantity_kg * factor_kg_co2e_per_unit, 6)))
);
ALTER TABLE public.greenstep_carbon_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.greenstep_carbon_activity_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.greenstep_carbon_estimates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read carbon reference" ON public.greenstep_carbon_factors;
CREATE POLICY "Read carbon reference" ON public.greenstep_carbon_factors FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Read carbon mapping" ON public.greenstep_carbon_activity_mapping;
CREATE POLICY "Read carbon mapping" ON public.greenstep_carbon_activity_mapping FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Read own carbon estimates" ON public.greenstep_carbon_estimates;
CREATE POLICY "Read own carbon estimates" ON public.greenstep_carbon_estimates FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
REVOKE ALL ON public.greenstep_carbon_factors, public.greenstep_carbon_activity_mapping, public.greenstep_carbon_estimates FROM anon, authenticated;
GRANT SELECT ON public.greenstep_carbon_factors, public.greenstep_carbon_activity_mapping TO anon, authenticated;
GRANT SELECT ON public.greenstep_carbon_estimates TO authenticated;
GRANT ALL ON public.greenstep_carbon_factors, public.greenstep_carbon_activity_mapping, public.greenstep_carbon_estimates TO service_role;
-- Future trusted server must validate measurements and recompute from the catalog.
-- Do not accept a browser-supplied result or use this table to award points automatically.

-- Source SHA256: fa3ad8a6659226f705391104e829c20fb0559aebb6764547dba58d944ad3f42a

INSERT INTO public.greenstep_carbon_factors (id,dataset_id,source_row,source_number,sector,subsector,activity_name,original_value,original_unit,indicator,source_citation,source_years,factor_kg_co2e_per_unit,quantity_unit,period_basis,app_status,review_notes) VALUES
('changwon-supplied-20261016-1','changwon-supplied-20261016',2,1,'에너지','건물','그린홈 보급','2.06','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',2060.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-2','changwon-supplied-20261016',3,2,'에너지','건물','빗물재이용','0.0342','tCO2eq/가구','가구','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',34.2,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-3','changwon-supplied-20261016',4,3,'에너지','건물','빗물재이용 시설 확대','0.0003','tCO2eq/m3','m3','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',0.3,'m3','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-4','changwon-supplied-20261016',5,4,'에너지','건물','수소연료전지(발전용)','2.569','tCO2eq/kW','kW','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',2569.0,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-5','changwon-supplied-20261016',6,5,'에너지','건물','태양열 온수기 도입','0.0024','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',2.4,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 5,12'),
('changwon-supplied-20261016-6','changwon-supplied-20261016',7,6,'에너지','건물','지열 냉난방 시스템 보급(가정)','1.0546','tCO2eq/kW','kW','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',1054.6,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 6,89'),
('changwon-supplied-20261016-7','changwon-supplied-20261016',8,7,'에너지','건물','지열 냉난방 시스템 보급(상업), 냉방 LNG','0.0014','tCO2eq/m2','m2','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',1.4,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-8','changwon-supplied-20261016',9,8,'에너지','건물','지열 냉난방 시스템 보급(상업), 냉방 전력','0.0026','tCO2eq/m2','m2','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',2.6,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-9','changwon-supplied-20261016',10,9,'에너지','건물','지열 냉난방 시스템 보급(상업), 난방 LNG','0.0222','tCO2eq/m2','m2','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',22.2,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-10','changwon-supplied-20261016',11,10,'에너지','건물','태양광 주택보급','1.5724','tCO2eq/가구','가구','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',1572.4,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-11','changwon-supplied-20261016',12,11,'에너지','건물','태양광 시스템 보급 확대','0.5174','tCO2eq/m2','m2','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',517.4,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 11,87'),
('changwon-supplied-20261016-12','changwon-supplied-20261016',13,12,'에너지','건물','태양열 온수기 도입','0.0024','tCO2eq/가구','가구','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',2.4,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 5,12'),
('changwon-supplied-20261016-13','changwon-supplied-20261016',14,13,'에너지','건물','태양열 시스템 보급 확대','0.1134','tCO2eq/m2','m2','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',113.4,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 13,88'),
('changwon-supplied-20261016-14','changwon-supplied-20261016',15,14,'에너지','건물','LED조명 보급','0.057','tCO2eq/개','개','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',57.0,'개','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-15','changwon-supplied-20261016',16,15,'에너지','건물','옥외광고 간판 LED화','0.28','tCO2eq/개','개','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',280.0,'개','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-16','changwon-supplied-20261016',17,16,'에너지','건물','고효율 LED 조명등 보급 확대 및 교체(가정, 형광등)','0.0101','tCO2eq/대','개','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',10.1,'대','not_specified','reference_only','단위 분모와 지표가 다름: 원문 확인 필요; 기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-17','changwon-supplied-20261016',18,17,'에너지','건물','고효율 LED 조명등 보급 확대 및 교체(가정, 백열등)','0.0163','tCO2eq/대','개','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',16.3,'대','not_specified','reference_only','단위 분모와 지표가 다름: 원문 확인 필요; 기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-18','changwon-supplied-20261016',19,18,'에너지','건물','고효율 LED 조명등 보급 확대 및 교체(상업)','0.0044','tCO2eq/m2/개','m2/개','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',4.4,'m2/개','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-19','changwon-supplied-20261016',20,19,'에너지','건물','스마트미터 보급','0.046','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',46.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-20','changwon-supplied-20261016',21,20,'에너지','건물','잠열 회수형 온수 보일러 도입(가정)','0.2963','tCO2eq/가구','가구','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',296.3,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-21','changwon-supplied-20261016',22,21,'에너지','건물','잠열 회수형 온수 보일러 도입(상업)','0.0013','tCO2eq/m2','m2','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',1.3,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-22','changwon-supplied-20261016',23,22,'에너지','건물','업무용 고효율 공조기의 보급','0.0174','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',17.4,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-23','changwon-supplied-20261016',24,23,'에너지','건물','고효율 제품 보급(냉장고)','0.0696','tCO2eq/대','대','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',69.6,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-24','changwon-supplied-20261016',25,24,'에너지','건물','고효율 제품 보급(세탁기)','0.0008','tCO2eq/대','대','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',0.8,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-25','changwon-supplied-20261016',26,25,'에너지','건물','고효율 제품 보급(전기밥솥)','0.0152','tCO2eq/대','대','온실가스 감축을 위한 실천방안 수립연구, 국립환경과학원, 2012','2012',15.2,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-26','changwon-supplied-20261016',27,26,'에너지','건물','대기전력차단기 보급','0.009464','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',9.464,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 26,27'),
('changwon-supplied-20261016-27','changwon-supplied-20261016',28,27,'에너지','건물','대기전력차단기 보급','0.071','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',71.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 26,27'),
('changwon-supplied-20261016-28','changwon-supplied-20261016',29,28,'에너지','건물','대기전력 저감 제품 보급','0.0598','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',59.8,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-29','changwon-supplied-20261016',30,29,'에너지','건물','절수기기 보급','0.0346','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',34.6,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-30','changwon-supplied-20261016',31,30,'에너지','건물','컴퓨터 대기전력 저감제품 보급','0.0015','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1.5,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-31','changwon-supplied-20261016',32,31,'에너지','건물','기존주택의 단열유리창 교체','0.6493','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',649.3,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-32','changwon-supplied-20261016',33,32,'에너지','건물','단열강화','0.653','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',653.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-33','changwon-supplied-20261016',34,33,'에너지','건물','에너지 저감형 건물외피시스템 신규주택 보급','0.9562','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',956.2,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-34','changwon-supplied-20261016',35,34,'에너지','건물','건물에너지이용 합리화 사업','0.235','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',235.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-35','changwon-supplied-20261016',36,35,'에너지','건물','태양광 발전','0.63','tCO2eq/kW','kW','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',630.0,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-36','changwon-supplied-20261016',37,36,'에너지','건물','지열','0.684','tCO2eq/RT','RT','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',684.0,'RT','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-37','changwon-supplied-20261016',38,37,'에너지','건물','하수열 및 하천수열','1.607','tCO2eq/kW','kW','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1607.0,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-38','changwon-supplied-20261016',39,38,'에너지','건물','소수력 발전소 건립','1.55','tCO2eq/kW','kW','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1550.0,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-39','changwon-supplied-20261016',40,39,'에너지','건물','냉방온도 1℃ 높이기','0.009','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',9.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-40','changwon-supplied-20261016',41,40,'에너지','건물','난방온도 2℃ 낮추기','0.441','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',441.0,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-41','changwon-supplied-20261016',42,41,'에너지','건물','TV 시청시간 줄이기(1시간 줄이기)','0.0213','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',21.3,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-42','changwon-supplied-20261016',43,42,'에너지','건물','컴퓨터 사용시간 줄이기(1시간 줄이기)','0.0243','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',24.3,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-43','changwon-supplied-20261016',44,43,'에너지','건물','냉장고 적정용량 유지하기','0.0331','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',33.1,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-44','changwon-supplied-20261016',45,44,'에너지','건물','세탁 사용횟수 줄이기(주1회 줄이기)','0.0058','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',5.8,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-45','changwon-supplied-20261016',46,45,'에너지','건물','청소횟수 줄이기','0.0126','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',12.6,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-46','changwon-supplied-20261016',47,46,'에너지','건물','다리미 사용시간 줄이기(주4분 단축)','0.0017','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1.7,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-47','changwon-supplied-20261016',48,47,'에너지','건물','냉방시간 줄이기(가정)','0.0387','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',38.7,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-48','changwon-supplied-20261016',49,48,'에너지','건물','냉방시간 줄이기(상업), LNG','0.0001','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',0.1,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-49','changwon-supplied-20261016',50,49,'에너지','건물','냉방시간 줄이기(상업), 전력','0.0003','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',0.3,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-50','changwon-supplied-20261016',51,50,'에너지','건물','에어컨 필터 주기적 청소하기','0.0051','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',5.1,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-51','changwon-supplied-20261016',52,51,'에너지','건물','난방시간 줄이기(1시간 줄이기), 가정','0.3826','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',382.6,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-52','changwon-supplied-20261016',53,52,'에너지','건물','난방시간 줄이기(1시간 줄이기), 상업','0.003','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',3.0,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-53','changwon-supplied-20261016',54,53,'에너지','건물','주기적인 보일러 청소하기(가정용 LNG보일러 청소)','0.0188','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',18.8,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-54','changwon-supplied-20261016',55,54,'에너지','건물','업무이후 소등실천 및 확대','0.0008','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',0.8,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-55','changwon-supplied-20261016',56,55,'에너지','건물','직장인 점심시간 실내 소등 실천','0.0003','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',0.3,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-56','changwon-supplied-20261016',57,56,'에너지','건물','점심시간 컴퓨터 끄기','0.0187','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',18.7,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-57','changwon-supplied-20261016',58,57,'에너지','건물','실내 냉난봉 온도의 합리적 제한 방안','0.004648','tCO2eq/(m2*℃)','m2/℃','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',4.648,'(m2*℃)','not_specified','reference_only','단위 분모와 지표가 다름: 원문 확인 필요; 기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-61','changwon-supplied-20261016',59,61,'에너지','건물','에코마일리지 제도','0.145','tCO2eq/명','명','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',145.0,'명','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-62','changwon-supplied-20261016',60,62,'에너지','건물','건축효율등급 강화','0.019','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',19.0,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-63','changwon-supplied-20261016',61,63,'에너지','건물','건물 에너지 소비 총량제 강화','0.015','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',15.0,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-64','changwon-supplied-20261016',62,64,'에너지','건물','냉난방 온도제한 의무화(시행면적 기준)','0.0031','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',3.1,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-65','changwon-supplied-20261016',63,65,'에너지','건물','냉난방 온도제한 의무화(에너지 소비기준)','274.758','tCO2eq/개소','개소','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',274758.0,'개소','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-66','changwon-supplied-20261016',64,66,'에너지','건물','녹색생활 실천 및 생활화','0.035','tCO2eq/인(명)','인(명)','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',35.0,'인(명)','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-68','changwon-supplied-20261016',65,68,'에너지','건물','탄소포인트제 운영','0.000424','tCO2eq/kW','kW','천안시 기후변화 대응 종합계획 2016년 이행평가 및 2017년 추진계획, 천안시, 2017','2017',0.424,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; kW는 전력이며 kWh로 자동 교정 불가'),
('changwon-supplied-20261016-80','changwon-supplied-20261016',66,80,'에너지','건물','도시가스보급확대','0.49227','tCO2eq/세대','세대','등유 855ℓ/가구·년 , 도시가스 725N㎥/가구·년 사용 기준','',492.27,'세대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-86','changwon-supplied-20261016',67,86,'에너지','건물','탄소중립 프로그램 참여확대','0.5818','tCO2eq/kW','kW','천안시 기후변화 대응 세부추진계획, 천안시, 2016','2016',581.8,'kW','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; kW는 전력이며 kWh로 자동 교정 불가'),
('changwon-supplied-20261016-87','changwon-supplied-20261016',68,87,'에너지','건물','태양광 시스템 보급 확대','0.5174','tCO2eq/m2','m2','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',517.4,'m2','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 11,87'),
('changwon-supplied-20261016-88','changwon-supplied-20261016',69,88,'에너지','건물','태양열 시스템 보급 확대','0.1134','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',113.4,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 13,88'),
('changwon-supplied-20261016-89','changwon-supplied-20261016',70,89,'에너지','건물','지열 냉난방 시스템 보급(가정)','1.0546','tCO2eq/가구','가구','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1054.6,'가구','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 동일 기술명 행 보존(출처·단위 별도 검토): 6,89'),
('changwon-supplied-20261016-115','changwon-supplied-20261016',71,115,'에너지','건물','태양전지','549','tCO2eq/MW·년','MW','녹색기술센터, 녹색기후기술의 온실가스 감축 효과 및 육성 방안, 2016','2016',549000.0,'MW·년','year_in_unit','reference_only',''),
('changwon-supplied-20261016-116','changwon-supplied-20261016',72,116,'에너지','건물','풍력','647','tCO2eq/MW·년','MW','녹색기술센터, 녹색기후기술의 온실가스 감축 효과 및 육성 방안, 2016','2016',647000.0,'MW·년','year_in_unit','reference_only',''),
('changwon-supplied-20261016-117','changwon-supplied-20261016',73,117,'에너지','건물','연료전지','917','tCO2eq/MW·년','MW','녹색기술센터, 녹색기후기술의 온실가스 감축 효과 및 육성 방안, 2016','2016',917000.0,'MW·년','year_in_unit','reference_only',''),
('changwon-supplied-20261016-133','changwon-supplied-20261016',74,133,'에너지','수송','하이브리드 승용차','1.148','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1148.0,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-134','changwon-supplied-20261016',75,134,'에너지','수송','하이브리드 버스','19.072','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',19072.0,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-135','changwon-supplied-20261016',76,135,'에너지','수송','하이브리드 택시','1.902','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1902.0,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-139','changwon-supplied-20261016',77,139,'에너지','수송','전기 승용차','1.433','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1433.0,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-140','changwon-supplied-20261016',78,140,'에너지','수송','전기 버스','39.195','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',39195.0,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-149','changwon-supplied-20261016',79,149,'에너지','수송','승용차 요일제 추진','0.248','tCO2eq/대','대','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',248.0,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지'),
('changwon-supplied-20261016-164','changwon-supplied-20261016',80,164,'에너지','수송','자전거 이용 활성화','0.443','tCO2eq/명','명','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',443.0,'명','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 명당 기준: 주행거리·기간·자가용 대체 여부 필요'),
('changwon-supplied-20261016-179','changwon-supplied-20261016',81,179,'에너지','수송','출퇴근버스','88.3227','tCO2eq/대','대','버스 1대당 자가용 25대 대체, 경유차:휘발유차=5:5 대체, 주행거리: 50km/일, 연비: 12.05 km/l, 경유 및 휘발유 석유환산계수, 배출계수 적용','',88322.7,'대','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 버스 1대·자가용 25대 대체·50km/일 가정: 승객 1회에 적용 금지'),
('changwon-supplied-20261016-213','changwon-supplied-20261016',82,213,'비에너지','폐기물','자원회수시설 확충(생활쓰레기)','0.403','tCO2eq/톤','톤','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',403.0,'톤','not_specified','reference_only','기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지; 자원회수시설의 생활쓰레기 처리: 페트병 분리배출·줍깅 계수로 사용 금지'),
('changwon-supplied-20261016-214','changwon-supplied-20261016',83,214,'비에너지','폐기물','음식쓰레기 저감 캠페인','0.00165','tCO2eq/kg','kg','지자체 온실가스 통합관리 지침, 한국환경공단, 2013','2013',1.65,'kg','not_specified','conditional_mass_estimate','동일 식사 범위에서 기준 잔반량과 실제 잔반량의 차이(kg) 필요. 진주시 공식 검증 계수는 아님')
ON CONFLICT DO NOTHING;

INSERT INTO public.greenstep_carbon_activity_mapping (activity_key,factor_id,status,required_inputs,reason) VALUES
('zero-leftover-meal','changwon-supplied-20261016-214','conditional','baseline_waste_kg;actual_waste_kg','같은 식사 기준 음식물쓰레기 감축 질량에만 적용. 식사 1회는 질량이 아님'),
('shared-bike','changwon-supplied-20261016-164','review_required','distance_km;avoided_mode;source_period','명당 계수를 5km 또는 1회로 환산할 근거 없음'),
('ch-transport-1','changwon-supplied-20261016-179','review_required','distance_km;occupancy;avoided_mode;source_period','기관 차량 대체 사업 계수이며 개인 통학버스 이용 계수가 아님'),
('ch-life-3','changwon-supplied-20261016-54','review_required','area_m2;duration_hours;source_period','소등 면적·기간·조명 조건 확인 필요'),
('balcony-solar-installation','changwon-supplied-20261016-35','review_required','installed_kw;operating_period;source_period','설치 용량과 가동 기간 확인 필요'),
('tumbler-reusable-cup',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('shopping-bag',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('electronic-receipt',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('reusable-container',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('personal-container-takeout',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('refill-station',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('eco-friendly-product',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('recycled-material-product',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('zero-emission-car-rental',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('high-quality-recycling',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('used-mobile-phone-return',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('tree-planting',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('ch-transport-3',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('ch-food-2',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('ch-food-3',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('ch-resource-1',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'),
('ch-resource-3',NULL,'no_matching_factor','','동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음')
ON CONFLICT DO NOTHING;

COMMIT;
