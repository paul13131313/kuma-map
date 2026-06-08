import { useState } from 'react';
import type { PeriodFilter, SpeciesFilter, MapMode } from './types/kuma';
import { useKumaData } from './hooks/useKumaData';
import { getAlertPrefectures } from './utils/parseData';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import AlertBanner from './components/AlertBanner';

export default function App() {
  const [period, setPeriod] = useState<PeriodFilter>('1year');
  const [species, setSpecies] = useState<SpeciesFilter>('all');
  const [prefecture, setPrefecture] = useState('all');
  const [mapMode, setMapMode] = useState<MapMode>('pin');

  const { allData, filtered, loading, error } = useKumaData(period, species, prefecture);
  const alertPrefectures = getAlertPrefectures(allData);

  return (
    <div className="h-screen flex flex-col bg-[#0D1117] text-white" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <header className="flex-shrink-0 bg-[#0D1117] border-b border-gray-700 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🐻</span>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }} className="text-3xl text-orange-400">
            KUMA MAP
          </h1>
          <span className="text-gray-400 text-sm hidden sm:block">— 熊出現マップ</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-800 rounded overflow-hidden border border-gray-600 text-sm">
            <button
              onClick={() => setMapMode('pin')}
              className={`px-3 py-1 ${mapMode === 'pin' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              📍 ピン
            </button>
            <button
              onClick={() => setMapMode('heat')}
              className={`px-3 py-1 ${mapMode === 'heat' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              🔥 ヒートマップ
            </button>
          </div>
          <div className="text-xs text-gray-500 hidden md:block">
            データ: 環境省・各都道府県発表
          </div>
        </div>
      </header>

      <AlertBanner prefectures={alertPrefectures} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          allData={allData}
          filtered={filtered}
          period={period}
          setPeriod={setPeriod}
          species={species}
          setSpecies={setSpecies}
          prefecture={prefecture}
          setPrefecture={setPrefecture}
        />
        <main className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117] z-10 text-gray-400">
              読み込み中...
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0D1117] z-10 text-red-400">
              {error}
            </div>
          )}
          {!loading && !error && <Map sightings={filtered} mode={mapMode} />}
        </main>
      </div>
    </div>
  );
}
