# HARD RULES — NON-NEGOTIABLE

## 1. REAL DATA ONLY
- ALL data displayed MUST come from real API calls
- NO fallback data, NO mock data, NO hardcoded prices, NO random number generators
- If an API call fails, show an error state or "Data unavailable" — NEVER fake numbers
- This is a hard rule. Zero exceptions.

## 2. Data Sources
- **Finnhub** (API key in .env.local as FINNHUB_API_KEY): Stock quotes, forex rates, market indices
- **Yahoo Finance** (no key): Commodities (oil, gold, wheat, sugar, aluminum, copper, palm oil, natural gas)
- **RSS feeds** (rss-parser): News from Al Jazeera, Reuters, BBC, AP — real headlines only
- **Conflict data**: Use real, current situation data in situation brief (manually curated is OK since it's analysis, not market data)

## 3. API Endpoints
- Yahoo Finance: `https://query1.finance.yahoo.com/v8/finance/chart/{SYMBOL}?interval=1d&range=7d`
- Finnhub quotes: `https://finnhub.io/api/v1/quote?symbol={SYMBOL}&token={KEY}`
- Finnhub forex: `https://finnhub.io/api/v1/forex/rates?base=USD&token={KEY}`
- RSS: Al Jazeera `https://www.aljazeera.com/xml/rss/all.xml`, Reuters, BBC World `http://feeds.bbci.co.uk/news/world/rss.xml`

## 4. Design Standard
- Must look like a $50K consulting deliverable shown to C-suite executives
- Dark military/intel aesthetic
- White-label — NO company names anywhere
- Professional, polished, data-dense
