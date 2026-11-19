import { NextRequest, NextResponse } from 'next/server';
import { parseRepository, slugify } from '@/lib/content';

const fail = (error: string, status: number) =>
  NextResponse.json({ error }, { status });
export async function GET(request: NextRequest) {
  const parts = parseRepository(request.nextUrl.searchParams.get('repo') || '');
  if (!parts)
    return fail('Enter a GitHub repository URL or owner/repository.', 400);
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(parts.owner)}/${encodeURIComponent(parts.repo)}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        redirect: 'error',
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 300 },
      },
    );
    if (response.status === 404)
      return fail('Repository not found. Make sure it is public.', 404);
    if (response.status === 403 || response.status === 429)
      return fail(
        'GitHub’s public API limit was reached. Try later or add the project manually.',
        429,
      );
    if (!response.ok)
      return fail(
        'GitHub could not load this repository. Try again shortly.',
        502,
      );
    const repo = await response.json();
    if (
      !repo.name ||
      !repo.full_name ||
      repo.private ||
      !parseRepository(repo.full_name)
    )
      return fail('No public repository was returned.', 404);
    return NextResponse.json({
      title: repo.name.replace(/[-_]+/g, ' ').trim().slice(0, 100) || repo.name,
      slug: slugify(repo.name),
      description: repo.description?.slice(0, 400) ?? '',
      repository: `https://github.com/${repo.full_name}`,
      tags: [
        ...new Set<string>(
          [repo.language, ...(repo.topics ?? [])].filter(
            (tag): tag is string =>
              typeof tag === 'string' && tag.length > 0 && tag.length <= 35,
          ),
        ),
      ].slice(0, 6),
      icon: 'code',
      category: 'Open Source',
      featured: false,
    });
  } catch {
    return fail(
      'Could not connect to GitHub. Try again or add the project manually.',
      502,
    );
  }
}
