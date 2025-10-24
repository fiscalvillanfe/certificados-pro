'use client';

export type Point = { x: number; y: number };

export default function SimpleLineChart({
  points,
  height = 180,
}: {
  points: Point[];
  height?: number;
}) {
  if (!points.length) return <div className="text-sm text-neutral-400">Sem dados para o período.</div>;
  const w = 560;
  const h = height;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const pad = 8;
  const scaleX = (x: number) => {
    if (maxX === minX) return pad;
    return pad + ((x - minX) / (maxX - minX)) * (w - pad * 2);
  };
  const scaleY = (y: number) => {
    if (maxY === minY) return h - pad;
    return h - pad - ((y - minY) / (maxY - minY)) * (h - pad * 2);
  };

  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`)
    .join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="rounded-lg bg-neutral-900 border border-white/10">
      <path d={path} fill="none" stroke="currentColor" className="text-brand-500" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={scaleX(p.x)} cy={scaleY(p.y)} r="2.5" className="fill-brand-400" />
      ))}
    </svg>
  );
}
