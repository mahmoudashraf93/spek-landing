import { DurableObject } from 'cloudflare:workers';
import { MAX_CHARS, SESSION_DAILY_LIMIT, LANGUAGES, validTranslation, admit, decodeTranslation } from './limits.mjs';

const json = (body, status = 200, extra = {}) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
    'X-Content-Type-Options': 'nosniff', ...extra },
});
const failure = (error, status = 503, retry) => json({ error }, status, retry ? { 'Retry-After': String(retry) } : {});
const sessionFrom = (request) => request.headers.get('Cookie')?.match(/(?:^|;\s*)spek_session=([0-9a-f-]{36})(?:;|$)/i)?.[1];
const ready = (env) => env.TRANSLATION_ENABLED === 'true' && !!env.GOOGLE_TRANSLATE_API_KEY
  && !!env.TURNSTILE_SECRET && !!env.IP_HASH_SECRET && !!env.TURNSTILE_SITE_KEY;

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  let length = 0;
  const parts = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 8192) { await reader.cancel(); throw new Error('large'); }
      parts.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const part of parts) { bytes.set(part, offset); offset += part.length; }
    return JSON.parse(new TextDecoder().decode(bytes));
  } finally { reader.releaseLock(); }
}

async function ipDigest(ip, secret, day) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, encoder.encode(`${day}:${ip}`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function handle(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
  if (!(env.ALLOWED_HOSTS || '').split(',').includes(url.hostname)) return failure('Unknown site.', 403);
  if (url.pathname === '/api/config' && request.method === 'GET') {
    const session = sessionFrom(request) || crypto.randomUUID();
    return json({ ready: !!ready(env), siteKey: env.TURNSTILE_SITE_KEY, maxChars: MAX_CHARS,
      dailyLimit: SESSION_DAILY_LIMIT, languages: LANGUAGES }, 200, {
      'Set-Cookie': `spek_session=${session}; Path=/api/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
    });
  }
  if (url.pathname === '/api/health' && request.method === 'GET') return json({ status: ready(env) ? 'ready' : 'setup', provider: 'google-nmt' });
  if (url.pathname !== '/api/translate') return failure('Not found.', 404);
  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405, { Allow: 'POST' });
  if (request.headers.get('Origin') !== url.origin
      || (request.headers.get('Sec-Fetch-Site') && request.headers.get('Sec-Fetch-Site') !== 'same-origin')) {
    return failure('Please translate from this website.', 403);
  }
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return failure('Send JSON.', 415);
  if (!ready(env)) return failure('The translator is being prepared. Please try again soon.');
  const session = sessionFrom(request);
  if (!session) return failure('Please reload the page and try again.', 403);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return failure('Unable to verify this connection.', 403);
  const input = await readBody(request).catch(() => null);
  if (!validTranslation(input)) return failure(`Enter 1–${MAX_CHARS} characters and choose an English language pair.`, 400);
  const day = new Date().toISOString().slice(0, 10);
  const digest = await ipDigest(ip, env.IP_HASH_SECRET, day);
  const ledger = env.USAGE.get(env.USAGE.idFromName('global-v1'));
  const attempt = await ledger.fetch('https://ledger/attempt', { method: 'POST', body: JSON.stringify({ ip: digest }) });
  if (!attempt.ok) return attempt;
  let verification;
  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: input.token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    verification = await result.json();
  } catch { return failure('The security check is unavailable. Please try again.'); }
  if (!verification.success || verification.hostname !== url.hostname || verification.action !== 'translate') {
    return failure('Please complete the security check again.', 403);
  }
  const reservation = await ledger.fetch('https://ledger/reserve', { method: 'POST', body: JSON.stringify({
    ip: digest, session, id: input.requestId, chars: Array.from(input.text).length,
  }) });
  if (!reservation.ok) return reservation;
  // Reserve before calling Google. Failed/ambiguous calls stay counted; no automatic retry.
  let upstream;
  try {
    upstream = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': env.GOOGLE_TRANSLATE_API_KEY },
      body: JSON.stringify({ q: input.text, source: input.source, target: input.target, format: 'text', model: 'nmt' }),
      signal: AbortSignal.timeout(12000),
    });
    if (!upstream.ok) return failure('Translation is temporarily unavailable. Please try again later.');
    const result = await upstream.json();
    const translation = result.data?.translations?.[0]?.translatedText;
    if (typeof translation !== 'string' || translation.length > 15000) return failure('Unable to read this translation. Please try again later.');
    const allowance = await reservation.json();
    return json({ translation: decodeTranslation(translation), remaining: allowance.remaining });
  } catch { return failure('Translation took too long. Please try again later.'); }
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env); }
    catch { return failure('The translator is temporarily unavailable. Please try again later.'); }
  },
};

export class UsageLedger extends DurableObject {
  async fetch(request) {
    const input = await request.json();
    const now = Date.now();
    const date = new Date(now).toISOString().slice(0, 10);
    const minute = Math.floor(now / 60000);
    const month = date.slice(0, 7);
    const endpoint = new URL(request.url).pathname;
    const response = await this.ctx.storage.transaction(async (txn) => {
      const key = (scope, period, subject = '') => `${scope}:${period}:${subject}`;
      const get = async (name) => (await txn.get(name))?.count || 0;
      const put = (name, count, ttl) => txn.put(name, { count, expires: now + ttl });
      if (endpoint === '/attempt') {
        const attemptKey = key('attempt', minute, input.ip);
        const count = await get(attemptKey);
        if (count >= 12) return failure('Too many attempts. Please wait a minute.', 429, 60);
        await put(attemptKey, count + 1, 120000);
        return json({ ok: true });
      }
      if (endpoint !== '/reserve' || !Number.isInteger(input.chars) || input.chars < 1 || input.chars > MAX_CHARS) return failure('Invalid reservation.', 400);
      const requestKey = key('request', date, `${input.session}:${input.id}`);
      if (await txn.get(requestKey)) return failure('This translation was already submitted. Please wait for its result.', 409);
      const keys = {
        sessionMinute: key('sm', minute, input.session), ipMinute: key('im', minute, input.ip),
        sessionDay: key('sd', date, input.session), ipDay: key('id', date, input.ip),
        dayChars: key('day', date), monthChars: key('month', month),
      };
      const current = Object.fromEntries(await Promise.all(Object.entries(keys).map(async ([field, name]) => [field, await get(name)])));
      const denied = admit(current, { chars: input.chars, dailyCap: Number(this.env.DAILY_CHAR_LIMIT), monthlyCap: Number(this.env.MONTHLY_CHAR_LIMIT) });
      if (denied) return failure(denied.error, denied.status, denied.retry);
      for (const [field, name] of Object.entries(keys)) {
        await put(name, current[field] + (field.endsWith('Chars') ? input.chars : 1),
          field.endsWith('Minute') ? 120000 : field === 'monthChars' ? 32 * 86400000 : 2 * 86400000);
      }
      await put(requestKey, 1, 2 * 86400000);
      return json({ remaining: SESSION_DAILY_LIMIT - current.sessionDay - 1 });
    });
    if (!await this.ctx.storage.getAlarm()) await this.ctx.storage.setAlarm(now + 86400000);
    return response;
  }

  async alarm() {
    const entries = await this.ctx.storage.list();
    const now = Date.now();
    const expired = [...entries].filter(([, value]) => value.expires < now).map(([key]) => key);
    // delete() accepts up to 128 keys at once.
    for (let i = 0; i < expired.length; i += 128) await this.ctx.storage.delete(expired.slice(i, i + 128));
    if (entries.size > expired.length) await this.ctx.storage.setAlarm(now + 86400000);
  }
}
