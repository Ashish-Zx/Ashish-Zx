import { z } from 'zod';

const repoPart = /^[A-Za-z0-9_.-]+$/;
export function parseRepository(
  input: string,
): { owner: string; repo: string } | null {
  const value = input.trim();
  const match = /^(?:https:\/\/github\.com\/)?([^/]+)\/([^/?#]+)\/?$/i.exec(
    value,
  );
  if (!match) return null;
  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, '');
  if (
    !/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(owner) ||
    !repoPart.test(repo) ||
    repo.length > 100 ||
    repo === '.' ||
    repo === '..'
  )
    return null;
  return { owner, repo };
}

export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)
    .replace(/-$/, '');
}

const name = z.string().trim().min(1).max(100);
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(90);
export const postSchema = z.object({
  slug,
  title: name,
  date: z.iso.date(),
  category: name,
  excerpt: z.string().trim().min(1).max(260),
  body: z.string().trim().min(1).max(50000),
  published: z.boolean(),
  sample: z.boolean().optional(),
});
export const projectSchema = z.object({
  slug,
  title: name,
  description: z.string().trim().min(1).max(400),
  repository: z
    .string()
    .startsWith('https://github.com/')
    .refine(
      (value) => !!parseRepository(value),
      'Use a public GitHub repository URL',
    ),
  tags: z.array(z.string().trim().min(1).max(35)).max(6),
  category: name,
  icon: z.enum(['shield', 'layers', 'workflow', 'code']),
  featured: z.boolean(),
});
export const contentSchema = z
  .object({
    projects: z.array(projectSchema).max(100),
    posts: z.array(postSchema).max(100),
  })
  .superRefine((content, ctx) => {
    for (const key of ['projects', 'posts'] as const) {
      if (
        new Set(content[key].map((item) => item.slug)).size !==
        content[key].length
      )
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: 'Slugs must be unique.',
        });
    }
  });

export type Project = z.infer<typeof projectSchema>;
export type Post = z.infer<typeof postSchema>;
export type Content = z.infer<typeof contentSchema>;

export function readingTime(body: string) {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 210));
}
export function formatDate(date: string) {
  return new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
