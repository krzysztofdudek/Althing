// The release brief templates: every worker brief ends with a checklist, the
// reviewer asks four questions and records its verdict last, and the merger
// records a red check whose cause is in the branch as a round. Prose is never
// hard-wrapped, so one line is one paragraph.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RELEASES = join(ROOT, 'releases');

function briefs(pattern) {
  if (!existsSync(RELEASES)) return [];
  return readdirSync(RELEASES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(RELEASES, d.name, 'briefs')))
    .flatMap((d) => readdirSync(join(RELEASES, d.name, 'briefs'))
      .filter((f) => pattern.test(f))
      .map((f) => ({ file: `releases/${d.name}/briefs/${f}`, text: readFileSync(join(RELEASES, d.name, 'briefs', f), 'utf8') })));
}

function brief(name) {
  return readFileSync(join(RELEASES, '6.2.0', 'briefs', name), 'utf8');
}

// The "## " sections of a brief, in order, with their bodies.
function sections(text) {
  return text.split(/^## /m).slice(1).map((part) => {
    const end = part.indexOf('\n');
    return { heading: part.slice(0, end).trim(), body: part.slice(end + 1) };
  });
}

const CHECKLIST_ITEMS = [
  [/committed/i, 'the work is committed'],
  [/jarl evidence[^\n]*--ran[^\n]*--saw/, 'red and green are recorded as jarl evidence --ran/--saw rows'],
  [/waited/i, 'every check the brief names was waited for to its end'],
  [/changelog/i, 'the changelog entry is written'],
  [/issue number/i, 'no loop issue number appears outside the commit subject'],
  [/commit subject/i, 'the issue number lives only in the commit subject'],
  [/loop ends/i, 'the reason: the loop ends and the number then points nowhere'],
  [/report is sent/i, 'the report is sent'],
];

test('every worker brief ends with a checklist that follows its report', () => {
  const workers = briefs(/^worker-.*\.md$/);
  assert.ok(workers.length >= 6, 'the worker briefs of the release are found');
  for (const { file, text } of workers) {
    const headings = sections(text).map((s) => s.heading);
    const report = headings.indexOf('Report');
    assert.ok(report >= 0, `${file} has a Report section`);
    assert.equal(headings[report + 1], 'Checklist', `${file}: the Checklist section follows Report`);
    const after = headings.slice(report + 2).filter((h) => h !== 'Changes');
    assert.deepEqual(after, [], `${file}: nothing but the changelog follows the Checklist`);
  }
});

test('every worker brief checklist carries each closing item', () => {
  for (const { file, text } of briefs(/^worker-.*\.md$/)) {
    const checklist = sections(text).find((s) => s.heading === 'Checklist');
    assert.ok(checklist, `${file} has a Checklist section`);
    for (const [pattern, label] of CHECKLIST_ITEMS) {
      assert.match(checklist.body, pattern, `${file}: checklist item missing: ${label}`);
    }
  }
});

test('the reviewer brief asks a fourth question on weakened protection, above all after a round', () => {
  const text = brief('reviewer.md');
  assert.match(text, /Answer four questions per issue/);
  assert.match(text, /^4\. [^\n]*weaken[^\n]*\(a mode, a default, a guard, a test\)[^\n]*after a round/m);
});

test('the reviewer brief names a worker\'s missing evidence rows an Important finding', () => {
  const text = brief('reviewer.md');
  assert.match(text, /missing evidence rows[^\n]*Important/);
});

test('the reviewer brief ends with the recording call, its model in the findings, and the answer quoting the printed line', () => {
  const text = brief('reviewer.md');
  const last = sections(text).filter((s) => s.heading !== 'Changes').at(-1);
  assert.equal(last.heading, 'The verdict', 'the verdict is the last step of the brief');
  assert.match(last.body, /jarl review <id> (approve|changes) --by <your reviewer name>/);
  assert.match(last.body, /model/);
  assert.match(last.body, /quot[^\n]*printed/);
});

test('no brief template passes --model to a jarl command', () => {
  const offending = briefs(/\.md$/).flatMap(({ file, text }) => text.split('\n')
    .filter((line) => /jarl/.test(line) && /--model/.test(line))
    .map((line) => `${file}: ${line.trim()}`));
  assert.deepEqual(offending, []);
});
