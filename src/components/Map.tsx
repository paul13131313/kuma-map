import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { KumaSighting } from '../types/kuma';
import type { MapMode } from '../types/kuma';
import { useEffect } from 'react';

// Leafletデフォルトアイコン修正
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createKumaIcon(species: string, count: number) {
  const isHiguma = species === 'ヒグマ';
  const isPulse = count >= 3;
  const size = isPulse ? 36 : 28;
  return L.divIcon({
    html: `<div style="
      font-size:${size}px;
      line-height:1;
      filter: drop-shadow(0 0 6px ${isHiguma ? '#FF2D55' : '#FF6B35'});
      ${isPulse ? 'animation: pulse 1s infinite;' : ''}
    ">🐻</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

// ヒートマップ用ダミーコンポーネント（leaflet.heatなし版: 密度を大きな丸で代用）
function HeatLayer({ sightings }: { sightings: KumaSighting[] }) {
  const map = useMap();
  useEffect(() => {
    const circles: L.Circle[] = sightings.map((s) =>
      L.circle([s.lat, s.lng], {
        radius: 25000,
        color: 'transparent',
        fillColor: '#FF6B35',
        fillOpacity: 0.15,
      }).addTo(map)
    );
    return () => { circles.forEach((c) => c.remove()); };
  }, [map, sightings]);
  return null;
}

type Props = {
  sightings: KumaSighting[];
  mode: MapMode;
};

// 都道府県別件数でアイコンサイズを変える
function getSightingCount(sightings: KumaSighting[], prefecture: string) {
  return sightings.filter((s) => s.prefecture === prefecture).length;
}

export default function Map({ sightings, mode }: Props) {
  return (
    <MapContainer
      center={[37.0, 137.5]}
      zoom={5}
      style={{ height: '100%', width: '100%', background: '#0D1117' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {mode === 'heat' && <HeatLayer sightings={sightings} />}
      {mode === 'pin' && sightings.map((s) => {
        const count = getSightingCount(sightings, s.prefecture);
        return (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={createKumaIcon(s.species, count)}
          >
            <Popup>
              <div style={{ fontFamily: 'Noto Sans JP, sans-serif', minWidth: 200 }}>
                <div style={{ fontWeight: 'bold', fontSize: 14, color: '#FF6B35', marginBottom: 4 }}>
                  🐻 {s.prefecture} {s.city}
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{s.date}</div>
                <div style={{ fontSize: 13, marginBottom: 4 }}>{s.situation}</div>
                <div style={{ fontSize: 11, color: '#888' }}>種別: {s.species}</div>
                <div style={{ fontSize: 11, color: '#888' }}>出典: {s.source}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
