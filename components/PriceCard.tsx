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
  const glowClass = isUp ? 'glow-red' : isDown ? 'glow-green' : '';
  const sparkColor = isUp ? '#ef4444' : isDown ? '#22c55e' : '#6b7280';

  const formatPrice = (p: number) => {
    if (p >= 10000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (p >= 100) return p.toFixed(2);
    if (p >= 10) return p.toFixed(3);
    return p.toFixed(decimals);
  };

  if (!available || price === null) {
    return (
      <div className="rounded-sm p-3 flex flex-col gap-1" style={{ background: 'rgba(10, 14, 22, 0.5)', border: '1px solid rgba(50, 60, 80, 0.2)' }}>
        <div className="type-label" style={{ fontSize: '9px' }}>
          {name}
        </div>
        <div className="text-xs text-gray-600 mt-1 font-mono">Data unavailable</div>
        <div className="text-[10px] text-gray-700">—</div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-sm p-3 overflow-hidden hover:brightness-110 transition-all duration-200"
      style={{
        background: isUp
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.04) 0%, rgba(10, 14, 22, 0.8) 100%)'
          : isDown
          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.04) 0%, rgba(10, 14, 22, 0.8) 100%)'
          : 'rgba(10, 14, 22, 0.6)',
        border: `1px solid ${isUp ? 'rgba(239, 68, 68, 0.15)' : isDown ? 'rgba(34, 197, 94, 0.15)' : 'rgba(50, 60, 80, 0.2)'}`,
        boxShadow: isUp
          ? 'inset 0 0 20px rgba(239, 68, 68, 0.03)'
          : isDown
          ? 'inset 0 0 20px rgba(34, 197, 94, 0.03)'
          : 'none',
      }}
    >
      {/* Ghost sparkline as background */}
      {sparkData.length >= 2 && (
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="type-label" style={{ fontSize: '9px' }}>
          {name}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className={`text-[20px] font-bold font-mono text-white tabular-nums leading-none number-reveal`}>
              {formatPrice(price)}
            </span>
            {unit && <span className="text-[10px] text-gray-600 ml-1 font-mono">{unit}</span>}
          </div>
          <div className={`flex items-center gap-0.5 ${changeColor}`}>
            {changePercent === null ? (
              <Minus className="w-3 h-3" />
            ) : isUp ? (
              <TrendingUp className="w-3 h-3" />
            ) : isDown ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            <span className={`text-[11px] font-mono font-semibold tabular-nums ${glowClass}`}>
              {changePercent !== null
                ? `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`
                : '—'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-700 font-mono">24h</span>
          <span className={`font-mono tabular-nums ${changeColor}`}>
            {change24h !== null
              ? `${change24h >= 0 ? '+' : ''}${change24h.toFixed(Math.abs(change24h) > 100 ? 0 : 2)}`
              : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
