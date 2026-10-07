-- Official 2026 Carbon Neutral Point activities. Amounts are KRW incentives,
-- not GreenStep points or carbon-reduction factors. Official amounts may change.
create table if not exists public.greenstep_incentive_activities (
  id text primary key,
  official_name text not null unique,
  app_activity_name text not null,
  amount_krw integer check (amount_krw is null or amount_krw >= 0),
  unit text,
  annual_limit_krw integer check (annual_limit_krw is null or annual_limit_krw >= 0),
  payout_organization text not null,
  payout_timing text not null,
  source_url text not null,
  source_checked_on date not null,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((amount_krw is null) = (unit is null))
);

create table if not exists public.greenstep_challenge_incentive_links (
  challenge_id text not null,
  incentive_activity_id text not null references public.greenstep_incentive_activities(id) on delete cascade,
  quantity_per_challenge numeric not null default 1 check (quantity_per_challenge > 0),
  match_note text not null,
  primary key (challenge_id, incentive_activity_id)
);

alter table public.greenstep_incentive_activities enable row level security;
alter table public.greenstep_challenge_incentive_links enable row level security;

drop policy if exists "Public can read active incentive activities" on public.greenstep_incentive_activities;
create policy "Public can read active incentive activities"
  on public.greenstep_incentive_activities for select
  using (is_active = true);

drop policy if exists "Public can read challenge incentive links" on public.greenstep_challenge_incentive_links;
create policy "Public can read challenge incentive links"
  on public.greenstep_challenge_incentive_links for select
  using (true);

grant select on public.greenstep_incentive_activities to anon, authenticated;
grant select on public.greenstep_challenge_incentive_links to anon, authenticated;

insert into public.greenstep_incentive_activities
  (id, official_name, app_activity_name, amount_krw, unit, annual_limit_krw,
   payout_organization, payout_timing, source_url, source_checked_on, note)
values
  ('electronic-receipt', '전자영수증 발급', '전자영수증', 10, '건', 70000, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('tumbler-reusable-cup', '텀블러·다회용컵 이용', '텀블러·다회용컵', 300, '개', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('single-use-cup-return', '일회용컵 반환', '일회용컵', 100, '개', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('refill-station', '리필스테이션 이용', '리필스테이션', 500, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('reusable-container', '다회용기 이용', '다회용기', 500, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('zero-emission-car-rental', '무공해차 대여', '무공해차', 100, 'km', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('eco-friendly-product', '친환경제품 구매', '친환경제품', 500, '건', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('high-quality-recycling', '고품질 재활용품 배출', '고품질 재활용품', 300, 'kg', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('used-mobile-phone-return', '폐휴대폰 반납', '폐휴대폰', 1000, '개', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('future-generation-action', '미래세대실천행동', '미래세대실천행동', null, null, null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', '기후행동1.5℃ 운영계획에 따름'),
  ('shared-bike', '공유자전거 이용', '공유자전거', 100, 'km', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('zero-leftover-meal', '잔반제로 실천', '잔반제로', 100, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('tree-planting', '나무심기', '나무심기', 3000, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('balcony-solar-installation', '가정용 베란다 태양광 설치', '가정용 베란다 태양광', 10000, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('recycled-material-product', '재생원료 사용제품 구매', '재생원료 사용제품', 100, '건', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('shopping-bag', '장바구니 이용', '장바구니', 50, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null),
  ('personal-container-takeout', '개인용기 식품 포장', '개인용기 식품 포장', 500, '회', null, '한국환경산업기술원', '실천 활동 후 익월 말일부터 지급', 'https://cpoint.or.kr/netzero/site/cntnts/CNTNTS_002.do', '2026-10-07', null)
on conflict (id) do update set
  official_name = excluded.official_name,
  app_activity_name = excluded.app_activity_name,
  amount_krw = excluded.amount_krw,
  unit = excluded.unit,
  annual_limit_krw = excluded.annual_limit_krw,
  payout_organization = excluded.payout_organization,
  payout_timing = excluded.payout_timing,
  source_url = excluded.source_url,
  source_checked_on = excluded.source_checked_on,
  note = excluded.note,
  updated_at = now();

insert into public.greenstep_challenge_incentive_links (challenge_id, incentive_activity_id, quantity_per_challenge, match_note)
values
  ('ch-transport-2', 'shared-bike', 5, '공유자전거 5km 이용 기준'),
  ('ch-life-1', 'tumbler-reusable-cup', 1, '공식 항목의 텀블러·다회용컵 이용 1개 기준'),
  ('ch-life-2', 'shopping-bag', 1, '공식 항목의 장바구니 이용 1회 기준'),
  ('ch-resource-2', 'high-quality-recycling', 1, '참여기업이 인정하는 고품질 재활용품 1kg 기준'),
  ('ch-food-1', 'zero-leftover-meal', 1, '공식 항목의 잔반제로 실천 1회 기준'),
  ('ch-official-electronic-receipt', 'electronic-receipt', 1, '전자영수증 1건 발급 기준'),
  ('ch-official-single-use-cup-return', 'single-use-cup-return', 1, '일회용컵 1개 반환 기준'),
  ('ch-official-refill-station', 'refill-station', 1, '리필스테이션 1회 이용 기준'),
  ('ch-official-reusable-container', 'reusable-container', 1, '다회용기 1회 이용 기준'),
  ('ch-official-zero-emission-car', 'zero-emission-car-rental', 5, '무공해차량 5km 이용 기준'),
  ('ch-official-eco-product', 'eco-friendly-product', 1, '친환경제품 구매 1건 기준'),
  ('ch-official-used-phone', 'used-mobile-phone-return', 1, '폐휴대폰 1개 반납 기준'),
  ('ch-official-tree-planting', 'tree-planting', 1, '나무심기 1회 참여 기준'),
  ('ch-official-balcony-solar', 'balcony-solar-installation', 1, '가정용 베란다 태양광 1회 설치 기준'),
  ('ch-official-recycled-material-product', 'recycled-material-product', 1, '재생원료 사용제품 구매 1건 기준'),
  ('ch-official-personal-container', 'personal-container-takeout', 1, '개인용기 식품 포장 1회 기준')
on conflict (challenge_id, incentive_activity_id) do update set
  quantity_per_challenge = excluded.quantity_per_challenge,
  match_note = excluded.match_note;
