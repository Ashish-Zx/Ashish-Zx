import 'server-only';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export const sessionName = 'portfolio_session';
export const sessionDuration = 60 * 60 * 8;
const secret = () => process.env.PORTFOLIO_ADMIN_PASSWORD ?? '';
export const studioConfigured = () => secret().length >= 16;
const digest = (value: string) => createHash('sha256').update(value).digest();
const equal = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));
const sign = (expiry: string) =>
  createHmac('sha256', secret())
    .update('portfolio-studio:' + expiry)
    .digest('hex');
export const correctPassword = (value: string) =>
  studioConfigured() && equal(value, secret());
export function createSession() {
  const expiry = String(Math.floor(Date.now() / 1000) + sessionDuration);
  return `${expiry}.${sign(expiry)}`;
}
export function validSession(value: string | undefined) {
  if (!studioConfigured() || !value) return false;
  const [expiry, signature, ...extra] = value.split('.');
  return (
    extra.length === 0 &&
    /^\d{10}$/.test(expiry) &&
    !!signature &&
    Number(expiry) > Date.now() / 1000 &&
    equal(signature, sign(expiry))
  );
}
