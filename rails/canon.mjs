// The canon consistency detector (rail canon/registry-consistent): the
// canon's family block, the tool map and the contracts index name exactly the
// registry's core and add-ons, and no retired name. The registry is the one
// place the list of tools is written; nothing else hardcodes it.

export const CANON_START = '<!-- CANON:FAMILY-SECTION:START -->';
export const CANON_END = '<!-- CANON:FAMILY-SECTION:END -->';

export function canonBlock(text) {
  const a = text.indexOf(CANON_START);
  const b = text.indexOf(CANON_END);
  if (a < 0 || b < a) return null;
  return text.slice(a + CANON_START.length, b);
}

// registry: { repos: { name: { display, kind } }, retired: [names] }
// docs: { 'family/canon.md': text, 'family/map.md': text, 'family/contracts.md': text } (absent keys are skipped)
export function checkCanon(registry, docs) {
  const out = [];
  if (!registry || !registry.repos) return [{ file: 'family/registry.json', message: 'family/registry.json has no "repos".' }];
  const members = Object.entries(registry.repos).filter(([, r]) => r.kind === 'core' || r.kind === 'add-on').map(([n, r]) => r.display || n);
  const retired = registry.retired || [];
  for (const [file, text] of Object.entries(docs)) {
    if (text === undefined || text === null) continue;
    let scope = text;
    if (file === 'family/canon.md') {
      scope = canonBlock(text);
      if (scope === null) { out.push({ file, message: `the canon has no family block between ${CANON_START} and ${CANON_END}.` }); continue; }
    }
    for (const name of members) {
      if (!new RegExp(`\\b${name}\\b`).test(scope)) out.push({ file, message: `${name} is a ${registry.repos[Object.keys(registry.repos).find((k) => (registry.repos[k].display || k) === name)].kind} in the registry but ${file === 'family/canon.md' ? "the canon's family block" : file} does not name it.` });
    }
    for (const name of retired) {
      if (new RegExp(`\\b${name}\\b`).test(scope)) out.push({ file, message: `${name} has left the family (registry "retired"), but ${file === 'family/canon.md' ? "the canon's family block" : file} still names it.` });
    }
  }
  return out;
}
