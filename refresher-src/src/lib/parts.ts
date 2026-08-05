import { getCollection, type CollectionEntry } from 'astro:content';

export type Module = CollectionEntry<'modules'>;

export const PARTS = [
  {
    id: 'A',
    title: 'Foundations',
    note: 'Refresher — territory you already own.',
  },
  {
    id: 'B',
    title: 'The pivot',
    note: 'Throughput instincts, inverted.',
  },
  {
    id: 'C',
    title: 'Substrate',
    note: 'The CPU and the wire.',
  },
  {
    id: 'D',
    title: 'Numerics',
    note: 'Below the framework quantizer.',
  },
  {
    id: 'E',
    title: 'Workloads',
    note: 'What actually runs at nanosecond scale.',
  },
] as const;

/** All modules in canonical order (by `n`). */
export async function allModules(): Promise<Module[]> {
  const mods = await getCollection('modules');
  return mods.sort((a, b) => a.data.n - b.data.n);
}

/** Modules bucketed by Part, in Part order, each bucket in canonical order. */
export async function modulesByPart() {
  const mods = await allModules();
  return PARTS.map((part) => ({
    ...part,
    modules: mods.filter((m) => m.data.part === part.id),
  }));
}

/** Previous / next module in canonical order. */
export function neighbours(mods: Module[], id: string) {
  const i = mods.findIndex((m) => m.id === id);
  return {
    prev: i > 0 ? mods[i - 1] : undefined,
    next: i >= 0 && i < mods.length - 1 ? mods[i + 1] : undefined,
  };
}
