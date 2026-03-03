'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useAnalysis } from '@/hooks/useAnalysis';
import type { AnalysisResponse } from '@/types/analysis';

interface AnalysisContextValue {
  data: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
  stale: boolean;
  refresh: () => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextValue | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const analysis = useAnalysis();

  return (
    <AnalysisContext.Provider value={analysis}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext(): AnalysisContextValue {
  const ctx = useContext(AnalysisContext);
  if (!ctx) {
    throw new Error('useAnalysisContext must be used within AnalysisProvider');
  }
  return ctx;
}
