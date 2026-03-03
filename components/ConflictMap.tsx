'use client';

import dynamic from 'next/dynamic';

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#0a0d14] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-mono text-gray-500 tracking-widest">LOADING MAP INTELLIGENCE...</p>
      </div>
    </div>
  ),
});

export default function ConflictMap() {
  return (
    <div className="h-full w-full rounded-sm overflow-hidden border border-[#1a2a3a]">
      <div className="bg-[#0a0d14] border-b border-[#1a2a3a] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
          <span className="text-[10px] font-mono font-bold text-gray-400 tracking-widest uppercase">
            Theater Operations Map — Middle East &amp; Persian Gulf
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600">
          <span>HORMUZ: <span className="text-red-400 font-bold">CLOSED</span></span>
          <span>DEFCON: <span className="text-orange-400 font-bold">3</span></span>
        </div>
      </div>
      <div style={{ height: 'calc(100% - 36px)' }}>
        <MapInner />
      </div>
    </div>
  );
}
