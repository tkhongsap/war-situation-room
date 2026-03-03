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
      <span className="text-[9px] text-gray-500 uppercase tracking-widest">{label}</span>
      <span
        className={`font-mono tabular-nums ${
          primary ? 'text-[15px] text-blue-200 font-semibold' : 'text-sm text-blue-300'
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
    <header className="sticky top-0 z-50 border-b border-[#1a2a3a] bg-[#07090f]/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-[0.14em] text-white uppercase leading-none">
                Situation Room
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.14em] uppercase">
                Global Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Threat Level Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-red-500/20 border border-red-500/60">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs font-bold text-red-300 tracking-widest">CRITICAL</span>
          </div>
        </div>

        {/* Center: Clocks */}
        <div className="flex items-center gap-6">
          <TimeZoneClock timezone="Asia/Bangkok" label="Bangkok" primary />
          <div className="w-px h-8 bg-gray-800"></div>
          <TimeZoneClock timezone="UTC" label="UTC" />
          <div className="w-px h-8 bg-gray-800"></div>
          <TimeZoneClock timezone="Asia/Tehran" label="Tehran" />
          <div className="w-px h-8 bg-gray-800"></div>
          <TimeZoneClock timezone="America/New_York" label="Washington" />
        </div>

        {/* Right: Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-green-500">
            <Radio className="w-3 h-3 blink" />
            <span className="text-[10px] tracking-widest text-green-500 font-medium">LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0d1117] border border-[#1a2a3a]">
            <RefreshCw className="w-3 h-3 text-gray-500" />
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-600 uppercase tracking-widest">Last Updated</span>
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
