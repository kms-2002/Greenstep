export const householdGuide = 'https://gjeec.or.kr/boardDownload.es?bid=0001&list_no=105&mid=a10401000000&seq=1';
type Guide = { label: string; detail: string; source?: string };
const guides: Record<string, Guide> = {
"ch-transport-1": {"label":"승용차 1 km 대체 시 약 0.134 kg","detail":"휘발유차 운행 회피분만 계산합니다. 버스 운행 배출은 별도입니다.","source":"84~85쪽, 수칙 27"},
"ch-transport-2": {"label":"승용차 5 km 대체 시 약 0.671 kg","detail":"휘발유차로 갈 거리를 자전거로 이동한 경우입니다. 거리(km) ÷ 16.24(km/L) × 2.18(kg/L).","source":"84~85쪽, 수칙 28"},
"ch-transport-3": {"label":"승용차 1 km 대체 시 약 0.134 kg","detail":"도보로 대체한 휘발유차 거리(km) ÷ 16.24 × 2.18.","source":"84~85쪽, 수칙 28"},
"ch-life-1": {"label":"종이컵 1개 대체 시 0.0476 kg","detail":"종이컵 생산 회피분입니다. 텀블러 제조·세척은 포함하지 않습니다.","source":"86~87쪽, 수칙 35"},
"ch-life-2": {"label":"비닐봉투 1장 대체 시 약 0.047 kg","detail":"현재 누적 산식은 대체한 장수 × 25 ÷ 533입니다. 안내서 부록에 실린 원계수는 0.0475 kg/장입니다.","source":"59쪽 및 86~87쪽, 수칙 32"},
"ch-life-3": {"label":"전력 1 kWh 절약 시 0.4781 kg","detail":"조명 소비전력(kW) × 소등 시간(h) × 0.4781.","source":"부록 Ⅲ, 112~113쪽"},
"ch-food-1": {"label":"잔반 100 g 감소 시 0.165 kg","detail":"앱은 평소와 이번 식사의 잔반 차이(kg) × 1.65로 계산합니다.","source":"창원시 제공 자료 214번 · 음식쓰레기 저감 캠페인"},
"ch-food-2": {"label":"식재료별 비교 필요","detail":"기준 식단과 실천 식단에서 재료별 중량과 배출계수를 곱한 뒤 두 합계의 차이를 구합니다."},
"ch-food-3": {"label":"수저 재질·중량 필요","detail":"받지 않은 수저의 재질별 중량과 해당 제품의 생산 배출계수가 필요합니다."},
"ch-resource-1": {"label":"수거 후 처리 경로 필요","detail":"수거량과 소각·재활용 등 처리 경로에 따라 배출 차이가 달라집니다."},
"ch-resource-2": {"label":"재질별 회수량 필요","detail":"같은 1 kg도 유리·금속·플라스틱별로 대체 원료와 재활용 공정이 다릅니다."},
"ch-resource-3": {"label":"품목별 회수량 필요","detail":"폐건전지와 종이팩 각각의 중량 및 처리 경로별 계수가 필요합니다."},
"ch-official-electronic-receipt": {"label":"종이영수증 1장 대체 시 0.001776 kg","detail":"종이로 인쇄하지 않은 영수증 장수 × 0.001776.","source":"88쪽, 수칙 40"},
"ch-official-single-use-cup-return": {"label":"회수·재활용 경로 필요","detail":"반환한 컵의 재질·중량 및 재활용 처리 결과가 필요합니다."},
"ch-official-refill-station": {"label":"PET 용기 200 g 절약 시 0.474 kg","detail":"기존 용기를 재사용해 대체한 PET 포장재 중량(kg) × 2.37.","source":"82~83쪽, 수칙 20"},
"ch-official-reusable-container": {"label":"일회용기 1개 대체 시 0.0221 kg","detail":"대체한 일회용기 개수 × 0.0221. 세척·회수 과정은 별도입니다.","source":"86~87쪽, 수칙 34"},
"ch-official-zero-emission-car": {"label":"전기차로 5 km 대체 시 약 0.101 kg","detail":"안내서 수칙 29의 전기차 비교 시나리오를 적용한 예시입니다. 5 ÷ 16.24 × 0.15 × 2.18.","source":"84~85쪽, 수칙 29"},
"ch-official-eco-product": {"label":"저탄소 생수 2 L 예시 0.03 kg","detail":"안내서 생수 표본의 병당 평균 차이(0.24 − 0.21)입니다. 다른 제품에는 해당 제품의 비교값이 필요합니다.","source":"82~83쪽, 수칙 16"},
"ch-official-used-phone": {"label":"재사용·소재 회수 결과 필요","detail":"반납한 기기의 재사용 여부 또는 회수 소재별 중량과 처리 배출량이 필요합니다."},
"ch-official-tree-planting": {"label":"수종·생장 기간 필요","detail":"나무의 생존 여부와 기간별 흡수량을 알아야 산정할 수 있습니다."},
"ch-official-balcony-solar": {"label":"계통전력 1 kWh 대체 시 0.4781 kg","detail":"직접 생산해 사용한 전력(kWh) × 안내서의 전력 배출계수. 설치·제조 배출은 별도입니다.","source":"부록 Ⅲ, 112~113쪽"},
"ch-official-recycled-material-product": {"label":"제품별 탄소발자국 비교 필요","detail":"동일 기능의 일반 제품과 재생원료 제품의 단위당 탄소발자국 차이 × 구매량."},
"ch-official-personal-container": {"label":"일회용기 1개 대체 시 0.0221 kg","detail":"포장에 쓰지 않은 일회용기 개수 × 0.0221. 개인용기 세척은 별도입니다.","source":"86~87쪽, 수칙 34"},
};
export const challengeCarbonGuide = (id: string): Guide => guides[id] ?? {
  label: '산정 기준 확인 중', detail: '이 활동에 맞는 비교 기준과 측정 단위가 필요합니다.',
};
