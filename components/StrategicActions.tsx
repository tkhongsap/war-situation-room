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
  CRITICAL: { border: 'border-l-red-500', badge: 'bg-red-500/15 text-red-400 border-red-500/30' },
  HIGH: { border: 'border-l-orange-500', badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  MODERATE: { border: 'border-l-yellow-500', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
} as const;

const phases: ActionPhase[] = [
  {
    title: 'Immediate Actions',
    timeframe: '24–48 Hours',
    icon: <Shield className="w-3.5 h-3.5 text-red-400" />,
    actions: [
      {
        action: 'Lock in current fuel and LPG supply contracts at existing rates',
        priority: 'CRITICAL',
        rationale: 'Energy prices moving +5-8% daily — every hour of delay increases exposure',
      },
      {
        action: 'Review and exercise all open import hedging positions on USD-denominated inputs',
        priority: 'CRITICAL',
        rationale: 'THB weakening against USD; unhedged imports face immediate cost inflation',
      },
      {
        action: 'Accelerate inventory of imported ingredients with Gulf or Middle East origin',
        priority: 'CRITICAL',
        rationale: 'Shipping disruption via Hormuz adds 14-21 days to transit — stockpile before gap hits',
      },
      {
        action: 'Activate alternate supplier contacts for Gulf-sourced raw materials',
        priority: 'HIGH',
        rationale: 'Diversify supply origin to reduce single-route dependency exposure',
      },
      {
        action: 'Issue internal memo to procurement: freeze all non-essential purchase orders',
        priority: 'HIGH',
        rationale: 'Preserve cash and negotiating position until market stabilizes',
      },
    ],
  },
  {
    title: 'Short-Term Response',
    timeframe: '1–2 Weeks',
    icon: <Clock className="w-3.5 h-3.5 text-orange-400" />,
    actions: [
      {
        action: 'Review menu and product pricing strategy — model pass-through scenarios',
        priority: 'HIGH',
        rationale: 'Input costs rising 8-15%; delayed pricing response compresses margins',
      },
      {
        action: 'Shift to domestic ingredient alternatives where quality parity exists',
        priority: 'HIGH',
        rationale: 'Domestic supply chains unaffected by Gulf shipping disruption',
      },
      {
        action: 'Renegotiate freight contracts with logistics providers — lock 30-60 day rates',
        priority: 'HIGH',
        rationale: 'Freight rates volatile and trending up; early movers secure better terms',
      },
      {
        action: 'Diversify packaging supplier base — source quotes from ASEAN manufacturers',
        priority: 'MODERATE',
        rationale: 'Aluminum and PET resin costs rising on energy pass-through',
      },
      {
        action: 'Engage FX desk to extend USD hedging coverage to 90-day forward positions',
        priority: 'HIGH',
        rationale: 'Currency volatility expected to persist — lock in rates before further deterioration',
      },
    ],
  },
  {
    title: 'Medium-Term Strategy',
    timeframe: '1–3 Months',
    icon: <Calendar className="w-3.5 h-3.5 text-yellow-400" />,
    actions: [
      {
        action: 'Build strategic commodity reserves — target 45-60 day buffer on critical inputs',
        priority: 'HIGH',
        rationale: 'Protects operations against extended shipping disruption scenario',
      },
      {
        action: 'Develop ASEAN-sourced supply chain alternatives for all Gulf-dependent inputs',
        priority: 'HIGH',
        rationale: 'Structural de-risking reduces exposure to Middle East transit disruption',
      },
      {
        action: 'Implement dynamic pricing mechanisms linked to input cost indices',
        priority: 'MODERATE',
        rationale: 'Enables faster price response in volatile commodity environment',
      },
      {
        action: 'Stress-test cash flow under 90-day escalation scenario (oil at $140+, THB at 38+)',
        priority: 'HIGH',
        rationale: 'Board-level visibility into worst-case financial impact',
      },
      {
        action: 'Evaluate cold storage and warehouse capacity expansion for inventory buffering',
        priority: 'MODERATE',
        rationale: 'Longer supply chains require deeper inventory positions',
      },
    ],
  },
];

export default function StrategicActions() {
  return (
    <div className="bg-[#07090f] border border-[#1a2a3a] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#1a2a3a] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Target className="w-3.5 h-3.5 text-orange-400" />
          <h2 className="text-[12px] font-semibold text-gray-300 uppercase tracking-[0.13em]">
            Strategic Actions — F&B Operations (Thailand)
          </h2>
        </div>
        <span className="text-[9px] text-gray-600 uppercase tracking-widest">
          Action Briefing • White-Label
        </span>
      </div>

      {/* Three phases in columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#1a2a3a]">
        {phases.map((phase) => (
          <div key={phase.title} className="p-4 space-y-3">
            {/* Phase header */}
            <div className="flex items-center gap-2 mb-3">
              {phase.icon}
              <div>
                <h3 className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                  {phase.title}
                </h3>
                <span className="text-[9px] text-gray-600 tracking-wide">{phase.timeframe}</span>
              </div>
            </div>

            {/* Action items */}
            <div className="space-y-2">
              {phase.actions.map((item, i) => {
                const pConfig = priorityConfig[item.priority];
                return (
                  <div
                    key={i}
                    className={`border-l-2 ${pConfig.border} bg-[#0a0e16] rounded-r-sm px-3 py-2.5`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span
                        className={`flex-shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded border tracking-widest ${pConfig.badge}`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-200 leading-relaxed mb-1">
                      {item.action}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
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
