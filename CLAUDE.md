# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured yet.

## Stack

- **Next.js 16** (App Router) with **React 19** — this version has breaking changes vs. training data; check `node_modules/next/dist/docs/` before writing code
- **TypeScript** with strict mode, path alias `@/*` maps to the repo root
- **Tailwind CSS v4** — uses `@import "tailwindcss"` and `@theme inline {}` blocks in CSS, not `tailwind.config.js`
- **ESLint 9** flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`

## Architecture

This is a freshly scaffolded Next.js App Router project — only the default boilerplate exists so far:

- `app/layout.tsx` — root layout; loads Geist fonts via `next/font/google`, sets CSS variables
- `app/page.tsx` — home page (Server Component by default)
- `app/globals.css` — global styles; Tailwind v4 theme tokens defined here with `@theme inline`

All routes live under `app/`. Server Components are the default; add `"use client"` only when browser APIs or interactivity are required.
