// The rulings ledger detector (rail rulings/ledger): method/rulings.md holds
// the owner's standing rulings, one entry each:
//
//   ## <slug>
//   **Date:** YYYY-MM-DD · **Status:** standing | superseded by <slug> | retired · **Origin:** releases/<v> | private <v> loop, translated
//
// An entry from a loop in this repository is a pointer: its text is the
// ruling of that slug in releases/<v>/.jarl/decisions.md, which must exist.
// An entry from a loop kept private carries its translated text below the line.

const META = /^\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})\s*\u00b7\s*\*\*Status:\*\*\s*(standing|retired|superseded by ([a-z0-9][a-z0-9.-]*))\s*\u00b7\s*\*\*Origin:\*\*\s*(releases\/(\d+\.\d+\.\d+)|private (\d+\.\d+\.\d+) loop, translated)\s*$/;
const SLUG = /^[a-z0-9][a-z0-9.-]*$/;

export function parseLedger(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  for (let i = 0; i < lines.length; i++) {
    const h = /^## (.+)$/.exec(lines[i]);
    if (!h) continue;
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    const m = META.exec((lines[j] || '').trim());
    entries.push({ slug: h[1].trim(), line: i + 1, metaLine: j + 1, meta: m ? { date: m[1], status: m[2], supersededBy: m[3] || null, loop: m[5] || null, privateLoop: m[6] || null } : null });
  }
  return entries;
}

// checkLedger(text, { decisionsOf(version) -> text | false (no loop) | null (unreadable) })
export function checkLedger(text, { decisionsOf = () => null } = {}) {
  const out = [];
  const entries = parseLedger(text);
  const slugs = new Set();
  for (const e of entries) {
    if (!SLUG.test(e.slug)) out.push({ line: e.line, message: `"${e.slug}" is not a slug (lower-case letters, digits, dots and hyphens).` });
    if (slugs.has(e.slug)) out.push({ line: e.line, message: `the slug "${e.slug}" has two entries.` });
    slugs.add(e.slug);
    if (!e.meta) { out.push({ line: e.metaLine, message: `the line after "## ${e.slug}" must read **Date:** YYYY-MM-DD \u00b7 **Status:** standing | superseded by <slug> | retired \u00b7 **Origin:** releases/<v> | private <v> loop, translated.` }); continue; }
    if (e.meta.loop) {
      const d = decisionsOf(e.meta.loop);
      if (d === null) out.push({ line: e.metaLine, message: `the method node cannot read releases/${e.meta.loop}/.jarl/decisions.md; declare a uses relation to the release-${e.meta.loop}-loop node.` });
      else if (d === false) out.push({ line: e.metaLine, message: `releases/${e.meta.loop} has no loop to point at.` });
      else if (!new RegExp(`^## ${e.meta.date} \u00b7 ${e.slug.replace(/[.]/g, '\\.')}\\s*$`, 'm').test(d)) out.push({ line: e.metaLine, message: `releases/${e.meta.loop}/.jarl/decisions.md has no ruling "## ${e.meta.date} \u00b7 ${e.slug}".` });
    }
  }
  for (const e of entries) {
    if (e.meta && e.meta.supersededBy && !slugs.has(e.meta.supersededBy)) out.push({ line: e.metaLine, message: `"${e.slug}" is superseded by "${e.meta.supersededBy}", which has no entry here.` });
  }
  return out;
}
