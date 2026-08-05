/**
 * Two small HTML tweaks that are easier here than in every .mdx file:
 *
 *  1. wrap <table> in a scroll container, so wide number tables never make
 *     the page itself scroll sideways
 *  2. append a quiet "#" anchor to h2/h3/h4 (revealed on hover by CSS)
 *
 * Written as a plain recursive walk to avoid taking a direct dependency on
 * unist-util-visit.
 */
const HEADINGS = new Set(['h2', 'h3', 'h4']);

export function rehypeEnhance() {
  return (tree) => walk(tree);
}

function walk(node) {
  if (!node.children) return;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];

    if (child.type === 'element' && child.tagName === 'table') {
      node.children[i] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [child],
      };
      continue;
    }

    if (child.type === 'element' && HEADINGS.has(child.tagName)) {
      const id = child.properties?.id;
      if (id) {
        child.children.push({
          type: 'element',
          tagName: 'a',
          properties: {
            className: ['anchor'],
            href: `#${id}`,
            'aria-hidden': 'true',
            tabindex: -1,
          },
          children: [{ type: 'text', value: '#' }],
        });
      }
      continue;
    }

    walk(child);
  }
}
