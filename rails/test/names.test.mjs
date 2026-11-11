import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { tokenize, entryForms, parseList, buildDigests, makeScanner, namesState, skippedForNames, hmac, PAD } from '../names.mjs';

// Every name here is invented. The key is a fixed test key, never a real one.
const KEY = '0f'.repeat(32);
const LIST = [
  '# invented names for the tests',
  'Quillmark Dynamics',
  'Bexley Oaks',
  '\u0141\u0119ka Wharf',
  'Sundial | cap',
  'Orrin Vale',
  '',
].join('\n');
const scanner = () => makeScanner(KEY, buildDigests(KEY, parseList(LIST)));

test('the list format: comments, blank lines and the cap flag', () => {
  const l = parseList(LIST);
  assert.equal(l.length, 5);
  assert.deepEqual(l[3], { entry: 'Sundial', cap: true });
  assert.equal(l[0].cap, false);
});

test('folding covers Polish letters, the l with stroke included, on both sides', () => {
  assert.deepEqual(tokenize('\u0141\u0119ka \u0105\u0119\u015b\u0107\u0144').map((t) => t.t), ['leka', 'aescn']);
  assert.deepEqual(entryForms('\u0141\u0119ka Wharf'), ['leka wharf', 'lekawharf']);
  assert.equal(scanner().scan('the leka wharf office').length, 1);
  assert.equal(scanner().scan('the \u0141\u0118KA-WHARF office').length, 1);
});

test('one entry meets every spelling: spaced, hyphenated, camelCase, joined, e-mail, possessive', () => {
  const s = scanner();
  for (const t of ['Quillmark Dynamics', 'quillmark-dynamics', 'QuillmarkDynamics', 'quillmarkdynamics', 'ops@quillmark.dynamics.example', "Quillmark Dynamics's board", "the Bexley Oaks' team", 'bexley_oaks', 'repos/bexley.oaks/x']) {
    assert.equal(s.scan(t).length >= 1, true, t);
  }
  assert.deepEqual(s.scan('Quillmark alone, and dynamics alone, are not the name'), []);
});

test('a multi-word name crosses a line break inside a paragraph, not a blank line', () => {
  const s = scanner();
  assert.deepEqual(s.scan('We met with Orrin\nVale yesterday.'), [{ line: 1, size: 2, end: 2 }]);
  assert.deepEqual(s.scan('We met with Orrin\n\nVale was there.'), []);
});

test('a window carries the line of its last word, and two windows that start on one line are both reported', () => {
  assert.deepEqual(scanner().scan('The site at Bexley\n---\nOaks opened.'), [{ line: 1, size: 2, end: 3 }]);
  const both = makeScanner(KEY, buildDigests(KEY, parseList('Orrin Vale\nVale Orrin')));
  assert.deepEqual(both.scan('Orrin Vale\nOrrin'), [{ line: 1, size: 2, end: 1 }, { line: 1, size: 2, end: 2 }]);
});

test('cap entries match only capitalised text', () => {
  const s = scanner();
  assert.equal(s.scan('Sundial shipped.').length, 1);
  assert.equal(s.scan('SUNDIAL shipped.').length, 1);
  assert.deepEqual(s.scan('a sundial in the garden'), []);
});

test('hashes, encoded blobs and lockfiles never collide with a short entry', () => {
  const keyed = makeScanner(KEY, buildDigests(KEY, parseList('dead\nAbc1')));
  assert.deepEqual(keyed.scan('commit deadbeefdeadbeefdeadbeef0123456789abcdef'), []);
  assert.deepEqual(keyed.scan('blob QWJjMWRlYWRBYmMxZGVhZEFiYzE9PQ2x=='), []);
  assert.equal(keyed.scan('the dead link').length, 1);
  assert.deepEqual(keyed.scan('dead dead dead', 'package-lock.json'), []);
  assert.ok(skippedForNames('a/yarn.lock') && skippedForNames('rails/names/digests.json') && !skippedForNames('method/boundary.md'));
});

test('a finding names the place and the window size, never the entry', () => {
  const found = scanner().scan('Line one.\nA note on Bexley Oaks here.');
  assert.deepEqual(found, [{ line: 2, size: 2, end: 2 }]);
  assert.deepEqual(scanner().scanName('research/2026-10-05-bexley-oaks-review/README.md'), [{ line: 0, size: 2, end: 0 }]);
});

test('the digests file is padded, sorted, keyed and holds no plain text', () => {
  const doc = buildDigests(KEY, parseList(LIST));
  assert.equal(doc.schema, 'althing-names/1');
  assert.equal(doc.entries.length, PAD);
  assert.deepEqual([...doc.entries].map((e) => e.d), [...doc.entries].map((e) => e.d).sort());
  assert.ok(doc.entries.some((e) => e.d === hmac(KEY, 'bexley oaks')));
  const json = JSON.stringify(doc).toLowerCase();
  for (const word of ['quillmark', 'bexley', 'orrin', 'sundial', 'wharf']) assert.ok(!json.includes(word), word);
  const many = parseList(Array.from({ length: 300 }, (_, i) => `Invented Name${i}`).join('\n'));
  assert.equal(buildDigests(KEY, many).entries.length, 2 * PAD, 'pads to the next multiple');
});

test('the four states: not initialised, no key, key mismatch, ready', () => {
  const dir = mkdtempSync(join(tmpdir(), 'althing-names-'));
  try {
    const digestsPath = join(dir, 'digests.json');
    const keyPath = join(dir, 'names.key');
    assert.equal(namesState({ digestsPath, keyPath, env: {} }).state, 'not-initialised');
    assert.match(namesState({ digestsPath, keyPath, env: {} }).message, /not initialised/);
    writeFileSync(digestsPath, JSON.stringify(buildDigests(KEY, parseList(LIST))));
    assert.equal(namesState({ digestsPath, keyPath, env: {} }).state, 'no-key');
    assert.equal(namesState({ digestsPath, keyPath, env: { ALTHING_NAMES_KEY: 'ab'.repeat(32) } }).state, 'key-mismatch');
    writeFileSync(keyPath, `${KEY}\n`);
    const ready = namesState({ digestsPath, keyPath, env: {} });
    assert.equal(ready.state, 'ready');
    assert.equal(ready.scanner.scan('Bexley Oaks').length, 1);
    assert.equal(namesState({ digestsPath, keyPath: join(dir, 'none'), env: { ALTHING_NAMES_KEY: KEY } }).state, 'ready');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
