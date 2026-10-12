import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink, Heart, Share2 } from 'lucide-react';
import { buildProposalLink, type Personalization } from '../lib/params';
import { copyText, nativeShare, whatsappUrl } from '../lib/share';

const field =
  'w-full rounded-2xl border-2 border-valentine-100 bg-white/90 px-4 py-3 text-lg text-gray-800 placeholder:text-gray-400 focus:border-valentine-400 focus:outline-none focus:ring-4 focus:ring-valentine-100';

export const CreateLink: React.FC = () => {
  const [form, setForm] = useState<Personalization>({ to: '', from: '', msg: '' });
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => buildProposalLink(form), [form]);
  const shareText = `${form.to ? `${form.to}, ` : ''}I have a very important question for you… 💌`;

  const set = (k: keyof Personalization) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const copy = async () => {
    if (await copyText(link)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const share = async () => {
    const handled = await nativeShare({ title: 'Will you be my Valentine?', text: shareText, url: link });
    if (!handled) window.open(whatsappUrl(`${shareText}\n${link}`), '_blank', 'noopener');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel w-full max-w-lg rounded-[2rem] border-4 border-white/60 p-6 shadow-2xl sm:p-10"
    >
      <div className="mb-6 text-center">
        <div className="mb-2 text-6xl" aria-hidden="true">💌</div>
        <h1 className="font-handwriting text-5xl text-valentine-600">Make your own</h1>
        <p className="mt-2 text-gray-600">Personalize it, then send the link to your special someone.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); share(); }}>
        <label className="block">
          <span className="mb-1 block font-bold text-valentine-800">Their name</span>
          <input className={field} value={form.to} onChange={set('to')} maxLength={30} placeholder="e.g. Ayesha" autoComplete="off" />
        </label>
        <label className="block">
          <span className="mb-1 block font-bold text-valentine-800">Your name</span>
          <input className={field} value={form.from} onChange={set('from')} maxLength={30} placeholder="e.g. Jawad" autoComplete="off" />
        </label>
        <label className="block">
          <span className="mb-1 block font-bold text-valentine-800">
            Sweet line <span className="font-normal text-gray-400">(optional)</span>
          </span>
          <input
            className={field}
            value={form.msg}
            onChange={set('msg')}
            maxLength={120}
            placeholder="I promise to buy you food and tell you you're pretty 🥺👉👈"
            autoComplete="off"
          />
        </label>

        <div className="rounded-2xl bg-valentine-50 p-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-valentine-400">Your link</p>
          <p className="break-all font-mono text-sm text-valentine-800">{link}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-valentine-500 to-valentine-600 px-6 py-3 font-bold text-white shadow-lg transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200"
          >
            <Share2 className="h-5 w-5" /> Send it
          </button>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-valentine-200 bg-white px-6 py-3 font-bold text-valentine-700 transition hover:bg-valentine-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-valentine-200"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />} {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 pt-1 text-sm font-semibold text-valentine-500 hover:underline"
        >
          <ExternalLink className="h-4 w-4" /> Preview what they'll see
        </a>
      </form>

      <p className="mt-6 flex items-center justify-center gap-1 text-xs text-gray-400">
        Made with <Heart className="h-3 w-3 fill-valentine-400 text-valentine-400" /> — nothing you type is stored.
      </p>
    </motion.div>
  );
};
