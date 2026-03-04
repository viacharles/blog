import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string().optional(),
    order: z.number(),
    section: z.string(),
    pubDate: z.coerce.date()
  })
});

export const collections = { docs };
