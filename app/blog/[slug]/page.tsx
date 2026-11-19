import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock3 } from 'lucide-react';
import { formatDate, readingTime } from '@/lib/content';
import { getContent, publicPosts } from '@/lib/store';
import { Markdown } from '@/components/markdown';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
async function getPost(slug: string) {
  return publicPosts(await getContent()).find((post) => post.slug === slug);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  return post
    ? { title: post.title, description: post.excerpt }
    : { title: 'Post not found' };
}
export default async function Article({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  return (
    <article className="article container-narrow">
      <Link className="text-link back-link" href="/blog">
        <ArrowLeft size={17} /> All posts
      </Link>
      <header>
        <div className="article-meta">
          <span className="note-category">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>
            <Clock3 size={15} /> {readingTime(post.body)} min read
          </span>
        </div>
        <h1>
          {post.title}
          <span className="accent">.</span>
        </h1>
        <p>{post.excerpt}</p>
        {post.sample && <span className="sample-badge">Starter article</span>}
      </header>
      <Markdown>{post.body}</Markdown>
    </article>
  );
}
