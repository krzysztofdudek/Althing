// The read-only detector (rail code/read-only-to-tools). Althing's workspace
// verifies; it never writes to a remote or a tool: no push, no tag, no
// publish, no release, no repository settings, no merged pull request, no
// closed or commented issue, no write through the GitHub API. Those acts are
// the owner's word, done by a person or by an agent on his word, never by code
// in workspace/. A needed exception is an architecture change.
//
// A push is seen in every shape a call takes: a shell line, with or without
// options between the command and its name (git -C <dir> push); an argument
// array, wherever in it the name stands; and the name as a string of its own,
// which is how it reaches git through a variable or a helper. send-pack, the
// plumbing a push runs, is read the same way.
//
// One exception is named below, and it is the only one: the tests of the names
// gate have to push for real, through the hook they test, and every such push
// goes through workspace/test/scratch-push.mjs, which runs it only over the
// file transport and only to a bare repository under the system temporary
// directory. The rail allows a push in that one file and nowhere else; the
// file's own tests hold what it refuses to run.

export const EXCEPTIONS = [
  { name: 'scratch-fixture-push', path: 'workspace/test/scratch-push.mjs', label: 'git push' },
];

const WRITES = [
  [/\bgit\b(?:\s+-{1,2}[^\s'"`]+(?:\s+[^-\s'"`][^\s'"`]*)?)*\s+(?:push|send-pack)\b/, 'git push'],
  [/['"`]git['"`]\s*,\s*\[[^\]]*?['"`](?:push|send-pack)['"`]/, 'git push'],
  [/(['"`])(?:push|send-pack)\1/, 'git push'],
  [/\bgit\s+tag\s+(?!-l\b|--list\b|--contains\b|--no-contains\b|--points-at\b|--merged\b|--no-merged\b|-n\d*\b|--sort\b|--format\b)\S/, 'git tag (creating, moving or deleting a tag)'],
  [/\bnpm\s+(?:publish|unpublish|deprecate|dist-tag\s+(?:add|rm))\b/, 'npm publish'],
  [/\bgh\s+release\s+(?:create|edit|delete|upload)\b/, 'gh release'],
  [/\bgh\s+repo\s+(?:edit|delete|archive|rename|create)\b/, 'gh repo edit'],
  [/\bgh\s+pr\s+(?:merge|close|comment|create|edit|review|reopen)\b/, 'gh pr'],
  [/\bgh\s+issue\s+(?:close|comment|create|edit|delete|reopen|transfer|lock|pin)\b/, 'gh issue'],
  [/\bgh\s+secret\s+(?:set|delete)\b/, 'gh secret'],
  [/\bgh\s+api\b[^\n]*(?:-X|--method)[\s=]*['"]?(?:POST|PUT|PATCH|DELETE)\b/, 'gh api with a writing method'],
  // the same commands as argument arrays: spawn('git', ['tag', ...])
  [/['"]git['"]\s*,\s*\[\s*['"]tag['"]\s*,\s*['"](?!-l['"]|--list['"]|--points-at['"]|--contains['"]|--merged['"])/, 'git tag'],
  [/['"]npm['"]\s*,\s*\[\s*['"](?:publish|unpublish|deprecate)['"]/, 'npm publish'],
  [/['"]gh['"]\s*,\s*\[\s*['"](?:release|repo|pr|issue|secret)['"]\s*,\s*['"](?:create|edit|delete|upload|archive|rename|merge|close|comment|review|reopen|transfer|lock|pin|set)['"]/, 'gh write'],
  [/['"]gh['"]\s*,\s*\[\s*['"]api['"][^\]]*['"](?:-X|--method)['"]\s*,\s*['"](?:POST|PUT|PATCH|DELETE)['"]/, 'gh api with a writing method'],
];

const CODE = /\.(?:mjs|cjs|js|ts|sh|bash)$/;

export function scanCode(path, text) {
  const out = [];
  if (!CODE.test(path)) return out;
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const [re, label] of WRITES) {
      if (!re.test(lines[i])) continue;
      if (EXCEPTIONS.some((e) => e.path === path && e.label === label)) continue;
      out.push({ line: i + 1, label });
      break;
    }
  }
  return out;
}

export function describeCode(f) {
  return `${f.label}: workspace code never writes to a remote or a tool. Print the command for a person to run on the owner's word instead; an exception is an architecture change.`;
}
