import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { ProjectArt } from './project-art';
import Link from 'next/link';
import {
  formatDate,
  readingTime,
  type Project,
  type Post,
} from '@/lib/content';

export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="section-label">
      <span>{number} /</span> {children}
    </p>
  );
}
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <ProjectArt icon={project.icon} />
      <div className="project-info">
        <div className="project-top">
          <span className="project-category">{project.category}</span>
          <ArrowUpRight className="project-arrow" size={18} strokeWidth={1.8} />
        </div>
        <h3>
          <a
            className="stretched"
            href={project.repository}
            target="_blank"
            rel="noreferrer"
          >
            {project.title}
            <span className="sr-only"> (opens on GitHub in a new tab)</span>
          </a>
        </h3>
        <p>{project.description}</p>
        <ul className="tags" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
export function NoteRow({ post }: { post: Post }) {
  return (
    <li className="note-row">
      <Link href={`/blog/${post.slug}`}>
        <div className="note-meta">
          <span className="note-category">{post.category}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <div className="note-main">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
        <span className="note-time">
          <Clock3 size={15} /> {readingTime(post.body)} min read
        </span>
        <ArrowRight className="note-arrow" size={19} />
      </Link>
    </li>
  );
}
