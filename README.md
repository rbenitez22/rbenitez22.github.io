# rbenitez22.github.io

Roberto Benitez's portfolio: a static [Astro](https://astro.build) site, published to GitHub Pages at <https://rbenitez22.github.io>. It shows apps running through short demo clips, plus notes on how each is built. Conrad comes first and is the largest. **No app source lives here.** The apps are private; this repo holds only text, images and video.

The clips, demo data and recording tools live in the Conrad repo under `plans/portfolio/` (recorder, VHS tapes, ffmpeg pipeline). This site only receives finished files.

## Requirements

- Node ≥ 22.22 (Astro 7). `npm` comes through `corepack` (`corepack npm@11 …`).
- Dependencies are pinned exactly in `package.json`: `astro` 7.3.8, self-hosted fonts from `@fontsource` (Cormorant Garamond, Source Sans 3, DM Mono), and `@astrojs/check` + `typescript` for `npm run check`.

## Commands

| Command | What it does |
|---|---|
| `corepack npm@11 install` | Install dependencies |
| `corepack npm@11 run dev` | Dev server on <http://localhost:4321>. **Drafts are shown here**, never in a build |
| `corepack npm@11 run check` | Contrast check (`scripts/check-contrast.mjs`, WCAG AA 4.5:1 for every text role on every surface, light and dark), then `astro check` (types) |
| `corepack npm@11 run build` | Static build to `dist/` |
| `corepack npm@11 run preview` | Serve `dist/` locally |

## Deploying

`.github/workflows/deploy.yml` builds with `withastro/action@v6` and deploys with `actions/deploy-pages@v5` on every push to `main` (or by hand from the Actions tab). One-time setup on GitHub: **Settings → Pages → Source: GitHub Actions**. `astro.config.mjs` sets `site: 'https://rbenitez22.github.io'` and no `base`, as a user site needs.

## Content

### Apps: `src/content/apps/<app>.md`

One file per app. The file name is the URL (`/conrad/`), and the Markdown body is the app's overview page.

```md
---
name: Conrad
tagline: Double-entry personal finance — ledgers, budgets, receipts and imports.
stack: [Java 25, Spring Boot, React, TypeScript, PostgreSQL]
order: 1          # position on the home page
---
Overview text…
```

### Posts: `src/content/posts/<app>/<slug>.md`

The folder names the app, and the URL is `/<app>/<slug>/`.

```md
---
title: Ten years in one ledger
summary: One line, shown in lists, under the title, and as the page description.
published: 2026-10-15
draft: true       # hidden from builds until false; still shown by `npm run dev`
clips:
  - name: ledger-tour          # files under public/media/<app>/
    caption: What the clip shows.
---
Body…
```

### Clips: `public/media/<app>/`

Each clip is four files: `<name>-wide.mp4` (16:9), `<name>-feed.mp4` (1:1), `<name>-wide-poster.png` and `<name>-feed-poster.png`.
- `ClipPlayer` serves the square video and poster below 40rem, and the wide ones above.
- Clips are silent with captions burned in, so they play muted and inline.
- Copy them in from Conrad with `plans/portfolio/pipeline/publish-clip.sh <clip> [app] [site-dir]`.
- Keep each file under 10 MB. GitHub refuses files over 100 MB, and Pages doesn't serve Git LFS.

## Structure

- `src/layouts/SiteLayout.astro`: the document (head, fonts, header, footer).
- `src/components/`:
  - `SiteHeader`, `SiteFooter`;
  - `AppCard` (home page app tile);
  - `PostList` (post index);
  - `ClipPlayer` (a clip and its caption).
- `src/pages/`:
  - `index.astro` (home: intro, apps, recent posts);
  - `[app]/index.astro` (app overview + its posts);
  - `[app]/[post].astro` (a post: header, clips, body).
- `src/lib/posts.ts`: post ids → app and slug, hrefs, dates, the published list (newest first; drafts only in dev).
- `src/styles/tokens.css`: the palette is private (`--palette-*`); components use roles and surfaces only (`--surface-0/1`, `--surface-rule`, `--text-strong/muted`, `--accent`, `--accent-strong`, `--accent-text`). Light is Conrad's Foundry theme, and dark follows `prefers-color-scheme` unless `data-theme` says otherwise.
- `src/styles/base.css`: the only layer that styles bare elements, which covers Markdown bodies. Everything else is class-only.

## Planned

- Real copy for the first posts. Conrad's receipt → transaction post comes first (P8 in Conrad's `plans/portfolio/plan.md`).
- More Conrad posts: QIF import, ledger editing, budget, templates & upcoming, loans, receipt split by items, themes & help, architecture.
- Other apps (Rusty Skillet, Patina, garçon MCP, …), one post each.
- Maybe: a custom domain, a theme toggle, Open Graph images from the clip posters.
