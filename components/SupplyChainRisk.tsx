'use client';

import { useState } from 'react';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { SupplyChainRiskSkeleton } from '@/components/AnalysisSkeleton';
import { riskCategories as fallbackRiskCategories, compositeRiskScore as fallbackCompositeScore, compositeRiskLabel as fallbackCompositeLabel } from '@/config/risk-data';
import { TrendingUp, TrendingDown, Minus, AlertOctagon, ChevronDown, ChevronRight } from 'lucide-react';

const riskConfig = {
  5: { label: 'CRITICAL', color: 'text-red-400', hexColor: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30', bar: 'bg-red-500', glow: 'glow-red' },
  4: { label: 'HIGH', color: 'text-orange-400', hexColor: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30', bar: 'bg-orange-500', glow: 'glow-amber' },
  3: { label: 'ELEVATED', color: 'text-yellow-400', hexColor: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', bar: 'bg-yellow-500', glow: 'glow-amber' },
  2: { label: 'MODERATE', color: 'text-blue-400', hexColor: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/30', bar: 'bg-blue-500', glow: 'glow-cyan' },
  1: { label: 'LOW', color: 'text-green-400', hexColor: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/30', bar: 'bg-green-500', glow: 'glow-green' },
} as const;

const BAR_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];
function barColor(level: number): string {
  return BAR_COLORS[5 - level] ?? '#6b7280';
}

export default function SupplyChainRisk() {
  const { data, loading } = useAnalysisContext();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (loading && !data) return <SupplyChainRiskSkeleton />;

  const riskCategories = data?.riskCategories ?? fallbackRiskCategories;
  const compositeRiskScore = data?.compositeRiskScore ?? fallbackCompositeScore;
  const compositeRiskLabel = data?.compositeRiskLabel ?? fallbackCompositeLabel;

  const compositeConfig = compositeRiskScore >= 4.5 ? riskConfig[5] : compositeRiskScore >= 3.5 ? riskConfig[4] : riskConfig[3];
  const gaugeColor = compositeConfig.hexColor;
  const gaugePct = compositeRiskScore / 5;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const assessmentDate = new Date().toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  });

  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      <div className="panel-header px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <AlertOctagon className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <div className="flex flex-col">
            <h2 className="type-display text-[11px] text-gray-300">Supply Chain Risk</h2>
            <span className="type-label mt-0.5" style={{ fontSize: '8px' }}>Assessment as of {assessmentDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative gauge-animate">
            <div className="absolute -inset-0.5 rounded-full opacity-25 blur-sm" style={{ background: `conic-gradient(${gaugeColor} 0% ${gaugePct * 100}%, transparent ${gaugePct * 100}% 100%)` }} />
            <div className="w-16 h-16 rounded-full flex-shrink-0 relative" style={{ background: `conic-gradient(${gaugeColor} 0% ${gaugePct * 100}%, #0f1825 ${gaugePct * 100}% 100%)`, padding: '3px' }}>
              <div className="w-full h-full rounded-full" style={{ padding: '2px', background: '#080c14' }}>
                <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 40%, #0f1520 0%, #080c14 100%)' }}>
                  <span className={`text-xl font-bold font-mono tabular-nums leading-none ${compositeConfig.color} ${compositeConfig.glow}`}>
                    {compositeRiskScore.toFixed(1)}
                  </span>
                  <span className="text-[7px] text-gray-600 tracking-wide mt-0.5 font-mono">/ 5.0</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="type-label" style={{ fontSize: '8px' }}>Composite</span>
            <span className={`font-mono text-base font-bold tracking-[0.15em] ${compositeConfig.color} ${compositeConfig.glow}`}>
              {compositeRiskLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-0">
        {riskCategories.map((cat) => {
          const config = riskConfig[cat.level as keyof typeof riskConfig];
          const isExpanded = expanded.has(cat.id);
          return (
            <div key={cat.id} className="border-b border-[#0f1825]/60 last:border-0">
              <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#0c1018] transition-colors group" onClick={() => toggleExpand(cat.id)}>
                <div className="flex-shrink-0 w-3 flex justify-center text-gray-600 group-hover:text-gray-400 transition-colors">
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-gray-300 type-body">{cat.name}</span>
                </div>
                <div className="w-20 h-1.5 bg-gray-800/50 rounded-full flex-shrink-0 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(cat.level / 5) * 100}%`, backgroundColor: barColor(cat.level), boxShadow: `0 0 6px ${barColor(cat.level)}40` }} />
                </div>
                <div className="flex-shrink-0 w-4 flex justify-center">
                  {cat.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-red-400" /> : cat.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5 text-green-400" /> : <Minus className="w-3.5 h-3.5 text-gray-600" />}
                </div>
                <div className={`flex-shrink-0 font-mono text-[10px] font-bold tracking-[0.15em] w-16 text-right ${config.color}`}>{config.label}</div>
                <div className={`flex-shrink-0 font-mono text-base font-bold tabular-nums w-5 text-right ${config.color} ${config.glow}`}>{cat.level}</div>
              </div>
              {isExpanded && (
                <div className="pl-9 pr-4 pb-3 space-y-1.5">
                  <p className="text-[11px] text-gray-400 leading-relaxed type-body">{cat.description}</p>
                  {cat.impacts.length > 0 && (
                    <ul className="space-y-0.5">
                      {cat.impacts.map((impact, i) => (
                        <li key={i} className="text-[10px] text-gray-500 flex items-start gap-1.5 type-body">
                          <span className="text-gray-700 mt-0.5">▸</span>
                          <span>{impact}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
