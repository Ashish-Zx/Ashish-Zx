'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  BookOpen,
  Check,
  Code2,
  Download,
  Eye,
  Globe,
  LockKeyhole,
  LogOut,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  contentSchema,
  postSchema,
  projectSchema,
  slugify,
  type Content,
  type Post,
  type Project,
} from '@/lib/content';
import { GitHub } from './brand-icons';
import { Markdown } from './markdown';

const storageKey = 'ashish-studio-v1';
const emptyPost = (): Post => ({
  slug: '',
  title: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  category: '',
  body: '',
  published: false,
});
const emptyProject = (): Project => ({
  slug: '',
  title: '',
  description: '',
  repository: '',
  tags: [],
  icon: 'code',
  category: 'Open Source',
  featured: false,
});
type Editor =
  | { kind: 'post'; original?: string; item: Post }
  | { kind: 'project'; original?: string; item: Project; tags: string };
async function studioRequest(
  action: string,
  data: Record<string, unknown> = {},
) {
  const response = await fetch('/api/studio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-portfolio-studio': '1' },
    body: JSON.stringify({ action, ...data }),
  });
  if (!response.ok)
    throw new Error((await response.json()).error ?? 'Studio request failed.');
}
async function loadStudio() {
  const response = await fetch('/api/studio', { cache: 'no-store' });
  if (!response.ok) throw new Error('Please sign in.');
  return contentSchema.parse(await response.json());
}
const messageFrom = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong. Try again.';

export function Studio({ initial }: { initial: Content | null }) {
  const local = initial !== null;
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(initial);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<'posts' | 'projects'>('posts');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [preview, setPreview] = useState(false);
  const [repo, setRepo] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (local) {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
        const result = contentSchema.safeParse(saved);
        if (result.success) setContent(result.data);
      } catch {
        /* A fresh browser starts with the supplied content. */
      }
      setReady(true);
    } else {
      let active = true;
      loadStudio()
        .then((data) => {
          if (active) setContent(data);
        })
        .catch(() => undefined)
        .finally(() => {
          if (active) setReady(true);
        });
      return () => {
        active = false;
      };
    }
  }, [local]);

  async function run(work: () => Promise<void>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await work();
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setBusy(false);
    }
  }
  async function persist(updated: Content) {
    const valid = contentSchema.parse(updated);
    if (local) localStorage.setItem(storageKey, JSON.stringify(valid));
    else {
      await studioRequest('save', { content: valid });
      router.refresh();
    }
    setContent(valid);
  }
  function edit(item: Editor | null) {
    setEditor(item);
    setPreview(false);
    setError('');
    setNotice('');
    setConfirmDelete(null);
  }
  function switchTab(next: 'posts' | 'projects') {
    setTab(next);
    edit(null);
  }
  function editPost(post: Post) {
    if (editor?.kind === 'post') setEditor({ ...editor, item: post });
  }
  function editProject(project: Project) {
    if (editor?.kind === 'project') setEditor({ ...editor, item: project });
  }
  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get('password');
    void run(async () => {
      await studioRequest('login', { password });
      setContent(await loadStudio());
    });
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || !content) return;
    void run(async () => {
      const key = editor.kind === 'post' ? 'posts' : 'projects';
      const slug = editor.item.slug || slugify(editor.item.title);
      if (!slug) throw new Error('Enter a URL slug using letters and numbers.');
      if (
        content[key].some(
          (item) => item.slug === slug && item.slug !== editor.original,
        )
      )
        throw new Error('That URL slug is already in use.');
      if (editor.kind === 'post') {
        const parsed = postSchema.safeParse({
          ...editor.item,
          slug,
          sample: false,
        });
        if (!parsed.success)
          throw new Error(
            'Check the post fields. Use only lowercase letters, numbers, and hyphens in the URL slug.',
          );
        await persist({
          ...content,
          posts: editor.original
            ? content.posts.map((item) =>
                item.slug === editor.original ? parsed.data : item,
              )
            : [parsed.data, ...content.posts],
        });
      } else {
        const parsed = projectSchema.safeParse({
          ...editor.item,
          slug,
          tags: [
            ...new Set(
              editor.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            ),
          ],
        });
        if (!parsed.success)
          throw new Error(
            'Check the project fields. Use a public GitHub URL and up to six tags (35 characters each).',
          );
        await persist({
          ...content,
          projects: editor.original
            ? content.projects.map((item) =>
                item.slug === editor.original ? parsed.data : item,
              )
            : [parsed.data, ...content.projects],
        });
      }
      edit(null);
      setNotice(local ? 'Saved in this browser.' : 'Saved to your site.');
    });
  }
  function remove(slug: string) {
    if (!content) return;
    void run(async () => {
      await persist(
        tab === 'posts'
          ? {
              ...content,
              posts: content.posts.filter((item) => item.slug !== slug),
            }
          : {
              ...content,
              projects: content.projects.filter((item) => item.slug !== slug),
            },
      );
      edit(null);
      setNotice('Item removed.');
    });
  }
  function importRepo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      const response = await fetch(
        `/api/github?repo=${encodeURIComponent(repo)}`,
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Import failed.');
      const existing = content?.projects.find(
        (item) =>
          item.repository.toLowerCase() === result.repository.toLowerCase(),
      );
      if (existing)
        throw new Error(
          'This repository is already listed. Open it from your projects to edit it.',
        );
      edit({ kind: 'project', item: result, tags: result.tags.join(', ') });
      setRepo('');
      setNotice('Repository loaded. Review the details and save to add it.');
    });
  }
  function download() {
    if (!content) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(content, null, 2) + '\n'], {
        type: 'application/json',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!ready)
    return (
      <p className="empty" role="status">
        Opening Studio…
      </p>
    );
  if (!content)
    return (
      <form onSubmit={login} className="surface login-form">
        <span className="project-icon shield">
          <LockKeyhole size={22} />
        </span>
        <h2>Owner sign-in</h2>
        <p>Sign in to manage the public portfolio.</p>
        <label>
          Studio password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            maxLength={1024}
          />
        </label>
        {error && (
          <p className="message error" role="alert">
            {error}
          </p>
        )}
        <button className="button button-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    );
  const items = tab === 'posts' ? content.posts : content.projects;
  return (
    <div className="studio-shell">
      <div className="studio-mode">
        <div>
          {local ? <Eye size={19} /> : <Globe size={19} />}
          <div>
            <strong>
              {local ? 'Local preview mode' : 'Live publishing mode'}
            </strong>
            <p>
              {local
                ? 'Changes stay in this browser and do not appear on the public site. Export your content to keep a copy.'
                : 'Published posts and saved projects appear on the public site.'}
            </p>
          </div>
        </div>
        {local ? (
          <button
            className="button button-secondary button-small"
            onClick={download}
          >
            <Download size={16} /> Export JSON
          </button>
        ) : (
          <button
            className="button button-secondary button-small"
            disabled={busy}
            onClick={() =>
              void run(async () => {
                await studioRequest('logout');
                edit(null);
                setContent(null);
              })
            }
          >
            <LogOut size={16} /> Sign out
          </button>
        )}
      </div>
      <div className="studio-toolbar">
        <div className="filters" aria-label="Content type">
          <button
            className="filter"
            aria-pressed={tab === 'posts'}
            disabled={busy}
            onClick={() => switchTab('posts')}
          >
            <BookOpen size={17} /> Blog posts
          </button>
          <button
            className="filter"
            aria-pressed={tab === 'projects'}
            disabled={busy}
            onClick={() => switchTab('projects')}
          >
            <Code2 size={17} /> Projects
          </button>
        </div>
        <button
          className="button button-primary button-small"
          disabled={busy}
          onClick={() =>
            edit(
              tab === 'posts'
                ? { kind: 'post', item: emptyPost() }
                : { kind: 'project', item: emptyProject(), tags: '' },
            )
          }
        >
          <Plus size={17} /> {tab === 'posts' ? 'New post' : 'New project'}
        </button>
      </div>
      {tab === 'projects' && !editor && (
        <form onSubmit={importRepo} className="surface import-form">
          <label htmlFor="repo-input">
            <GitHub /> Import from GitHub
          </label>
          <div>
            <input
              id="repo-input"
              placeholder="owner/repository or GitHub URL"
              value={repo}
              onChange={(event) => setRepo(event.target.value)}
              required
              maxLength={260}
            />
            <button className="button button-secondary" disabled={busy}>
              {busy ? 'Working…' : 'Import'}
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="message error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="message success" role="status">
          <Check size={17} />
          {notice}
        </p>
      )}
      {editor ? (
        <form onSubmit={save} className="surface editor-form">
          <div className="editor-heading">
            <h2>
              {editor.original ? 'Edit' : 'New'} {editor.kind}
            </h2>
            <button
              type="button"
              className="icon-button"
              aria-label="Close editor"
              disabled={busy}
              onClick={() => edit(null)}
            >
              <X size={20} />
            </button>
          </div>
          {editor.kind === 'post' ? (
            <>
              <div className="form-grid">
                <label>
                  Title
                  <input
                    autoFocus
                    value={editor.item.title}
                    onChange={(event) =>
                      editPost({ ...editor.item, title: event.target.value })
                    }
                    maxLength={100}
                    required
                  />
                </label>
                <label>
                  URL slug
                  <input
                    value={editor.item.slug}
                    placeholder={
                      slugify(editor.item.title) || 'generated-from-title'
                    }
                    onChange={(event) =>
                      editPost({ ...editor.item, slug: event.target.value })
                    }
                    maxLength={90}
                  />
                </label>
                <label>
                  Category
                  <input
                    value={editor.item.category}
                    onChange={(event) =>
                      editPost({ ...editor.item, category: event.target.value })
                    }
                    maxLength={100}
                    placeholder="e.g. Reliability"
                    required
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={editor.item.date}
                    onChange={(event) =>
                      editPost({ ...editor.item, date: event.target.value })
                    }
                    required
                  />
                </label>
              </div>
              <label>
                Excerpt
                <textarea
                  rows={2}
                  maxLength={260}
                  value={editor.item.excerpt}
                  onChange={(event) =>
                    editPost({ ...editor.item, excerpt: event.target.value })
                  }
                  required
                />
              </label>
              <div>
                <div className="editor-heading">
                  <label htmlFor={preview ? undefined : 'editor-body'}>
                    Article body <span className="muted">(Markdown)</span>
                  </label>
                  <button
                    type="button"
                    className="filter"
                    aria-pressed={preview}
                    onClick={() => setPreview(!preview)}
                  >
                    <Eye size={16} /> {preview ? 'Back to editor' : 'Preview'}
                  </button>
                </div>
                {preview ? (
                  <div className="markdown-preview">
                    {editor.item.body.trim() ? (
                      <Markdown>{editor.item.body}</Markdown>
                    ) : (
                      <p className="muted">Nothing to preview yet.</p>
                    )}
                  </div>
                ) : (
                  <textarea
                    id="editor-body"
                    className="body-input"
                    rows={11}
                    value={editor.item.body}
                    onChange={(event) =>
                      editPost({ ...editor.item, body: event.target.value })
                    }
                    maxLength={50000}
                    required
                  />
                )}
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={editor.item.published}
                  onChange={(event) =>
                    editPost({
                      ...editor.item,
                      published: event.target.checked,
                    })
                  }
                />{' '}
                {local
                  ? 'Mark as published (local only)'
                  : 'Publish on the public blog'}
              </label>
            </>
          ) : (
            <>
              <div className="form-grid">
                <label>
                  Title
                  <input
                    autoFocus
                    value={editor.item.title}
                    onChange={(event) =>
                      editProject({ ...editor.item, title: event.target.value })
                    }
                    maxLength={100}
                    required
                  />
                </label>
                <label>
                  URL slug
                  <input
                    value={editor.item.slug}
                    placeholder={
                      slugify(editor.item.title) || 'generated-from-title'
                    }
                    onChange={(event) =>
                      editProject({ ...editor.item, slug: event.target.value })
                    }
                    maxLength={90}
                  />
                </label>
                <label>
                  GitHub repository
                  <input
                    type="url"
                    value={editor.item.repository}
                    onChange={(event) =>
                      editProject({
                        ...editor.item,
                        repository: event.target.value,
                      })
                    }
                    maxLength={260}
                    required
                  />
                </label>
                <label>
                  Category
                  <input
                    value={editor.item.category}
                    onChange={(event) =>
                      editProject({
                        ...editor.item,
                        category: event.target.value,
                      })
                    }
                    maxLength={100}
                    required
                  />
                </label>
              </div>
              <label>
                Description
                <textarea
                  rows={3}
                  maxLength={400}
                  value={editor.item.description}
                  onChange={(event) =>
                    editProject({
                      ...editor.item,
                      description: event.target.value,
                    })
                  }
                  required
                />
              </label>
              <div className="form-grid">
                <label>
                  Technology tags{' '}
                  <span className="muted">(comma separated)</span>
                  <input
                    value={editor.tags}
                    maxLength={225}
                    onChange={(event) =>
                      setEditor({ ...editor, tags: event.target.value })
                    }
                  />
                </label>
                <label>
                  Card icon
                  <select
                    value={editor.item.icon}
                    onChange={(event) =>
                      editProject({
                        ...editor.item,
                        icon: event.target.value as Project['icon'],
                      })
                    }
                  >
                    <option value="code">Code</option>
                    <option value="shield">Shield</option>
                    <option value="layers">Layers</option>
                    <option value="workflow">Workflow</option>
                  </select>
                </label>
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={editor.item.featured}
                  onChange={(event) =>
                    editProject({
                      ...editor.item,
                      featured: event.target.checked,
                    })
                  }
                />{' '}
                Feature on the homepage
              </label>
            </>
          )}
          <div className="editor-actions">
            <button className="button button-primary" disabled={busy}>
              {busy
                ? 'Saving…'
                : editor.kind === 'project'
                  ? 'Save project'
                  : editor.item.published && !local
                    ? 'Publish post'
                    : 'Save post'}
            </button>
            <button
              type="button"
              className="button button-secondary"
              disabled={busy}
              onClick={() => edit(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="surface studio-list">
          {items.length ? (
            <ul>
              {items.map((item) => (
                <li key={item.slug}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {'published' in item
                        ? item.published
                          ? 'Published'
                          : 'Draft'
                        : item.featured
                          ? 'Featured project'
                          : item.category}
                    </span>
                  </div>
                  {confirmDelete === item.slug ? (
                    <div className="item-actions">
                      <button
                        className="inline-action danger"
                        disabled={busy}
                        onClick={() => remove(item.slug)}
                      >
                        Confirm delete
                      </button>
                      <button
                        className="inline-action"
                        disabled={busy}
                        onClick={() => setConfirmDelete(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="item-actions">
                      <button
                        className="inline-action"
                        disabled={busy}
                        onClick={() =>
                          edit(
                            'published' in item
                              ? { kind: 'post', original: item.slug, item }
                              : {
                                  kind: 'project',
                                  original: item.slug,
                                  item,
                                  tags: item.tags.join(', '),
                                },
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="icon-button danger"
                        disabled={busy}
                        aria-label={`Delete ${item.title}`}
                        onClick={() => setConfirmDelete(item.slug)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No {tab} yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
