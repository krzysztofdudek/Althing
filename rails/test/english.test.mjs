import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scanEnglish, scanMessage, scanName, STOPWORDS } from '../english.mjs';
import { check } from '../aspects/lang-english.mjs';

const fixture = (name) => readFileSync(new URL(`./fixtures/english/${name}`, import.meta.url), 'utf8');

test('Polish with diacritics is flagged: heading, letters and a sentence', () => {
  const found = scanEnglish(fixture('polish.md'), 'notes/polish.md');
  const rules = new Set(found.map((f) => f.rule));
  assert.ok(rules.has('slot'), 'the heading word');
  assert.ok(rules.has('letter'), 'a Polish letter');
  assert.ok(rules.has('sentence'), 'two Polish words in one sentence');
  assert.ok(found.some((f) => f.line === 5 && f.rule === 'letter'), 'a one-word line with a Polish letter');
});

test('Polish folded to ASCII is still flagged by the word rules', () => {
  const found = scanEnglish(fixture('polish-folded.md'), 'notes/folded.md');
  assert.ok(found.some((f) => f.line === 3 && f.rule === 'sentence'));
  assert.ok(found.some((f) => f.line === 5 && f.rule === 'sentence'));
  assert.ok(!found.some((f) => f.rule === 'letter'));
});

test('English with Norse names, code fences, inline code and URLs passes', () => {
  assert.deepEqual(scanEnglish(fixture('english.md'), 'notes/english.md'), []);
});

test('a Polish word in a Tags value or a file name is flagged on its own', () => {
  const found = scanEnglish(fixture('tags.md'), 'issues/001-a-fix.md');
  assert.deepEqual(found.map((f) => [f.line, f.rule]), [[3, 'slot']]);
  const named = scanEnglish('# Fine\n', 'research/2026-10-05-petla-review/README.md');
  assert.deepEqual(named.map((f) => [f.line, f.rule]), [[0, 'slot']]);
});

test('the allow-list lets an exact proper name through and nothing else', () => {
  const text = fixture('allowed.md');
  const word = text.match(/to (\S+) for/)[1];
  assert.equal(scanEnglish(text, 'a.md', { allow: new Set() }).length, 1);
  assert.deepEqual(scanEnglish(text, 'a.md', { allow: new Set([word]) }), []);
  assert.equal(scanEnglish(text, 'a.md', { allow: new Set([word.toLowerCase()]) }).length, 1, 'case-sensitive');
});

test('commit messages, branch names and slugs', () => {
  const polish = fixture('polish-folded.md').split('\n')[2];
  assert.equal(scanMessage(`rails: a fix\n\n${polish}\n`).length, 1);
  assert.deepEqual(scanMessage('rails: a fix\n\nThe English body of a message.\n# a git comment line is skipped\n'), []);
  assert.deepEqual(scanName('jarl/028-packages'), []);
  const word = [...STOPWORDS].find((w) => w.length > 4);
  assert.equal(scanName(`jarl/123-${word}-fix`).length, 1);
});

test('the Yggdrasil adapter reports file and line, and skips binary content', () => {
  const v = check({ files: [{ path: 'notes/polish.md', content: fixture('polish.md') }, { path: 'x.bin', content: 'a\u0000b' }] });
  assert.ok(v.length >= 3);
  assert.ok(v.every((x) => x.file === 'notes/polish.md' && x.line >= 1 && x.message.startsWith('lang/english: ')));
});

test('the detector does not flag its own source or the lexicon-free rails', () => {
  for (const f of ['english.mjs', 'markdown.mjs', 'aspects/lang-english.mjs']) {
    const text = readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
    assert.deepEqual(scanEnglish(text, `rails/${f}`), [], f);
  }
});
