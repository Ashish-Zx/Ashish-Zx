import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  Cpu,
  MapPin,
  Network,
  ShieldCheck,
  Code2,
  Mail,
} from 'lucide-react';
import { SectionLabel } from '@/components/content-ui';
import { GitHub, LinkedIn } from '@/components/brand-icons';
export const metadata: Metadata = {
  title: 'About',
  description:
    'About Ashish Kumar Shah, a computer engineering student based in Nepal.',
};
const focus = [
  {
    icon: Cpu,
    title: 'Applied AI',
    text: 'Working with model training, ML pipelines, and systems that put research to use.',
  },
  {
    icon: Network,
    title: 'Multi-agent systems',
    text: 'Designing workflows where agents investigate independently and their outputs can be verified.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliability',
    text: 'Building incident-response tools and keeping humans in the loop for sensitive decisions.',
  },
  {
    icon: Code2,
    title: 'Full-stack engineering',
    text: 'Building TypeScript and React interfaces backed by Python services.',
  },
];
export default function About() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <SectionLabel number="03">BEHIND THE WORK</SectionLabel>
          <h1>
            About me<span className="accent">.</span>
          </h1>
          <p>
            Hi, I’m Ashish Kumar Shah, a computer engineering student based in
            Nepal.
          </p>
        </div>
      </div>
      <div className="container about-layout">
        <section className="about-copy">
          <div className="status-pill">
            <MapPin size={14} /> BASED IN NEPAL
          </div>
          <h2>I like building software people can trust.</h2>
          <p>
            My work spans applied AI, multi-agent systems, and full-stack
            engineering. I’m especially interested in how verification, testing,
            and human review make AI systems more useful in practice.
          </p>
          <p>
            I’m currently building{' '}
            <a
              href="https://github.com/Ashish-Zx/sentinel-sre"
              target="_blank"
              rel="noreferrer"
            >
              SentinelSRE
            </a>
            , a platform for investigating production incidents and turning a
            proposed fix into a verified draft pull request.
          </p>
          <Link className="text-link" href="/projects">
            See what I’m building <ArrowUpRight size={17} />
          </Link>
          <div className="about-socials">
            <a
              aria-label="GitHub"
              href="https://github.com/Ashish-Zx"
              target="_blank"
              rel="noreferrer"
            >
              <GitHub />
            </a>
            <a
              aria-label="LinkedIn"
              href="https://www.linkedin.com/in/ashishzx"
              target="_blank"
              rel="noreferrer"
            >
              <LinkedIn />
            </a>
            <a aria-label="Email" href="mailto:ashish2062official@gmail.com">
              <Mail size={18} />
            </a>
          </div>
        </section>
        <section aria-label="Focus areas" className="focus-grid">
          {focus.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span className="project-icon shield">
                <Icon size={22} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}
