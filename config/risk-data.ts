export interface RiskCategory {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  trend: 'up' | 'down' | 'stable';
  description: string;
  impacts: string[];
}

export const riskCategories: RiskCategory[] = [
  {
    id: 'energy',
    name: 'Energy & Fuel Costs',
    level: 5,
    trend: 'up',
    description:
      'Thailand imports ~80% of crude oil — Hormuz closure directly impacts supply. Brent +35% in 72h drives diesel and LPG price spikes. LPG is the primary cooking fuel for Thai F&B operations; EGAT electricity tariffs are oil-linked and will follow within 1-2 billing cycles.',
    impacts: [
      'LPG cooking gas costs projected +20-30% within 2 weeks — hits every kitchen, factory, and QSR outlet',
      'Diesel surcharges on domestic cold chain logistics (last-mile delivery, warehouse refrigeration)',
      'EGAT Ft tariff adjustment expected next cycle — electricity costs for factories and cold storage rising',
    ],
  },
  {
    id: 'shipping',
    name: 'Shipping & Logistics',
    level: 5,
    trend: 'up',
    description:
      'Hormuz closure forces rerouting via Cape of Good Hope, adding 14-21 days to Gulf→Laem Chabang transit. Thailand\'s largest port is already seeing container backlog. Imported dairy (NZ/EU), wheat flour (Australia/Canada), and food-grade chemicals face acute delays.',
    impacts: [
      'Laem Chabang port congestion rising — container dwell times up 40% as rerouted vessels bunch',
      'Reefer container shortage for temperature-sensitive imports (dairy, frozen seafood, meat)',
      'War risk insurance premiums on Gulf-origin cargo now exceed 2% of shipment value — passed to importers',
    ],
  },
  {
    id: 'packaging',
    name: 'Packaging Materials',
    level: 4,
    trend: 'up',
    description:
      'Thailand\'s packaging industry is energy-intensive. Aluminum +18% impacts canned beverages and ready-to-eat products. PET resin (used in bottles, food trays) tracks oil prices with a 2-4 week lag. Glass furnaces are natural gas dependent.',
    impacts: [
      'Aluminum can costs rising — major impact on beverage producers (beer, RTD, energy drinks, canned coffee)',
      'PET preform prices up ~12% — affects water, juice, condiment, and sauce bottling',
      'Corrugated cardboard and kraft paper prices following energy input costs upward',
    ],
  },
  {
    id: 'raw-materials',
    name: 'Food Ingredients & Raw Materials',
    level: 4,
    trend: 'up',
    description:
      'Thailand imports 95%+ of wheat flour (Australia, Canada, US) — all shipments transit through routes affected by conflict-driven shipping disruption. Dairy ingredients (NZ, EU) face same issue. Sugar is domestically produced but global price spike (+8%) creates export pull, tightening local supply.',
    impacts: [
      'Wheat flour — Thailand\'s #1 imported food ingredient — delivery delays of 2-3 weeks expected; spot prices +15%',
      'Dairy (milk powder, whey, butter from NZ/EU) lead times extending; cold chain capacity strained',
      'Soybean oil and palm oil: domestic palm oil supply stable but prices rising in sympathy with global benchmarks',
      'Sugar: Thailand is a net exporter — global price spike incentivizes export, potentially tightening domestic availability',
    ],
  },
  {
    id: 'currency',
    name: 'Currency & FX Exposure',
    level: 4,
    trend: 'up',
    description:
      'THB weakening as capital flows to USD safe havens. BOT has limited intervention capacity without burning reserves. Most Thai F&B imports are USD-denominated — every 1 THB depreciation adds ~3% to import costs. Forward hedging costs have spiked as volatility surges.',
    impacts: [
      'USD-denominated ingredient imports (wheat, dairy, food chemicals) face double hit: commodity price + FX',
      'Forward hedging premiums up 40-60bps — locking in rates is getting expensive but not locking in is worse',
      'EUR-denominated imports (European dairy, machinery parts) somewhat shielded as EUR also weakening vs USD',
    ],
  },
  {
    id: 'consumer',
    name: 'Domestic Consumer Demand',
    level: 2,
    trend: 'stable',
    description:
      'Thai domestic F&B demand is resilient short-term — food is non-discretionary. However, tourism-linked revenue is at risk (Middle East tourist segment, general travel sentiment). Premium/imported product segments may soften as consumers trade down on price-sensitive items.',
    impacts: [
      'QSR and convenience food demand stable — Thai consumers prioritize food spending',
      'Tourism-linked F&B revenue at risk: hotels, airport retail, tourist-zone restaurants seeing Middle East cancellations',
      'Premium imported product segment (European cheese, Japanese wagyu, imported wines) may see demand softening',
      'Domestic brands with local ingredient sourcing are competitively advantaged in this environment',
    ],
  },
];

// Weighted composite: energy(5×0.25) + shipping(5×0.2) + packaging(4×0.15) + raw-materials(4×0.2) + currency(4×0.1) + consumer(2×0.1)
export const compositeRiskScore = 4.3;
export const compositeRiskLabel = 'HIGH';
