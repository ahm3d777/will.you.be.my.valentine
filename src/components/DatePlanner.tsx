import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Copy,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import type { DateIdea, Vibe } from '../types';
import type { Personalization } from '../lib/params';
import { fetchDateIdeas } from '../lib/api';
import { burst, vibrate } from '../lib/effects';
import { copyText, nativeShare, whatsappUrl } from '../lib/share';

const VIBES: { id: Vibe; label: string }[] = [
  { id: 'any', label: '✨ Surprise me' },
  { id: 'cozy', label: '🧸 Cozy' },
  { id: 'adventurous', label: '🏞️ Adventurous' },
  { id: 'fancy', label: '🍷 Fancy' },
  { id: 'budget', label: '🪙 Budget' },
  { id: 'at-home', label: '🏠 At home' },
];

const ROTATIONS = [-2, 1.5, -1];

/** Next 14 February (this year if it hasn't passed yet). */
function nextValentine(): Date {
  const now = new Date();
  const y = now.getMonth() > 1 || (now.getMonth() === 1 && now.getDate() > 14) ? now.getFullYear() + 1 : now.getFullYear();
  return new Date(y, 1, 14);
}

function googleCalendarUrl(idea: DateIdea, withWho: string) {
  const d = nextValentine();
  const ymd = (x: Date) =>
    `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}`;
  const end = new Date(d);
  end.setDate(d.getDate() + 1);
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${idea.emoji} ${idea.title}${withWho ? ` with ${withWho}` : ''}`,
    details: `${idea.description}\n\nOur Valentine's date 💖`,
    dates: `${ymd(d)}/${ymd(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export const DatePlanner: React.FC<{ person: Personalization }> = ({ person }) => {
  const [vibe, setVibe] = useState<Vibe>('any');
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setSelected(null);
    const results = await fetchDateIdeas(vibe);
    setIdeas(results);
    setLoading(false);
  };

  const confirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    vibrate([40, 30, 80]);
    burst();
  };

  const chosen = selected !== null ? ideas[selected] : null;
  const answerText = chosen
    ? `YES! 💖 I'll be your Valentine${person.from ? `, ${person.from}` : ''}! 🥰\n` +
      `Our date: ${chosen.emoji} ${chosen.title} — ${chosen.description}`
    : '';

  const sendAnswer = async () => {
    const handled = await nativeShare({ title: 'My answer 💌', text: answerText });
    if (!handled) window.open(whatsappUrl(answerText), '_blank', 'noopener');
  };

  const copyAnswer = async () => {
    if (await copyText(answerText)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ---------- Confirmed ----------
  if (confirmed && chosen) {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotate: -4 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        className="relative w-full max-w-xl rounded-[2rem] border-4 border-emerald-200 bg-white p-8 text-center shadow-2xl"
      >
        <motion.div
          className="absolute -right-4 -top-5 text-5xl"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-hidden="true"
        >
          🥳
        </motion.div>

        <p className="mb-2 flex items-center justify-center gap-3 font-handwriting text-4xl font-bold text-emerald-500">
          It's a date! <CheckCircle2 className="h-9 w-9 fill-emerald-100" />
        </p>
        <div className="mx-auto my-5 flex max-w-md items-center gap-4 rounded-2xl bg-valentine-50 p-4 text-left">
          <span className="text-5xl" aria-hidden="true">{chosen.emoji}</span>
          <div>
            <p className="font-handwriting text-3xl font-bold text-valentine-800">{chosen.title}</p>
            <p className="text-gray-600">{chosen.description}</p>
          </div>
        </div>
        <p className="mb-6 text-lg text-gray-500">
          {person.from ? `Now let ${person.from} know! 💌` : 'Now send your answer! 💌'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={sendAnswer}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-valentine-500 to-valentine-600 px-6 py-3 font-bold text-white shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200"
          >
            <Send className="h-5 w-5" /> Send my answer
          </button>
          <button
            type="button"
            onClick={copyAnswer}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-valentine-200 bg-white px-6 py-3 font-bold text-valentine-700 transition hover:bg-valentine-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200"
          >
            <Copy className="h-5 w-5" /> {copied ? 'Copied!' : 'Copy'}
          </button>
          <a
            href={googleCalendarUrl(chosen, person.from)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-valentine-200 bg-white px-6 py-3 font-bold text-valentine-700 transition hover:bg-valentine-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200"
          >
            <CalendarPlus className="h-5 w-5" /> Add to calendar
          </a>
        </div>

        <button
          type="button"
          onClick={() => setConfirmed(false)}
          className="mt-6 text-sm font-semibold text-gray-400 underline-offset-4 hover:text-valentine-500 hover:underline"
        >
          Change our plan
        </button>
      </motion.div>
    );
  }

  // ---------- Planner ----------
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="flex w-full max-w-2xl flex-col items-center"
      aria-labelledby="plan-title"
    >
      <h2
        id="plan-title"
        className="mb-4 inline-block rounded-full border border-white bg-white/60 px-6 py-2 text-center font-handwriting text-3xl text-valentine-700 shadow-sm"
      >
        ✨ Let's plan our date ✨
      </h2>

      <div className="mb-6 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="Date vibe">
        {VIBES.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={vibe === v.id}
            onClick={() => setVibe(v.id)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200 ${
              vibe === v.id
                ? 'bg-valentine-500 text-white shadow-md'
                : 'bg-white/70 text-valentine-700 ring-1 ring-valentine-200 hover:bg-white'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={generate}
        disabled={loading}
        className="group mb-8 flex items-center gap-3 rounded-full border-4 border-valentine-200 bg-white px-8 py-4 font-bold text-valentine-600 shadow-xl transition hover:scale-105 hover:bg-valentine-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-300 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="h-7 w-7 animate-spin text-valentine-400" />
        ) : ideas.length ? (
          <RefreshCw className="h-7 w-7 text-valentine-400 transition group-hover:rotate-180" />
        ) : (
          <Sparkles className="h-7 w-7 fill-yellow-400 text-yellow-400" />
        )}
        <span className="font-handwriting text-3xl">
          {loading ? 'Asking Cupid…' : ideas.length ? 'More ideas' : 'Plan our date!'}
        </span>
      </button>

      <div className="grid w-full gap-5" role="radiogroup" aria-label="Date ideas">
        <AnimatePresence mode="popLayout">
          {!loading &&
            ideas.map((idea, index) => {
              const isSel = selected === index;
              return (
                <motion.button
                  key={`${idea.title}-${index}`}
                  type="button"
                  role="radio"
                  aria-checked={isSel}
                  onClick={() => setSelected(index)}
                  initial={{ opacity: 0, y: 40, scale: 0.85, rotate: ROTATIONS[index % 3] * 4 }}
                  animate={{ opacity: 1, y: 0, scale: isSel ? 1.03 : 1, rotate: isSel ? 0 : ROTATIONS[index % 3] }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.12, type: 'spring', stiffness: 260, damping: 20 }}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  className={`group flex w-full items-center gap-5 rounded-2xl border-2 p-5 text-left shadow-lg transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-300 ${
                    isSel ? 'border-valentine-400 bg-white' : 'border-pink-100 bg-white/85 hover:bg-white'
                  }`}
                >
                  <span className="rounded-2xl bg-valentine-100 p-3 text-4xl shadow-inner sm:text-5xl" aria-hidden="true">
                    {idea.emoji}
                  </span>
                  <span className="flex-1">
                    <span className="mb-1 block font-handwriting text-3xl font-bold text-valentine-800">{idea.title}</span>
                    <span className="block leading-relaxed text-gray-600">{idea.description}</span>
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSel ? 'border-valentine-500 bg-valentine-500 text-white' : 'border-valentine-200'
                    }`}
                    aria-hidden="true"
                  >
                    {isSel && <CheckCircle2 className="h-5 w-5" />}
                  </span>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>

      {ideas.length > 0 && !loading && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={selected !== null ? { scale: 1.06 } : undefined}
          whileTap={selected !== null ? { scale: 0.96 } : undefined}
          onClick={confirm}
          disabled={selected === null}
          className="mt-10 flex items-center gap-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 px-10 py-4 text-2xl font-bold text-white shadow-xl ring-4 ring-emerald-100 transition focus:outline-none focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:ring-gray-100"
        >
          <Calendar className="h-7 w-7" />
          <span className="font-handwriting">{selected === null ? 'Pick one first 👆' : "Let's do it!"}</span>
        </motion.button>
      )}
    </motion.section>
  );
};
