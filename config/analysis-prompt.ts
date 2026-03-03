// AI Analysis Pipeline — Prompts (v1.0)

export const SYSTEM_PROMPT = `You are a senior geopolitical risk analyst and supply chain strategist specializing in
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

IMPORTANT: Return ONLY valid JSON. Do not wrap in markdown code fences. Do not include any text before or after the JSON.`;

export const USER_PROMPT_TEMPLATE = `## Current Market Data (Live)
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
- Return exactly 6 risk categories: energy, shipping, packaging, raw-materials, currency, consumer
- Return exactly 3 scenarios: base, escalation, deescalation
- Return exactly 3 strategic action phases: immediate, short-term, medium-term with 3-5 actions each
- Return exactly 6 key stats`;

export function buildUserPrompt(
  marketData: unknown,
  forexData: unknown,
  newsData: unknown,
): string {
  return USER_PROMPT_TEMPLATE
    .replace('{market_data_json}', JSON.stringify(marketData, null, 2))
    .replace('{forex_data_json}', JSON.stringify(forexData, null, 2))
    .replace('{news_headlines_json}', JSON.stringify(newsData, null, 2))
    .replace('{iso_timestamp}', new Date().toISOString());
}
