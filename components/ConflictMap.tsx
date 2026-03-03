'use client';

import dynamic from 'next/dynamic';

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 50%, #0a1018 0%, #060810 100%)' }}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="font-mono text-[10px] text-gray-600 tracking-[0.2em]">LOADING MAP INTELLIGENCE...</p>
      </div>
    </div>
  ),
});

export default function ConflictMap() {
  return (
    <div className="panel h-full w-full overflow-hidden relative grid-overlay">
      <div className="panel-header px-4 py-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-red-dot"></div>
          <span className="type-display text-[10px] text-gray-400">
            Theater Operations Map — Middle East &amp; Persian Gulf
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <span className="text-gray-600">HORMUZ: <span className="text-red-400 font-bold glow-red">CLOSED</span></span>
          <span className="text-gray-600">DEFCON: <span className="text-orange-400 font-bold glow-amber">3</span></span>
        </div>
      </div>
      <div style={{ height: 'calc(100% - 36px)' }} className="relative z-0">
        <MapInner />
      </div>
    </div>
  );
}
