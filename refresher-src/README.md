# refresher-src

Astro source for the **Refresher** series, published at
`https://www.srikanthmalla.com/refresher/` and linked from `learning.html`.

GitHub Pages serves this repo's root as static files, so the *built output* is
committed at `../refresher/`. This directory is the source and is not served.

## Working on it

```bash
cd refresher-src
npm install          # first time only
npm run dev          # http://localhost:4321/refresher/
npm run build        # writes ../refresher/ — commit that directory
```

`npm run build` deletes and regenerates `../refresher/` in full. Nothing should
be hand-edited in there.

## Layout

```
src/
  content/modules/*.mdx   one file per module; frontmatter drives nav + search
  content.config.ts       collection schema (n, title, blurb, part, draft, tags)
  components/
    Sidebar.astro         parts → modules → headings of the current module
    Callout.astro         type="probe" | "trap" | "bridge"
    Probe.astro           one Critical-thinking question + its answer
    SelfCheck.astro       question visible, answer behind a native <details>
    Search.astro          overlay; fetches /refresher/search.json on first use
  layouts/
    BaseLayout.astro      shell, top bar, theme, progress, keyboard nav
    ModuleLayout.astro    module header, prose column, pager
  pages/
    index.astro           contents page
    [...slug].astro       one page per module
    search.json.ts        build-time search index, one record per h2 section
  lib/
    parts.ts              Part metadata, ordering, neighbours
    rehype-enhance.mjs    wraps tables for scroll, adds heading anchors
  styles/global.css       palette, typography, prose rules
public/fonts/             latin-subset variable woff2, self-hosted
```

## Adding a module

Drop an `.mdx` file in `src/content/modules/`. The filename becomes the URL
slug. Set `draft: false` once it is written; drafts render a placeholder, are
dimmed in the nav, and are excluded from the search index.

Each module follows four beats, and the `##` headings are what the sidebar and
search index key off:

```
## The core mental model
## Numbers worth memorizing
## Critical thinking      (<Probe q="...">answer</Probe>)
## Self-check             (<SelfCheck q="...">answer</SelfCheck>)
```

## Notes

- `/.nojekyll` at the repo root is required — Jekyll would otherwise strip the
  `_astro/` asset directory.
- Math is KaTeX via `remark-math` + `rehype-katex`; code is Shiki with a
  light/dark theme pair swapped by the `.light` class, not a media query.
- Reading progress and theme live in `localStorage` under `refresher:*`.
