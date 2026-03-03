import { NextResponse } from 'next/server';

export const revalidate = 60;

export interface ForexDataPoint {
  symbol: string;
  name: string;
  price: number | null;
  change24h: number | null;
  changePercent: number | null;
  unit: string;
  sparkline: number[];
  available: boolean;
  category: 'currency' | 'index';
}

const CURRENCY_SYMBOLS = [
  { symbol: 'THBUSD=X', name: 'THB/USD', unit: 'THB', category: 'currency' as const },
  { symbol: 'EURUSD=X', name: 'EUR/USD', unit: 'USD', category: 'currency' as const },
  { symbol: 'CNYUSD=X', name: 'CNY/USD', unit: 'CNY', category: 'currency' as const },
  { symbol: 'JPYUSD=X', name: 'JPY/USD', unit: 'JPY', category: 'currency' as const },
];

const INDEX_SYMBOLS = [
  { symbol: '^GSPC', name: 'S&P 500', unit: 'pts', category: 'index' as const },
  { symbol: '^SET.BK', name: 'SET Index', unit: 'pts', category: 'index' as const },
  { symbol: '^N225', name: 'Nikkei 225', unit: 'pts', category: 'index' as const },
];

const ALL_SYMBOLS = [...CURRENCY_SYMBOLS, ...INDEX_SYMBOLS];

interface YahooMeta {
  regularMarketPrice: number;
  previousClose?: number;
  regularMarketPreviousClose?: number;
  chartPreviousClose?: number;
}

interface YahooChartResponse {
  chart: {
    result: Array<{
      meta: YahooMeta;
      indicators: { quote: Array<{ close: (number | null)[] }> };
    }> | null;
    error: { code: string; description: string } | null;
  };
}

interface FinnhubForexRates {
  base: string;
  quote: Record<string, number>;
}

async function fetchYahooFinance(
  symbol: string
): Promise<{ price: number; prevClose: number; closes: number[] } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=10d&interval=1d&includePrePost=false`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SituationRoom/1.0)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json: YahooChartResponse = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const price = result.meta.regularMarketPrice;
    if (!price || price <= 0) return null;

    const prevClose =
      result.meta.regularMarketPreviousClose ??
      result.meta.previousClose ??
      result.meta.chartPreviousClose ??
      price;
    const rawCloses = result.indicators?.quote?.[0]?.close ?? [];
    const closes = rawCloses.filter((v): v is number => v !== null && !isNaN(v));

    return { price, prevClose, closes };
  } catch {
    return null;
  }
}

async function fetchFinnhubForexRates(): Promise<FinnhubForexRates | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;
  try {
    const url = `https://finnhub.io/api/v1/forex/rates?base=USD&token=${apiKey}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<FinnhubForexRates>;
  } catch {
    return null;
  }
}

export async function GET() {
  const [finnhubResult, ...yahooResults] = await Promise.allSettled([
    fetchFinnhubForexRates(),
    ...ALL_SYMBOLS.map((s) => fetchYahooFinance(s.symbol)),
  ]);

  const finnhubData = finnhubResult.status === 'fulfilled' ? finnhubResult.value : null;
  const yahooData = yahooResults.map((r) => (r.status === 'fulfilled' ? r.value : null));

  const results: ForexDataPoint[] = ALL_SYMBOLS.map((item, idx) => {
    const yahoo = yahooData[idx];

    if (!yahoo) {
      // Try Finnhub as secondary source for currency rates (price only — no sparkline or change data)
      if (item.category === 'currency' && finnhubData?.quote) {
        const code = item.symbol.replace('USD=X', '').replace('=X', '');
        const finnhubRate = finnhubData.quote[code];
        if (finnhubRate && finnhubRate > 0) {
          return {
            symbol: item.symbol,
            name: item.name,
            price: parseFloat(finnhubRate.toFixed(4)),
            change24h: null,
            changePercent: null,
            unit: item.unit,
            sparkline: [],
            available: true,
            category: item.category,
          };
        }
      }
      return {
        symbol: item.symbol,
        name: item.name,
        price: null,
        change24h: null,
        changePercent: null,
        unit: item.unit,
        sparkline: [],
        available: false,
        category: item.category,
      };
    }

    const decimals = item.category === 'index' ? 2 : 5;
    const change24h = parseFloat((yahoo.price - yahoo.prevClose).toFixed(decimals));
    const changePercent = parseFloat(((change24h / yahoo.prevClose) * 100).toFixed(2));

    return {
      symbol: item.symbol,
      name: item.name,
      price:
        item.category === 'index'
          ? parseFloat(yahoo.price.toFixed(2))
          : parseFloat(yahoo.price.toFixed(4)),
      change24h,
      changePercent,
      unit: item.unit,
      sparkline: yahoo.closes.slice(-10),
      available: true,
      category: item.category,
    };
  });

  return NextResponse.json({
    data: results,
    timestamp: new Date().toISOString(),
  });
}
