import type { Metadata } from 'next';
import { SectionLabel } from '@/components/content-ui';
import { Studio } from '@/components/studio';
import { studioConfigured } from '@/lib/auth';
import { getContent, publicPosts } from '@/lib/store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
};
export default async function StudioPage() {
  const configured = studioConfigured();
  const content = configured ? null : await getContent();
  return (
    <>
      <div className="page-banner studio-banner">
        <div className="container">
          <SectionLabel number="04">CONTENT WORKSPACE</SectionLabel>
          <h1>
            Studio<span className="accent">.</span>
          </h1>
          <p>
            Write, edit, and publish blog posts, or bring in a project from
            GitHub.
          </p>
        </div>
      </div>
      <section className="container listing-section">
        <Studio
          initial={content ? { ...content, posts: publicPosts(content) } : null}
        />
      </section>
    </>
  );
}
