import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Crosshair,
  Mail,
  MapPin,
} from 'lucide-react';
import { NoteRow, ProjectCard, SectionLabel } from '@/components/content-ui';
import { GitHub } from '@/components/brand-icons';
import { getContent, publicPosts } from '@/lib/store';

export const dynamic = 'force-dynamic';
export default async function Home() {
  const content = await getContent();
  const projects = content.projects
    .filter((project) => project.featured)
    .slice(0, 3);
  const picked = projects.length ? projects : content.projects.slice(0, 3);
  const notes = publicPosts(content).slice(0, 3);
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-intro">
              <span aria-hidden="true" /> Ashish Kumar Shah
            </p>
            <h1>
              Building systems
              <br /> <span>that think.</span>
            </h1>
            <p className="hero-description">
              I’m a computer engineering student working on applied AI,
              multi-agent systems, and reliable software.
            </p>
            <div className="hero-actions">
              <Link href="/projects" className="button button-primary">
                Explore my work <ArrowUpRight size={18} />
              </Link>
              <Link href="/blog" className="button button-secondary">
                <BookOpen size={17} /> Read the blog
              </Link>
            </div>
          </div>
          <figure className="hero-figure">
            <Image
              src="/images/flow-field.webp"
              alt="An abstract knot of translucent jade glass, with fine strands tracing its curves"
              fill
              preload
              sizes="(max-width: 660px) 100vw, (max-width: 1100px) 52vw, 620px"
            />
            <div className="figure-guides" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <figcaption>
              <Crosshair size={15} />
              <span>FIG. 01</span>
              <span>Jade topology</span>
            </figcaption>
          </figure>
        </div>
        <div className="hero-index">
          <div className="container hero-index-inner">
            <p>
              <span className="status-dot" /> Open to collaborate
            </p>
            <p>
              <MapPin size={15} /> Based in Nepal
            </p>
            <a href="#selected-work">
              Scroll to work <ArrowDown size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="container home-section" id="selected-work">
        <div className="section-heading">
          <div>
            <SectionLabel number="01">THE PORTFOLIO</SectionLabel>
            <h2>
              Selected projects<span className="accent">.</span>
            </h2>
            <p>A few things I’ve built and shared on GitHub.</p>
          </div>
          <Link className="text-link section-link" href="/projects">
            All projects <ArrowUpRight size={17} />
          </Link>
        </div>
        {picked.length ? (
          <div className="project-grid">
            {picked.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="empty">No projects have been added yet.</p>
        )}
      </section>

      <section className="notes-section">
        <div className="container home-section journal-layout">
          <div className="section-heading">
            <div>
              <SectionLabel number="02">THE JOURNAL</SectionLabel>
              <h2>
                Field notes<span className="accent">.</span>
              </h2>
              <p>
                What I’m learning about AI, reliability, and building software.
              </p>
            </div>
            <Link className="text-link section-link" href="/blog">
              All posts <ArrowUpRight size={17} />
            </Link>
          </div>
          {notes.length ? (
            <ul className="note-list">
              {notes.map((post) => (
                <NoteRow key={post.slug} post={post} />
              ))}
            </ul>
          ) : (
            <p className="empty">No posts have been published yet.</p>
          )}
        </div>
      </section>

      <section className="container contact-section">
        <div className="contact-panel">
          <div>
            <SectionLabel number="03">GET IN TOUCH</SectionLabel>
            <h2>
              Let’s build something<span className="accent">.</span>
            </h2>
            <p>
              Have a project, a question, or a good problem to solve? I’d love
              to hear about it.
            </p>
            <div className="hero-actions">
              <a
                href="mailto:ashish2062official@gmail.com"
                className="button button-primary"
              >
                <Mail size={17} /> Say hello <ArrowRight size={16} />
              </a>
              <a
                href="https://github.com/Ashish-Zx"
                target="_blank"
                rel="noreferrer"
                className="button button-secondary"
              >
                <GitHub /> GitHub
              </a>
            </div>
          </div>
          <svg
            className="contact-decoration"
            viewBox="0 0 540 300"
            aria-hidden="true"
            fill="none"
          >
            {Array.from({ length: 15 }, (_, index) => (
              <ellipse
                key={index}
                cx="350"
                cy="150"
                rx={120 + index * 10}
                ry={12 + index * 8}
                transform={`rotate(${-35 + index * 3} 350 150)`}
                stroke="currentColor"
              />
            ))}
          </svg>
        </div>
      </section>
    </>
  );
}
