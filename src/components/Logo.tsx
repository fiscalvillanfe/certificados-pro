'use client';

export default function Logo() {
  return (
    <div className="flex items-center justify-center select-none">
      <svg width="36" height="36" viewBox="0 0 48 48" className="drop-shadow">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#4C7CFF" />
            <stop offset="1" stopColor="#203CA0" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="36" height="36" rx="10" fill="url(#g)" />
        <path d="M15 26.5l6.5 6.5L33 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="ml-3 text-lg font-semibold tracking-wide">
        Certificados<span className="text-brand-400">Pro</span>
      </span>
    </div>
  );
}
