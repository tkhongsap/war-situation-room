'use client';

import { useState, useEffect, useCallback } from 'react';
import PriceCard from './PriceCard';
import { Activity, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceDataPoint {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent: number;
  unit: string;
  sparkline: number[];
  category?: string;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h3 className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">{title}</h3>
      <div className="flex-1 h-px bg-[#1a2a3a]"></div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-sm border border-[#1a2a3a] bg-[#0d1117] p-3 animate-pulse">
      <div className="h-3 bg-gray-800 rounded w-16 mb-2"></div>
      <div className="h-5 bg-gray-800 rounded w-24 mb-3"></div>
      <div className="h-6 bg-gray-800 rounded"></div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#0f1825] animate-pulse">
      <div className="h-3 bg-gray-800 rounded w-20"></div>
      <div className="h-4 bg-gray-800 rounded w-16"></div>
      <div className="h-3 bg-gray-800 rounded w-12"></div>
    </div>
  );
}

function fmtCompact(p: number, decimals: number) {
  if (p >= 10000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p >= 100) return p.toFixed(2);
  if (p >= 1) return p.toFixed(3);
  return p.toFixed(decimals);
}

function CompactPriceRow({ item, decimals = 2 }: { item: PriceDataPoint; decimals?: number }) {
  const isUp = item.changePercent > 0;
  const isDown = item.changePercent < 0;
  const changeColor = isUp ? 'text-red-400' : isDown ? 'text-green-400' : 'text-gray-500';

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#0f1825] last:border-0 hover:bg-[#0d1117] transition-colors group">
      <span className="text-[11px] text-gray-400 min-w-[90px]">{item.name}</span>
      <span className="text-[14px] font-bold font-mono tabular-nums text-white">
        {fmtCompact(item.price, decimals)}
        {item.unit && <span className="text-[9px] text-gray-600 ml-0.5">{item.unit}</span>}
      </span>
      <div className={`flex items-center gap-0.5 ${changeColor} min-w-[64px] justify-end`}>
        {isUp ? (
          <TrendingUp className="w-3 h-3 flex-shrink-0" />
        ) : isDown ? (
          <TrendingDown className="w-3 h-3 flex-shrink-0" />
        ) : (
          <Minus className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="text-[11px] font-mono font-semibold tabular-nums">
          {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

export default function MarketSignals() {
  const [marketData, setMarketData] = useState<PriceDataPoint[]>([]);
  const [forexData, setForexData] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [mktRes, fxRes] = await Promise.all([
        fetch('/api/market-data'),
        fetch('/api/forex'),
      ]);
      if (mktRes.ok) {
        const mkt = await mktRes.json();
        setMarketData(mkt.data);
      }
      if (fxRes.ok) {
        const fx = await fxRes.json();
        setForexData(fx.data);
      }
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
    } catch { /* use existing data */ }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const energy = marketData.filter(d => ['BZ=F', 'CL=F', 'NG=F'].includes(d.symbol));
  const commodities = marketData.filter(d => !['BZ=F', 'CL=F', 'NG=F'].includes(d.symbol));
  const currencies = forexData.filter(d => d.category === 'currency');
  const indices = forexData.filter(d => d.category === 'index');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-[13px] font-semibold text-gray-300 uppercase tracking-[0.15em]">Market Signals</h2>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Updated <span className="font-mono">{lastUpdated}</span></span>
          </div>
        )}
      </div>

      {/* Energy — large cards, 3 columns */}
      <div>
        <SectionHeader title="Energy — 7-Day Price Action" />
        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            <>{[1,2,3].map(i => <SkeletonCard key={i} />)}</>
          ) : (
            energy.map(item => (
              <div key={item.symbol} className="fade-in">
                <PriceCard {...item} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Commodities — 6 columns */}
      <div>
        <SectionHeader title="Commodities — 7-Day Price Action" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {loading ? (
            <>{[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}</>
          ) : (
            commodities.map(item => (
              <div key={item.symbol} className="fade-in">
                <PriceCard {...item} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Currencies + Indices — compact table rows */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <SectionHeader title="Currencies — 10-Day Trend" />
          <div className="rounded-sm border border-[#1a2a3a] bg-[#0d1117] px-3 py-1">
            {loading ? (
              <>{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</>
            ) : currencies.length === 0 ? (
              <p className="text-[11px] text-gray-600 py-3 text-center">Data unavailable</p>
            ) : (
              currencies.map(item => (
                <div key={item.symbol} className="fade-in">
                  <CompactPriceRow item={item} decimals={4} />
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <SectionHeader title="Market Indices" />
          <div className="rounded-sm border border-[#1a2a3a] bg-[#0d1117] px-3 py-1">
            {loading ? (
              <>{[1,2,3].map(i => <SkeletonRow key={i} />)}</>
            ) : indices.length === 0 ? (
              <p className="text-[11px] text-gray-600 py-3 text-center">Data unavailable</p>
            ) : (
              indices.map(item => (
                <div key={item.symbol} className="fade-in">
                  <CompactPriceRow item={item} decimals={0} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
