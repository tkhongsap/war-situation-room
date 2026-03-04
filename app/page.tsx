'use client';

import { AnalysisProvider } from '@/contexts/AnalysisContext';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import Header from '@/components/Header';
import ExecutiveSummary from '@/components/ExecutiveSummary';
import SituationBrief from '@/components/SituationBrief';
import ConflictMap from '@/components/ConflictMap';
import MarketSignals from '@/components/MarketSignals';
import SupplyChainRisk from '@/components/SupplyChainRisk';
import ScenarioAnalysis from '@/components/ScenarioAnalysis';
import NewsFeed from '@/components/NewsFeed';
import StrategicActions from '@/components/StrategicActions';
import TickerBar from '@/components/TickerBar';
import StaleDataBanner from '@/components/StaleDataBanner';

function DashboardContent() {
  const { stale, data, error, refresh } = useAnalysisContext();

  return (
    <div className="min-h-screen relative" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0c1018 0%, #060810 40%, #04060a 100%)' }}>
      <Header />

      <main className="px-4 pt-4 pb-16 max-w-[1920px] mx-auto space-y-4">
        {/* Stale data warning */}
        {stale && data?.meta?.generatedAt && (
          <StaleDataBanner generatedAt={data.meta.generatedAt} onRefresh={refresh} />
        )}

        {/* Error banner */}
        {error && !data && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-sm" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p className="text-[11px] text-red-400/80 font-mono flex-1">
              Analysis unavailable: {error}. Showing fallback data.
            </p>
          </div>
        )}

        {/* Executive Summary — full width, hero section */}
        <div className="section-fade-1">
          <ExecutiveSummary />
        </div>

        {/* Row 1: Situation Brief + Theater Map */}
        <div className="section-fade-2 grid grid-cols-[5fr_7fr] gap-4 h-[380px]">
          <SituationBrief />
          <ConflictMap />
        </div>

        {/* Row 2: Market Signals — full width */}
        <div className="section-fade-3">
          <div className="panel p-4 pb-5">
            <MarketSignals />
          </div>
        </div>

        {/* Row 3: Supply Chain Risk + Scenario Analysis */}
        <div className="section-fade-4 grid grid-cols-[5fr_7fr] gap-4 h-[340px]">
          <SupplyChainRisk />
          <ScenarioAnalysis />
        </div>

        {/* Row 4: Strategic Actions — full width */}
        <div className="section-fade-5">
          <StrategicActions />
        </div>

        {/* Row 5: Intel Feed */}
        <div className="section-fade-6">
          <NewsFeed />
        </div>
      </main>

      <TickerBar />
    </div>
  );
}

export default function Home() {
  return (
    <AnalysisProvider>
      <DashboardContent />
    </AnalysisProvider>
  );
}
