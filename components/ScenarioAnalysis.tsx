import { scenarios } from '@/config/scenarios';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const variantConfig = {
  base: {
    border: 'rgba(245, 158, 11, 0.25)',
    bg: 'rgba(245, 158, 11, 0.03)',
    headerBg: 'rgba(245, 158, 11, 0.06)',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    probBar: 'bg-amber-500',
    glow: 'glow-amber',
    glowColor: 'rgba(245, 158, 11, 0.12)',
  },
  escalation: {
    border: 'rgba(239, 68, 68, 0.25)',
    bg: 'rgba(239, 68, 68, 0.03)',
    headerBg: 'rgba(239, 68, 68, 0.06)',
    text: 'text-red-400',
    badge: 'bg-red-500/15 text-red-300 border-red-500/30',
    probBar: 'bg-red-500',
    glow: 'glow-red',
    glowColor: 'rgba(239, 68, 68, 0.12)',
  },
  deescalation: {
    border: 'rgba(34, 197, 94, 0.25)',
    bg: 'rgba(34, 197, 94, 0.03)',
    headerBg: 'rgba(34, 197, 94, 0.06)',
    text: 'text-green-400',
    badge: 'bg-green-500/15 text-green-300 border-green-500/30',
    probBar: 'bg-green-500',
    glow: 'glow-green',
    glowColor: 'rgba(34, 197, 94, 0.12)',
  },
};

export default function ScenarioAnalysis() {
  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      {/* Panel Header */}
      <div className="panel-header px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" style={{ boxShadow: '0 0 6px rgba(245, 158, 11, 0.4)' }}></div>
          <h2 className="type-display text-[11px] text-gray-300">
            Scenario Analysis
          </h2>
        </div>
        <span className="type-label" style={{ fontSize: '9px' }}>
          Probability-Weighted
        </span>
      </div>

      {/* Scenario Cards */}
      <div className="flex-1 p-4 grid grid-cols-3 gap-4 min-h-0">
        {scenarios.map((scenario, idx) => {
          const cfg = variantConfig[scenario.variant];
          return (
            <div
              key={scenario.id}
              className="rounded-sm flex flex-col overflow-hidden fade-in"
              style={{
                animationDelay: `${0.3 + idx * 0.1}s`,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderLeft: `2px solid ${cfg.border}`,
                boxShadow: `inset 0 0 30px ${cfg.glowColor}`,
              }}
            >
              {/* Card Header — prominent probability */}
              <div className="px-3.5 pt-3.5 pb-2.5" style={{ background: cfg.headerBg, borderBottom: `1px solid ${cfg.border}` }}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`font-mono text-[11px] font-bold ${cfg.text} tracking-[0.1em] uppercase`}>
                    {scenario.name}
                  </span>
                  {/* Large probability badge */}
                  <div className={`flex flex-col items-center px-2 py-0.5 rounded-sm border ${cfg.badge}`}>
                    <span className={`text-xl font-extrabold font-mono tabular-nums leading-none ${cfg.text} ${cfg.glow}`}>
                      {scenario.probability}%
                    </span>
                    <span className="type-label" style={{ fontSize: '7px', color: 'rgba(148, 163, 184, 0.4)' }}>prob.</span>
                  </div>
                </div>
                {/* Probability bar */}
                <div className="h-1 bg-gray-800/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cfg.probBar} transition-all duration-700`}
                    style={{ width: `${scenario.probability}%`, boxShadow: `0 0 8px ${cfg.glowColor}` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="px-3.5 py-2.5" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.2)' }}>
                <p className="text-[12px] text-gray-400 leading-relaxed type-body">
                  {scenario.description}
                </p>
              </div>

              {/* Timeline */}
              <div className="px-3.5 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.2)' }}>
                <span className="type-label" style={{ fontSize: '8px' }}>
                  Duration
                </span>
                <span className={`font-mono text-[11px] font-medium ${cfg.text}`}>
                  {scenario.timeline}
                </span>
              </div>

              {/* Impact Table */}
              <div className="flex-1 px-3.5 py-2.5 space-y-2">
                {scenario.impacts.map((impact) => (
                  <div key={impact.label} className="flex items-center justify-between">
                    <span className="type-label" style={{ fontSize: '8px' }}>
                      {impact.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {impact.direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-red-400" />
                      ) : impact.direction === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-green-400" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-500" />
                      )}
                      <span
                        className={`text-[11px] font-bold font-mono tabular-nums ${
                          impact.direction === 'up'
                            ? 'text-red-400'
                            : impact.direction === 'down'
                              ? 'text-green-400'
                              : 'text-gray-400'
                        }`}
                      >
                        {impact.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
