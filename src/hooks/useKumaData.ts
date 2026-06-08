import { useState, useEffect, useMemo } from 'react';
import type { KumaSighting, PeriodFilter, SpeciesFilter } from '../types/kuma';
import { filterSightings } from '../utils/parseData';

export function useKumaData(period: PeriodFilter, species: SpeciesFilter, prefecture: string) {
  const [allData, setAllData] = useState<KumaSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/kuma_data.json')
      .then((r) => r.json())
      .then((d: KumaSighting[]) => {
        setAllData(d);
        setLoading(false);
      })
      .catch(() => {
        setError('データの読み込みに失敗しました');
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => filterSightings(allData, period, species, prefecture),
    [allData, period, species, prefecture]
  );

  return { allData, filtered, loading, error };
}
