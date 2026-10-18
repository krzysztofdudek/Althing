// The wiring detector (rail hooks/wired): the git hooks and rails.yml invoke
// the hook rails and the Yggdrasil fill and gate, and pin the same yg version.
// Without this, a rail that needs a secret or git history could silently stop
// running while every Yggdrasil rule stayed green.

const PIN = /@chrisdudek\/yg@(\d+\.\d+\.\d+)/g;

export function pinsOf(text) {
  return [...String(text).matchAll(PIN)].map((m) => m[1]);
}

const HOOKS = {
  '.githooks/pre-commit': [[/\byg\b[^\n]*\bcheck\b|@chrisdudek\/yg@[^\s]+\s+check\b/, 'the Yggdrasil gate (yg check)'], [/rails\/run\.mjs\s+staged\b/, 'node rails/run.mjs staged']],
  '.githooks/commit-msg': [[/rails\/run\.mjs\s+message\b/, 'node rails/run.mjs message']],
  '.githooks/pre-push': [[/rails\/run\.mjs\s+range\b/, 'node rails/run.mjs range'], [/--require-key\b/, '--require-key'], [/--remote\s+"\$2"/, 'the remote check (--remote "$2")']],
  '.githooks/post-merge': [[/log\s+merge-resolve\b/, 'yg log merge-resolve']],
};

const CI = [
  [/node\s+--test\b/, 'the rails tests (node --test)'],
  [/check\s+--approve\s+--only-deterministic\b/, 'the Yggdrasil fill (yg check --approve --only-deterministic)'],
  [/check\s+--no-approve\b/, 'the Yggdrasil gate (yg check --no-approve)'],
  [/rails\/run\.mjs\s+range\b[^\n]*--require-key/, 'the names scan over the pushed range (rails/run.mjs range ... --require-key)'],
  [/rails\/run\.mjs\s+history\b[^\n]*--require-key/, 'the nightly history scan (rails/run.mjs history --require-key)'],
  [/secrets\.ALTHING_NAMES_KEY\b/, 'the names key secret (ALTHING_NAMES_KEY)'],
  [/github\.repository\s*==\s*'krzysztofdudek\/Althing'/, 'the names job guarded to the canonical repository (github.repository)'],
];

// hooks: { path: text } of the .githooks node; ci: rails.yml text, or null when unreadable here.
export function checkHooks(hooks, ci) {
  const out = [];
  const pins = new Set();
  for (const [path, needs] of Object.entries(HOOKS)) {
    const text = hooks[path];
    if (text === undefined) { out.push({ file: Object.keys(hooks)[0], message: `${path} is missing.` }); continue; }
    for (const [re, label] of needs) if (!re.test(text)) out.push({ file: path, message: `${path} does not run ${label}.` });
    for (const p of pinsOf(text)) pins.add(p);
  }
  if (pins.size > 1) out.push({ file: Object.keys(hooks)[0], message: `the hooks pin different yg versions: ${[...pins].join(', ')}.` });
  if (ci === null) out.push({ file: Object.keys(hooks)[0], message: 'the hooks node cannot read .github/workflows/rails.yml; declare its uses relation to the ci node.' });
  else if (ci !== false) {
    const ciPins = new Set(pinsOf(ci));
    for (const p of ciPins) if (pins.size && !pins.has(p)) out.push({ file: Object.keys(hooks)[0], message: `rails.yml pins yg ${p}, the hooks pin ${[...pins].join(', ')}: one pin, everywhere.` });
  } else out.push({ file: Object.keys(hooks)[0], message: '.github/workflows/rails.yml is missing.' });
  return out;
}

export function checkCi(path, text) {
  const out = [];
  for (const [re, label] of CI) if (!re.test(text)) out.push({ file: path, message: `rails.yml does not run ${label}.` });
  if (new Set(pinsOf(text)).size > 1) out.push({ file: path, message: `rails.yml pins different yg versions: ${[...new Set(pinsOf(text))].join(', ')}.` });
  return out;
}
