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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="px-4 pt-4 pb-16 max-w-[1920px] mx-auto space-y-4">
        {/* Executive Summary — full width, above everything */}
        <div className="section-fade-1">
          <ExecutiveSummary />
        </div>

        {/* Row 1: Situation Brief + Theater Map */}
        <div className="section-fade-2 grid grid-cols-[5fr_7fr] gap-4 h-[380px]">
          <SituationBrief />
          <ConflictMap />
        </div>

        {/* Row 2: Market Signals — full width */}
        <div className="section-fade-3 bg-[#07090f] border border-[#1a2a3a] rounded-sm p-4 pb-5">
          <MarketSignals />
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
