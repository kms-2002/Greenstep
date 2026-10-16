# GreenStep CO₂ 데이터 적용 안내

## 자료의 의미

제공 파일은 창원시 배출량의 시계열이 아니라 **감축기술별 원단위 82개**입니다.
원본의 기술 번호, 행 번호, 단위, 출처를 보존했습니다. 출처에 적힌 과거 문헌을 독립적으로 검증하지 않았으므로 진주시의 최신 공식 배출계수로 표시하면 안 됩니다.
`tCO2eq`는 `kg CO₂e`로 1,000배 변환했습니다. **분모는 바꾸지 않았습니다.** CO₂e는 온실가스의 이산화탄소환산량입니다.

|원본 번호|항목|변환 계수|앱 적용|
|---|---|---|---|
|214|음식쓰레기 저감 캠페인|1.65 kg CO₂e / kg|감축한 음식물쓰레기 질량을 입력할 때 조건부 추정|
|164|자전거 이용 활성화|443 kg CO₂e / 명|기간·거리·대체 교통수단 확인 전 보류|
|179|출퇴근버스|88,322.7 kg CO₂e / 대|기관 차량 대체 사업 기준. 개인 탑승 1회에 적용 금지|
|54|업무 이후 소등|0.8 kg CO₂e / m²|면적·기간 등 조건 확인 전 보류|
|213|자원회수시설 확충|403 kg CO₂e / 톤|폐기물 처리시설 기준. 페트병 분리배출·줍깅과 다름|

나머지 81개 원단위는 참고용으로 보존했습니다. 같은 이름의 5개 중복 그룹도 출처 또는 단위가 달라 삭제하지 않았습니다. 기간이 없는 계수를 임의로 365로 나누거나, kW를 kWh로 수정하지 않았습니다. 텀블러 등 일치하는 항목이 없는 활동은 `no_matching_factor`입니다.

## 앱에서 입력할 정보와 계산

잔반제로 인증에서 **동일한 식사량·조건의 비교 기준 잔반(g)**, **이번 실천 후 잔반(g)** 두 값을 선택 입력합니다. 기준 무게는 실제 비교 가능한 측정으로 확보해야 합니다. 식사 전체 무게나 먹은 무게를 넣지 않습니다. 사진에서 무게를 추론하지 않습니다.

```text
감축 무게(kg) = (비교 기준 잔반(g) - 실천 후 잔반(g)) / 1000
추정 감축량(kg CO₂e) = 감축 무게(kg) × 1.65
예: (200 - 50) / 1000 × 1.65 = 0.2475 kg CO₂e
```

두 값이 같으면 추정량은 0입니다. 음수·무한값·기준보다 큰 실천 후 무게는 허용하지 않습니다. 미입력 또는 적용 계수가 없는 활동은 `not_calculated`, 결과는 `null`입니다. 기존 누적치에 더하는 값만 0이며 “실제 감축량 0”을 의미하지 않습니다. 결과는 소수점 6자리까지 보존합니다.

새 참여 기록에 입력 무게, 계수 ID, 계수 값, 계산 버전, 결과를 함께 저장합니다. 기존 데이터는 재계산하지 않으며 홈에 시범 기록 포함을 명시합니다. 포인트는 기존 인센티브 기준을 그대로 사용합니다. 탄소 추정치와 포인트를 비례 환산하지 않습니다.

## 파일 구성

- `source.csv`: 제공 원본 그대로 보존.
- `carbon_factors.csv`: 82개 정규화 원단위, UTF-8 BOM. Supabase `greenstep_carbon_factors`와 열 이름 일치.
- `activity_mapping.csv`: 22개 앱 활동의 매칭 상태·필수 입력·보류 사유. 비어 있는 factor_id는 NULL.
- `metadata.json`: 원본 SHA256, 변환 기준, 중복 그룹, 제한 사항.
- 프로젝트 루트 `src/data/carbonReference.json`: 앱에서 사용하는 같은 데이터.
- 프로젝트 루트 `supabase/migrations/202610160001_carbon_reference.sql`: 테이블 3개, 접근 정책, 원단위·매핑 INSERT 포함.
- 프로젝트 루트 `scripts/prepare_carbon_data.py`: 원본에서 재생성하는 스크립트. 인자 없이 실행하면 보존한 source.csv 사용.

## 나중에 Supabase에 적용하는 순서

1. 대상 Supabase 프로젝트의 SQL Editor에서 `supabase/migrations/202610160001_carbon_reference.sql` **전체**를 실행합니다. 테이블과 82개 원단위, 22개 매핑을 함께 넣으므로 별도 CSV 업로드는 필요 없습니다. 이번 작업에서는 원격 DB에 실행하지 않았습니다.
2. Table Editor에서 `greenstep_carbon_factors`, `greenstep_carbon_activity_mapping`을 확인합니다. CSV는 별도 가져오기용 또는 검토용입니다. SQL 실행 뒤 같은 CSV를 중복 업로드하지 않습니다.
3. 회원가입을 Supabase Auth와 연결한 뒤, 인증된 사용자의 ID를 서버에서 확인하여 `greenstep_carbon_estimates.user_id`로 저장합니다. 현재 로컬 앱 ID는 Auth UUID가 아니므로 그대로 가져오면 안 됩니다.
4. 서버/Edge Function은 입력 무게와 활동을 검증하고 허용된 계수를 DB에서 조회해 재계산합니다. 브라우저가 보낸 감축 결과·계수·사용자 ID를 그대로 신뢰하지 않습니다. `participation_id`는 사용자별로 유일하여 같은 인증의 중복 저장을 막습니다.
5. 현재 코드는 브라우저의 기존 로컬 저장 구조를 사용합니다. Supabase 조회·저장 API는 아직 연결하지 않았습니다. 준비된 개인 계산 테이블은 사용자 본인 조회만 허용하고, 쓰기는 신뢰하는 서버의 service_role만 허용합니다. service_role 키는 브라우저에 넣지 않습니다.

앱 스냅샷→DB 열: `factorId`→`factor_id`, `factorKgCO2ePerUnit`→`factor_kg_co2e_per_unit`, `baselineWasteKg`→`baseline_waste_kg`, `actualWasteKg`→`actual_waste_kg`, `reducedQuantityKg`→`reduced_quantity_kg`, `estimatedKgCO2e`→`estimated_kg_co2e`, `calculationVersion`→`calculation_version`.

운영 전에는 원문 지침의 산정 경계·처리 방식과 진주시 적용 가능성을 확인해야 합니다. 이번 추정치는 자기 입력에 근거하며 공인 감축 실적이나 지급 심사 증빙이 아닙니다.
