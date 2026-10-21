// Policy reference and voluntary practice benchmark have different scopes.
export const carbonTargets = {
  checkedOn: '2026-10-21',
  national: {
    baselineYear: 2018,
    targetYear: 2035,
    baselineNetMillionTonnes: 742.3,
    reductionPercent: [53, 61] as const,
    source: 'https://www.mcee.go.kr/home/web/board/read.do?boardId=1818900&boardMasterId=939&menuId=10598',
  },
  practice: {
    kg: 1000,
    // A rolling 365-day window is GreenStep's implementation choice,
    // not an individually allocated NDC or a claim about the campaign's deadline.
    days: 365,
    source: 'https://www.kcen.kr/cbook/index.green',
    name: '온실가스 1인 1톤 줄이기',
  },
};
