import 'server-only';
import { mkdir, readFile, rename, writeFile, rm } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import seed from '@/data/seed.json';
import { contentSchema, type Content } from './content';

const dataFile = () =>
  process.env.PORTFOLIO_DATA_FILE ||
  path.join(process.cwd(), 'data', 'portfolio.json');
export async function getContent(): Promise<Content> {
  try {
    return contentSchema.parse(
      JSON.parse(
        await readFile(/* turbopackIgnore: true */ dataFile(), 'utf8'),
      ),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    return contentSchema.parse(seed);
  }
}
export async function saveContent(content: Content) {
  const destination = dataFile();
  await mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(content, null, 2) + '\n', {
      mode: 0o600,
    });
    await rename(temporary, destination);
  } finally {
    await rm(temporary, { force: true });
  }
}
export const publicPosts = (content: Content) =>
  content.posts
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));
