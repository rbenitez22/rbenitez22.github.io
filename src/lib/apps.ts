import { getCollection, type CollectionEntry } from 'astro:content';

type App = CollectionEntry<'apps'>;

function compareByOrder(a: App, b: App): number {
  return a.data.order - b.data.order;
}

/** Every app with a page, in its `order`; an app appears once its file is in the site. */
export async function listAppsInOrder(): Promise<App[]> {
  const apps = await getCollection('apps');
  return apps.sort(compareByOrder);
}
