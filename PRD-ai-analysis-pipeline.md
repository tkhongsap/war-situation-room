# PRD: AI-Powered Dynamic Analysis Pipeline

## Problem Statement

The War Situation Room dashboard currently has **hardcoded analysis content** across 4 config files:
- `config/risk-data.ts` — supply chain risk scores, justifications, impacts
- `config/scenarios.ts` — scenario probabilities, descriptions, impact ranges
- `config/situation-data.ts` — situation brief, BLUF, executive summary, key stats
- `components/StrategicActions.tsx` — 15 strategic action items hardcoded in JSX

While market data (commodities, forex, news) refreshes live via API routes, the **analytical layer is frozen in time**. When Brent moves from $81 to $120, the risk justification still references old numbers. When a ceasefire is brokered, the strategic actions still say "CRITICAL."

For this dashboard to be a sellable product — not a one-time snapshot — the analysis must regenerate dynamically based on live data.

## Solution

Build an **AI analysis pipeline** that:
1. Ingests live market data, forex rates, and news headlines from existing API routes
2. Sends this data + a carefully crafted analysis prompt to an LLM (Claude Sonnet 4.5)
3. Returns structured JSON matching the existing TypeScript interfaces
4. Caches the output server-side (configurable TTL, default 4 hours)
5. Frontend components fetch from this new API route instead of importing hardcoded configs

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  Frontend (Next.js)               │
│                                                   │
│  ExecutiveSummary ──┐                             │
│  SituationBrief ────┤                             │
│  SupplyChainRisk ───┼── GET /api/analysis ──────┐ │
│  ScenarioAnalysis ──┤                           │ │
│  StrategicActions ──┘                           │ │
│                                                  │ │
├──────────────────────────────────────────────────┤ │
│              API Route: /api/analysis             │ │
│                                                   │ │
│  1. Check cache (file or memory)                  │ │
│     └─ If valid (< TTL) → return cached JSON ────┘ │
│                                                   │
│  2. If stale/missing:                             │
│     a. Fetch /api/market-data (commodities)       │
│     b. Fetch /api/forex (currencies + indices)    │
│     c. Fetch /api/news (headlines)                │
│     d. Construct analysis prompt with live data   │
│     e. Call Claude Sonnet 4.5 API                 │
│     f. Parse + validate structured JSON response  │
│     g. Write to cache + return                    │
│                                                   │
├──────────────────────────────────────────────────┤
│              External Dependencies                │
│                                                   │
│  Anthropic API (Claude Sonnet 4.5)               │
│  - ~2K tokens in (data + prompt)                  │
│  - ~4K tokens out (full analysis JSON)            │
│  - Cost: ~$0.02-0.05 per call                    │
│  - Frequency: every 4-6 hours = ~$0.20/day       │
└──────────────────────────────────────────────────┘
```

## Analysis Prompt Design

The prompt is the core IP of this pipeline. It must produce C-suite quality analysis that:
- References **actual numbers** from live data (not hallucinated)
- Provides **Thailand F&B-specific** context (white-label but industry-relevant)
- Adjusts risk scores **proportionally** to actual market movements
- Shifts scenario probabilities based on **news sentiment**
- Updates strategic actions based on **current threat level**

### System Prompt

```
You are a senior geopolitical risk analyst and supply chain strategist specializing in
Southeast Asian F&B operations. You produce executive intelligence briefings for C-suite
decision makers at major food & beverage companies operating in Thailand.

Your analysis must be:
- DATA-DRIVEN: Reference actual numbers provided. Never fabricate statistics.
- THAILAND F&B SPECIFIC: Reference Thai supply chain realities — LPG cooking fuel costs,
  Laem Chabang port dynamics, wheat flour import dependency (95%+ from AU/CA/US),
  domestic palm oil/sugar production, BOT FX policy, EGAT electricity tariffs.
- WHITE-LABEL: Use "the organization" or "F&B operations" — never name specific companies.
- ACTIONABLE: Every risk must have a "so what" for procurement, finance, and operations.
- CALIBRATED: Risk scores (1-5) must be proportional to actual price movements and disruption severity.
  - 5 (CRITICAL): >25% price spike or complete supply route closure
  - 4 (HIGH): 15-25% price spike or severe delays (2+ weeks)
  - 3 (ELEVATED): 8-15% price movement or moderate delays (1-2 weeks)
  - 2 (MODERATE): 3-8% price movement or minor disruption
  - 1 (LOW): <3% movement, minimal operational impact

You will receive current market data (commodity prices, forex rates, stock indices) and
recent news headlines. Analyze these inputs and produce a structured JSON response.
```

### User Prompt Template

```
## Current Market Data (Live)
{market_data_json}

## Currency & Index Data (Live)
{forex_data_json}

## Recent News Headlines (Last 48h)
{news_headlines_json}

## Current Date/Time
{iso_timestamp}

---

Analyze the above data and produce a JSON response with this exact structure:

{
  "situationData": {
    "lastUpdated": "<ISO timestamp>",
    "threatLevel": "CRITICAL|HIGH|ELEVATED|MODERATE|LOW",
    "operationName": "<current operation/conflict name if known, or 'GLOBAL RISK MONITOR'>",
    "executiveSummary": "<2-3 sentence executive summary referencing actual data points>",
    "bluf": {
      "keyChange": "<1 sentence: the single most important change since last update>",
      "impact": "<1 sentence: direct impact on Thai F&B supply chain operations>",
      "watch": "<1 sentence: what to monitor in next 24-48 hours>"
    },
    "bulletPoints": ["<6 situation bullets with specific data references>"],
    "keyStats": [
      {"label": "<stat name>", "value": "<stat value>", "status": "critical|warning|alert|normal"}
    ]
  },
  "riskCategories": [
    {
      "id": "<energy|shipping|packaging|raw-materials|currency|consumer>",
      "name": "<display name>",
      "level": <1-5>,
      "trend": "up|down|stable",
      "description": "<2-3 sentences justifying this score with actual data points>",
      "impacts": ["<3-4 specific impacts on Thai F&B operations>"]
    }
  ],
  "compositeRiskScore": <weighted average to 1 decimal>,
  "compositeRiskLabel": "CRITICAL|HIGH|ELEVATED|MODERATE|LOW",
  "scenarios": [
    {
      "id": "base|escalation|deescalation",
      "name": "<scenario name>",
      "probability": <0-100>,
      "variant": "base|escalation|deescalation",
      "description": "<2-3 sentences based on current trajectory>",
      "timeline": "<estimated duration>",
      "impacts": [
        {"label": "<metric>", "value": "<projected range>", "direction": "up|down|neutral"}
      ]
    }
  ],
  "strategicActions": [
    {
      "phase": "immediate|short-term|medium-term",
      "timeframe": "<e.g. 24-48 Hours>",
      "actions": [
        {
          "action": "<specific actionable recommendation for Thai F&B>",
          "priority": "CRITICAL|HIGH|MODERATE",
          "rationale": "<1 sentence why, referencing current data>"
        }
      ]
    }
  ]
}

RULES:
- Risk scores MUST be calibrated to actual price movements in the data provided
- All percentages and numbers in justifications must come from the provided data
- Scenario probabilities must sum to 100
- Strategic actions must reference Thailand-specific context (AFTA, BOI, EGAT, PTT, Laem Chabang, etc.)
- If data shows de-escalation signals, risk scores MUST decrease accordingly
- If a commodity shows negative change, do NOT describe it as "spiking"
```

## Output Schema

The `/api/analysis` route returns a single JSON object matching the combined interfaces of:
- `SituationData` (situation brief, BLUF, key stats)
- `RiskCategory[]` + composite score (supply chain risk)
- `Scenario[]` (scenario analysis)
- `StrategicAction[]` (action briefing) — NEW interface, extracted from component

Plus metadata:
```typescript
interface AnalysisResponse {
  situationData: SituationData;
  riskCategories: RiskCategory[];
  compositeRiskScore: number;
  compositeRiskLabel: string;
  scenarios: Scenario[];
  strategicActions: StrategicActionPhase[];
  meta: {
    generatedAt: string;      // ISO timestamp
    expiresAt: string;        // ISO timestamp (generatedAt + TTL)
    model: string;            // e.g. "claude-sonnet-4-5"
    dataInputs: {
      commodities: number;    // count of commodity data points
      forex: number;          // count of forex data points
      headlines: number;      // count of news headlines ingested
    };
  };
}
```

## Frontend Migration

Each component that currently imports from hardcoded config files must be converted to:
1. `'use client'` component (if not already)
2. Fetch from `/api/analysis` on mount
3. Show loading skeleton while fetching
4. Show error state if API fails (NOT fallback to hardcoded data)
5. Auto-refresh on configurable interval (default: 30 min check, use cached if valid)

Components to migrate:
- `ExecutiveSummary.tsx` — already partially dynamic (fetches deltas), needs full migration
- `SituationBrief.tsx` — currently imports `situationData`
- `SupplyChainRisk.tsx` — currently imports `riskCategories`, `compositeRiskScore`
- `ScenarioAnalysis.tsx` — currently imports `scenarios`
- `StrategicActions.tsx` — currently has actions hardcoded in component

## Environment Variables

New required:
```
ANTHROPIC_API_KEY=sk-ant-...       # Claude API access
ANALYSIS_CACHE_TTL=14400           # Cache TTL in seconds (default: 4 hours)
ANALYSIS_MODEL=claude-sonnet-4-5   # Model to use
```

## Cache Strategy

- **Server-side file cache**: Write analysis JSON to `/tmp/analysis-cache.json`
- **TTL-based**: Check file mtime vs TTL on each request
- **Race protection**: If multiple requests hit during regeneration, first one generates, others wait
- **Manual refresh**: `POST /api/analysis?refresh=true` forces regeneration (for admin use)
- **Fallback**: If LLM call fails, serve stale cache with `stale: true` flag (frontend shows warning)

## User Stories

### US-010: Analysis API Route
Create `/api/analysis/route.ts` that:
- Fetches live data from internal API routes
- Constructs the analysis prompt with live data
- Calls Anthropic API (Claude Sonnet 4.5)
- Validates response against TypeScript interfaces
- Caches to filesystem with TTL
- Returns structured JSON

### US-011: Analysis Prompt & System Prompt
Create `config/analysis-prompt.ts` containing:
- System prompt (geopolitical analyst persona + Thailand F&B expertise)
- User prompt template with data injection points
- Response schema definition
- Prompt versioning (track changes to prompt)

### US-012: Frontend Migration — Dynamic Data Fetching
Convert all analysis-consuming components to:
- Fetch from `/api/analysis` instead of importing config files
- Add loading skeletons (dark theme, animated pulse)
- Add error states
- Auto-refresh interval
- Create shared `useAnalysis()` hook or context provider

### US-013: Strategic Actions Data Extraction
Extract hardcoded action items from `StrategicActions.tsx` into:
- New `StrategicActionPhase` interface in types
- Component receives data as props from `/api/analysis`
- Actions rendered dynamically, not hardcoded

### US-014: Cache Management & Manual Refresh
Implement:
- File-based cache with TTL checking
- Race condition protection (lock file or in-memory mutex)
- `POST /api/analysis?refresh=true` endpoint
- Stale-while-revalidate: serve stale cache if LLM fails, with warning flag
- Cache metadata (generated time, model used, input counts)

### US-015: Loading States & Error Handling
Design and implement:
- Dark-themed skeleton loaders matching panel dimensions
- Error state component: "Analysis temporarily unavailable — last updated X hours ago"
- Stale data warning banner: "Using cached analysis from [time] — refresh in progress"
- Connection lost state for when API route is unreachable

## Success Criteria

1. Dashboard loads with AI-generated analysis within 5 seconds (cached) or 30 seconds (fresh generation)
2. Risk scores correlate with actual market data — if Brent drops 10%, energy risk score decreases
3. Strategic actions reference current numbers, not stale ones
4. Scenario probabilities shift based on news sentiment
5. Cache prevents excessive API costs (<$0.25/day at 4-hour refresh cycle)
6. Frontend gracefully handles loading, errors, and stale data
7. No hardcoded analysis content remains in the codebase

## Cost Estimate

| Refresh Interval | Calls/Day | Cost/Call | Daily Cost | Monthly Cost |
|---|---|---|---|---|
| 4 hours | 6 | $0.04 | $0.24 | $7.20 |
| 2 hours | 12 | $0.04 | $0.48 | $14.40 |
| 1 hour | 24 | $0.04 | $0.96 | $28.80 |

Recommended: **4-hour refresh** for production, **1-hour** during active crisis periods (configurable via env var).

## Non-Goals (This Phase)

- Real-time streaming analysis (SSE/WebSocket)
- Multi-language analysis (Thai language output)
- Historical analysis tracking / trend comparison
- User-configurable analysis parameters
- Multiple industry templates (only F&B Thailand for now)
