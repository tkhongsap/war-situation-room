'use client';

function Pulse({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-sm animate-pulse ${className}`}
      style={{ background: 'rgba(30, 55, 85, 0.15)', ...style }}
    />
  );
}

export function ExecutiveSummarySkeleton() {
  return (
    <div className="panel px-6 py-5 relative overflow-hidden">
      <div className="flex items-center gap-6">
        {/* Gauge placeholder */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full animate-pulse" style={{ background: 'rgba(30, 55, 85, 0.2)' }} />
          <Pulse className="h-3 w-16" />
        </div>
        <div className="w-px self-stretch" style={{ background: 'linear-gradient(180deg, transparent, rgba(30, 55, 85, 0.4), transparent)' }} />
        {/* BLUF lines */}
        <div className="flex-1 min-w-0 space-y-3">
          <Pulse className="h-3 w-32" />
          <div className="space-y-2.5">
            <Pulse className="h-4 w-full" />
            <Pulse className="h-3.5 w-5/6" />
            <Pulse className="h-3 w-4/6" />
          </div>
        </div>
        <div className="w-px self-stretch" style={{ background: 'linear-gradient(180deg, transparent, rgba(30, 55, 85, 0.4), transparent)' }} />
        {/* Delta cards */}
        <div className="flex gap-3 flex-shrink-0">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col items-center px-4 py-2.5 rounded-sm min-w-[95px]" style={{ background: 'rgba(30, 55, 85, 0.06)', border: '1px solid rgba(30, 55, 85, 0.15)' }}>
              <Pulse className="h-2 w-12 mb-2" />
              <Pulse className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SituationBriefSkeleton() {
  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      <div className="panel-header px-5 py-3 flex items-center justify-between">
        <Pulse className="h-3 w-24" />
        <Pulse className="h-5 w-20 rounded-sm" />
      </div>
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.3)' }}>
        <Pulse className="h-2 w-16 mb-1.5" />
        <Pulse className="h-4 w-48" />
      </div>
      <div className="px-5 py-3.5 grid grid-cols-2 gap-3" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.25)' }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex flex-col gap-1">
            <Pulse className="h-2 w-14" />
            <Pulse className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="flex-1 px-5 py-3.5 space-y-3">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <Pulse key={i} className="h-3" style={{ width: `${85 - i * 5}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SupplyChainRiskSkeleton() {
  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <Pulse className="h-3 w-32 flex-1" />
        <div className="w-16 h-16 rounded-full animate-pulse" style={{ background: 'rgba(30, 55, 85, 0.2)' }} />
      </div>
      <div className="flex-1 px-4 py-2 space-y-0">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(15, 24, 37, 0.6)' }}>
            <Pulse className="h-3 w-3" />
            <Pulse className="h-3 flex-1" />
            <Pulse className="h-1.5 w-20 rounded-full" />
            <Pulse className="h-3.5 w-3.5" />
            <Pulse className="h-3 w-16" />
            <Pulse className="h-4 w-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScenarioAnalysisSkeleton() {
  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header px-5 py-3 flex items-center justify-between flex-shrink-0">
        <Pulse className="h-3 w-28" />
        <Pulse className="h-2 w-24" />
      </div>
      <div className="flex-1 p-4 grid grid-cols-3 gap-4 min-h-0">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-sm flex flex-col overflow-hidden" style={{ background: 'rgba(30, 55, 85, 0.03)', border: '1px solid rgba(30, 55, 85, 0.15)' }}>
            <div className="px-3.5 pt-3.5 pb-2.5" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.15)' }}>
              <div className="flex justify-between mb-2">
                <Pulse className="h-3 w-20" />
                <Pulse className="h-8 w-12" />
              </div>
              <Pulse className="h-1 w-full rounded-full" />
            </div>
            <div className="px-3.5 py-2.5" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.2)' }}>
              <Pulse className="h-3 w-full mb-1" />
              <Pulse className="h-3 w-4/5" />
            </div>
            <div className="flex-1 px-3.5 py-2.5 space-y-2">
              {[0, 1, 2, 3].map(j => (
                <div key={j} className="flex justify-between">
                  <Pulse className="h-2 w-16" />
                  <Pulse className="h-3 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StrategicActionsSkeleton() {
  return (
    <div className="panel overflow-hidden">
      <div className="panel-header px-5 py-3 flex items-center justify-between">
        <Pulse className="h-3 w-56" />
        <Pulse className="h-2 w-28" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {[0, 1, 2].map(col => (
          <div key={col} className="p-4 space-y-3" style={{ borderLeft: col > 0 ? '1px solid rgba(30, 55, 85, 0.25)' : 'none' }}>
            <div className="flex items-center gap-2 mb-3">
              <Pulse className="h-3.5 w-3.5 rounded-sm" />
              <Pulse className="h-3 w-28" />
            </div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-r-sm px-3 py-2.5" style={{ background: 'rgba(10, 14, 22, 0.5)', borderLeft: '2px solid rgba(30, 55, 85, 0.2)' }}>
                <Pulse className="h-2 w-16 mb-2" />
                <Pulse className="h-3 w-full mb-1" />
                <Pulse className="h-2.5 w-4/5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
