# rbenitez22.github.io

Roberto Benitez's portfolio: a static [Astro](https://astro.build) site, published to GitHub Pages at <https://rbenitez22.github.io>. It shows apps running through short demo clips, plus notes on how each is built. Conrad comes first and is the largest. **No app source lives here.** The apps are private; this repo holds only text, images and video.

The clips, demo data and recording tools live in the Conrad repo under `portfolio-source/` (recorder, VHS tapes, ffmpeg pipeline; plans in `plans/portfolio/`). So do the **drafts**: the private Conrad repo keeps unpublished post pages (`portfolio-source/site-posts/`) and finished clips (`portfolio-source/captures/final/`). This public repo only receives a post on the day it goes live, from Conrad's `portfolio-source/site-posts/publish-post.sh`.

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

`.github/workflows/deploy.yml` builds with `withastro/action@v6` and deploys with `actions/deploy-pages@v5` on every push to `master` (or by hand from the Actions tab). The `github-pages` environment needs `master` as an allowed deployment branch. One-time setup on GitHub: **Settings → Pages → Source: GitHub Actions**. `astro.config.mjs` sets `site: 'https://rbenitez22.github.io'` and no `base`, as a user site needs.

## Content

### Apps: `src/content/apps/<app>.md`

One file per app. The file name is the URL (`/conrad/`), and the Markdown body is the app's overview page. An app file is public as soon as it's pushed, so a new app's page is drafted in Conrad (`site-posts/<app>/_app.md`) and arrives with its first post.

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
pubDate: 2026-10-15
draft: true       # hidden from builds until false; still shown by `npm run dev`
clips:
  - name: ledger-tour          # files under public/media/<app>/
    caption: What the clip shows.
images:                        # optional; shown after the clips, in this order
  - name: chat-ledger.png      # file under public/media/<app>/, extension included
    alt: What the image shows, for screen readers.
    caption: The line under the image.
---
Body…
```

### Taking a post live

Posts go live one at a time, on the day each one is posted on LinkedIn (about weekly). Until then a post's page and clips stay in the private Conrad repo. The tool that brings one here lives there too, because it belongs with the drafts. From the Conrad checkout:

```sh
portfolio-source/site-posts/publish-post.sh conrad/upcoming              # today's date, staged only
portfolio-source/site-posts/publish-post.sh conrad/upcoming 2026-10-21   # a given date
portfolio-source/site-posts/publish-post.sh conrad/upcoming --commit     # also commits just this post here
```

It copies the page and any missing clips and images into this repo, sets `draft: false` and `pubDate:`, and runs this repo's `npm run check` (a failure undoes everything). An app's first post also brings the app's page (`src/content/apps/<app>.md`, drafted in Conrad as `site-posts/<app>/_app.md`), since apps have no draft flag. It then stages the post, its media and any app page here and deletes the drafts in Conrad. With `--commit` it also commits just those files here. It never pushes. Conrad's `portfolio-source/README.md` has the details. It finds this repo at `/programming/rbenitez22.github.io`, or `SITE_DIR`.

**Guard rail (local).** `.git/info/exclude` ignores anything new under `src/content/posts/` and `public/media/`. A stray `git add .` or `git add -A` therefore can't sweep in a post or clip that isn't live. Files already tracked are unaffected, and Conrad's `publish-post.sh` force-adds (`git add -f`) the post it's publishing. That file is never pushed, so on a fresh clone add these two lines to `.git/info/exclude`:

```
/src/content/posts/**
/public/media/**
```


### Clips: `public/media/<app>/`

Each clip is four files: `<name>-wide.mp4` (16:9), `<name>-feed.mp4` (1:1), `<name>-wide-poster.png` and `<name>-feed-poster.png`.
- `ClipPlayer` serves the square video and poster below 40rem, and the wide ones above.
- Clips are silent with captions burned in, so they play muted and inline.
- Conrad's `portfolio-source/site-posts/publish-post.sh` copies a post's clips in when it goes live. To copy one by hand (e.g. a re-take of a live clip), use `portfolio-source/pipeline/publish-clip.sh <clip> [app] [site-dir]` in Conrad.
- Keep each file under 10 MB. GitHub refuses files over 100 MB, and Pages doesn't serve Git LFS.

### Images: `public/media/<app>/`

A post can show still images instead of, or after, its clips. Each is one file named in full (`garcon-chat-ledger.png`) with its `alt` and `caption`.
- `PostImage` frames it like a clip: full column width, rounded border, muted caption.
- The same 10 MB limit applies. A 2560 px wide PNG of a phone screenshot is about 1 MB.

## Structure

- `src/layouts/SiteLayout.astro`: the document (head, fonts, header, footer).
- `src/components/`:
  - `SiteHeader` (Work, then one link per app), `SiteFooter`;
  - `AppCard` (home page app tile);
  - `PostList` (post index);
  - `ClipPlayer` (a clip and its caption);
  - `PostImage` (a still image and its caption).
- `src/pages/`:
  - `index.astro` (home: intro, apps, recent posts);
  - `[app]/index.astro` (app overview + its posts);
  - `[app]/[post].astro` (a post: header, clips, images, body).
- `src/lib/apps.ts`: the apps in their `order`, for the home page and the header (which links every app that has a page).
- `src/lib/posts.ts`: post ids → app and slug, hrefs, dates, the published list (newest first; drafts only in dev).
- `src/styles/tokens.css`: the palette is private (`--palette-*`); components use roles and surfaces only (`--surface-0/1`, `--surface-rule`, `--text-strong/muted`, `--accent`, `--accent-strong`, `--accent-text`). Light is Conrad's Foundry theme, and dark follows `prefers-color-scheme` unless `data-theme` says otherwise.
- `src/styles/base.css`: the only layer that styles bare elements, which covers Markdown bodies. Everything else is class-only.

## Planned

- Real copy for the posts: Conrad posts 1–9 are written as drafts (ledger tour, receipt → transaction, QIF import, ledger editing, templates from the ledger, editing templates, Upcoming, Home at a glance, Home to the work). They go live one a week.
- More Conrad posts: budget, loans, receipt split by items, themes & help, architecture.
- After Conrad: garçon, showing mainly Rusty Skillet and the shopping list; then other apps (Patina, …).
- Maybe: a custom domain, a theme toggle, Open Graph images from the clip posters.
