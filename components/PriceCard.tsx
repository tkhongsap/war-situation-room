'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface PriceCardProps {
  name: string;
  price: number | null;
  unit: string;
  change24h: number | null;
  changePercent: number | null;
  sparkline: number[];
  decimals?: number;
  available?: boolean;
}

export default function PriceCard({
  name,
  price,
  unit,
  change24h,
  changePercent,
  sparkline,
  decimals = 2,
  available = true,
}: PriceCardProps) {
  const isUp = (changePercent ?? 0) > 0;
  const isDown = (changePercent ?? 0) < 0;
  const sparkData = sparkline.map((v, i) => ({ v, i }));

  const changeColor =
    !available || changePercent === null
      ? 'text-gray-600'
      : isUp
        ? 'text-red-400'
        : isDown
          ? 'text-green-400'
          : 'text-gray-400';
  const sparkColor = isUp ? '#ef4444' : isDown ? '#22c55e' : '#6b7280';
  const bgAccent =
    !available || changePercent === null
      ? 'bg-gray-500/5 border-gray-700/30'
      : isUp
        ? 'bg-red-500/5 border-red-500/20'
        : isDown
          ? 'bg-green-500/5 border-green-500/20'
          : 'bg-gray-500/5 border-gray-500/20';

  const formatPrice = (p: number) => {
    if (p >= 10000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (p >= 100) return p.toFixed(2);
    if (p >= 10) return p.toFixed(3);
    return p.toFixed(decimals);
  };

  if (!available || price === null) {
    return (
      <div className="rounded-sm border border-gray-800/40 bg-[#0d1117] p-3 flex flex-col gap-2">
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">
          {name}
        </div>
        <div className="text-xs font-mono text-gray-600 mt-1">Data unavailable</div>
        <div className="h-10" />
        <div className="text-[10px] font-mono text-gray-700">—</div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-sm border ${bgAccent} bg-[#0d1117] p-3 flex flex-col gap-2 hover:bg-[#111820] transition-colors`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">
            {name}
          </div>
          <div className="text-base font-mono font-bold text-white mt-1 tabular-nums leading-none">
            {formatPrice(price)}
            <span className="text-[10px] text-gray-500 ml-1">{unit}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${changeColor}`}>
          {changePercent === null ? (
            <Minus className="w-3 h-3" />
          ) : isUp ? (
            <TrendingUp className="w-3 h-3" />
          ) : isDown ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <Minus className="w-3 h-3" />
          )}
          <span className="text-xs font-mono font-medium tabular-nums">
            {changePercent !== null
              ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
              : '—'}
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-10">
        {sparkData.length >= 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] font-mono text-gray-700">No chart data</span>
          </div>
        )}
      </div>

      {/* 24h change */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="text-gray-600">24h</span>
        <span className={changeColor}>
          {change24h !== null
            ? `${change24h >= 0 ? '+' : ''}${change24h.toFixed(Math.abs(change24h) > 100 ? 0 : 2)}`
            : '—'}
        </span>
      </div>
    </div>
  );
}
