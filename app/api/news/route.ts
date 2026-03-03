import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  category: 'Military' | 'Economic' | 'Shipping' | 'Diplomatic' | 'Sanctions';
  url?: string;
}

const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SituationRoom/1.0)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
});

const RSS_FEEDS = [
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'NYT' },
];

const conflictKeywords =
  /iran|hormuz|oil|sanction|middle east|military|strike|nuclear|irgc|crude|tanker|strait|persian gulf|israel|hamas|hezbollah|ukraine|russia|war|conflict|ceasefire/i;

function categorizeHeadline(headline: string): NewsItem['category'] {
  const h = headline.toLowerCase();
  if (
    /military|strike|missile|troops|navy|carrier|bomb|airstrike|irgc|pentagon|forces|weapon|combat|attack/.test(
      h
    )
  )
    return 'Military';
  if (
    /ship|freight|port|vessel|maersk|tanker|hormuz|cargo|maritime|logistics|container|reroute/.test(
      h
    )
  )
    return 'Shipping';
  if (/sanction|ofac|treasury|embargo|export control|ban|asset freeze/.test(h)) return 'Sanctions';
  if (
    /diplomat|ceasefire|talk|negotiat|un security|foreign minister|peace|mediati|envoy|summit/.test(
      h
    )
  )
    return 'Diplomatic';
  return 'Economic';
}

export async function GET() {
  const allItems: NewsItem[] = [];

  await Promise.all(
    RSS_FEEDS.map(async (feed) => {
      try {
        const feedData = await parser.parseURL(feed.url);
        for (const item of feedData.items ?? []) {
          const title = item.title?.trim() ?? '';
          if (!title) continue;
          if (conflictKeywords.test(title)) {
            allItems.push({
              id:
                item.guid ??
                item.link ??
                `${feed.source}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              headline: title,
              source: feed.source,
              timestamp: item.pubDate
                ? new Date(item.pubDate).toISOString()
                : new Date().toISOString(),
              category: categorizeHeadline(title),
              url: item.link,
            });
          }
        }
      } catch {
        // RSS fetch failed for this source — no fallback per RULES.md
      }
    })
  );

  // Sort newest first, deduplicate by headline prefix
  const seen = new Set<string>();
  const unique = allItems
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .filter((item) => {
      const key = item.headline.toLowerCase().slice(0, 80);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  return NextResponse.json({
    data: unique.slice(0, 20),
    source: unique.length > 0 ? 'live' : 'unavailable',
    timestamp: new Date().toISOString(),
  });
}
