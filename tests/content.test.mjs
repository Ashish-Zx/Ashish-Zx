import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  contentSchema,
  formatDate,
  parseRepository,
  readingTime,
  slugify,
} from '../lib/content.ts';

const seed = JSON.parse(
  readFileSync(new URL('../data/seed.json', import.meta.url), 'utf8'),
);

test('repository import accepts GitHub URLs and short repository names', () => {
  for (const input of [
    '  Ashish-Zx/sentinel-sre  ',
    'https://github.com/Ashish-Zx/sentinel-sre/',
    'https://github.com/Ashish-Zx/sentinel-sre.git',
  ]) {
    assert.deepEqual(parseRepository(input), {
      owner: 'Ashish-Zx',
      repo: 'sentinel-sre',
    });
  }
});
test('repository import rejects off-site URLs, dot segments, and GitHub subpages', () => {
  for (const input of [
    'https://example.org/owner/repo',
    'http://github.com/owner/repo',
    'https://github.com/owner/repo/issues',
    'owner/..',
    'owner/%2Fprivate',
    'owner/repo?other=',
    'owner/repo#fragment',
    'https://github.com@host.tld/owner/repo',
  ])
    assert.equal(parseRepository(input), null, input);
});
test('content validates starter data, and prevents duplicate slugs and external repository URLs', () => {
  assert.equal(contentSchema.safeParse(seed).success, true);
  assert.equal(
    contentSchema.safeParse({ ...seed, posts: [...seed.posts, seed.posts[0]] })
      .success,
    false,
  );
  assert.equal(
    contentSchema.safeParse({
      ...seed,
      projects: [
        { ...seed.projects[0], repository: 'https://example.org/owner/repo' },
      ],
    }).success,
    false,
  );
});
test('slugs, time estimates, and dates display consistently', () => {
  assert.equal(slugify(' A Tést! Title '), 'a-test-title');
  assert.equal(readingTime('word '.repeat(211)), 2);
  assert.equal(formatDate('2026-06-04'), 'Jun 04, 2026');
});
