type Props = { prefectures: string[] };

export default function AlertBanner({ prefectures }: Props) {
  if (prefectures.length === 0) return null;
  return (
    <div className="bg-red-600 text-white px-4 py-2 text-sm font-bold flex items-center gap-2 animate-pulse">
      <span>⚠️</span>
      <span>出没急増警戒: {prefectures.join(' / ')}</span>
    </div>
  );
}
