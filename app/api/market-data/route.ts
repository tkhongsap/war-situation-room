import { NextResponse } from 'next/server';

export const revalidate = 60;

export interface PriceDataPoint {
  symbol: string;
  name: string;
  price: number | null;
  change24h: number | null;
  changePercent: number | null;
  unit: string;
  sparkline: number[];
  available: boolean;
}

const COMMODITIES = [
  { symbol: 'BZ=F', name: 'Brent Crude', unit: '/bbl' },
  { symbol: 'CL=F', name: 'WTI Crude', unit: '/bbl' },
  { symbol: 'NG=F', name: 'Natural Gas', unit: '/MMBtu' },
  { symbol: 'GC=F', name: 'Gold', unit: '/oz' },
  { symbol: 'HG=F', name: 'Copper', unit: '/lb' },
  { symbol: 'ALI=F', name: 'Aluminum', unit: '/t' },
  { symbol: 'ZW=F', name: 'Wheat', unit: 'c/bu' },
  { symbol: 'SB=F', name: 'Sugar', unit: 'c/lb' },
];

interface YahooChartResult {
  meta: {
    regularMarketPrice: number;
    previousClose?: number;
    regularMarketPreviousClose?: number;
    chartPreviousClose?: number;
    currency: string;
  };
  indicators: {
    quote: Array<{ close: (number | null)[] }>;
  };
}

interface YahooChartResponse {
  chart: {
    result: YahooChartResult[] | null;
    error: { code: string; description: string } | null;
  };
}

async function fetchYahooFinance(
  symbol: string
): Promise<{ price: number; prevClose: number; closes: number[] } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=7d&interval=1d&includePrePost=false`;
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

export async function GET() {
  const results = await Promise.all(
    COMMODITIES.map(async (commodity): Promise<PriceDataPoint> => {
      const data = await fetchYahooFinance(commodity.symbol);

      if (!data) {
        return {
          symbol: commodity.symbol,
          name: commodity.name,
          price: null,
          change24h: null,
          changePercent: null,
          unit: commodity.unit,
          sparkline: [],
          available: false,
        };
      }

      const change24h = parseFloat((data.price - data.prevClose).toFixed(4));
      const changePercent = parseFloat(((change24h / data.prevClose) * 100).toFixed(2));

      return {
        symbol: commodity.symbol,
        name: commodity.name,
        price: parseFloat(data.price.toFixed(4)),
        change24h,
        changePercent,
        unit: commodity.unit,
        sparkline: data.closes.slice(-7),
        available: true,
      };
    })
  );

  return NextResponse.json({
    data: results,
    timestamp: new Date().toISOString(),
  });
}
