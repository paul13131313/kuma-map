export type KumaSpecies = 'ツキノワグマ' | 'ヒグマ' | '不明';

export type KumaSighting = {
  id: string;
  prefecture: string;
  city: string;
  date: string;
  species: KumaSpecies;
  lat: number;
  lng: number;
  situation: string;
  source: string;
};

export type PeriodFilter = '1month' | '3months' | '1year' | 'all';
export type SpeciesFilter = 'ツキノワグマ' | 'ヒグマ' | 'all';
export type MapMode = 'pin' | 'heat';
