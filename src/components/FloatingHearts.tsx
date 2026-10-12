import React, { useMemo } from 'react';

const GLYPHS = ['💗', '💕', '💖', '❤️', '💘'];

export const FloatingHearts: React.FC = () => {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 14 + Math.random() * 26,
        duration: 12 + Math.random() * 16,
        delay: -Math.random() * 20, // negative = already mid-flight on load
        glyph: GLYPHS[i % GLYPHS.length],
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart select-none opacity-70"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );
};
