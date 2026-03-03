'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Radio } from 'lucide-react';

interface TimeZoneClockProps {
  timezone: string;
  label: string;
}

function TimeZoneClock({ timezone, label }: TimeZoneClockProps) {
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
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{label}</span>
      <span className="text-sm font-mono text-blue-300 tabular-nums">{time}</span>
    </div>
  );
}

export default function Header() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const update = () => setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
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
              <h1 className="text-xl font-bold tracking-[0.15em] text-white uppercase font-mono leading-none">
                Situation Room
              </h1>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-mono">
                Global Intelligence Dashboard
              </p>
            </div>
          </div>

          {/* Threat Level Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-red-500/40 bg-red-500/10">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs font-mono font-bold text-red-400 tracking-widest">CRITICAL</span>
          </div>
        </div>

        {/* Center: Clocks */}
        <div className="flex items-center gap-6">
          <TimeZoneClock timezone="Asia/Bangkok" label="Bangkok" />
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
            <span className="text-[10px] font-mono tracking-widest text-green-500">LIVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-mono text-gray-500">
              UPDATED {lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
