import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { validTranslation, admit } from './limits.mjs';

const baseline = { sessionMinute: 0, ipMinute: 0, sessionDay: 0, ipDay: 0, dayChars: 0, monthChars: 0 };
const sample = (overrides = {}) => ({ text: 'Hello!', source: 'en', target: 'es', token: 'test-token', requestId: randomUUID(), ...overrides });

test('Unicode characters, empty input, and unsupported pairs are validated', () => {
  assert.equal(validTranslation(sample({ text: '😀'.repeat(500) })), true);
  assert.equal(validTranslation(sample({ text: '😀'.repeat(501) })), false);
  assert.equal(validTranslation(sample({ text: '   ' })), false);
  assert.equal(validTranslation(sample({ source: 'es', target: 'ar' })), false);
  assert.equal(validTranslation(sample({ target: 'pt-PT' })), true);
});

function runtime(overrides = {}) {
  const expected = [];
  const mock = {
    expect(url, result, status = 200) { expected.push({ url, result, status }); },
    assertNoPendingInterceptors() { assert.equal(expected.length, 0); },
    pendingInterceptors() { return expected.map(({ url }) => url); },
    async handle(request) {
      const next = expected.shift();
      assert.ok(next, `Unexpected outbound request: ${request.url}`);
      assert.equal(request.url, next.url);
      assert.equal(request.method, 'POST');
      const result = typeof next.result === 'function' ? await next.result(request) : next.result;
      return Response.json(result, { status: next.status });
    },
  };
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: [{ type: 'ESModule', path: 'cloudflare/worker.mjs' }, { type: 'ESModule', path: 'cloudflare/limits.mjs' }], compatibilityDate: '2026-10-23',
    durableObjects: { USAGE: { className: 'UsageLedger', useSQLite: true } },
    bindings: { ALLOWED_HOSTS: 'localhost', TRANSLATION_ENABLED: 'true', GOOGLE_TRANSLATE_API_KEY: 'test-only',
      IP_HASH_SECRET: 'test-only', TURNSTILE_SECRET: 'test-only', TURNSTILE_SITE_KEY: 'test-only',
      DAILY_CHAR_LIMIT: '30000', MONTHLY_CHAR_LIMIT: '900000', ...overrides },
    outboundService: mock.handle,
  }));
  return { mf, mock };
}

async function translate(mf, body, extra = {}) {
  return mf.dispatchFetch('https://localhost/api/translate', { method: 'POST', headers: {
    Origin: 'https://localhost', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1',
    Cookie: `spek_session=${randomUUID()}`, ...extra,
  }, body: JSON.stringify(body) });
}

function verify(mock, changes = {}) {
  mock.expect('https://challenges.cloudflare.com/turnstile/v0/siteverify', { success: true, hostname: 'localhost', action: 'translate', ...changes });
}

test('cross-origin, missing session, invalid input, and oversized bodies fail before upstream', async () => {
  const { mf, mock } = runtime();
  try {
    assert.equal((await translate(mf, sample(), { Origin: 'https://attacker.example' })).status, 403);
    assert.equal((await translate(mf, sample(), { Cookie: '' })).status, 403);
    assert.equal((await translate(mf, sample({ text: 'a'.repeat(501) }))).status, 400);
    assert.equal((await translate(mf, sample({ token: '' }))).status, 400);
    assert.equal((await translate(mf, sample({ text: 'a'.repeat(9000) }))).status, 400);
    mock.assertNoPendingInterceptors();
  } finally { await mf.dispose(); }
});

test('Turnstile success must match the site hostname and action', async () => {
  const { mf, mock } = runtime();
  try {
    verify(mock, { hostname: 'attacker.example' });
    assert.equal((await translate(mf, sample())).status, 403);
    verify(mock, { action: 'different' });
    assert.equal((await translate(mf, sample())).status, 403);
    verify(mock, { success: false });
    assert.equal((await translate(mf, sample())).status, 403);
    mock.assertNoPendingInterceptors();
  } finally { await mf.dispose(); }
});

test('successful requests use NMT, return plain text and remaining allowance, and deduplicate', async () => {
  const { mf, mock } = runtime();
  const session = randomUUID(), body = sample();
  let observed;
  try {
    verify(mock);
    mock.expect('https://translation.googleapis.com/language/translate/v2', async (request) => {
      observed = await request.json();
      return { data: { translations: [{ translatedText: 'Hola &amp; adiós' }] } };
    });
    const response = await translate(mf, body, { Cookie: `spek_session=${session}` });
    assert.equal(response.status, 200, `${await response.clone().text()} ${JSON.stringify(mock.pendingInterceptors())}`);
    assert.deepEqual(observed, { q: body.text, source: 'en', target: 'es', format: 'text', model: 'nmt' });
    assert.deepEqual(await response.json(), { translation: 'Hola & adiós', remaining: 9 });
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    verify(mock);
    assert.equal((await translate(mf, body, { Cookie: `spek_session=${session}` })).status, 409);
    mock.assertNoPendingInterceptors();
  } finally { await mf.dispose(); }
});

test('concurrent reservations cannot overrun a shared character cap', async () => {
  const { mf } = runtime({ DAILY_CHAR_LIMIT: '500' });
  try {
    const namespace = await mf.getDurableObjectNamespace('USAGE');
    const stub = namespace.get(namespace.idFromName('concurrent-test'));
    const replies = await Promise.all(Array.from({ length: 12 }, (_, index) => stub.fetch('https://ledger/reserve', {
      method: 'POST', body: JSON.stringify({ ip: `ip${index}`, session: randomUUID(), id: randomUUID(), chars: 100 }),
    })));
    assert.equal(replies.filter((r) => r.status === 200).length, 5);
    assert.equal(replies.filter((r) => r.status === 503).length, 7);
  } finally { await mf.dispose(); }
});

test('IP burst limits survive rotating session identifiers', async () => {
  const { mf } = runtime();
  try {
    const namespace = await mf.getDurableObjectNamespace('USAGE');
    const stub = namespace.get(namespace.idFromName('rate-test'));
    const replies = [];
    for (let i = 0; i < 4; i++) replies.push(await stub.fetch('https://ledger/reserve', {
      method: 'POST', body: JSON.stringify({ ip: 'same-ip', session: randomUUID(), id: randomUUID(), chars: 1 }),
    }));
    assert.deepEqual(replies.map((r) => r.status), [200, 200, 200, 429]);
  } finally { await mf.dispose(); }
});

test('Google failures stay reserved and expose no upstream credentials or error bodies', async () => {
  const { mf, mock } = runtime({ DAILY_CHAR_LIMIT: '6' });
  try {
    verify(mock);
    mock.expect('https://translation.googleapis.com/language/translate/v2', { error: { message: 'secret diagnostic text' } }, 403);
    const response = await translate(mf, sample());
    assert.equal(response.status, 503);
    assert.doesNotMatch(await response.text(), /secret diagnostic|test-only/);
    verify(mock);
    assert.equal((await translate(mf, sample())).status, 503);
    mock.assertNoPendingInterceptors();
  } finally { await mf.dispose(); }
});

test('daily, monthly, session, and invalid configuration boundaries are enforced', () => {
  const caps = { chars: 100, dailyCap: 500, monthlyCap: 1000 };
  assert.equal(admit({ ...baseline, dayChars: 401 }, caps).status, 503);
  assert.equal(admit({ ...baseline, monthChars: 901 }, caps).status, 503);
  assert.equal(admit({ ...baseline, sessionDay: 10 }, caps).status, 429);
  assert.equal(admit({ ...baseline, ipDay: 30 }, caps).status, 429);
  assert.equal(admit(baseline, { ...caps, dailyCap: NaN }).status, 503);
});
