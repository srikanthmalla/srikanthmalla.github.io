import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeEnhance } from './src/lib/rehype-enhance.mjs';

// The built site is committed to ../refresher/ and served by GitHub Pages
// at https://www.srikanthmalla.com/refresher/
export default defineConfig({
  site: 'https://www.srikanthmalla.com',
  base: '/refresher',
  outDir: '../refresher',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    // rehypeHeadingIds runs first so rehypeEnhance can hang anchors off the ids.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeHeadingIds, rehypeKatex, rehypeEnhance],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-default' },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
