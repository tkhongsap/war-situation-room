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

function getRiskMeta(score: number): { color: string; label: string } {
  if (score >= 4.5) return { color: '#ef4444', label: 'CRITICAL' };
  if (score >= 3.5) return { color: '#f97316', label: 'HIGH' };
  if (score >= 2.5) return { color: '#eab308', label: 'ELEVATED' };
  return { color: '#3b82f6', label: 'MODERATE' };
}

function RiskDial({ score, maxScore = 5 }: { score: number; maxScore?: number }) {
  const pct = Math.min(score / maxScore, 1);
  const { color, label } = getRiskMeta(score);

  return (
    <div className="relative flex-shrink-0 flex flex-col items-center gap-1">
      <div
        className="w-20 h-20 rounded-full"
        style={{
          background: `conic-gradient(${color} 0% ${pct * 100}%, #1e2d3d ${pct * 100}% 100%)`,
          padding: '6px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#07090f] flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono tabular-nums text-white leading-none">
            {score.toFixed(1)}
          </span>
          <span className="text-[8px] font-semibold tracking-widest mt-0.5" style={{ color }}>
            / {maxScore}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold tracking-widest" style={{ color }}>
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
  const threatColor = threatTextColor[situationData.threatLevel] ?? 'text-red-400';

  return (
    <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm px-6 py-5">
      <div className="flex items-center gap-5">
        {/* Risk gauge */}
        <RiskDial score={compositeRiskScore} />

        {/* Divider */}
        <div className="w-px self-stretch bg-[#1a2a3a] flex-shrink-0" />

        {/* BLUF Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Executive Summary
            </span>
            <div className="flex-1 h-px bg-[#1a2a3a]" />
            <span className={`text-[10px] font-bold tracking-[0.18em] uppercase ${threatColor}`}>
              {situationData.operationName}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex gap-3 items-baseline">
              <span className={`text-[9px] font-bold tracking-[0.16em] uppercase whitespace-nowrap flex-shrink-0 w-[82px] ${threatColor}`}>
                KEY CHANGE
              </span>
              <p className="text-[14px] font-medium text-gray-100 leading-snug">
                {situationData.bluf.keyChange}
              </p>
            </div>
            <div className="flex gap-3 items-baseline">
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase whitespace-nowrap flex-shrink-0 w-[82px] text-orange-400/80">
                IMPACT
              </span>
              <p className="text-[13px] text-gray-300 leading-snug">
                {situationData.bluf.impact}
              </p>
            </div>
            <div className="flex gap-3 items-baseline">
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase whitespace-nowrap flex-shrink-0 w-[82px] text-amber-400/75">
                WATCH
              </span>
              <p className="text-[13px] text-gray-400 leading-snug">
                {situationData.bluf.watch}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-[#1a2a3a] flex-shrink-0" />

        {/* Delta indicators */}
        <div className="flex items-stretch gap-3 flex-shrink-0">
          {deltas.map((d) => (
            <div
              key={d.label}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded border min-w-[90px] ${
                d.direction === 'up'
                  ? 'border-red-500/30 bg-red-500/5'
                  : d.direction === 'down'
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-gray-700/50 bg-gray-500/5'
              }`}
            >
              <span className="text-[9px] text-gray-500 uppercase tracking-wider mb-1.5">
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
                      ? 'text-red-400'
                      : d.direction === 'down'
                      ? 'text-green-400'
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
  );
}
