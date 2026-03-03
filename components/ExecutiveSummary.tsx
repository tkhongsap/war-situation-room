'use client';

import { useState, useEffect, useCallback } from 'react';
import { compositeRiskScore } from '@/config/risk-data';
import { situationData } from '@/config/situation-data';
import { scenarios } from '@/config/scenarios';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DeltaItem {
  label: string;
  value: string;
  direction: 'up' | 'down' | 'neutral';
}

interface ApiDataPoint {
  symbol: string;
  changePercent: number | null;
  price: number | null;
}

function getRiskMeta(score: number): { color: string; label: string; glowClass: string } {
  if (score >= 4.5) return { color: '#ef4444', label: 'CRITICAL', glowClass: 'glow-red' };
  if (score >= 3.5) return { color: '#f97316', label: 'HIGH', glowClass: 'glow-amber' };
  if (score >= 2.5) return { color: '#eab308', label: 'ELEVATED', glowClass: 'glow-amber' };
  return { color: '#3b82f6', label: 'MODERATE', glowClass: 'glow-cyan' };
}

function RiskDial({ score, maxScore = 5 }: { score: number; maxScore?: number }) {
  const pct = Math.min(score / maxScore, 1);
  const { color, label, glowClass } = getRiskMeta(score);

  // Generate tick marks
  const ticks = Array.from({ length: 25 }, (_, i) => {
    const angle = (i / 25) * 360;
    const isMajor = i % 5 === 0;
    return { angle, isMajor };
  });

  return (
    <div className="relative flex-shrink-0 flex flex-col items-center gap-2 gauge-animate">
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className="absolute -inset-1 rounded-full opacity-30 blur-sm"
          style={{ background: `conic-gradient(${color} 0% ${pct * 100}%, transparent ${pct * 100}% 100%)` }}
        />

        {/* Main gauge */}
        <div
          className="w-24 h-24 rounded-full relative"
          style={{
            background: `conic-gradient(${color} 0% ${pct * 100}%, #0f1825 ${pct * 100}% 100%)`,
            padding: '3px',
          }}
        >
          {/* Tick marks ring */}
          <div className="absolute inset-0 rounded-full">
            {ticks.map((tick, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  width: '1px',
                  height: tick.isMajor ? '6px' : '3px',
                  background: tick.isMajor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                  transformOrigin: '0 0',
                  transform: `rotate(${tick.angle}deg) translate(-0.5px, -48px)`,
                }}
              />
            ))}
          </div>

          {/* Inner ring spacer */}
          <div className="w-full h-full rounded-full" style={{ padding: '3px', background: '#0a0e18' }}>
            {/* Center */}
            <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 40%, #0f1520 0%, #080c14 100%)' }}>
              <span className={`text-3xl font-mono font-extrabold tabular-nums text-white leading-none ${glowClass}`}>
                {score.toFixed(1)}
              </span>
              <span className="text-[8px] font-mono font-medium tracking-widest mt-1" style={{ color: 'rgba(148, 163, 184, 0.4)' }}>
                / {maxScore}
              </span>
            </div>
          </div>
        </div>
      </div>
      <span className={`text-[10px] font-mono font-bold tracking-[0.25em] ${glowClass}`} style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export default function ExecutiveSummary() {
  const [deltas, setDeltas] = useState<DeltaItem[]>([]);

  const freightImpact = scenarios[0]?.impacts.find((i) => i.label === 'Freight Rates')?.value ?? 'Elevated';

  const fetchDeltas = useCallback(async () => {
    try {
      const [mktRes, fxRes] = await Promise.all([
        fetch('/api/market-data'),
        fetch('/api/forex'),
      ]);
      const mktData: ApiDataPoint[] = mktRes.ok ? (await mktRes.json()).data ?? [] : [];
      const fxData: ApiDataPoint[] = fxRes.ok ? (await fxRes.json()).data ?? [] : [];

      const brent = mktData.find((d) => d.symbol === 'BZ=F');
      const thb = fxData.find((d) => d.symbol === 'THBUSD=X');

      const built: DeltaItem[] = [
        {
          label: 'Brent Crude',
          value:
            brent?.changePercent != null
              ? `${brent.changePercent >= 0 ? '+' : ''}${brent.changePercent.toFixed(1)}%`
              : 'N/A',
          direction:
            brent?.changePercent != null
              ? brent.changePercent > 0
                ? 'up'
                : 'down'
              : 'neutral',
        },
        {
          label: 'Freight Est.',
          value: freightImpact,
          direction: 'up',
        },
        {
          label: 'THB / USD',
          value:
            thb?.changePercent != null
              ? `${thb.changePercent >= 0 ? '+' : ''}${thb.changePercent.toFixed(2)}%`
              : 'N/A',
          direction:
            thb?.changePercent != null
              ? thb.changePercent > 0
                ? 'up'
                : 'down'
              : 'neutral',
        },
      ];
      setDeltas(built);
    } catch {
      // keep empty
    }
  }, [freightImpact]);

  useEffect(() => {
    fetchDeltas();
    const interval = setInterval(fetchDeltas, 60000);
    return () => clearInterval(interval);
  }, [fetchDeltas]);

  const threatTextColor: Record<string, string> = {
    CRITICAL: 'text-red-400',
    HIGH: 'text-orange-400',
    ELEVATED: 'text-yellow-400',
    MODERATE: 'text-blue-400',
    LOW: 'text-green-400',
  };
  const threatGlow: Record<string, string> = {
    CRITICAL: 'glow-red',
    HIGH: 'glow-amber',
    ELEVATED: 'glow-amber',
    MODERATE: 'glow-cyan',
    LOW: 'glow-green',
  };
  const threatColor = threatTextColor[situationData.threatLevel] ?? 'text-red-400';
  const threatGlowClass = threatGlow[situationData.threatLevel] ?? 'glow-red';

  return (
    <div className="panel px-6 py-5 relative overflow-hidden">
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(239, 68, 68, 0.2) 30%, rgba(249, 115, 22, 0.15) 50%, rgba(6, 182, 212, 0.1) 70%, transparent 90%)' }} />

      <div className="flex items-center gap-6">
        {/* Risk gauge */}
        <RiskDial score={compositeRiskScore} />

        {/* Divider */}
        <div className="w-px self-stretch flex-shrink-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(30, 55, 85, 0.4), transparent)' }} />

        {/* BLUF Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="type-label" style={{ letterSpacing: '0.2em' }}>
              Executive Summary
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(30, 55, 85, 0.4), transparent)' }} />
            <span className={`font-mono text-[10px] font-bold tracking-[0.2em] uppercase ${threatColor} ${threatGlowClass}`}>
              {situationData.operationName}
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex gap-3 items-baseline">
              <span className={`type-label flex-shrink-0 w-[82px] ${threatColor} ${threatGlowClass}`} style={{ fontSize: '9px' }}>
                KEY CHANGE
              </span>
              <p className="text-[14px] font-medium text-gray-100 leading-snug type-body">
                {situationData.bluf.keyChange}
              </p>
            </div>
            <div className="flex gap-3 items-baseline">
              <span className="type-label flex-shrink-0 w-[82px] text-orange-400/80 glow-amber" style={{ fontSize: '9px' }}>
                IMPACT
              </span>
              <p className="text-[13px] text-gray-300 leading-snug type-body">
                {situationData.bluf.impact}
              </p>
            </div>
            <div className="flex gap-3 items-baseline">
              <span className="type-label flex-shrink-0 w-[82px] text-amber-400/75" style={{ fontSize: '9px' }}>
                WATCH
              </span>
              <p className="text-[13px] text-gray-400 leading-snug type-body">
                {situationData.bluf.watch}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch flex-shrink-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(30, 55, 85, 0.4), transparent)' }} />

        {/* Delta indicators */}
        <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
          <span className="type-label">24h Change</span>
          <div className="flex items-stretch gap-3 flex-shrink-0">
            {deltas.map((d, idx) => (
              <div
                key={d.label}
                className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-sm min-w-[95px] number-reveal ${
                  d.direction === 'up'
                    ? 'glow-red-box'
                    : d.direction === 'down'
                    ? 'glow-green-box'
                    : ''
                }`}
                style={{
                  animationDelay: `${0.4 + idx * 0.1}s`,
                  background: d.direction === 'up'
                    ? 'rgba(239, 68, 68, 0.04)'
                    : d.direction === 'down'
                    ? 'rgba(34, 197, 94, 0.04)'
                    : 'rgba(100, 116, 139, 0.04)',
                  border: `1px solid ${
                    d.direction === 'up'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : d.direction === 'down'
                      ? 'rgba(34, 197, 94, 0.2)'
                      : 'rgba(100, 116, 139, 0.15)'
                  }`,
                }}
              >
                <span className="type-label mb-1.5" style={{ fontSize: '8px' }}>
                  {d.label}
                </span>
                <div className="flex items-center gap-1">
                  {d.direction === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  ) : d.direction === 'down' ? (
                    <TrendingDown className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  ) : null}
                  <span
                    className={`text-lg font-bold font-mono tabular-nums leading-none ${
                      d.direction === 'up'
                        ? 'text-red-400 glow-red'
                        : d.direction === 'down'
                        ? 'text-green-400 glow-green'
                        : 'text-gray-400'
                    }`}
                  >
                    {d.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
