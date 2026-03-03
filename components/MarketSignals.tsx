'use client';

import { useState, useEffect, useCallback } from 'react';
import PriceCard from './PriceCard';
import { Activity, RefreshCw } from 'lucide-react';

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
      <h3 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-[0.15em]">{title}</h3>
      <div className="flex-1 h-px bg-[#1a2a3a]"></div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-sm border border-[#1a2a3a] bg-[#0d1117] p-3 animate-pulse">
      <div className="h-3 bg-gray-800 rounded w-16 mb-2"></div>
      <div className="h-5 bg-gray-800 rounded w-24 mb-3"></div>
      <div className="h-10 bg-gray-800 rounded"></div>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-mono font-bold text-gray-300 uppercase tracking-[0.15em]">Market Signals</h2>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-600">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>UPDATED {lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Energy */}
      <div>
        <SectionHeader title="Energy" />
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

      {/* Commodities */}
      <div>
        <SectionHeader title="Commodities" />
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

      {/* Currencies + Indices in 2 columns */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <SectionHeader title="Currencies" />
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              <>{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</>
            ) : (
              currencies.map(item => (
                <div key={item.symbol} className="fade-in">
                  <PriceCard {...item} decimals={4} />
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <SectionHeader title="Market Indices" />
          <div className="grid grid-cols-3 gap-3">
            {loading ? (
              <>{[1,2,3].map(i => <SkeletonCard key={i} />)}</>
            ) : (
              indices.map(item => (
                <div key={item.symbol} className="fade-in">
                  <PriceCard {...item} decimals={0} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
