# Situation Room — Global Intelligence Dashboard

Real-time geopolitical intelligence dashboard. Monitors active conflict theaters, market signals, supply chain risk, and breaking news — all from live data sources. Designed for 1920×1080 war-room displays.

## Panels

| Panel | Description |
|---|---|
| **Situation Brief** | Current threat level, operation status, and key tactical statistics |
| **Theater Map** | Leaflet map of the Middle East/Persian Gulf — strike targets, naval assets, shipping routes |
| **Market Signals** | Live prices for 8 commodities, 4 FX pairs, 3 major indices with 7-10 day sparklines |
| **Supply Chain Risk** | 6-category risk assessment with severity bars and composite score |
| **Scenario Analysis** | Probability-weighted outcomes (Base / Escalation / De-escalation) |
| **Intel Feed** | RSS-aggregated, conflict-filtered headlines from Al Jazeera, BBC, and NYT |
| **Ticker Bar** | Fixed-bottom live scroll of all key market prices and status indicators |

## Data Sources

All data is live. No mock data, no fallbacks.

| Source | Data |
|---|---|
| **Yahoo Finance** | Commodities (Brent, WTI, Natural Gas, Gold, Copper, Aluminum, Wheat, Sugar), FX, Indices |
| **Finnhub** (optional) | Secondary FX rates fallback |
| **RSS feeds** | Al Jazeera, BBC World, NYT World — keyword-filtered for conflict relevance |

## Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `FINNHUB_API_KEY` | Optional | Enables Finnhub as FX fallback when Yahoo Finance is unavailable |

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production Build

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t situation-room .
docker run -p 3000:3000 \
  -e FINNHUB_API_KEY=your_key_here \
  situation-room
```

The image uses Next.js standalone output — minimal footprint, no node_modules in the runner stage.

## Architecture

```
app/
  api/
    market-data/    Yahoo Finance — 8 commodities, 60s revalidation
    forex/          Yahoo Finance + Finnhub fallback — 4 FX + 3 indices
    news/           RSS aggregation — keyword-filtered, 5min revalidation
  layout.tsx        Root layout, Leaflet CSS, dark theme
  page.tsx          Dashboard composition

components/
  Header.tsx          Sticky header — multi-timezone clocks, threat level
  SituationBrief.tsx  Op status, key stats, tactical bullet points
  ConflictMap.tsx     Leaflet map wrapper (SSR-disabled)
  MapInner.tsx        Leaflet map — markers, routes, polygons
  MarketSignals.tsx   Energy / commodities / FX / indices grid
  PriceCard.tsx       Individual price card with sparkline
  SupplyChainRisk.tsx 6-category risk grid with severity bars
  ScenarioAnalysis.tsx  3-scenario probability analysis
  NewsFeed.tsx        Live RSS intel feed with category filters
  TickerBar.tsx       Fixed-bottom scrolling market ticker

config/
  situation-data.ts   Current operation brief (manually curated)
  scenarios.ts        Probability-weighted scenarios
  risk-data.ts        Supply chain risk categories
```

## Design

Dark military/intel aesthetic. Monospace typography (JetBrains Mono). Color-coded severity system (Critical → Red, High → Orange, Elevated → Yellow, Moderate → Blue, Low → Green). Optimized for 24/7 war-room display at 1920×1080+.
