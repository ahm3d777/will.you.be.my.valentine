import confetti from 'canvas-confetti';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

let heartShape: confetti.Shape | null = null;
const getHeart = () => {
  if (!heartShape) {
    heartShape = confetti.shapeFromPath({
      path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
    });
  }
  return heartShape;
};

const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#ff69b4'];

/** Two-sided heart shower used when they say YES. */
export function celebrate(durationMs = 3500) {
  if (reducedMotion()) return;
  const end = Date.now() + durationMs;
  const shapes = [getHeart(), 'circle' as const];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: COLORS, shapes, scalar: 1.4 });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: COLORS, shapes, scalar: 1.4 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

/** One big burst (used when the date is locked in). */
export function burst() {
  if (reducedMotion()) return;
  confetti({
    particleCount: 140,
    spread: 90,
    startVelocity: 40,
    origin: { y: 0.75 },
    colors: [...COLORS, '#fbbf24', '#34d399'],
    shapes: [getHeart(), 'circle'],
    scalar: 1.2,
  });
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}
