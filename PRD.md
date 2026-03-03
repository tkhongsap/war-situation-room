# War Situation Room — Geopolitical Risk Intelligence Dashboard

## Overview
A real-time, C-suite-ready web dashboard that monitors the Iran-USA conflict and assesses its business impact on F&B / FMCG supply chains. The product is **white-label** — no company branding. It should look like a premium intelligence product that any enterprise can use.

## Target Audience
- Executive leadership / C-suite
- Risk & strategy teams
- Supply chain / procurement managers

## Design
- **Dark theme** (military/intel aesthetic — think Bloomberg terminal meets watchwar.live)
- Clean, minimal, data-dense
- Auto-refreshing data (polling every 60s for prices, 5min for news)
- Responsive but optimized for large screens / war room displays
- Professional — no gimmicks, no clutter

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** + **shadcn/ui** components
- **Recharts** or **Tremor** for charts
- **Leaflet** or **MapLibre** for interactive maps
- **TypeScript** throughout
- No database needed — all data from APIs, cached in-memory or via route handlers

## Data Sources (Public APIs)

### Oil & Energy
- Brent crude, WTI prices — via Yahoo Finance API or similar free source
- Natural gas prices
- Energy index tracking

### Commodities (F&B relevant)
- Sugar, barley/wheat, aluminum, glass (packaging materials)
- Palm oil (key SEA commodity)
- Use free commodity APIs or scraping

### Currency / Forex
- THB/USD, EUR/USD, CNY/USD
- Via exchangerate.host or similar

### Shipping & Freight
- Baltic Dry Index
- Container freight rates
- Strait of Hormuz traffic status

### News / Intel
- Curated conflict news feed — use NewsAPI, RSS feeds, or Brave Search API
- Filter for: Iran, Hormuz, oil, shipping, supply chain, sanctions, Middle East
- AI-generated situation summary (can be static/manual for v1)

## Dashboard Sections

### 1. Header Bar
- Dashboard title: "SITUATION ROOM" with subtitle "Geopolitical Risk Intelligence"
- Last updated timestamp (auto-refresh indicator)
- Overall risk level indicator (CRITICAL / HIGH / ELEVATED / MODERATE / LOW)
- Current date/time in multiple timezones (Bangkok, UTC, Tehran, Washington DC)

### 2. Conflict Map (Hero Section)
- Interactive map centered on Middle East / Indian Ocean
- Markers for: strike locations, Strait of Hormuz chokepoint, key shipping routes
- Color-coded zones (conflict zone, risk zone, safe zone)
- Shipping route lines (normal routes vs. alternative routes)
- Key infrastructure markers (ports, refineries, military bases)
- Static data is fine for v1 — hardcode known strike locations and routes

### 3. Market Impact Panel
- Real-time price cards for: Brent Crude, WTI, Natural Gas
- Commodity price cards: Sugar, Wheat, Aluminum, Palm Oil
- Each card shows: current price, 24h change (%), 7d sparkline chart
- Currency panel: THB/USD, EUR/USD with change indicators
- Color coding: green (favorable), red (unfavorable), amber (volatile)

### 4. Supply Chain Risk Assessment
- Risk matrix / heatmap showing risk levels across categories:
  - Energy & Fuel Costs
  - Raw Material Availability
  - Packaging Materials (aluminum, glass)
  - Shipping & Logistics
  - Currency Exposure
  - Consumer Demand
- Each category: risk level (1-5), trend arrow (↑↓→), brief description
- Visual: color-coded cards or grid

### 5. Scenario Analysis Cards
- 3 scenario cards:
  1. **Base Case**: "Hormuz partially restricted, conflict contained" — projected impacts
  2. **Escalation**: "Full Hormuz closure, expanded theater" — projected impacts  
  3. **De-escalation**: "Ceasefire within 2 weeks" — projected impacts
- Each shows estimated impact on: energy costs, raw materials, freight, timeline

### 6. Live Intelligence Feed
- Scrolling news feed with conflict-related headlines
- Each item: timestamp, source, headline, relevance tag
- Filter by category: Military, Economic, Shipping, Diplomatic
- Auto-updates every 5 minutes

### 7. Key Metrics Ticker
- Bottom ticker bar (like a stock ticker) showing key numbers:
  - Oil price, Hormuz status, freight index, THB/USD, risk level
  - Scrolling or static row

## Pages
For v1, **single page dashboard** is sufficient. All sections on one scrollable page with anchor navigation.

## Non-Goals (v1)
- User authentication
- Database / persistence
- Custom alerts / notifications
- Historical data analysis
- Company-specific customization UI
- Mobile optimization (desktop-first)

## Success Criteria
- Loads in <3 seconds
- All data sections populate with real or realistic data
- Looks C-suite ready (dark, professional, data-dense)
- Map renders with conflict zones and shipping routes
- Price data auto-refreshes
- News feed shows relevant, recent content
