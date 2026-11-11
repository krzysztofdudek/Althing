import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDigests, parseList } from '../names.mjs';

const ALTHING = fileURLToPath(new URL('../..', import.meta.url));
const ZERO = '0'.repeat(40);
const CANONICAL = 'https://github.com/krzysztofdudek/Althing.git';

// An invented list under a test key: the real key and the real list never enter a test.
const KEY = '5a'.repeat(32);
const WORD = ['Quill', 'mark'].join('');
const PAIR = ['Bexley', 'Oaks'];
const LIST = `${WORD}\n${PAIR.join(' ')}\n${['Zq', 'x'].join('')}\n`;

const ID = ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null'];
const g = (cwd, ...args) => execFileSync('git', [...ID, ...args], { cwd, stdio: 'pipe' }).toString().trim();

let base;
let rails;
let n = 0;

// A copy of the rails with digests of the invented list, as Althing's checkout holds the real ones.
before(() => {
  base = mkdtempSync(join(tmpdir(), 'althing-rails-run-'));
  rails = join(base, 'Althing', 'rails');
  cpSync(join(ALTHING, 'rails'), rails, { recursive: true, filter: (src) => !/\/rails\/(names|test)$/.test(src) });
  mkdirSync(join(rails, 'names'));
  writeFileSync(join(rails, 'names', 'digests.json'), JSON.stringify(buildDigests(KEY, parseList(LIST))));
});
after(() => rmSync(base, { recursive: true, force: true }));

function repo() {
  const dir = join(base, `repo${++n}`);
  mkdirSync(dir);
  g(dir, 'init', '-q', '-b', 'main');
  writeFileSync(join(dir, 'README.md'), '# A thing\n\nIt does one thing.\n');
  g(dir, 'add', '.');
  g(dir, 'commit', '-q', '-m', 'docs: the first commit');
  return dir;
}

function write(dir, files) {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
  g(dir, 'add', '.');
}

function commit(dir, files, message) {
  write(dir, files);
  g(dir, 'commit', '-q', '-m', message);
  return g(dir, 'rev-parse', 'HEAD');
}

function run(dir, args, { input, key = KEY, more = {} } = {}) {
  const env = { ...process.env, HOME: join(base, 'home'), ALTHING_NAMES_KEY: key || '', ...more };
  for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_GRAFT_FILE']) if (!(k in more)) delete env[k];
  const r = spawnSync(process.execPath, [join(rails, 'run.mjs'), ...args], { cwd: dir, input, encoding: 'utf8', env });
  return { status: r.status, text: `${r.stdout}${r.stderr}` };
}

const range = (dir, from, to) => run(dir, ['range', from, to, '--require-key']);
const pushed = (dir, lines, url = CANONICAL) => run(dir, ['range', '--stdin', '--require-key', '--remote', url], { input: lines });
const refusals = (text, rail = 'names') => text.split('\n').filter((l) => l.startsWith(`${rail}: `));
const at = (sha, where) => `commit ${sha.slice(0, 12)} ${where}: `;
const silent = (text) => {
  const low = text.toLowerCase();
  for (const w of [WORD, ...PAIR]) assert.ok(!low.includes(w.toLowerCase()), 'the output never carries the name');
};

// Two branches that change the same line of a file, and a merge whose resolution is the text given.
function mergeOf(dir, path, side, main, resolved) {
  g(dir, 'checkout', '-q', '-b', 'side');
  const onSide = commit(dir, { [path]: side }, 'docs: side');
  g(dir, 'checkout', '-q', 'main');
  commit(dir, { [path]: main }, 'docs: main');
  spawnSync('git', [...ID, 'merge', '-q', 'side'], { cwd: dir });
  const merge = commit(dir, { [path]: resolved }, 'merge: side');
  assert.equal(g(dir, 'rev-list', '--parents', '-1', 'HEAD').split(' ').length, 3, 'a merge commit');
  return { merge, onSide };
}

test('a name or a secret a merge adds is refused at the merge, and a line the merge takes from one parent is not counted again', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  const secret = ['AKIA', 'Q'.repeat(16)].join('');
  const { merge } = mergeOf(dir, 'README.md', '# A thing\n\nIt does one thing, on the side.\n', '# A thing\n\nIt does one thing, on main.\n', `# A thing\n\nIt does one thing, for ${PAIR.join(' ')}.\n${secret}\n`);
  let r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(merge, 'README.md:3')}`), r.text);
  assert.ok(r.text.includes(`secrets-range: ${at(merge, 'README.md:4')}`), r.text);
  assert.match(r.text, /rails range \(3 commits\): 2 refusal/);
  silent(r.text);

  const second = repo();
  const s0 = g(second, 'rev-parse', 'HEAD');
  commit(second, { 'a.md': 'One.\n\nTwo.\n\nThree.\n' }, 'docs: a');
  const kept = mergeOf(second, 'a.md', `One.\n\nTwo, by ${WORD}.\n\nThree.\n`, 'One.\n\nTwo, on main.\n\nThree.\n', `One.\n\nTwo, by ${WORD}.\n\nThree.\n\nFour, new.\n`);
  r = range(second, s0, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.equal(refusals(r.text).length, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(kept.onSide, 'a.md:3')}`), `the side's own commit is refused, and the merge is not: ${r.text}`);
  r = pushed(second, `refs/heads/main ${kept.merge} refs/heads/main ${kept.onSide}\n`);
  assert.equal(r.status, 0, `the side is on the remote already, and the merge adds no name: ${r.text}`);
  assert.match(r.text, /rails range \(2 commits\): clean/);
});

test('a name split over an old line and an added one is refused, in a pushed commit and in the staged lines', () => {
  const dir = repo();
  commit(dir, { 'a.md': `The site at ${PAIR[0]}\n` }, 'docs: a');
  const start = g(dir, 'rev-parse', 'HEAD');
  write(dir, { 'a.md': `The site at ${PAIR[0]}\n${PAIR[1]} opened.\n` });
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes('names: a.md:1: '), r.text);
  silent(r.text);
  g(dir, 'commit', '-q', '-m', 'docs: a grows');
  r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(g(dir, 'rev-parse', 'HEAD'), 'a.md:1')}`), r.text);
  silent(r.text);
});

test('a name formed by removing the line between its words, or parted by a line of punctuation, is refused', () => {
  const dir = repo();
  commit(dir, { 'a.md': `The site at ${PAIR[0]}\n\n${PAIR[1]} opened.\n`, 'b.md': `The site at ${PAIR[0]}\n---\n` }, 'docs: two files');
  const start = g(dir, 'rev-parse', 'HEAD');
  write(dir, { 'a.md': `The site at ${PAIR[0]}\n${PAIR[1]} opened.\n`, 'b.md': `The site at ${PAIR[0]}\n---\n${PAIR[1]} opened.\n` });
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes('names: a.md:1: ') && r.text.includes('names: b.md:1: '), r.text);
  g(dir, 'commit', '-q', '-m', 'docs: they change');
  const head = g(dir, 'rev-parse', 'HEAD');
  r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(head, 'a.md:1')}`) && r.text.includes(`names: ${at(head, 'b.md:1')}`), r.text);
  silent(r.text);
});

test('a name in an author e-mail or in a committer name is refused with the commit', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  write(dir, { 'b.md': 'B.\n' });
  execFileSync('git', ['-c', 'user.name=Test', '-c', `user.email=someone@${WORD.toLowerCase()}.example`, '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', 'commit', '-q', '-m', 'docs: b'], { cwd: dir, stdio: 'pipe' });
  const byAuthor = g(dir, 'rev-parse', 'HEAD');
  let r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(byAuthor, 'author or committer, or another header of the commit')}`), r.text);
  silent(r.text);

  const second = repo();
  const s0 = g(second, 'rev-parse', 'HEAD');
  write(second, { 'c.md': 'C.\n' });
  execFileSync('git', [...ID, 'commit', '-q', '-m', 'docs: c'], { cwd: second, stdio: 'pipe', env: { ...process.env, GIT_COMMITTER_NAME: PAIR.join(' ') } });
  r = range(second, s0, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(g(second, 'rev-parse', 'HEAD'), 'author or committer, or another header of the commit')}`), r.text);
  silent(r.text);
});

test('a range that cannot be read is an error, never 0 commits', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  const head = commit(dir, { 'a.md': 'A.\n' }, 'docs: a');
  const blob = g(dir, 'rev-parse', 'HEAD:a.md');
  const unread = (r, says) => {
    assert.equal(r.status, 2, r.text);
    assert.match(r.text, says);
    assert.match(r.text, /nothing was scanned/);
    assert.ok(!/clean/.test(r.text), r.text);
  };
  unread(range(dir, 'no-such-ref', 'HEAD'), /no-such-ref is not a commit/);
  unread(range(dir, start, 'no-such-head'), /no-such-head is not a commit/);
  unread(range(dir, start, blob), /is not a commit/);
  unread(pushed(dir, 'refs/heads/main\n'), /a line of the push is not/);
  unread(pushed(dir, `refs/tags/blob ${blob} refs/tags/blob ${ZERO}\n`), /a pushed object is not a commit, or a tag of one/);
  unread(pushed(dir, `refs/heads/main ${'1'.repeat(40)} refs/heads/main ${ZERO}\n`), /a pushed object is not a commit, or a tag of one/);
  unread(run(join(base, 'Althing'), ['range', start, head, '--require-key']), /no git repository/);
  unread(run(join(base, 'Althing'), ['history', '--require-key']), /no git repository/);
  const fine = range(dir, start, head);
  assert.equal(fine.status, 0, fine.text);
  assert.match(fine.text, /rails range \(1 commit\): clean/);
  const whole = pushed(dir, `refs/heads/main ${head} refs/heads/main ${'1'.repeat(40)}\n`);
  assert.equal(whole.status, 0, whole.text);
  assert.match(whole.text, /rails range \(2 commits\): clean/, 'a remote commit that is not here means the whole history');
});

test('a push that carries nothing says so, and is not called clean', () => {
  const dir = repo();
  const head = g(dir, 'rev-parse', 'HEAD');
  for (const input of ['', '\n', `(delete) ${ZERO} refs/heads/gone ${head}\n`]) {
    const r = pushed(dir, input);
    assert.equal(r.status, 0, r.text);
    assert.match(r.text, /nothing to scan/);
    assert.ok(!/clean/.test(r.text), r.text);
  }
});

test('a path or a pushed ref that carries a name is refused and not printed', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  const named = `clients/${WORD.toLowerCase()}/plan.md`;
  write(dir, { [named]: `A plan.\nRan in ${'/'}Users/someone/x.\n` });
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: a new file's path \(not printed\): /);
  silent(r.text);
  g(dir, 'commit', '-q', '-m', 'docs: a plan');
  const head = g(dir, 'rev-parse', 'HEAD');
  r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(head, "a new file's path (not printed)")}`), r.text);
  assert.match(r.text, /boundary\/no-private-paths: commit [0-9a-f]{12} a file whose path carries a name \(not printed\):2: /, 'another rail names the file without its path');
  silent(r.text);
  r = run(dir, ['tree', '--require-key']);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: HEAD a file's path \(not printed\): /);
  silent(r.text);
  r = pushed(dir, `refs/heads/${WORD.toLowerCase()}-work ${start} refs/heads/${WORD.toLowerCase()}-work ${ZERO}\n`);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: a pushed ref's name \(not printed\): /);
  silent(r.text);
});

test('the added lines of a file whose path git quotes in a diff are read: a space, a non-ASCII letter, a quote', () => {
  const paths = ['docs/my notes.md', 'docs/caf\u00e9.md', 'docs/say "hi".md'];
  const dir = repo();
  commit(dir, Object.fromEntries(paths.map((p) => [p, 'One.\n'])), 'docs: three files');
  const start = g(dir, 'rev-parse', 'HEAD');
  write(dir, Object.fromEntries(paths.map((p) => [p, `One.\nBy ${WORD}.\n`])));
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  for (const p of paths) assert.ok(r.text.includes(`names: ${p}:2: `), `${p}: ${r.text}`);
  g(dir, 'commit', '-q', '-m', 'docs: they grow');
  const head = g(dir, 'rev-parse', 'HEAD');
  r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.equal(refusals(r.text).length, 3, r.text);
  for (const p of paths) assert.ok(r.text.includes(`names: ${at(head, `${p}:2`)}`), `${p}: ${r.text}`);
  silent(r.text);
});

test('every added line of a file is read after an added line that begins with "++ "', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  write(dir, { 'a.md': `One.\n++ b/other.md\nBy ${WORD}.\n` });
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes('names: a.md:3: '), r.text);
  g(dir, 'commit', '-q', '-m', 'docs: a');
  r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(g(dir, 'rev-parse', 'HEAD'), 'a.md:3')}`), r.text);
  silent(r.text);
});

test('git attributes and the big file threshold do not hide a file\'s lines, staged or pushed', () => {
  const settings = [
    (dir) => commit(dir, { '.gitattributes': '*.md -diff\n' }, 'build: attributes'),
    (dir) => commit(dir, { '.gitattributes': 'a.md binary\n' }, 'build: attributes'),
    (dir) => { mkdirSync(join(dir, '.git', 'info'), { recursive: true }); writeFileSync(join(dir, '.git', 'info', 'attributes'), 'a.md binary\n'); },
    (dir) => g(dir, 'config', 'core.bigFileThreshold', '1'),
  ];
  for (const [i, set] of settings.entries()) {
    const dir = repo();
    set(dir);
    commit(dir, { 'a.md': 'One.\n' }, 'docs: a');
    const start = g(dir, 'rev-parse', 'HEAD');
    write(dir, { 'a.md': `One.\nBy ${WORD}.\n` });
    let r = run(dir, ['staged']);
    assert.equal(r.status, 1, `setting ${i}: ${r.text}`);
    assert.ok(r.text.includes('names: a.md:2: '), `setting ${i}: ${r.text}`);
    g(dir, 'commit', '-q', '-m', 'docs: a grows');
    r = range(dir, start, 'HEAD');
    assert.equal(r.status, 1, `setting ${i}: ${r.text}`);
    assert.ok(r.text.includes(`names: ${at(g(dir, 'rev-parse', 'HEAD'), 'a.md:2')}`), `setting ${i}: ${r.text}`);
    silent(r.text);
  }
});

test('the tree scan reads a file whose name is not valid UTF-8, and passes over a submodule without printing its path', () => {
  const dir = repo();
  writeFileSync(Buffer.concat([Buffer.from(`${dir}/odd-`), Buffer.from([0xff, 0xfe]), Buffer.from('.md')]), `One.\nBy ${WORD}.\n`);
  g(dir, 'add', '.');
  g(dir, 'update-index', '--add', '--cacheinfo', `160000,${g(dir, 'rev-parse', 'HEAD')},vendor/${WORD.toLowerCase()}`);
  let r = run(dir, ['staged']);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: odd-[^:]*\.md:2: /);
  assert.match(r.text, /names: a new file's path \(not printed\): /);
  g(dir, 'commit', '-q', '-m', 'build: an odd name and a submodule');
  r = run(dir, ['tree', '--require-key']);
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: HEAD odd-[^:]*\.md:2: /);
  assert.match(r.text, /names: HEAD a file's path \(not printed\): /);
  assert.match(r.text, /rails tree: 2 refusal/);
  silent(r.text);
  r = range(dir, ZERO, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.match(r.text, /names: commit [0-9a-f]{12} odd-[^:]*\.md:2: /);
  silent(r.text);
});

// A commit object written byte for byte, as a client set to another encoding writes it.
function craft(dir, edit) {
  const raw = execFileSync('git', ['cat-file', 'commit', 'HEAD'], { cwd: dir }).toString('latin1');
  return execFileSync('git', ['hash-object', '-t', 'commit', '-w', '--stdin'], { cwd: dir, input: Buffer.from(edit(raw), 'latin1') }).toString().trim();
}

// The pair with a Polish letter (the l with stroke), which folds to the entry of the list; 0xb3 is that letter in ISO-8859-2.
const POLISH = `${PAIR[0].replace('l', '\u0142')} ${PAIR[1]}`;
const LATIN2 = POLISH.replace('\u0142', '\u00b3');

test('every header of a commit is read, a tag message carried by a merge among them, and its message in the encoding it declares', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': 'A.\n' }, 'docs: a');
  const carried = `mergetag object ${start}\n type commit\n tag v1\n tagger Test <test@example.com> 0 +0000\n \n The release for ${PAIR.join(' ')}.\n`;
  const withTag = craft(dir, (raw) => raw.replace('\n\n', `\n${carried}\n`));
  let r = range(dir, start, withTag);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(withTag, 'author or committer, or another header of the commit')}`), r.text);
  silent(r.text);

  const declare = (raw) => raw.replace('\n\n', '\nencoding ISO-8859-2\n\n');
  const byAuthor = craft(dir, (raw) => declare(raw).replace(/^author Test </m, `author ${LATIN2} <`));
  r = range(dir, start, byAuthor);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(byAuthor, 'author or committer, or another header of the commit')}`), r.text);
  silent(r.text);

  const inMessage = craft(dir, (raw) => `${declare(raw)}\nAsked for by ${LATIN2}.\n`);
  r = range(dir, start, inMessage);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(inMessage, 'message:3')}`), r.text);
  silent(r.text);

  const unknown = craft(dir, (raw) => raw.replace('\n\n', '\nencoding x-no-such-encoding\n\n'));
  r = range(dir, start, unknown);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`messages: commit ${unknown.slice(0, 12)}: it declares an encoding this scan cannot decode`), r.text);
});

test('no setting of this machine changes what is read of a commit: i18n.logOutputEncoding, a replacement object, a graft file', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  const plain = commit(dir, { 'a.md': 'A.\n' }, `docs: a\n\nAsked for by ${POLISH}.`);
  g(dir, 'config', 'i18n.logOutputEncoding', 'ISO-8859-2');
  let r = range(dir, start, 'HEAD');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(plain, 'message:3')}`), r.text);
  silent(r.text);

  const second = repo();
  const s0 = g(second, 'rev-parse', 'HEAD');
  const bad = commit(second, { 'a.md': `By ${WORD}.\n` }, 'docs: a');
  g(second, 'replace', bad, g(second, 'commit-tree', '-p', s0, '-m', 'docs: a', `${s0}^{tree}`));
  r = range(second, s0, bad);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(bad, 'a.md:1')}`), r.text);
  silent(r.text);

  // While a graft file is in force nothing is read: a push follows it when it picks what to send, and the scan does not.
  const refused = (out) => {
    assert.equal(out.status, 2, out.text);
    assert.equal(out.text.split('\n').filter((l) => /^rails (range|history): a graft file is in force/.test(l)).length, 1, out.text);
    assert.match(out.text, /git replace --convert-graft-file/);
    assert.ok(!/clean|refusal\(s\)/.test(out.text), out.text);
    silent(out.text);
  };
  const third = repo();
  const root = g(third, 'rev-parse', 'HEAD');
  g(third, 'checkout', '-q', '--orphan', 'private');
  commit(third, { 'p.md': `By ${WORD}.\n` }, 'docs: private');
  const last = commit(third, { 'q.md': 'Q.\n' }, 'docs: more');
  g(third, 'checkout', '-q', 'main');
  mkdirSync(join(third, '.git', 'info'), { recursive: true });
  const grafts = join(third, '.git', 'info', 'grafts');
  // The root joined onto a private history that is cut at its tip: a push sends that history's whole tree as one commit.
  writeFileSync(grafts, `${root} ${last}\n${last}\n`);
  refused(pushed(third, `refs/heads/main ${root} refs/heads/main ${ZERO}\n`));
  refused(range(third, ZERO, root));
  refused(run(third, ['history', '--require-key']));
  writeFileSync(grafts, '# no graft here\n\n');
  r = range(third, ZERO, root);
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /rails range \(1 commit\): clean/, 'a graft file with no graft in it is not in force');
  const outside = join(base, `grafts${++n}`);
  writeFileSync(outside, `${root} ${last}\n`);
  refused(run(third, ['range', ZERO, root, '--require-key'], { more: { GIT_GRAFT_FILE: outside } }));
});

test('a pushed annotated tag has its name, its tagger and its message read, a tag of a tag too', () => {
  const dir = repo();
  const head = g(dir, 'rev-parse', 'HEAD');
  const push = (ref, object = ref) => pushed(dir, `refs/tags/${ref} ${g(dir, 'rev-parse', object)} refs/tags/${ref} ${ZERO}\n`);
  const named = (r, object) => {
    assert.equal(r.status, 1, r.text);
    assert.ok(r.text.includes(`names: tag object ${g(dir, 'rev-parse', object).slice(0, 12)}: its name, its tagger or its message: `), r.text);
    silent(r.text);
  };
  g(dir, 'tag', '-a', 'v1', '-m', `The release for ${PAIR.join(' ')}.`);
  named(push('v1'), 'v1');
  execFileSync('git', [...ID, 'tag', '-a', 'v2', '-m', 'A plain release.'], { cwd: dir, stdio: 'pipe', env: { ...process.env, GIT_COMMITTER_NAME: PAIR.join(' ') } });
  named(push('v2'), 'v2');
  // The object keeps the name it was made under, whatever ref it is pushed to.
  g(dir, 'tag', '-a', `${WORD.toLowerCase()}-1`, '-m', 'A plain release.');
  named(push('v3', `${WORD.toLowerCase()}-1`), `${WORD.toLowerCase()}-1`);
  // A tag of a tag: the word is in the inner one only.
  g(dir, 'tag', '-a', 'inner', '-m', `Made for ${WORD}.`);
  g(dir, 'tag', '-a', 'outer', '-m', 'A plain tag of a tag.', g(dir, 'rev-parse', 'inner'));
  named(push('outer'), 'inner');
  // The message rail reads a tag's message as it reads a commit's.
  g(dir, 'tag', '-a', 'v4', '-m', 'A release.\n\nClaude-Session: abc');
  let r = push('v4');
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`messages: tag object ${g(dir, 'rev-parse', 'v4').slice(0, 12)} message:3: `), r.text);
  g(dir, 'tag', '-a', 'v5', '-m', 'A plain release.');
  r = push('v5');
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /rails range \(1 commit\): clean/);
  named(range(dir, ZERO, 'v1'), 'v1');
  r = run(dir, ['history', '--require-key']);
  assert.equal(r.status, 1, r.text);
  for (const t of ['v1', 'v2', 'inner', `${WORD.toLowerCase()}-1`]) assert.ok(r.text.includes(`names: tag object ${g(dir, 'rev-parse', t).slice(0, 12)}: `), `${t}: ${r.text}`);
  silent(r.text);
  assert.ok(head);
});

test('a real push of a tag through Althing\'s pre-push hook is refused when the tag carries a name, and nothing arrives', () => {
  const dir = repo();
  // The hook is Althing's own file, pointed at the copy of the rails that holds the invented list.
  const hook = readFileSync(join(ALTHING, '.githooks', 'pre-push'), 'utf8');
  assert.ok(hook.includes('exec node rails/run.mjs range'), 'the hook runs the rails by a relative path');
  mkdirSync(join(dir, '.git', 'hooks'), { recursive: true });
  writeFileSync(join(dir, '.git', 'hooks', 'pre-push'), hook.replace('exec node rails/run.mjs range', `exec node '${join(rails, 'run.mjs')}' range`), { mode: 0o755 });
  // A local bare remote whose address reads as the canonical repository.
  const remote = join(base, `remote${++n}`, 'krzysztofdudek', 'Althing.git');
  mkdirSync(remote, { recursive: true });
  g(remote, 'init', '-q', '--bare', '-b', 'main');
  const send = (...refs) => {
    const env = { ...process.env, HOME: join(base, 'home'), ALTHING_NAMES_KEY: KEY, GIT_ALLOW_PROTOCOL: 'file' };
    for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) delete env[k];
    const r = spawnSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'push', remote, ...refs], { cwd: dir, encoding: 'utf8', env });
    return { status: r.status, text: `${r.stdout}${r.stderr}` };
  };
  const has = (ref) => spawnSync('git', ['rev-parse', '--verify', '--quiet', ref], { cwd: remote }).status === 0;
  let r = send('main');
  assert.equal(r.status, 0, r.text);
  assert.match(r.text, /rails range \(1 commit\): clean/);
  g(dir, 'tag', '-a', 'v1', '-m', `The release for ${PAIR.join(' ')}.`);
  r = send('v1');
  assert.notEqual(r.status, 0, r.text);
  assert.match(r.text, /names: tag object [0-9a-f]{12}: its name, its tagger or its message: /);
  assert.ok(!has('refs/tags/v1'), 'the tag did not arrive');
  silent(r.text);
  g(dir, 'tag', '-a', 'v2', '-m', 'A plain release.');
  r = send('v2');
  assert.equal(r.status, 0, r.text);
  assert.ok(has('refs/tags/v2'), 'a clean tag arrives');
});

// A short entry, to meet a fragment of a signature's letters.
const SHORT = ['Zq', 'x'].join('');

// The checksum an OpenPGP armor closes with (CRC-24), as its four letters.
function checksum(bytes) {
  let crc = 0xb704ce;
  for (const b of bytes) { crc ^= b << 16; for (let bit = 0; bit < 8; bit++) { crc <<= 1; if (crc & 0x1000000) crc ^= 0x1864cfb; } }
  return Buffer.from([(crc >> 16) & 255, (crc >> 8) & 255, crc & 255]).toString('base64');
}

// An OpenPGP signature in its armor: one signature packet whose encoded letters hold the short entry between two slashes, on full lines and on the last line, closed by its checksum line.
function pgpArmor() {
  const rest = `${'AAAA'.repeat(4)}/${SHORT}/AAA`.repeat(9);
  const letters = `${Buffer.from([0x89, (rest.length * 3 / 4) >> 8, (rest.length * 3 / 4) & 255]).toString('base64')}${rest}`;
  return ['-----BEGIN PGP SIGNATURE-----', '', ...letters.match(/.{1,64}/g), `=${checksum(Buffer.from(letters, 'base64'))}`, '-----END PGP SIGNATURE-----'];
}

// An SSH signature in its armor, with the short entry between two slashes in its encoded letters.
function sshArmor() {
  const field = (b) => Buffer.concat([Buffer.from([0, 0, b.length >> 8, b.length & 255]), b]);
  const holds = Buffer.from(`/${SHORT}/AAA`.repeat(8), 'base64');
  const before = Buffer.concat([Buffer.from('SSHSIG'), Buffer.from([0, 0, 0, 1]), field(Buffer.alloc(51, 7)), field(Buffer.from('git')), field(Buffer.alloc(0)), field(Buffer.from('sha512'))]);
  // Three bytes make four letters, so the entry's bytes start at a multiple of three.
  const bytes = Buffer.concat([before, field(Buffer.concat([Buffer.alloc((3 - ((before.length + 4) % 3)) % 3, 9), holds]))]);
  const lines = bytes.toString('base64').match(/.{1,70}/g);
  assert.ok(lines.join('').includes(`/${SHORT}/`), 'the short entry stands in the encoded letters');
  return ['-----BEGIN SSH SIGNATURE-----', ...lines, '-----END SSH SIGNATURE-----'];
}

// A commit like HEAD with a gpgsig header that holds the armor.
function signed(dir, armor) {
  const header = `gpgsig ${armor.join('\n ')}\n`;
  return craft(dir, (raw) => raw.replace('\n\n', `\n${header}\n`));
}

test('a signature is not read as words by Althing\'s range, and text that is not UTF-8 is refused', () => {
  const dir = repo();
  const start = g(dir, 'rev-parse', 'HEAD');
  commit(dir, { 'a.md': 'A.\n' }, 'docs: a');
  for (const armor of [pgpArmor(), sshArmor()]) {
    const r = range(dir, start, signed(dir, armor));
    assert.equal(r.status, 0, `${armor[0]}: ${r.text}`);
    assert.match(r.text, /rails range \(1 commit\): clean/);
  }
  const pgp = pgpArmor();
  let bad = signed(dir, [pgp[0], '', `${WORD}Abc`, pgp.at(-1)]);
  let r = range(dir, start, bad);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`names: ${at(bad, 'author or committer, or another header of the commit')}`), r.text);
  silent(r.text);

  const tag = (message) => execFileSync('git', ['hash-object', '-t', 'tag', '-w', '--stdin'], { cwd: dir, input: Buffer.concat([Buffer.from(`object ${start}\ntype commit\ntag v1\ntagger Test <test@example.com> 0 +0000\n\n`), Buffer.isBuffer(message) ? message : Buffer.from(message)]) }).toString().trim();
  const push = (id) => pushed(dir, `refs/tags/v1 ${id} refs/tags/v1 ${ZERO}\n`);
  r = push(tag(`A plain release.\n${pgp.join('\n')}\n`));
  assert.equal(r.status, 0, r.text);
  const odd = tag(Buffer.from(`The release for ${LATIN2}.\n`, 'latin1'));
  r = push(odd);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`messages: tag object ${odd.slice(0, 12)}: its bytes are not UTF-8`), r.text);
  silent(r.text);
  const undeclared = craft(dir, (raw) => `${raw}\nAsked for by ${LATIN2}.\n`);
  r = range(dir, start, undeclared);
  assert.equal(r.status, 1, r.text);
  assert.ok(r.text.includes(`messages: commit ${undeclared.slice(0, 12)}: its bytes are not UTF-8`), r.text);
  silent(r.text);
});
