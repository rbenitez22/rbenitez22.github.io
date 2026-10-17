import { getCollection, type CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

/** Post ids are "<app>/<slug>", from the folder the Markdown file sits in. */
export function readAppOf(post: Post): string {
  return post.id.split('/')[0];
}

export function readSlugOf(post: Post): string {
  return post.id.split('/').slice(1).join('/');
}

export function buildPostHref(post: Post): string {
  return `/${readAppOf(post)}/${readSlugOf(post)}/`;
}

export function formatPublished(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function comparePublishedNewestFirst(a: Post, b: Post): number {
  return b.data.pubDate.getTime() - a.data.pubDate.getTime();
}

/** Drafts show up under `astro dev` so they can be previewed, never in a build. */
function isVisible(post: Post): boolean {
  return import.meta.env.DEV || !post.data.draft;
}

export async function listPublishedPosts(app?: string): Promise<Post[]> {
  const posts = await getCollection('posts', isVisible);
  return posts
    .filter((post) => app === undefined || readAppOf(post) === app)
    .sort(comparePublishedNewestFirst);
}
