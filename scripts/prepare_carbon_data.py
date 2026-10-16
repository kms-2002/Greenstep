"""Reproducible import of the supplied Changwon reduction-factor CSV (stdlib only)."""
import csv
import hashlib
import io
import json
import re
import sys
from collections import Counter, defaultdict
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data/carbon/changwon-20261016'
DATASET = 'changwon-supplied-20261016'
source = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT / 'source.csv'
raw = source.read_bytes()
try:
    decoded = raw.decode('utf-8-sig')
    encoding = 'utf-8-sig'
except UnicodeDecodeError:
    decoded = raw.decode('cp949')
    encoding = 'cp949'
rows = list(csv.reader(io.StringIO(decoded)))
assert len(rows[0]) == 9 and rows[0][3:8] == ['감축기술', '원단위', '단위', '지표', '출처']
OUT.mkdir(parents=True, exist_ok=True)
if source.resolve() != (OUT / 'source.csv').resolve():
    (OUT / 'source.csv').write_bytes(raw)
records = []
for line, row in enumerate(rows[1:], start=2):
    if not any(row):
        continue
    assert len(row) == 9, (line, 'Unexpected CSV column count')
    number, sector, subsector, numbered_name, value, unit, indicator, citation, alias = [c.strip() for c in row]
    value = Decimal(value)
    assert value.is_finite() and value >= 0 and unit.startswith('tCO2eq/'), (line, 'Invalid factor')
    name = re.sub(r'^\d+\.\s*', '', numbered_name)
    denominator = unit.split('/', 1)[1]
    period = 'year_in_unit' if '년' in denominator else 'not_specified'
    notes = []
    if denominator.replace('·년', '') != indicator:
        notes.append('단위 분모와 지표가 다름: 원문 확인 필요')
    if name != alias:
        notes.append('원문 기술명과 별칭 불일치')
    if period == 'not_specified' and number != '214':
        notes.append('기간·실천 빈도 불명: 1회/하루/연간으로 임의 환산 금지')
    if number in ['68', '86']:
        notes.append('kW는 전력이며 kWh로 자동 교정 불가')
    if number == '179':
        notes.append('버스 1대·자가용 25대 대체·50km/일 가정: 승객 1회에 적용 금지')
    if number == '164':
        notes.append('명당 기준: 주행거리·기간·자가용 대체 여부 필요')
    if number == '213':
        notes.append('자원회수시설의 생활쓰레기 처리: 페트병 분리배출·줍깅 계수로 사용 금지')
    if number == '214':
        notes.append('동일 식사 범위에서 기준 잔반량과 실제 잔반량의 차이(kg) 필요. 진주시 공식 검증 계수는 아님')
    records.append(dict(
        id=f'{DATASET}-{number}', dataset_id=DATASET, source_row=line, source_number=int(number),
        sector=sector, subsector=subsector, activity_name=name, original_value=str(value), original_unit=unit,
        indicator=indicator, source_citation=citation, source_years=';'.join(sorted(set(re.findall(r'\b(?:19|20)\d{2}\b', citation)))),
        factor_kg_co2e_per_unit=float(value * 1000), quantity_unit=denominator, period_basis=period,
        app_status='conditional_mass_estimate' if number == '214' else 'reference_only',
        review_notes='; '.join(notes),
    ))
assert len({r['id'] for r in records}) == len(records)
groups = defaultdict(list)
for r in records:
    groups[r['activity_name']].append(r)
for group in groups.values():
    if len(group) > 1:
        detail = '동일 기술명 행 보존(출처·단위 별도 검토): ' + ','.join(str(r['source_number']) for r in group)
        for r in group:
            r['review_notes'] += '; ' + detail

def mapping(key, number, status, inputs, reason):
    return dict(activity_key=key, factor_id=f'{DATASET}-{number}' if number else None,
                status=status, required_inputs=inputs, reason=reason)

links = [
    mapping('zero-leftover-meal', 214, 'conditional', 'baseline_waste_kg;actual_waste_kg', '같은 식사 기준 음식물쓰레기 감축 질량에만 적용. 식사 1회는 질량이 아님'),
    mapping('shared-bike', 164, 'review_required', 'distance_km;avoided_mode;source_period', '명당 계수를 5km 또는 1회로 환산할 근거 없음'),
    mapping('ch-transport-1', 179, 'review_required', 'distance_km;occupancy;avoided_mode;source_period', '기관 차량 대체 사업 계수이며 개인 통학버스 이용 계수가 아님'),
    mapping('ch-life-3', 54, 'review_required', 'area_m2;duration_hours;source_period', '소등 면적·기간·조명 조건 확인 필요'),
    mapping('balcony-solar-installation', 35, 'review_required', 'installed_kw;operating_period;source_period', '설치 용량과 가동 기간 확인 필요'),
]
for key in ['tumbler-reusable-cup','shopping-bag','electronic-receipt','reusable-container','personal-container-takeout','refill-station','eco-friendly-product','recycled-material-product','zero-emission-car-rental','high-quality-recycling','used-mobile-phone-return','tree-planting','ch-transport-3','ch-food-2','ch-food-3','ch-resource-1','ch-resource-3']:
    links.append(mapping(key, None, 'no_matching_factor', '', '동일 활동·단위의 계수가 제공 CSV에 없음. 유사 명칭만으로 연결하지 않음'))

def write_csv(name, items):
    with (OUT / name).open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(items[0]))
        writer.writeheader()
        writer.writerows(items)

write_csv('carbon_factors.csv', records)
write_csv('activity_mapping.csv', links)
metadata = dict(dataset_id=DATASET, source_filename='경상남도_창원시_온실가스배출량_수정.csv',
                source_sha256=hashlib.sha256(raw).hexdigest(), source_encoding=encoding,
                imported_on='2026-10-16', source_jurisdiction='경상남도 창원시', target_jurisdiction='진주시·경상국립대학교',
                verification='user_supplied_reference_not_independently_verified', row_count=len(records),
                status_counts=dict(Counter(r['app_status'] for r in records)),
                duplicate_name_groups={k:[r['source_number'] for r in v] for k,v in groups.items() if len(v)>1},
                formula='reduced_food_waste_kg * original_tCO2eq_per_kg * 1000',
                example={'baseline_waste_kg':0.2,'actual_waste_kg':0.05,'avoided_kg':0.15,'estimated_kg_co2e':0.2475},
                limitations=['기간 미상 행의 365일 나누기 금지','상이한 분모의 계수 합산 금지','창원시 제공 자료를 진주시 공식 계수로 표시하지 않음','기존 포인트 인센티브 금액과 CO2e 계수는 별도'])
(OUT / 'metadata.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
app = {'metadata':metadata,'factors':records,'mappings':links}
(ROOT / 'src/data/carbonReference.json').write_text(json.dumps(app,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def sql_value(v):
    if v is None: return 'NULL'
    if isinstance(v,(int,float)): return str(v)
    return "'" + str(v).replace("'", "''") + "'"

schema = (ROOT / 'scripts/carbon_schema.sql').read_text(encoding='utf-8')
sql = schema + '\n-- Source SHA256: ' + metadata['source_sha256'] + '\n'
for table, items in [('greenstep_carbon_factors', records), ('greenstep_carbon_activity_mapping', links)]:
    columns = ','.join(items[0].keys())
    sql += f'\nINSERT INTO public.{table} ({columns}) VALUES\n'
    sql += ',\n'.join('('+','.join(sql_value(v) for v in row.values())+')' for row in items)
    sql += '\nON CONFLICT DO NOTHING;\n'
sql += '\nCOMMIT;\n'
(ROOT / 'supabase/migrations/202610160001_carbon_reference.sql').write_text(sql,encoding='utf-8')
assert next(r for r in records if r['source_number']==214)['factor_kg_co2e_per_unit'] == 1.65
assert Decimal('0.15') * Decimal('1.65') == Decimal('0.2475')
assert len(list(csv.DictReader((OUT/'carbon_factors.csv').open(encoding='utf-8-sig')))) == len(records)
print(json.dumps(metadata,ensure_ascii=False,indent=2))
