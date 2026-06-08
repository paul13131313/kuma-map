import type { KumaSighting } from '../types/kuma';

type Props = { sightings: KumaSighting[] };

export default function RecentList({ sightings }: Props) {
  const recent = [...sightings].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10);
  return (
    <div className="flex flex-col gap-1">
      {recent.map((s) => (
        <div key={s.id} className="bg-gray-800 rounded px-3 py-2 text-xs border-l-2 border-orange-500">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-orange-400">{s.prefecture} {s.city}</span>
            <span className="text-gray-400">{s.date}</span>
          </div>
          <div className="text-gray-300">{s.situation}</div>
          <div className="text-gray-500 mt-1">
            {s.species === 'ヒグマ' ? '🐻 ヒグマ' : '🐻 ツキノワグマ'} — {s.source}
          </div>
        </div>
      ))}
    </div>
  );
}
