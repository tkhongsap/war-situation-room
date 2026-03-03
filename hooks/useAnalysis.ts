'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { AnalysisResponse } from '@/types/analysis';

const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

interface UseAnalysisResult {
  data: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
  stale: boolean;
  refresh: () => Promise<void>;
}

export function useAnalysis(): UseAnalysisResult {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnalysis = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const res = await fetch('/api/analysis');
      if (!res.ok) {
        throw new Error(`Analysis API returned ${res.status}`);
      }

      const result: AnalysisResponse = await res.json();
      setData(result);
      setStale(result.meta?.stale === true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
      // Keep existing data on refresh failure
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/analysis?refresh=true', { method: 'POST' });
      if (!res.ok) throw new Error(`Refresh returned ${res.status}`);
      const result: AnalysisResponse = await res.json();
      setData(result);
      setStale(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh analysis');
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
    intervalRef.current = setInterval(() => fetchAnalysis(true), REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAnalysis]);

  return { data, loading, error, stale, refresh };
}
