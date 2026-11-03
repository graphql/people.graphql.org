import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
const stories = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
    name: z.string(),
    description: z.string(),
    shareText: z.string().min(1).optional(),
    sidebar: z
      .object({ role: z.string(), introduction: z.string() })
      .optional(),
    publishedAt: z.coerce.date(),
    recordedAt: z.coerce.date(),
    interviewer: z.string(),
    relatedLinks: z
      .object({
        title: z.string(),
        items: z.array(
          z.object({
            title: z.string(),
            url: z.url(),
            description: z.string(),
          }),
        ),
      })
      .optional(),
    github: z
      .string()
      .regex(/^[a-zA-Z0-9-]+$/)
      .optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.url(),
          username: z.string().optional(),
        }),
      )
      .default([]),
    hero: z
      .object({ src: z.string(), alt: z.string(), caption: z.string() })
      .optional(),
  }),
});
const stars = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/stars" }),
  schema: z.object({
    name: z.string(),
    initials: z.string(),
    year: z.number().int(),
    contribution: z.string().optional(),
    tsc: z.boolean().default(false),
    github: z
      .string()
      .regex(/^[a-zA-Z0-9-]+$/)
      .optional(),
    avatar: z
      .string()
      .regex(/^\/avatars\/[a-zA-Z0-9-]+\.png$/)
      .optional(),
  }),
});
const people = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/people" }),
  schema: z.object({
    name: z.string().min(1),
    githubUsername: z
      .string()
      .regex(/^[a-zA-Z0-9-]+$/)
      .optional(),
    avatarUrl: z
      .string()
      .regex(/^(\/|https:\/\/)/)
      .optional(),
    location: z.string().optional(),
    organization: z.string().optional(),
    sourceIds: z.array(z.string().min(1)),
  }),
});
export const collections = { stories, stars, people };
