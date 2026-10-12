import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { DatePlanner } from './DatePlanner';
import type { Personalization } from '../lib/params';

export const SuccessView: React.FC<{ person: Personalization }> = ({ person }) => {
  return (
    <div className="flex w-full flex-col items-center">
      <motion.section
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8, bounce: 0.45 }}
        className="glass-panel relative mb-10 w-full overflow-hidden rounded-[2.5rem] border-4 border-white/60 bg-gradient-to-b from-white/90 to-pink-50/90 p-8 text-center shadow-2xl sm:p-12"
      >
        <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-16 -top-16 text-valentine-200"
          >
            <Sparkles size={190} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-16 -left-16 text-valentine-200"
          >
            <Sparkles size={170} />
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
          transition={{ delay: 0.25, scale: { type: 'spring', stiffness: 200 }, rotate: { duration: 0.6 } }}
          className="relative z-10 mb-4 inline-block select-none text-8xl drop-shadow-xl sm:text-9xl"
          role="img"
          aria-label="Happy face with hearts"
        >
          🥰
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="relative z-10"
        >
          <h1 className="mb-6 font-handwriting text-6xl leading-tight text-valentine-600 drop-shadow-sm sm:text-8xl">
            YAAAY!!!
            <span className="block text-4xl text-valentine-400 sm:text-6xl">Best. Day. Ever.</span>
          </h1>

          <div className="inline-block rounded-2xl border-2 border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700 sm:text-2xl">
              {person.to ? `${person.to}, you` : 'You'} just made me the happiest person in the universe! 🌎✨
              <span className="mt-2 block font-handwriting text-3xl font-bold text-valentine-500">
                I love you so much!{person.from ? ` — ${person.from}` : ''}
              </span>
            </p>
          </div>
        </motion.div>

        <div className="relative z-10 mt-8 flex justify-center gap-6" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -14, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            >
              <Heart className="h-11 w-11 fill-valentine-400 text-valentine-500 drop-shadow-md" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <DatePlanner person={person} />
    </div>
  );
};
