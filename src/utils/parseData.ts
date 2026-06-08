import type { KumaSighting, PeriodFilter, SpeciesFilter } from '../types/kuma';

export function filterSightings(
  data: KumaSighting[],
  period: PeriodFilter,
  species: SpeciesFilter,
  prefecture: string
): KumaSighting[] {
  const now = new Date();
  return data.filter((s) => {
    if (species !== 'all' && s.species !== species) return false;
    if (prefecture !== 'all' && s.prefecture !== prefecture) return false;
    if (period !== 'all') {
      const date = new Date(s.date);
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      if (period === '1month' && diffDays > 30) return false;
      if (period === '3months' && diffDays > 90) return false;
      if (period === '1year' && diffDays > 365) return false;
    }
    return true;
  });
}

export function getPrefectureStats(data: KumaSighting[]): Record<string, number> {
  return data.reduce<Record<string, number>>((acc, s) => {
    acc[s.prefecture] = (acc[s.prefecture] || 0) + 1;
    return acc;
  }, {});
}

export function getTopPrefectures(data: KumaSighting[], n = 10): { prefecture: string; count: number }[] {
  const stats = getPrefectureStats(data);
  return Object.entries(stats)
    .map(([prefecture, count]) => ({ prefecture, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function getAlertPrefectures(data: KumaSighting[]): string[] {
  const recent = filterSightings(data, '1month', 'all', 'all');
  const prev = filterSightings(data, '3months', 'all', 'all').filter((s) => {
    const d = new Date(s.date);
    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  });
  const recentStats = getPrefectureStats(recent);
  const prevStats = getPrefectureStats(prev);
  return Object.entries(recentStats)
    .filter(([pref, cnt]) => {
      const prevCnt = prevStats[pref] || 0;
      return cnt >= 3 || (prevCnt > 0 && cnt / prevCnt >= 2);
    })
    .map(([pref]) => pref);
}
