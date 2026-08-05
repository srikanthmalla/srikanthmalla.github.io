import type { APIRoute } from 'astro';
import { SERIES, seriesEntries, getSeries, slugOf } from '../lib/series';

/**
 * Build-time search index across every series. One record per h2 section, so a
 * hit lands the reader on the right part of a long module rather than its top.
 *
 * The body is raw MDX, so we strip the syntax we actually use rather than
 * pulling in a parser: JSX tags, code fences, math, links, emphasis.
 */
function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import .*$/gm, ' ')
    .replace(/<(?:Probe|SelfCheck)\s+q="([^"]*)"[^>]*>/g, ' $1. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]*\$/g, ' ')
    .replace(/^\s*\|[-:\s|]+\|\s*$/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`>]/g, ' ')
    .replace(/&\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const records: Array<Record<string, unknown>> = [];

  for (const s of SERIES) {
    const series = getSeries(s.id);
    for (const e of await seriesEntries(s.id)) {
      if (e.data.draft) continue;
      const url = `${base}/${s.id}/${slugOf(e)}/`;
      const body = e.body ?? '';

      const parts = body.split(/^##\s+(.+)$/gm);
      const intro = toPlainText(parts[0] ?? '');

      records.push({
        u: url,
        n: e.data.n,
        s: series.title,
        m: e.data.title,
        h: 'Overview',
        k: e.data.tags.join(' '),
        t: `${e.data.blurb} ${intro}`.slice(0, 1600),
      });

      for (let i = 1; i < parts.length; i += 2) {
        const heading = parts[i].replace(/[*`_]/g, '').trim();
        const slug = heading
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        const text = toPlainText(parts[i + 1] ?? '');
        if (!text) continue;
        records.push({
          u: `${url}#${slug}`,
          n: e.data.n,
          s: series.title,
          m: e.data.title,
          h: heading,
          t: text.slice(0, 2400),
        });
      }
    }
  }

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json' },
  });
};
