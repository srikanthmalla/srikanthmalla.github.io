import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One collection for every series. The directory under src/content/series/
 * becomes the series id, so an entry id looks like "refresher/01-roofline"
 * and the URL is /blog/refresher/01-roofline/.
 *
 * Adding a series means adding a directory here plus an entry in SERIES
 * (src/lib/series.ts). Nothing else needs touching.
 */
const series = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/series' }),
  schema: z.object({
    // Display number within its series — explicit so filenames can change.
    n: z.number(),
    title: z.string(),
    // One-line framing shown in the sidebar tooltip and on the contents page.
    blurb: z.string(),
    // Which group this belongs to, as keyed in the series definition.
    part: z.string(),
    // Rough read time in minutes; hand-set, not word-counted.
    minutes: z.number().default(12),
    // Drafts are dimmed in the nav and excluded from search.
    draft: z.boolean().default(false),
    // Free-form tags used by search scoring.
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { series };
