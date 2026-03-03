import { Shield, Clock, Calendar, Target } from 'lucide-react';

interface ActionItem {
  action: string;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
  rationale: string;
}

interface ActionPhase {
  title: string;
  timeframe: string;
  icon: React.ReactNode;
  actions: ActionItem[];
}

const priorityConfig = {
  CRITICAL: { accentClass: 'accent-border-critical', badge: 'bg-red-500/12 text-red-400 border-red-500/25', glow: 'glow-red' },
  HIGH: { accentClass: 'accent-border-high', badge: 'bg-orange-500/12 text-orange-400 border-orange-500/25', glow: 'glow-amber' },
  MODERATE: { accentClass: 'accent-border-moderate', badge: 'bg-yellow-500/12 text-yellow-400 border-yellow-500/25', glow: '' },
} as const;

const phases: ActionPhase[] = [
  {
    title: 'Immediate Actions',
    timeframe: '24–48 Hours',
    icon: <Shield className="w-3.5 h-3.5 text-red-400" />,
    actions: [
      {
        action: 'Lock in LPG cooking gas contracts at current PTT/EGAT rates before next price adjustment',
        priority: 'CRITICAL',
        rationale: 'LPG is the backbone of Thai F&B — every kitchen, factory, QSR outlet. Price resets are imminent; every day of delay costs 5-8% more',
      },
      {
        action: 'Exercise all open USD forward hedges and extend coverage on wheat flour, dairy, and soybean oil imports',
        priority: 'CRITICAL',
        rationale: 'THB depreciating against USD; unhedged importers face commodity price spike + FX hit simultaneously',
      },
      {
        action: 'Emergency purchase order: accelerate 60-day inventory of imported wheat flour (AU/CA/US) and dairy powder (NZ)',
        priority: 'CRITICAL',
        rationale: 'Laem Chabang-bound shipments face 2-3 week delays from Hormuz rerouting — buy now before the gap hits shelves',
      },
      {
        action: 'Contact domestic palm oil and sugar suppliers — secure forward contracts before export pull tightens local supply',
        priority: 'HIGH',
        rationale: 'Thailand is a net sugar exporter; global price spike (+8%) incentivizes exporters, squeezing domestic availability',
      },
      {
        action: 'Procurement freeze on all non-essential capex and imported equipment — preserve cash for critical inputs',
        priority: 'HIGH',
        rationale: 'Cash conservation is survival mode; redirect budget to ingredient and energy security',
      },
    ],
  },
  {
    title: 'Short-Term Response',
    timeframe: '1–2 Weeks',
    icon: <Clock className="w-3.5 h-3.5 text-orange-400" />,
    actions: [
      {
        action: 'Model menu/product price adjustments: 5%, 10%, 15% pass-through scenarios across all SKUs',
        priority: 'HIGH',
        rationale: 'Input costs rising 8-15% — delayed pricing response compresses margins; Thai consumers accept gradual increases better than sudden jumps',
      },
      {
        action: 'Substitute imported wheat flour with Thai rice flour or tapioca starch where product quality allows',
        priority: 'HIGH',
        rationale: 'Thailand has abundant domestic rice and cassava — zero import dependency, stable pricing, shorter supply chain',
      },
      {
        action: 'Negotiate 60-day rate locks with freight forwarders at Laem Chabang and Bangkok Port',
        priority: 'HIGH',
        rationale: 'Container rates volatile and trending up 80-150% on rerouted lanes; early movers get better terms before peak congestion',
      },
      {
        action: 'Source packaging quotes from Vietnam, Indonesia, and Malaysian manufacturers as backup',
        priority: 'MODERATE',
        rationale: 'ASEAN Free Trade Area (AFTA) = 0% tariff on packaging materials; diversifies away from energy-cost-impacted Thai suppliers',
      },
      {
        action: 'Engage bank FX desk: extend USD hedge to 90-day forwards; evaluate THB put options for downside protection',
        priority: 'HIGH',
        rationale: 'BOT intervention capacity is limited — THB could weaken further; forward premiums are rising but still cheaper than spot exposure',
      },
    ],
  },
  {
    title: 'Medium-Term Strategy',
    timeframe: '1–3 Months',
    icon: <Calendar className="w-3.5 h-3.5 text-yellow-400" />,
    actions: [
      {
        action: 'Build strategic inventory buffer: 45-60 days of wheat flour, dairy, and soybean oil in bonded warehouse',
        priority: 'HIGH',
        rationale: 'If Hormuz stays closed 2+ months, current 30-day inventory cycles will break — deeper buffer is insurance',
      },
      {
        action: 'Develop dual-source supply chains: Indian wheat flour, Philippine coconut oil, Indonesian palm oil as permanent alternatives',
        priority: 'HIGH',
        rationale: 'ASEAN + India sourcing avoids Gulf transit entirely; RCEP/AFTA tariff benefits make it cost-competitive even post-crisis',
      },
      {
        action: 'Implement dynamic pricing engine tied to BOT exchange rate and TFEX commodity indices',
        priority: 'MODERATE',
        rationale: 'Automates price response to input cost volatility — reduces margin lag from quarterly price reviews to weekly',
      },
      {
        action: 'Board-level stress test: model 90-day cash flow under Brent $140+, THB 38+/USD, wheat +30%',
        priority: 'HIGH',
        rationale: 'C-suite needs worst-case visibility; stress test drives decisions on credit facility activation and dividend deferrals',
      },
      {
        action: 'Evaluate cold chain capacity expansion: additional cold storage at Laem Chabang FTZ or EEC industrial zones',
        priority: 'MODERATE',
        rationale: 'Longer supply chains + deeper inventory = more cold storage needed; EEC zones offer BOI tax incentives for logistics investment',
      },
    ],
  },
];

export default function StrategicActions() {
  return (
    <div className="panel overflow-hidden">
      {/* Header */}
      <div className="panel-header px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Target className="w-3.5 h-3.5 text-orange-400" />
          <h2 className="type-display text-[11px] text-gray-300">
            Strategic Actions — F&B Operations (Thailand)
          </h2>
        </div>
        <span className="type-label" style={{ fontSize: '8px' }}>
          Action Briefing • White-Label
        </span>
      </div>

      {/* Three phases in columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ borderTop: 'none' }}>
        {phases.map((phase, phaseIdx) => (
          <div
            key={phase.title}
            className="p-4 space-y-3"
            style={{ borderLeft: phaseIdx > 0 ? '1px solid rgba(30, 55, 85, 0.25)' : 'none' }}
          >
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-3">
              {phase.icon}
              <div>
                <h3 className="type-display text-[10px] text-gray-300">
                  {phase.title}
                </h3>
                <span className="type-label mt-0.5" style={{ fontSize: '8px' }}>{phase.timeframe}</span>
              </div>
            </div>

            {/* Action items */}
            <div className="space-y-2.5">
              {phase.actions.map((item, i) => {
                const pConfig = priorityConfig[item.priority];
                return (
                  <div
                    key={i}
                    className={`${pConfig.accentClass} rounded-r-sm px-3 py-2.5`}
                    style={{ background: 'rgba(10, 14, 22, 0.5)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {/* Number badge */}
                      <span className="font-mono text-[10px] font-bold text-gray-600 tabular-nums w-4 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`flex-shrink-0 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded-sm border tracking-[0.15em] ${pConfig.badge}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-200 leading-relaxed mb-1 type-body">
                      {item.action}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic type-body">
                      {item.rationale}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
