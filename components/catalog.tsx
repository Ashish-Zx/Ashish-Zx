'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { NoteRow, ProjectCard } from './content-ui';
import type { Post, Project } from '@/lib/content';

type CatalogProps =
  { kind: 'projects'; items: Project[] } | { kind: 'blog'; items: Post[] };
export function Catalog(props: CatalogProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const categories = [
    ...new Set(props.items.map((item) => item.category)),
  ].sort();
  function matches(item: Project | Post) {
    const text =
      'repository' in item
        ? `${item.description} ${item.tags.join(' ')}`
        : item.excerpt;
    return (
      (!category || item.category === category) &&
      `${item.title} ${item.category} ${text}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    );
  }
  const hasMatches = props.items.some(matches);
  const noun = props.kind === 'projects' ? 'projects' : 'posts';
  return (
    <>
      <div className="filter-bar">
        <div className="filters" aria-label="Filter by category">
          {[null, ...categories].map((value) => (
            <button
              key={value ?? ''}
              type="button"
              className="filter"
              aria-pressed={value === category}
              onClick={() => setCategory(value)}
            >
              {value ?? 'All'}
            </button>
          ))}
        </div>
        <label className="search">
          <Search size={17} />
          <span className="sr-only">Search {noun}</span>
          <input
            type="search"
            placeholder={`Search ${noun}…`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      {!hasMatches ? (
        <p className="empty" role="status">
          {props.items.length
            ? `No ${noun} match your search.`
            : `No ${noun} have been added yet.`}{' '}
          {props.items.length > 0 && (
            <button
              className="inline-action"
              onClick={() => {
                setQuery('');
                setCategory(null);
              }}
            >
              Clear filters
            </button>
          )}
        </p>
      ) : props.kind === 'projects' ? (
        <div className="project-grid">
          {props.items.filter(matches).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <ul className="note-list">
          {props.items.filter(matches).map((post) => (
            <NoteRow key={post.slug} post={post} />
          ))}
        </ul>
      )}
    </>
  );
}
