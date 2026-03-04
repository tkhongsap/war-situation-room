import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'fs';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/config/analysis-prompt';
import type { AnalysisResponse } from '@/types/analysis';

const CACHE_PATH = '/tmp/analysis-cache.json';
const LOCK_PATH = '/tmp/analysis-cache.lock';
const CACHE_TTL = parseInt(process.env.ANALYSIS_CACHE_TTL || '14400', 10) * 1000; // ms

// ── Helpers ──────────────────────────────────────────────

function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

interface CacheEntry {
  data: AnalysisResponse;
  timestamp: number;
}

function readCache(): CacheEntry | null {
  try {
    if (!existsSync(CACHE_PATH)) return null;
    const raw = readFileSync(CACHE_PATH, 'utf-8');
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function writeCache(data: AnalysisResponse): void {
  const entry: CacheEntry = { data, timestamp: Date.now() };
  writeFileSync(CACHE_PATH, JSON.stringify(entry), 'utf-8');
}

function isCacheFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_TTL;
}

function acquireLock(): boolean {
  try {
    if (existsSync(LOCK_PATH)) {
      // Check if lock is stale (> 2 minutes)
      const stat = readFileSync(LOCK_PATH, 'utf-8');
      const lockTime = parseInt(stat, 10);
      if (Date.now() - lockTime < 120_000) return false;
    }
    writeFileSync(LOCK_PATH, String(Date.now()), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

function releaseLock(): void {
  try {
    if (existsSync(LOCK_PATH)) unlinkSync(LOCK_PATH);
  } catch {
    // ignore
  }
}

// ── Data Fetching ────────────────────────────────────────

async function fetchLiveData(baseUrl: string) {
  const [mktRes, fxRes, newsRes] = await Promise.all([
    fetch(`${baseUrl}/api/market-data`),
    fetch(`${baseUrl}/api/forex`),
    fetch(`${baseUrl}/api/news`),
  ]);

  const marketData = mktRes.ok ? await mktRes.json() : { data: [] };
  const forexData = fxRes.ok ? await fxRes.json() : { data: [] };
  const newsData = newsRes.ok ? await newsRes.json() : { data: [] };

  return { marketData, forexData, newsData };
}

// ── LLM Call ─────────────────────────────────────────────

async function generateAnalysis(
  marketData: unknown,
  forexData: unknown,
  newsData: unknown,
): Promise<AnalysisResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  const client = new Anthropic({ apiKey });
  const model = process.env.ANALYSIS_MODEL || 'claude-sonnet-4-5';
  const userPrompt = buildUserPrompt(marketData, forexData, newsData);

  const response = await client.messages.create({
    model,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonStr = extractJSON(text);
  const analysis = JSON.parse(jsonStr);

  // Normalize LLM output inconsistencies
  if (Array.isArray(analysis.strategicActions)) {
    for (const phase of analysis.strategicActions) {
      // LLM sometimes returns "action" instead of "actions"
      if (!phase.actions && phase.action) {
        phase.actions = Array.isArray(phase.action) ? phase.action : [phase.action];
        delete phase.action;
      }
      // Ensure actions is always an array
      if (!Array.isArray(phase.actions)) {
        phase.actions = [];
      }
    }
  }

  // Count data inputs for meta
  const mktArr = Array.isArray((marketData as Record<string, unknown>)?.data)
    ? ((marketData as Record<string, unknown>).data as unknown[]).length
    : 0;
  const fxArr = Array.isArray((forexData as Record<string, unknown>)?.data)
    ? ((forexData as Record<string, unknown>).data as unknown[]).length
    : 0;
  const newsArr = Array.isArray((newsData as Record<string, unknown>)?.data)
    ? ((newsData as Record<string, unknown>).data as unknown[]).length
    : 0;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_TTL);

  const result: AnalysisResponse = {
    situationData: analysis.situationData,
    riskCategories: analysis.riskCategories,
    compositeRiskScore: analysis.compositeRiskScore,
    compositeRiskLabel: analysis.compositeRiskLabel,
    scenarios: analysis.scenarios,
    strategicActions: analysis.strategicActions,
    meta: {
      generatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      model,
      dataInputs: {
        commodities: mktArr,
        forex: fxArr,
        headlines: newsArr,
      },
    },
  };

  return result;
}

// ── Route Handlers ───────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // 1. Check cache
    const cached = readCache();
    if (cached && isCacheFresh(cached)) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Analysis-Cache': 'HIT',
          'X-Analysis-Generated': cached.data.meta.generatedAt,
        },
      });
    }

    // 2. Try to acquire lock for regeneration
    if (!acquireLock()) {
      // Another request is generating — serve stale if available
      if (cached) {
        const staleData = { ...cached.data, meta: { ...cached.data.meta, stale: true } };
        return NextResponse.json(staleData, {
          headers: { 'X-Analysis-Cache': 'STALE' },
        });
      }
      return NextResponse.json(
        { error: 'Analysis is being generated, please retry shortly' },
        { status: 503 },
      );
    }

    try {
      // 3. Fetch live data
      const baseUrl = new URL(request.url).origin;
      const { marketData, forexData, newsData } = await fetchLiveData(baseUrl);

      // 4. Generate analysis
      const analysis = await generateAnalysis(marketData, forexData, newsData);

      // 5. Cache
      writeCache(analysis);

      return NextResponse.json(analysis, {
        headers: {
          'X-Analysis-Cache': 'MISS',
          'X-Analysis-Generated': analysis.meta.generatedAt,
        },
      });
    } catch (genError) {
      // Stale-while-revalidate: serve stale cache if LLM fails
      if (cached) {
        const staleData = { ...cached.data, meta: { ...cached.data.meta, stale: true } };
        return NextResponse.json(staleData, {
          headers: { 'X-Analysis-Cache': 'STALE-ERROR' },
        });
      }
      throw genError;
    } finally {
      releaseLock();
    }
  } catch (error) {
    console.error('[Analysis API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis', detail: String(error) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const refresh = url.searchParams.get('refresh');

  if (refresh !== 'true') {
    return NextResponse.json({ error: 'Use POST ?refresh=true to force regeneration' }, { status: 400 });
  }

  try {
    if (!acquireLock()) {
      return NextResponse.json({ error: 'Regeneration already in progress' }, { status: 409 });
    }

    try {
      const baseUrl = url.origin;
      const { marketData, forexData, newsData } = await fetchLiveData(baseUrl);
      const analysis = await generateAnalysis(marketData, forexData, newsData);
      writeCache(analysis);

      return NextResponse.json(analysis, {
        headers: {
          'X-Analysis-Cache': 'REFRESH',
          'X-Analysis-Generated': analysis.meta.generatedAt,
        },
      });
    } finally {
      releaseLock();
    }
  } catch (error) {
    console.error('[Analysis API] Refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate analysis', detail: String(error) },
      { status: 500 },
    );
  }
}
