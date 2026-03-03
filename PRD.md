# War Situation Room — Global Intelligence & Market Signal Dashboard

## Overview
A real-time global intelligence dashboard that tracks the current Iran-USA conflict and its market impact. Combines conflict intelligence, geopolitical risk monitoring, and financial market signals into a single C-suite-ready interface. White-label — no company branding.

## Target Audience
- Executive leadership / C-suite
- Risk & strategy teams
- Investment / treasury teams
- Supply chain / procurement managers

## Design
- **Dark theme** (military/intel aesthetic — Bloomberg terminal meets intelligence briefing)
- Clean, minimal, data-dense
- Auto-refreshing data (polling every 60s for prices, 5min for news)
- Optimized for large screens / war room displays
- Professional — no gimmicks, no clutter
- Visual inspiration: watchwar.live, worldmonitor.app

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** + **shadcn/ui** components
- **Recharts** for charts/sparklines
- **Leaflet** for interactive conflict map
- **TypeScript** throughout
- No database — all data from APIs, cached in-memory via route handlers

## Data Sources (Public APIs)

### Oil & Energy
- Brent crude, WTI prices
- Natural gas prices
- Use free financial APIs (Yahoo Finance, Alpha Vantage, or similar)

### Commodities
- Sugar, Wheat, Aluminum, Palm Oil, Gold, Copper
- Key F&B and industrial commodities affected by conflict

### Currencies / Forex
- THB/USD, EUR/USD, CNY/USD, JPY/USD
- Via exchangerate.host or similar

### Equities / Market Indices
- S&P 500, SET (Thailand), Nikkei, crude oil ETFs
- Key indices that react to geopolitical risk

### Shipping & Freight
- Baltic Dry Index
- Strait of Hormuz status
- Container freight rate indicators

### News / Intel
- Conflict news from RSS feeds (Al Jazeera, Reuters, BBC, AP)
- Filter for: Iran, Hormuz, oil, shipping, sanctions, Middle East, military
- Categorized: Military, Economic, Shipping, Diplomatic, Sanctions

## Dashboard Layout

### 1. Header Bar
- Title: "SITUATION ROOM" with subtitle "Global Intelligence Dashboard"
- Overall threat level badge (CRITICAL / HIGH / ELEVATED / MODERATE / LOW)
- Multi-timezone clocks: Bangkok, UTC, Tehran, Washington DC
- Last updated timestamp with auto-refresh indicator
- Pulsing dot when data is live

### 2. Situation Brief (Top Left)
- AI-style intelligence briefing summary
- 4-6 bullet points covering current situation
- Key stats: casualties, missiles intercepted, Hormuz status, days since escalation
- Styled like classified briefing document (monospace header, "SITUATION BRIEF" label)
- Threat level indicator with colored badge
- Manually updatable via config file

### 3. Conflict Map (Top Center/Right — Hero)
- Interactive Leaflet map with dark tiles
- Strike location markers (Tehran, nuclear sites, IRGC bases, retaliation targets)
- Strait of Hormuz chokepoint overlay (highlighted danger zone)
- Shipping routes: normal (through Hormuz, red/dashed) vs alternative (Cape of Good Hope, green)
- Key ports: Jebel Ali, Fujairah, Ras Tanura, Bandar Abbas
- Naval presence markers (US carrier groups, IRGC navy estimated positions)
- Military base markers
- Map legend
- Zoom/pan interactive

### 4. Market Signals Panel (Middle Section)
Three sub-sections in a grid:

**Energy:**
- Brent Crude, WTI, Natural Gas
- Current price, 24h change %, 7d sparkline

**Commodities:**
- Gold, Aluminum, Wheat, Sugar, Palm Oil, Copper
- Current price, 24h change %, sparkline

**Currencies:**
- THB/USD, EUR/USD, CNY/USD, JPY/USD
- Current rate, change indicator

**Indices:**
- S&P 500, SET Index, Nikkei 225
- Current value, daily change %

Each card: price, change %, trend arrow, color coding (green/red), mini sparkline chart

### 5. Supply Chain & Logistics Risk
- Risk heatmap across categories:
  - Energy & Fuel Costs (risk 1-5)
  - Shipping & Logistics
  - Raw Materials
  - Packaging (aluminum, glass)
  - Currency Exposure
  - Consumer Demand Impact
- Each: risk level, trend arrow, brief description
- Overall composite risk score
- Color coded cards

### 6. Scenario Analysis
- Three scenario cards side by side:
  1. **Base Case** (amber): Hormuz partially restricted, conflict contained — projected impacts
  2. **Escalation** (red): Full Hormuz closure, expanded theater — projected impacts
  3. **De-escalation** (green): Ceasefire within 2 weeks — projected impacts
- Each shows: probability, description, energy cost impact %, freight impact %, estimated duration

### 7. Live Intel Feed (Right Sidebar or Bottom)
- Scrolling news headlines
- Each: timestamp (relative), source, headline, category tag
- Filter buttons: All / Military / Economic / Shipping / Diplomatic / Sanctions
- Auto-refresh every 5 minutes
- 20 most recent items

### 8. Key Metrics Ticker Bar (Bottom)
- Scrolling ticker showing: Brent price, WTI, Gold, THB/USD, S&P 500, Hormuz status, threat level
- Always visible at bottom of screen

## Pages
Single page dashboard — all sections on one view with anchor navigation.

## Non-Goals (v1)
- User authentication
- Database / persistence
- Custom alerts / notifications
- Historical data deep-dives
- Mobile optimization (desktop-first)
- Live video feeds (v2)
- 3D globe (v2)

## Success Criteria
- Loads in <3 seconds
- All panels populate with real or realistic data
- Looks C-suite ready — would not look out of place in a boardroom
- Map renders with conflict zones and shipping routes
- Price data auto-refreshes
- News feed shows relevant, current content
- Single Docker container deployment
