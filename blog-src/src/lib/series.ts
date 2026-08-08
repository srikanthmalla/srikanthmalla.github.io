import { getCollection, type CollectionEntry } from 'astro:content';

export type Entry = CollectionEntry<'series'>;

export interface Part {
  id: string;
  title: string;
  note: string;
}

export interface Series {
  /** URL segment and content directory name */
  id: string;
  title: string;
  /** shown in the sidebar header and on the blog index */
  subtitle: string;
  /** long description for the index card */
  description: string;
  /** the word used for a unit of this series, e.g. "Module" */
  unit: string;
  parts: Part[];
}

export const SERIES: Series[] = [
  {
    id: 'ml-hardware',
    title: 'ML Hardware & Low-Latency Systems',
    subtitle: 'From roofline to nanosecond inference',
    description:
      'Twelve modules, written for someone who already knows the basics. Starts from roofline and GPU throughput instincts, then inverts them for the batch-of-one regime: tail latency, CPU microarchitecture, PCIe and the wire, fixed-point numerics, and the workloads that answer in nanoseconds.',
    unit: 'Module',
    parts: [
      { id: 'A', title: 'Foundations', note: 'Territory you already own.' },
      { id: 'B', title: 'The pivot', note: 'Throughput instincts, inverted.' },
      { id: 'C', title: 'Substrate', note: 'The CPU and the wire.' },
      { id: 'D', title: 'Numerics', note: 'Below the framework quantizer.' },
      { id: 'E', title: 'Workloads', note: 'What actually runs at nanosecond scale.' },
    ],
  },
  {
    id: 'diffusion',
    title: 'Diffusion',
    subtitle: 'From score matching to fast samplers',
    description:
      'Nine modules on diffusion models for people who have trained one and want the derivations to actually connect. The forward process and why it is designed the way it is, three equivalent views of the objective, the sampler as an ODE solver, guidance, latent and flow-matching formulations, and where inference time actually goes.',
    unit: 'Module',
    parts: [
      { id: 'F', title: 'The process', note: 'What is actually being learned.' },
      { id: 'G', title: 'Sampling', note: 'The generative half, as numerics.' },
      { id: 'H', title: 'Control', note: 'Steering the trajectory.' },
      { id: 'I', title: 'In practice', note: 'Latents, distillation, and cost.' },
    ],
  },
  {
    id: 'ml-software',
    title: 'ML Software & Compilers',
    subtitle: 'How PyTorch becomes kernels',
    description:
      'Fourteen modules on the stack between model code and the GPU. Why eager execution won and what it costs per op, how torch.compile captures Python at runtime, what Inductor and Triton actually generate, how the caching allocator and CUDA Graphs attack the two runtime overheads, and the three places where none of it works cleanly yet: dynamic shapes, MoE routing, and top-k.',
    unit: 'Module',
    parts: [
      { id: 'J', title: 'The fault line', note: 'Why the stack looks like this.' },
      { id: 'K', title: 'Capture', note: 'From Python bytecode to kernels.' },
      { id: 'L', title: 'Runtime', note: 'Memory and launch.' },
      { id: 'M', title: 'Where it breaks', note: 'Dynamism the compiler cannot see.' },
      { id: 'N', title: 'Synthesis', note: 'Choosing, and serving.' },
    ],
  },
  {
    id: 'hw-sw-codesign',
    title: 'ML Hardware/Software Codesign',
    subtitle: 'Compute, memory, interconnect — and the mapping between them',
    description:
      'Fourteen modules on designing the chip and the compiler as one problem. Three resource abstractions — compute, memory, interconnect — each exposing capacity, bandwidth, latency and granularity, plus the field that makes it codesign: who decides placement. Then mapping, the act that binds them, and the four things that break a static mapping: sparsity, precision, dynamism and scale.',
    unit: 'Module',
    parts: [
      { id: 'O', title: 'The three abstractions', note: 'What each resource exposes.' },
      { id: 'P', title: 'Mapping', note: 'The act that binds them.' },
      { id: 'Q', title: 'Where mappings break', note: 'Irregularity, precision, scale.' },
      { id: 'R', title: 'In practice', note: 'Real workloads, real chips, the real loop.' },
    ],
  },
];

export function getSeries(id: string): Series {
  const s = SERIES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown series: ${id}`);
  return s;
}

/** Entries of one series, in canonical order. */
export async function seriesEntries(seriesId: string): Promise<Entry[]> {
  const all = await getCollection('series');
  return all
    .filter((e) => e.id.startsWith(`${seriesId}/`))
    .sort((a, b) => a.data.n - b.data.n);
}

/** Entries bucketed by Part, in Part order. */
export async function entriesByPart(seriesId: string) {
  const entries = await seriesEntries(seriesId);
  return getSeries(seriesId).parts.map((part) => ({
    ...part,
    entries: entries.filter((e) => e.data.part === part.id),
  }));
}

/** The slug segment after the series id, e.g. "01-roofline". */
export function slugOf(entry: Entry): string {
  return entry.id.split('/').slice(1).join('/');
}

export function neighbours(entries: Entry[], id: string) {
  const i = entries.findIndex((e) => e.id === id);
  return {
    prev: i > 0 ? entries[i - 1] : undefined,
    next: i >= 0 && i < entries.length - 1 ? entries[i + 1] : undefined,
  };
}
