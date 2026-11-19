import type { Metadata } from 'next';
import { Catalog } from '@/components/catalog';
import { SectionLabel } from '@/components/content-ui';
import { getContent, publicPosts } from '@/lib/store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Field notes on applied AI, reliability, and building software.',
};
export default async function Blog() {
  const posts = publicPosts(await getContent());
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <SectionLabel number="02">THE JOURNAL</SectionLabel>
          <h1>
            Field notes<span className="accent">.</span>
          </h1>
          <p>Practical notes on AI, reliability, and building software.</p>
        </div>
      </div>
      <section className="container listing-section" aria-label="Blog catalog">
        <Catalog kind="blog" items={posts} />
      </section>
    </>
  );
}
