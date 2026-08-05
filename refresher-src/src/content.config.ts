import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const modules = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/modules' }),
  schema: z.object({
    // Display number, e.g. 1..12 — kept explicit so file names can change.
    n: z.number(),
    title: z.string(),
    // One-line framing shown in the sidebar tooltip and on the contents page.
    blurb: z.string(),
    part: z.enum(['A', 'B', 'C', 'D', 'E']),
    // Rough read time in minutes; hand-set, not word-counted.
    minutes: z.number().default(12),
    // Draft modules render a placeholder and are dimmed in the nav.
    draft: z.boolean().default(false),
    // Free-form tags used by search scoring.
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { modules };
