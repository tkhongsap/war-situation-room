'use client';

import { useState, useEffect, useCallback } from 'react';
import { Newspaper, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  category: 'Military' | 'Economic' | 'Shipping' | 'Diplomatic' | 'Sanctions';
  url?: string;
}

const categoryConfig: Record<NewsItem['category'], { color: string; bg: string; border: string }> = {
  Military:   { color: 'text-red-400',    bg: 'bg-red-500/8',     border: 'border-red-500/20' },
  Shipping:   { color: 'text-cyan-400',   bg: 'bg-cyan-500/8',    border: 'border-cyan-500/20' },
  Diplomatic: { color: 'text-yellow-400', bg: 'bg-yellow-500/8',  border: 'border-yellow-500/20' },
  Sanctions:  { color: 'text-orange-400', bg: 'bg-orange-500/8',  border: 'border-orange-500/20' },
  Economic:   { color: 'text-blue-400',   bg: 'bg-blue-500/8',    border: 'border-blue-500/20' },
};

type FilterCategory = 'All' | NewsItem['category'];
const FILTERS: FilterCategory[] = ['All', 'Military', 'Shipping', 'Diplomatic', 'Sanctions', 'Economic'];

function formatUtcTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }) + ' UTC';
  } catch {
    return '';
  }
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const json = await res.json();
        setNews(json.data ?? []);
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
      }
    } catch {
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300_000); // 5 min
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered = filter === 'All' ? news : news.filter((n) => n.category === filter);

  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <div className="panel-header px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
          <h2 className="type-display text-[11px] text-gray-300">
            Live Intel Feed
          </h2>
          <span className="type-label ml-1" style={{ fontSize: '9px' }}>— Last 48 Hours</span>
          {/* Pulsing green dot */}
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green-dot" />
            <span className="font-mono text-[9px] text-emerald-400 tracking-[0.2em] font-bold live-pulse">LIVE</span>
          </div>
          <span className="type-label ml-1" style={{ fontSize: '9px', color: 'rgba(100, 116, 139, 0.4)' }}>
            Al Jazeera · BBC · NYT
          </span>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Updated <span className="tabular-nums">{lastUpdated}</span></span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="px-5 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.25)' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-[10px] px-2.5 py-1 rounded-sm border tracking-[0.1em] uppercase transition-all duration-200 ${
              filter === f
                ? 'bg-cyan-500/12 border-cyan-500/30 text-cyan-300 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#0c1018]'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-gray-700 tabular-nums">
          {filtered.length} items
        </span>
      </div>

      {/* Feed */}
      <div className="max-h-[280px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="font-mono text-[11px] text-gray-600 tracking-wider">Fetching intel feeds...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-[12px] text-gray-600">
              {news.length === 0
                ? 'Data unavailable — RSS feeds offline'
                : 'No items match selected filter'}
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((item, idx) => {
              const cat = categoryConfig[item.category];
              return (
                <div
                  key={item.id}
                  className="px-5 py-3.5 hover:bg-[#0c1018] transition-colors flex items-start gap-3 fade-in"
                  style={{
                    animationDelay: `${idx * 0.03}s`,
                    borderBottom: '1px solid rgba(12, 21, 32, 0.6)',
                  }}
                >
                  {/* Category pill */}
                  <span
                    className={`flex-shrink-0 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-sm border ${cat.bg} ${cat.border} ${cat.color} tracking-[0.12em] uppercase mt-0.5 whitespace-nowrap`}
                  >
                    {item.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-gray-200 leading-snug hover:text-white transition-colors block type-body"
                      >
                        {item.headline}
                      </a>
                    ) : (
                      <p className="text-[13px] text-gray-200 leading-snug type-body">
                        {item.headline}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {/* Source badge */}
                      <span className="font-mono text-[8px] font-medium text-gray-600 px-1.5 py-0.5 rounded-sm tracking-wider" style={{ background: 'rgba(20, 29, 40, 0.6)', border: '1px solid rgba(30, 55, 85, 0.2)' }}>
                        {item.source}
                      </span>
                      <span className="font-mono text-[9px] text-gray-700 tabular-nums">
                        {formatUtcTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
