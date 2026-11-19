import type { Metadata } from 'next';
import { Catalog } from '@/components/catalog';
import { SectionLabel } from '@/components/content-ui';
import { getContent } from '@/lib/store';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Open-source projects by Ashish Shah, from agentic AI to reliability tooling.',
};
export default async function Projects() {
  const { projects } = await getContent();
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <SectionLabel number="01">THE PORTFOLIO</SectionLabel>
          <h1>
            Projects<span className="accent">.</span>
          </h1>
          <p>
            Open-source experiments and tools in AI, reliability, and full-stack
            engineering.
          </p>
        </div>
      </div>
      <section
        className="container listing-section"
        aria-label="Project catalog"
      >
        <Catalog kind="projects" items={projects} />
      </section>
    </>
  );
}
