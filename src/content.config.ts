import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().min(1),
    permalink: z.string().regex(/^\/(?:.*\/)?$/),
    description: z.string(),
    canonicalPath: z.string(),
    category: z.string(),
    source: z.string(),
    sourcePath: z.string(),
    wordpressId: z.number().nullable(),
    reviewStatus: z.enum(['imported-needs-review', 'authored-needs-review', 'reviewed']),
    notes: z.array(z.string()),
    priority: z.string(),
  }),
});
export const collections = { pages };
