'use client';

import { useState, useEffect, useCallback } from 'react';

interface TickerItem {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  isStatus?: boolean;
}

interface PricePoint {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  unit: string;
  available: boolean;
  category?: string;
}

function fmtPrice(price: number | null): string {
  if (price === null) return '—';
  if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 100) return price.toFixed(2);
  if (price >= 1) return price.toFixed(3);
  return price.toFixed(4);
}

function fmtPct(pct: number | null): string | undefined {
  if (pct === null) return undefined;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
}

function buildItems(market: PricePoint[], forex: PricePoint[]): TickerItem[] {
  const find = (arr: PricePoint[], sym: string) => arr.find((d) => d.symbol === sym);

  const brent = find(market, 'BZ=F');
  const wti = find(market, 'CL=F');
  const gold = find(market, 'GC=F');
  const gas = find(market, 'NG=F');
  const aluminum = find(market, 'ALI=F');
  const wheat = find(market, 'ZW=F');
  const copper = find(market, 'HG=F');

  const thb = find(forex, 'THBUSD=X');
  const eur = find(forex, 'EURUSD=X');
  const jpy = find(forex, 'JPYUSD=X');
  const sp500 = find(forex, '^GSPC');
  const nikkei = find(forex, '^N225');
  const set = find(forex, '^SET.BK');

  const makeItem = (label: string, d: PricePoint | undefined, prefix = ''): TickerItem => {
    if (!d) return { label, value: '—' };
    const val = d.price !== null ? `${prefix}${fmtPrice(d.price)}` : '—';
    const chg = fmtPct(d.changePercent);
    return {
      label,
      value: val,
      change: chg,
      changePositive: d.changePercent !== null ? d.changePercent < 0 : undefined,
    };
  };

  return [
    makeItem('BRENT CRUDE', brent, '$'),
    makeItem('WTI CRUDE', wti, '$'),
    makeItem('GOLD', gold, '$'),
    makeItem('NATURAL GAS', gas, '$'),
    makeItem('S&P 500', sp500),
    makeItem('NIKKEI 225', nikkei),
    makeItem('SET INDEX', set),
    makeItem('THB/USD', thb),
    makeItem('EUR/USD', eur),
    makeItem('JPY/USD', jpy),
    makeItem('ALUMINUM', aluminum, '$'),
    makeItem('WHEAT', wheat),
    makeItem('COPPER', copper, '$'),
    { label: 'HORMUZ STATUS', value: 'CLOSED', change: 'WAR RISK', changePositive: false, isStatus: true },
    { label: 'THREAT LEVEL', value: 'CRITICAL', change: 'DEFCON 3', changePositive: false, isStatus: true },
  ];
}

export default function TickerBar() {
  const [items, setItems] = useState<TickerItem[]>([
    { label: 'LOADING', value: '...' },
  ]);

  const fetchData = useCallback(async () => {
    try {
      const [mktRes, fxRes] = await Promise.all([
        fetch('/api/market-data'),
        fetch('/api/forex'),
      ]);
      const mkt = mktRes.ok ? await mktRes.json() : { data: [] };
      const fx = fxRes.ok ? await fxRes.json() : { data: [] };
      const built = buildItems(mkt.data ?? [], fx.data ?? []);
      if (built.length > 0) setItems(built);
    } catch {
      // Keep current items on error
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const tickerContent = [...items, ...items]; // doubled for seamless loop

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-8 frosted overflow-hidden flex items-center" style={{ borderTop: '1px solid rgba(30, 55, 85, 0.2)' }}>
      {/* LIVE badge */}
      <div className="flex-shrink-0 px-4 h-full flex items-center gap-2" style={{ borderRight: '1px solid rgba(30, 55, 85, 0.2)' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-red-dot" />
        <span className="font-mono text-[10px] font-bold text-red-400 tracking-[0.2em] glow-red">LIVE</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="ticker-animate flex items-center gap-7 whitespace-nowrap">
          {tickerContent.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="type-label" style={{ fontSize: '9px', letterSpacing: '0.12em' }}>{item.label}</span>
              <span
                className={`font-mono text-[12px] font-semibold tabular-nums ${
                  item.isStatus ? 'text-red-400 glow-red' : 'text-gray-100'
                }`}
              >
                {item.value}
              </span>
              {item.change && (
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    item.changePositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {item.change}
                </span>
              )}
              <span style={{ color: 'rgba(30, 55, 85, 0.4)' }}>·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
