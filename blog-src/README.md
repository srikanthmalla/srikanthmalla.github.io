# blog-src

Astro source for the blog series, published under
`https://www.srikanthmalla.com/blog/` and linked from `learning.html`.

GitHub Pages serves this repo's root as static files, so the *built output* is
committed at `../blog/`. This directory is the source and is not served.

## Working on it

```bash
cd blog-src
npm install          # first time only
npm run dev          # http://localhost:4321/blog/
npm run build        # writes ../blog/ — commit that directory
```

`npm run build` deletes and regenerates `../blog/` in full. Nothing in there
should ever be hand-edited. Run it from this directory, not from a subdirectory.

## URLs

```
/blog/                                  all series
/blog/<series>/                         one series' contents page
/blog/<series>/<slug>/                  one module
/blog/search.json                       build-time search index
```

## Layout

```
src/
  content/series/<series>/*.mdx   one file per module; the directory is the series id
  content.config.ts               frontmatter schema (n, title, blurb, part, draft, tags)
  lib/series.ts                   SERIES definitions, part metadata, ordering, neighbours
  components/
    Sidebar.astro                 parts → modules → headings of the current module
    Callout.astro                 type="probe" | "trap" | "bridge"
    Probe.astro                   one Critical-thinking question + its answer
    SelfCheck.astro               question visible, answer behind a native <details>
    Search.astro                  overlay; fetches /blog/search.json on first use
  layouts/
    BaseLayout.astro              shell, top bar, theme, progress, keyboard nav
    EntryLayout.astro             module header, prose column, pager
  pages/
    index.astro                   /blog/ — lists every series
    [series]/index.astro          series contents page
    [series]/[slug].astro         one page per module
    search.json.ts                search index across all series
  lib/rehype-enhance.mjs          wraps tables for scroll, adds heading anchors
  styles/global.css               palette, typography, prose rules
public/fonts/                     latin-subset variable woff2, self-hosted
```

## Adding a series

1. Create `src/content/series/<id>/` and drop `.mdx` files in it.
2. Add an entry to `SERIES` in `src/lib/series.ts` with its `parts`.
3. Add a card to the blog index if it needs promoting elsewhere.

Part ids must be unique across the whole collection, since one collection backs
every series — ML Hardware uses A-E, Diffusion F-I, ML Software J-N, and
HW/SW Codesign O-R, Serving Kimi K3 S-V.

## Adding a module

Drop an `.mdx` file in the series directory. The filename becomes the URL slug.
Set `draft: false` once written; drafts are dimmed in the nav and excluded from
search. Import paths are three levels up:

```js
import Callout from '../../../components/Callout.astro';
```

Each module follows four beats, and the `##` headings are what the sidebar and
search index key off. Beats 1, 3 and 4 are identical across series; **beat 2 is
named for what that series' second section actually contains**, because a
generic label over comparison tables, code listings and pipeline diagrams reads
as an appendix rather than as part of the argument:

```
## The core mental model
## <beat 2 — see below>
## Critical thinking      (<Probe q="...">answer</Probe>)
## Self-check             (<SelfCheck q="...">answer</SelfCheck>)
```

| Series      | Beat 2                          | Because it holds            |
| ----------- | ------------------------------- | --------------------------- |
| ml-hardware | `Numbers worth memorizing`      | latency ladders, ridge points — genuine recall targets |
| diffusion   | `The formulas and the numbers`  | conversions, schedules, parameter values |
| ml-software | `How it actually works`         | pipelines, kernels, costs, commands |
| hw-sw-codesign | `The design space, quantified` | energy/bandwidth ladders, loop-nest notation, architecture comparisons |
| serving-k3  | `What the reports actually measured` | cited figures, cluster shapes, engine configs, flags |

Every table in beat 2 opens with a sentence saying what it is for. A section
that starts on a bare `|` reads as a dump; the lead-in is what makes it a beat.

## Gotchas

- `/.nojekyll` at the repo root is required — Jekyll would strip `_astro/`.
- A bare `<` followed by a digit or letter in MDX is parsed as a JSX tag. Write
  `under 100` or `&lt;100`, never `<100`.
- Math in a component prop (`<Probe q="... $x$ ...">`) is **not** processed by
  remark-math and renders as literal TeX. Keep `q=` text plain.
- Inline `<code>` is `white-space: nowrap`, so a long literal overflows the page
  at 375px. Split it into several short code spans.
- A `|` inside `$math$` inside a markdown table splits the cell. Use `\lvert`.
- Font URLs in `global.css` are absolute (`/blog/fonts/...`) and must be updated
  if `base` ever changes.
- Math is KaTeX via `remark-math` + `rehype-katex`; code is Shiki with a
  light/dark theme pair swapped by the `.light` class, not a media query.
- Reading progress and theme live in `localStorage` under `refresher:*` (the
  key prefix predates the rename and is kept so existing progress survives).
- Renaming a series changes its URLs. `src/pages/refresher/` holds meta-refresh
  stubs pointing at `/blog/ml-hardware/`; Astro's `redirects` config cannot
  express this, because the destination sits under a dynamic `[series]` route.
