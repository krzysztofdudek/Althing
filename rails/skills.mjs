// The skill frontmatter detector (rail skills/frontmatter). A skill is found by
// its description, so the description must say when it applies: it starts
// "Use when", fits in 1024 characters, and the name matches the directory.

export function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z][\w-]*):\s?(.*)$/.exec(line);
    if (kv) fields[kv[1]] = kv[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return fields;
}

export function checkSkill(path, text) {
  const out = [];
  if (!/\/SKILL\.md$/.test(path)) return out;
  const dir = path.split('/').slice(-2, -1)[0];
  const fm = parseFrontmatter(text);
  if (!fm) return [`${path} has no frontmatter (--- name, description ---).`];
  if (fm.name !== dir) out.push(`name "${fm.name ?? ''}" must equal the skill's directory, "${dir}".`);
  const d = fm.description ?? '';
  if (!d.startsWith('Use when')) out.push('description must start "Use when": a skill is found by the moment it names.');
  if (d.length > 1024) out.push(`description is ${d.length} characters; the limit is 1024.`);
  return out;
}
