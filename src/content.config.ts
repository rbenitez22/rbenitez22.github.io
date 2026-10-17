import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** One entry per showcased app; the Markdown body is its overview page. */
const apps = defineCollection({
  loader: glob({ base: './src/content/apps', pattern: '*.md' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

/** A clip published under public/media/<app>/: <clip>-wide.mp4, -feed.mp4 and their posters. */
const clip = z.object({
  name: z.string(),
  caption: z.string(),
});

/** One entry per post; the folder under posts/ names the app it belongs to. */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '*/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    clips: z.array(clip).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { apps, posts };
