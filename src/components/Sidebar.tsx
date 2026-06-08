import type { KumaSighting, PeriodFilter, SpeciesFilter } from '../types/kuma';
import { getTopPrefectures } from '../utils/parseData';
import RecentList from './RecentList';

type Props = {
  allData: KumaSighting[];
  filtered: KumaSighting[];
  period: PeriodFilter;
  setPeriod: (v: PeriodFilter) => void;
  species: SpeciesFilter;
  setSpecies: (v: SpeciesFilter) => void;
  prefecture: string;
  setPrefecture: (v: string) => void;
};

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県',
  '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県',
  '静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県',
  '奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県',
  '熊本県','大分県','宮崎県','鹿児島県','沖縄県',
];

export default function Sidebar({ allData, filtered, period, setPeriod, species, setSpecies, prefecture, setPrefecture }: Props) {
  const top10 = getTopPrefectures(filtered);
  const maxCount = top10[0]?.count || 1;

  return (
    <div className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-700 overflow-y-auto flex flex-col" style={{ minWidth: 0, width: '288px', maxWidth: '288px' }}>
      {/* フィルター */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-3">フィルター</h2>
        <div className="mb-3">
          <label className="text-gray-400 text-xs mb-1 block">期間</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
            className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value="1month">直近1ヶ月</option>
            <option value="3months">直近3ヶ月</option>
            <option value="1year">直近1年</option>
            <option value="all">全期間</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="text-gray-400 text-xs mb-1 block">種別</label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value as SpeciesFilter)}
            className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value="all">すべて</option>
            <option value="ツキノワグマ">ツキノワグマ</option>
            <option value="ヒグマ">ヒグマ</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs mb-1 block">都道府県</label>
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600"
          >
            <option value="all">すべて</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 統計 */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-3">統計</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-white">{filtered.length}</div>
            <div className="text-xs text-gray-400">件（フィルター後）</div>
          </div>
          <div className="bg-gray-800 rounded p-3 text-center">
            <div className="text-2xl font-bold text-white">{allData.length}</div>
            <div className="text-xs text-gray-400">件（全期間）</div>
          </div>
        </div>
        <h3 className="text-gray-400 text-xs font-bold mb-2">出没件数 TOP10</h3>
        <div className="flex flex-col gap-1">
          {top10.map((item, i) => (
            <div key={item.prefecture} className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 w-4">{i + 1}</span>
              <span className="text-gray-300 flex-1 truncate">{item.prefecture}</span>
              <div className="w-20 bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-orange-400 font-bold w-6 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 直近リスト */}
      <div className="p-4 flex-1">
        <h2 className="text-orange-400 font-bold text-xs uppercase tracking-widest mb-3">直近の出没情報</h2>
        <RecentList sightings={filtered} />
      </div>
    </div>
  );
}
