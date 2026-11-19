import { NextRequest, NextResponse } from 'next/server';
import { contentSchema } from '@/lib/content';
import { getContent, saveContent } from '@/lib/store';
import {
  correctPassword,
  createSession,
  sessionDuration,
  sessionName,
  studioConfigured,
  validSession,
} from '@/lib/auth';

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });
const authorized = (request: NextRequest) =>
  validSession(request.cookies.get(sessionName)?.value);
export async function GET(request: NextRequest) {
  if (!authorized(request)) return error('Sign in to open the studio.', 401);
  return NextResponse.json(await getContent(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
export async function POST(request: NextRequest) {
  if (request.headers.get('x-portfolio-studio') !== '1')
    return error('Invalid studio request.', 403);
  if (!studioConfigured())
    return error('Public publishing is not configured.', 503);
  if (Number(request.headers.get('content-length')) > 2_000_000)
    return error('The request is too large.', 413);
  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid request.', 400);
  }
  if (body?.action === 'login') {
    if (
      typeof body.password !== 'string' ||
      body.password.length > 1024 ||
      !correctPassword(body.password)
    )
      return error('That password was not accepted.', 401);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionName, createSession(), {
      path: '/api/studio',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionDuration,
    });
    return response;
  }
  if (body?.action === 'logout') {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionName, '', {
      path: '/api/studio',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
    });
    return response;
  }
  if (!authorized(request))
    return error('Your session expired. Sign in again.', 401);
  if (body?.action !== 'save') return error('Unknown action.', 400);
  const parsed = contentSchema.safeParse(body.content);
  if (!parsed.success)
    return error(
      'Check the content fields and make sure each slug is unique.',
      400,
    );
  try {
    await saveContent(parsed.data);
  } catch (cause) {
    console.error('Portfolio save failed', cause);
    return error('Could not write to the content store.', 500);
  }
  return NextResponse.json({ ok: true });
}
