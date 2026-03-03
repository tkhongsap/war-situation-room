import { scenarios } from '@/config/scenarios';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const variantConfig = {
  base: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/5',
    headerBg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    probBar: 'bg-amber-500',
  },
  escalation: {
    border: 'border-red-500/40',
    bg: 'bg-red-500/5',
    headerBg: 'bg-red-500/10',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
    probBar: 'bg-red-500',
  },
  deescalation: {
    border: 'border-green-500/40',
    bg: 'bg-green-500/5',
    headerBg: 'bg-green-500/10',
    text: 'text-green-400',
    badge: 'bg-green-500/20 text-green-300 border-green-500/40',
    probBar: 'bg-green-500',
  },
};

export default function ScenarioAnalysis() {
  return (
    <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm overflow-hidden h-full flex flex-col">
      {/* Panel Header */}
      <div className="border-b border-[#1a2a3a] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <h2 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em]">
            Scenario Analysis
          </h2>
        </div>
        <span className="text-[10px] text-gray-600 tracking-widest uppercase">
          Probability-Weighted
        </span>
      </div>

      {/* Scenario Cards */}
      <div className="flex-1 p-4 grid grid-cols-3 gap-3 min-h-0">
        {scenarios.map((scenario) => {
          const cfg = variantConfig[scenario.variant];
          return (
            <div
              key={scenario.id}
              className={`rounded-sm border-l-2 border ${cfg.border} ${cfg.bg} flex flex-col overflow-hidden`}
            >
              {/* Card Header — prominent probability */}
              <div className={`${cfg.headerBg} border-b ${cfg.border} px-3 pt-3 pb-2`}>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[11px] font-semibold ${cfg.text} tracking-wide uppercase`}>
                    {scenario.name}
                  </span>
                  {/* Large probability badge */}
                  <div className={`flex flex-col items-center px-2 py-0.5 rounded border ${cfg.badge}`}>
                    <span className={`text-xl font-bold font-mono tabular-nums leading-none ${cfg.text}`}>
                      {scenario.probability}%
                    </span>
                    <span className="text-[8px] text-gray-600 tracking-wide">prob.</span>
                  </div>
                </div>
                {/* Probability bar */}
                <div className="h-1.5 bg-gray-800 rounded-full">
                  <div
                    className={`h-full rounded-full ${cfg.probBar} transition-all duration-700`}
                    style={{ width: `${scenario.probability}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="px-3 py-2 border-b border-[#1a2a3a]">
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              {/* Timeline */}
              <div className="px-3 py-1.5 border-b border-[#1a2a3a] flex items-center gap-2">
                <span className="text-[9px] text-gray-600 uppercase tracking-widest">
                  Duration
                </span>
                <span className={`text-[11px] font-medium font-mono ${cfg.text}`}>
                  {scenario.timeline}
                </span>
              </div>

              {/* Impact Table */}
              <div className="flex-1 px-3 py-2 space-y-1.5">
                {scenario.impacts.map((impact) => (
                  <div key={impact.label} className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-600 uppercase tracking-wide">
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
