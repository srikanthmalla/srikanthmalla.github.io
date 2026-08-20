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
    Overview.astro                claim + diagram at the top of every module
    MentalModel.astro             a causal chain — nodes, labelled arrows, annotations
    FigRef.astro                  inline dotted-underline trigger for a Figure
    Figure.astro                  the collapsible figure panel + caption
    Roofline.astro                log-log roofline; points, arrows, ridge
    Plot.astro                    line plot, either axis log, direct-labelled
    Bars.astro                    horizontal bars, log by default
    Flow.astro                    stages left-to-right, with an optional branch
    Stack.astro                   vertical layers, `width` narrows them
    Timeline.astro                rows of blocks on a shared time axis
    Grid.astro                    a cell matrix with some cells highlighted
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

## The overview

Every module opens with an `<Overview>` before the first `##`: one sentence
naming the model, then **a diagram of it**, then usually the trap. It is
deliberately not a `<Figure>` — figures are click-to-reveal evidence for one
claim, this is the map at the trailhead, so it is always open and needs no
trigger.

```mdx
<Overview claim="The module's thesis." close="The thing to watch for.">
  <MentalModel alt="…" nodes={[…]} via={['so', 'but', 'hence']} />
</Overview>
```

The picture is the point. A card of bullets restates the prose; a diagram
encodes the relationships the prose spends three paragraphs establishing. Most
modules are an argument — *this is true, therefore that, which breaks when the
following* — so `MentalModel` draws that spine, with the evidence above each
node and the consequence below, and the last node usually being where it fails.
Where a domain picture genuinely captures the whole module (the roofline in ML
Hardware 1) use that instead.

Inline figures are left alone: they are anchored to a specific sentence, whereas
this summarises the whole argument, so the two do not duplicate.

`search.json.ts` pulls the claim, the close and every node label into the
module's intro record, so a module is findable by its thesis and not only by its
blurb.

## Figures

A figure is two components: an inline `<FigRef>` that dotted-underlines a phrase,
and a `<Figure>` block holding the chart. They pair on `id`, and the ref may sit
before or after the block.

```mdx
...so <FigRef for="rl-h100">decode sits 300x below the ridge</FigRef>, which is why...

<Figure id="rl-h100" caption="What the reader should take from it.">
  <Roofline alt="..." peak={989} bw={3.35} points={[...]} arrows={[...]} />
</Figure>
```

The panel **must be a sibling of the paragraph, not inside it** — an SVG nested
in a `<p>` is invalid HTML and the browser reparents it, and MDX rejects a block
component opened mid-paragraph outright. Put it after the paragraph ends.

Figures start collapsed only when `html.js` is set, so a reader without JS sees
every figure expanded rather than none. `<Figure open>` opts out of collapsing.

Not every idea wants a chart. Four diagram components cover the common abstract
shapes — `Flow` for pipelines and decisions, `Stack` for levels and ladders,
`Timeline` for what-happens-when, `Grid` for which-elements — and bespoke inline
SVG inside a `<Figure>` handles the rest, using the `d-*` classes so it themes
with everything else.

Captions accept `*emphasis*`, `**strong**` and `` `code` ``: `caption` is a plain
prop, so MDX never runs markdown over it, and `Figure` does a three-rule inline
pass instead.

Chart colours are `--fig-1/2/3`, separate from the UI accents: the UI set sits at
OKLCH L 0.71-0.76, outside the 0.48-0.67 band that reads correctly as adjacent
series marks on the dark surface. **Three slots only** — a fourth (teal) fails
colourblind separation against the red. Validate any change with the dataviz
skill's `validate_palette.js` against surface `#191c23` (dark) and `#ffffff`
(light). One data series gets one colour; identity comes from direct labels.

## Gotchas

- `/.nojekyll` at the repo root is required — Jekyll would strip `_astro/`.
- A bare `<` followed by a digit or letter in MDX is parsed as a JSX tag. Write
  `under 100` or `&lt;100`, never `<100`.
- Math in a component prop (`<Probe q="... $x$ ...">`) is **not** processed by
  remark-math and renders as literal TeX. Keep `q=` text plain.
- Inline `<code>` is `white-space: nowrap`, so a long literal overflows the page
  at 375px. Split it into several short code spans.
- A `|` inside `$math$` inside a markdown table splits the cell. Use `\lvert`.
- An unescaped `$` before a digit pairs with the next one and remark-math eats
  the prose between them. Write `\$5.50`, never `$5.50`.
- A caption is an HTML attribute, so a straight `"` inside it ends the attribute
  and breaks the MDX parse. Use typographic quotes.
- Anything that inserts imports must look only at the MDX preamble: `import
  triton` inside a code fence also starts with `import `.
- A `<FigRef>` must be a `<span role="button">`, not a `<button>`: a button stays
  inline-block whatever `display` you set, so a trigger phrase that wraps draws
  one full-width underline instead of one per line.
- Font URLs in `global.css` are absolute (`/blog/fonts/...`) and must be updated
  if `base` ever changes.
- Math is KaTeX via `remark-math` + `rehype-katex`; code is Shiki with a
  light/dark theme pair swapped by the `.light` class, not a media query.
- Reading progress and theme live in `localStorage` under `refresher:*` (the
  key prefix predates the rename and is kept so existing progress survives).
- Renaming a series changes its URLs. `src/pages/refresher/` holds meta-refresh
  stubs pointing at `/blog/ml-hardware/`; Astro's `redirects` config cannot
  express this, because the destination sits under a dynamic `[series]` route.
