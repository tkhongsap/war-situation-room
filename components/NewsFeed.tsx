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
  Military:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  Shipping:   { color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30' },
  Diplomatic: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  Sanctions:  { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  Economic:   { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30' },
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
    <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#1a2a3a] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Newspaper className="w-3.5 h-3.5 text-blue-400" />
          <h2 className="text-[11px] font-semibold text-gray-300 uppercase tracking-[0.15em]">
            Live Intel Feed
          </h2>
          {/* Pulsing green dot */}
          <div className="flex items-center gap-1.5 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-green-dot" />
            <span className="text-[9px] text-green-500 tracking-widest font-medium uppercase">Live</span>
          </div>
          <span className="text-[10px] text-gray-700 ml-1">
            Al Jazeera · BBC · NYT
          </span>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Updated <span className="font-mono">{lastUpdated}</span></span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="border-b border-[#1a2a3a] px-4 py-2 flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] px-2.5 py-1 rounded border tracking-wide uppercase transition-colors ${
              filter === f
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-semibold'
                : 'border-[#1a2a3a] text-gray-500 hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-gray-700 tabular-nums font-mono">
          {filtered.length} items
        </span>
      </div>

      {/* Feed */}
      <div className="max-h-[280px] overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">
            <div className="w-5 h-5 border-2 border-blue-500/40 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-[11px] text-gray-600">Fetching intel feeds...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-[12px] text-gray-600">
              {news.length === 0
                ? 'Data unavailable — RSS feeds offline'
                : 'No items match selected filter'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#0f1825]">
            {filtered.map((item) => {
              const cat = categoryConfig[item.category];
              return (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-[#0d1117] transition-colors flex items-start gap-3"
                >
                  {/* Category pill */}
                  <span
                    className={`flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded border ${cat.bg} ${cat.border} ${cat.color} tracking-widest uppercase mt-0.5 whitespace-nowrap`}
                  >
                    {item.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-gray-200 leading-snug hover:text-white transition-colors block"
                      >
                        {item.headline}
                      </a>
                    ) : (
                      <p className="text-[13px] text-gray-200 leading-snug">
                        {item.headline}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      {/* Source badge */}
                      <span className="text-[9px] font-medium bg-[#1a2a3a] text-gray-500 px-1.5 py-0.5 rounded">
                        {item.source}
                      </span>
                      <span className="text-[9px] font-mono text-gray-700">
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
