import type { DateIdea, Vibe } from '../types';

const LOCAL_IDEAS: DateIdea[] = [
  { title: 'Starlit Picnic', description: 'A cozy blanket, strawberries and stargazing somewhere quiet.', emoji: '🧺' },
  { title: 'Pottery Painting', description: 'Paint silly mugs for each other and swap them at the end.', emoji: '🎨' },
  { title: 'Dessert Crawl', description: 'Three spots, three desserts, one winner crowned by us.', emoji: '🍰' },
  { title: 'Rooftop Sunset', description: 'Chai, snacks and the sky turning pink just for us.', emoji: '🌇' },
  { title: 'Movie Fort', description: 'Blanket fort, fairy lights, popcorn and a rom-com marathon.', emoji: '🎬' },
  { title: 'Photo Walk', description: 'Explore old streets and take the cutest candid photos.', emoji: '📸' },
];

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

/** Calls our own Worker (/api/date-ideas). Never throws — always returns 3 ideas. */
export async function fetchDateIdeas(vibe: Vibe): Promise<DateIdea[]> {
  try {
    const res = await fetch(`/api/date-ideas?vibe=${encodeURIComponent(vibe)}`, {
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { ideas?: DateIdea[] };
    if (Array.isArray(data.ideas) && data.ideas.length) return data.ideas.slice(0, 3);
    throw new Error('No ideas');
  } catch (e) {
    console.warn('Using local date ideas:', e);
    return shuffle(LOCAL_IDEAS).slice(0, 3);
  }
}
