'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface StaleDataBannerProps {
  generatedAt: string;
  onRefresh?: () => void;
}

export default function StaleDataBanner({ generatedAt, onRefresh }: StaleDataBannerProps) {
  const date = new Date(generatedAt);
  const ago = getTimeAgo(date);

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-sm"
      style={{
        background: 'rgba(245, 158, 11, 0.06)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
      }}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
      <p className="text-[11px] text-amber-400/80 font-mono flex-1">
        Using cached analysis from {ago} — refresh in progress
      </p>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono font-medium text-amber-400 hover:text-amber-300 transition-colors"
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
