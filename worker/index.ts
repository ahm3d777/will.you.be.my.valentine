/**
 * Cloudflare Worker entry.
 *  - /api/date-ideas  → AI date ideas (Gemini), key stays secret on the server
 *  - /api/health      → simple status check
 *  - everything else  → static React app from ./dist (SPA fallback)
 */

export interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
}

interface DateIdea {
  title: string;
  description: string;
  emoji: string;
}

const FALLBACK_IDEAS: DateIdea[] = [
  { title: 'Starlit Picnic', description: 'A cozy blanket, strawberries and stargazing somewhere quiet.', emoji: '🧺' },
  { title: 'Pottery Painting', description: 'Paint silly mugs for each other and swap them at the end.', emoji: '🎨' },
  { title: 'Dessert Crawl', description: 'Three spots, three desserts, one winner crowned by us.', emoji: '🍰' },
  { title: 'Rooftop Sunset', description: 'Chai, snacks and the sky turning pink just for us.', emoji: '🌇' },
  { title: 'Cook-Off Night', description: 'We cook the same dish separately and judge each other (lovingly).', emoji: '🍝' },
  { title: 'Photo Walk', description: 'Explore old streets and take the cutest candid photos.', emoji: '📸' },
  { title: 'Movie Fort', description: 'Blanket fort, fairy lights, popcorn and a rom-com marathon.', emoji: '🎬' },
  { title: 'Bookstore Date', description: 'Pick a book for each other in 10 minutes, then read over coffee.', emoji: '📚' },
  { title: 'Boat Ride', description: 'A slow ride on the water with music and good conversation.', emoji: '🚣' },
  { title: 'Arcade Battle', description: 'Loser buys the ice cream. Winner gets bragging rights forever.', emoji: '🕹️' },
  { title: 'Flower Market', description: 'Build a bouquet together, then find the perfect vase.', emoji: '💐' },
  { title: 'Karaoke Duet', description: 'One cheesy love song, sung terribly and with full confidence.', emoji: '🎤' },
];

const VIBES = new Set(['any', 'cozy', 'adventurous', 'fancy', 'budget', 'at-home']);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

function pickFallback(count: number): DateIdea[] {
  const pool = [...FALLBACK_IDEAS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

function firstGrapheme(s: string): string {
  const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
  for (const { segment } of seg.segment(s.trim())) return segment;
  return '';
}

function isIdea(x: unknown): x is DateIdea {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return typeof o.title === 'string' && typeof o.description === 'string' && typeof o.emoji === 'string';
}

async function generateIdeas(env: Env, vibe: string): Promise<DateIdea[]> {
  const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
  const vibeText = vibe === 'any' ? '' : ` The vibe should be: ${vibe}.`;
  const prompt =
    `Generate 3 cute, creative and romantic Valentine's date ideas.${vibeText} ` +
    `Each needs a catchy title (max 4 words), a 1-sentence description (max 20 words) and a single emoji. ` +
    `Keep them sweet, wholesome and doable.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY! },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 1.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                description: { type: 'STRING' },
                emoji: { type: 'STRING' },
              },
              required: ['title', 'description', 'emoji'],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(12_000),
    },
  );

  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error('Bad Gemini shape');
  const ideas = parsed.filter(isIdea).slice(0, 3).map((i) => ({
    title: i.title.slice(0, 40),
    description: i.description.slice(0, 160),
    emoji: firstGrapheme(i.emoji) || '💖',
  }));
  if (ideas.length === 0) throw new Error('No valid ideas');
  return ideas;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({ ok: true, ai: Boolean(env.GEMINI_API_KEY) });
    }

    if (url.pathname === '/api/date-ideas') {
      if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
      const vibeParam = (url.searchParams.get('vibe') || 'any').toLowerCase();
      const vibe = VIBES.has(vibeParam) ? vibeParam : 'any';

      if (!env.GEMINI_API_KEY) {
        return json({ ideas: pickFallback(3), source: 'fallback' });
      }
      try {
        return json({ ideas: await generateIdeas(env, vibe), source: 'ai' });
      } catch (err) {
        console.error('date-ideas error:', err);
        return json({ ideas: pickFallback(3), source: 'fallback' });
      }
    }

    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
