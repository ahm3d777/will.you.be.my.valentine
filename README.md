# 💌 Will You Be My Valentine?

A playful, animated Valentine's proposal page with personalized share links, a runaway **No** button, and AI date ideas. Built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion, and deployed on **Cloudflare Workers**.

**Live:** https://will-you-be-my-valentine.k-ahm3d777.workers.dev

## Features

- **Personalized links.** `/?to=Ayesha&from=Jawad&msg=...` greets them by name. Make one at **`/create`**.
- **Runaway "No" button.** It dodges on hover (desktop) or on tap (mobile), stays inside the card, never covers YES, and works with the keyboard.
- **Heart confetti and haptics** when they say YES.
- **AI date planner.** Pick a vibe (cozy, fancy, budget…) and Gemini suggests 3 dates. If AI is not set up, it falls back to built-in ideas, so it never breaks.
- **Close the loop.** They pick a date and send their answer back over WhatsApp or the native share sheet, or add it to Google Calendar.
- **Secure.** The Gemini API key is stored on the Worker as a secret and is never shipped to the browser.
- Social preview image (OG), favicon, `prefers-reduced-motion` support, and accessible radio groups.

## Project structure

```
src/                 React app (Vite)
  components/        ProposalCard, SuccessView, DatePlanner, CreateLink, FloatingHearts
  lib/               api, params, share, effects (confetti)
worker/index.ts      Cloudflare Worker: /api/date-ideas, /api/health, static assets
wrangler.jsonc       Worker config (SPA fallback, /api routed to the Worker)
```

## Run locally

```bash
npm install
npm run preview        # builds, then serves app + API on http://localhost:8787
```

For hot reload, use two terminals: `npm run dev:api` (Worker on :8787) and `npm run dev` (Vite on :3000, which proxies `/api`).

To enable AI locally, create `.dev.vars` containing `GEMINI_API_KEY=your_key`.

## Deploy

```bash
npx wrangler login
npx wrangler secret put GEMINI_API_KEY   # optional; the app works without it
npm run deploy
```

**Cloudflare Git integration (Workers Builds):** set the build command to `npm run build` and the deploy command to `npx wrangler deploy`. Add `GEMINI_API_KEY` under *Settings → Variables and Secrets* as a **Secret**.

Check that it's running: `GET /api/health` returns `{"ok":true,"ai":true|false}`.
