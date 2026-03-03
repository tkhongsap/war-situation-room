'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Radio } from 'lucide-react';

interface TimeZoneClockProps {
  timezone: string;
  label: string;
  primary?: boolean;
}

function TimeZoneClock({ timezone, label, primary = false }: TimeZoneClockProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="flex flex-col items-center">
      <span className="type-label" style={{ fontSize: '8px', letterSpacing: '0.2em' }}>{label}</span>
      <span
        className={`font-mono tabular-nums ${
          primary ? 'text-[15px] text-cyan-300 font-semibold' : 'text-sm text-blue-300/70'
        }`}
      >
        {time}
      </span>
    </div>
  );
}

export default function Header() {
  const [lastUpdatedFull, setLastUpdatedFull] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLastUpdatedFull(
        now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          now.toLocaleTimeString('en-US', { hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 frosted" style={{ borderBottom: '1px solid rgba(30, 55, 85, 0.3)' }}>
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.15), rgba(239, 68, 68, 0.15), transparent)' }} />

      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-red-500 pulse-red-dot"></div>
            </div>
            <div>
              <h1 className="type-display text-[18px] text-white leading-none" style={{ letterSpacing: '0.18em' }}>
                Situation Room
              </h1>
              <p className="type-label mt-0.5" style={{ fontSize: '9px', color: 'rgba(148, 163, 184, 0.5)' }}>
                Global Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Threat Level Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm glow-red-box" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="font-mono text-[10px] font-bold text-red-400 tracking-[0.2em] glow-red">CRITICAL</span>
          </div>
        </div>

        {/* Center: Clocks */}
        <div className="flex items-center gap-6">
          <TimeZoneClock timezone="Asia/Bangkok" label="Bangkok" primary />
          <div className="w-px h-8" style={{ background: 'rgba(30, 55, 85, 0.3)' }}></div>
          <TimeZoneClock timezone="UTC" label="UTC" />
          <div className="w-px h-8" style={{ background: 'rgba(30, 55, 85, 0.3)' }}></div>
          <TimeZoneClock timezone="Asia/Tehran" label="Tehran" />
          <div className="w-px h-8" style={{ background: 'rgba(30, 55, 85, 0.3)' }}></div>
          <TimeZoneClock timezone="America/New_York" label="Washington" />
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 live-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-400 font-bold live-pulse">LIVE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm" style={{ background: 'rgba(10, 15, 25, 0.6)', border: '1px solid rgba(30, 55, 85, 0.25)' }}>
            <RefreshCw className="w-3 h-3 text-gray-600" />
            <div className="flex flex-col">
              <span className="type-label" style={{ fontSize: '7px' }}>Last Updated</span>
              <span className="text-[11px] text-gray-400 font-mono tabular-nums">
                {lastUpdatedFull}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
