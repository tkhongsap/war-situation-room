import Header from '@/components/Header';
import SituationBrief from '@/components/SituationBrief';
import ConflictMap from '@/components/ConflictMap';
import MarketSignals from '@/components/MarketSignals';
import SupplyChainRisk from '@/components/SupplyChainRisk';
import ScenarioAnalysis from '@/components/ScenarioAnalysis';
import NewsFeed from '@/components/NewsFeed';
import TickerBar from '@/components/TickerBar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="px-4 pt-4 pb-12 max-w-[1920px] mx-auto space-y-4">
        {/* Row 1: Situation Brief + Theater Map */}
        <div className="grid grid-cols-[5fr_7fr] gap-4 h-[380px]">
          <SituationBrief />
          <ConflictMap />
        </div>

        {/* Row 2: Market Signals — full width */}
        <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm p-4 pb-5">
          <MarketSignals />
        </div>

        {/* Row 3: Supply Chain Risk + Scenario Analysis */}
        <div className="grid grid-cols-[5fr_7fr] gap-4 h-[340px]">
          <SupplyChainRisk />
          <ScenarioAnalysis />
        </div>

        {/* Row 4: Intel Feed */}
        <NewsFeed />
      </main>

      <TickerBar />
    </div>
  );
}
