import type { APIRoute } from 'astro';
import { allModules } from '../lib/parts';

/**
 * Build-time search index. One record per h2 section, so a hit lands the
 * reader on the right part of a long module rather than at its top.
 *
 * The body is raw MDX, so we strip the syntax we actually use rather than
 * pulling in a parser: JSX tags, code fences, math, links, emphasis.
 */
function toPlainText(mdx: string): string {
  return (
    mdx
      // fenced code
      .replace(/```[\s\S]*?```/g, ' ')
      // import statements at the top of the file
      .replace(/^import .*$/gm, ' ')
      // JSX/component tags, but keep the q="..." text of Probe/SelfCheck
      .replace(/<(?:Probe|SelfCheck)\s+q="([^"]*)"[^>]*>/g, ' $1. ')
      .replace(/<[^>]+>/g, ' ')
      // display + inline math
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/\$[^$\n]*\$/g, ' ')
      // markdown table pipes and rules
      .replace(/^\s*\|[-:\s|]+\|\s*$/gm, ' ')
      .replace(/\|/g, ' ')
      // links -> label
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // leftover markup
      .replace(/[#*_`>]/g, ' ')
      .replace(/&\w+;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export const GET: APIRoute = async () => {
  const mods = await allModules();
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const records: Array<Record<string, unknown>> = [];

  for (const m of mods) {
    if (m.data.draft) continue;
    const url = `${base}/${m.id}/`;
    const body = m.body ?? '';

    // Split on top-level "## " headings; the first chunk is the intro.
    const parts = body.split(/^##\s+(.+)$/gm);
    const intro = toPlainText(parts[0] ?? '');

    records.push({
      u: url,
      n: m.data.n,
      m: m.data.title,
      h: 'Overview',
      // `k` is matched but never displayed, so tags do not pollute excerpts.
      k: m.data.tags.join(' '),
      t: `${m.data.blurb} ${intro}`.slice(0, 1600),
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
        n: m.data.n,
        m: m.data.title,
        h: heading,
        t: text.slice(0, 2400),
      });
    }
  }

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json' },
  });
};
