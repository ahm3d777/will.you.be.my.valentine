import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import type { Personalization } from '../lib/params';
import { vibrate } from '../lib/effects';

interface Props {
  person: Personalization;
  onAccept: () => void;
}

const NO_MESSAGES = [
  'Are you sure? 🥺',
  'Think again!',
  'Pretty please? 🙏',
  "Don't break my heart 💔",
  "I'll buy you chocolate! 🍫",
  'And biryani! 🍛',
  "You can't catch me 😜",
  'The Yes button is RIGHT there…',
  'Okay, just click Yes! 💖',
];

const NO_LABELS = ['No', 'No?', 'Really?', 'Sure??', 'Hmm…', 'Nope', 'Pls no', 'Yes?'];

const MARGIN = 10;

export const ProposalCard: React.FC<Props> = ({ person, onAccept }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noAnchorRef = useRef<HTMLDivElement>(null); // static: marks the resting spot
  const noWrapRef = useRef<HTMLDivElement>(null); // moving part
  const offset = useRef({ x: 0, y: 0 });
  const lastPointerDown = useRef(0);

  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [mascot, setMascot] = useState('🐻');

  const yesScale = Math.min(1 + attempts * 0.08, 1.6);
  const noScale = Math.max(1 - attempts * 0.04, 0.7);

  /** Move the No button to a random spot that stays inside the card and away from Yes. */
  const dodge = useCallback(() => {
    const card = cardRef.current?.getBoundingClientRect();
    const anchor = noAnchorRef.current?.getBoundingClientRect();
    const btn = noWrapRef.current;
    const yes = yesRef.current?.getBoundingClientRect();
    if (!card || !anchor || !btn) return;

    // Resting position (the anchor never moves) and the button's untransformed size
    const baseLeft = anchor.left;
    const baseTop = anchor.top;
    const noEl = { width: btn.offsetWidth, height: btn.offsetHeight };

    const minX = card.left + MARGIN - baseLeft;
    const maxX = card.right - MARGIN - noEl.width - baseLeft;
    const minY = card.top + MARGIN - baseTop;
    const maxY = card.bottom - MARGIN - noEl.height - baseTop;

    let best = { x: 0, y: 0 };
    for (let i = 0; i < 25; i++) {
      const x = minX + Math.random() * Math.max(0, maxX - minX);
      const y = minY + Math.random() * Math.max(0, maxY - minY);
      const left = baseLeft + x;
      const top = baseTop + y;
      const movedFar = Math.hypot(x - offset.current.x, y - offset.current.y) > 90;
      const hitsYes =
        yes &&
        left < yes.right + 12 &&
        left + noEl.width > yes.left - 12 &&
        top < yes.bottom + 12 &&
        top + noEl.height > yes.top - 12;
      best = { x, y };
      if (movedFar && !hitsYes) break;
    }

    offset.current = best;
    setNoPos(best);
    setAttempts((a) => a + 1);
    setMascot((m) => (m === '😭' || attempts >= 4 ? '😭' : '🥺'));
    vibrate(30);
  }, [attempts]);

  const onNoPointerDown = (e: React.PointerEvent) => {
    // Touch/pen have no hover → dodge on tap. Mouse already dodged on hover,
    // but if they somehow reach it, dodge again.
    e.preventDefault();
    lastPointerDown.current = Date.now();
    dodge();
  };

  const greeting = person.to ? `${person.to},` : null;
  const message = NO_MESSAGES[Math.min(attempts - 1, NO_MESSAGES.length - 1)];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      className="glass-panel relative w-full max-w-lg rounded-[2rem] border-4 border-white/60 px-6 pb-8 pt-20 text-center shadow-2xl sm:px-10"
    >
      {/* Mascot */}
      <div className="absolute -top-16 left-1/2 z-20 -translate-x-1/2">
        <motion.div
          key={mascot}
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0, y: [0, -8, 0] }}
          transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          className="select-none text-8xl drop-shadow-xl sm:text-9xl"
          role="img"
          aria-label="Cute mascot"
        >
          {mascot}
        </motion.div>
      </div>

      {greeting && (
        <p className="font-handwriting text-3xl font-bold text-valentine-500 sm:text-4xl">{greeting}</p>
      )}
      <h1 className="mb-4 font-handwriting text-5xl leading-tight text-valentine-600 drop-shadow-sm sm:text-6xl">
        Will you be my Valentine?
      </h1>

      <p className="mb-8 inline-block rounded-2xl bg-white/50 px-4 py-2 font-medium text-valentine-800 backdrop-blur-sm">
        {person.msg || "I promise to buy you food and tell you you're pretty 🥺👉👈"}
      </p>

      <div className="relative flex min-h-[150px] flex-col items-center justify-center gap-6 sm:min-h-[110px] sm:flex-row">
        <motion.button
          ref={yesRef}
          type="button"
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.08 }}
          whileTap={{ scale: yesScale * 0.95 }}
          onMouseEnter={() => setMascot('🥰')}
          onMouseLeave={() => setMascot(attempts > 4 ? '😭' : '🐻')}
          onClick={onAccept}
          className="z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-valentine-400 to-valentine-600 px-10 py-4 text-2xl font-extrabold text-white shadow-lg shadow-valentine-500/30 ring-4 ring-valentine-200 focus:outline-none focus-visible:ring-valentine-400"
        >
          <Heart className="h-7 w-7 animate-pulse fill-current" /> YES!
        </motion.button>

        <div ref={noAnchorRef} className="z-10">
        <motion.div
          ref={noWrapRef}
          animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <button
            type="button"
            onPointerEnter={(e) => e.pointerType === 'mouse' && dodge()}
            onPointerDown={onNoPointerDown}
            onClick={() => {
              // Keyboard (Enter/Space) users: dodge on click. Skip clicks that follow a tap we already handled.
              if (Date.now() - lastPointerDown.current > 600) dodge();
            }}
            aria-label="No (good luck catching it)"
            className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-7 py-3 text-xl font-bold text-valentine-800 shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200"
          >
            <X className="h-5 w-5" /> {NO_LABELS[Math.min(attempts, NO_LABELS.length - 1)]}
          </button>
        </motion.div>
        </div>
      </div>

      <div className="mt-4 h-9" aria-live="polite">
        <AnimatePresence mode="wait">
          {attempts > 0 && (
            <motion.p
              key={attempts}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-handwriting text-2xl font-bold text-valentine-500"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
