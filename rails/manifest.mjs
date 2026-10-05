// The release manifest detector (rail release/manifest): releases/<v>/family.json
// is a valid family-release/1 document. Shared by ws, which writes manifests.

export const SEMVER = /^\d+\.\d+\.\d+$/;
const SHA = /^[0-9a-f]{40}$/;
const STATES = ['open', 'candidate', 'published'];

// validateManifest(m, { dir, registry, previousExists, frozen })
//   dir             the release directory name (x.y.z)
//   registry        the parsed family/registry.json, or null when unreadable here
//   previousExists  (version) => true | false | null (null: cannot be read from here)
//   frozen          the set of paths FROZEN.sha256 lists, or null when there is none
// Returns a list of messages.
export function validateManifest(m, { dir, registry = null, previousExists = () => null, frozen = null } = {}) {
  const out = [];
  if (!m || typeof m !== 'object') return ['family.json must be a JSON object.'];
  if (m.schema !== 'family-release/1') out.push('"schema" must be "family-release/1".');
  if (m.release !== dir) out.push(`"release" must equal the directory name, "${dir}".`);
  if (!STATES.includes(m.state)) out.push(`"state" must be one of ${STATES.join(', ')}.`);
  if (m.previous !== null && m.previous !== undefined) {
    if (!SEMVER.test(String(m.previous))) out.push('"previous" must be a version (x.y.z) or null.');
    else {
      const ex = previousExists(m.previous);
      if (ex === false) out.push(`"previous" names ${m.previous}, but releases/${m.previous}/family.json does not exist.`);
      if (ex === null) out.push(`"previous" names ${m.previous}, which this release's node cannot read; run node workspace/ws.mjs release nodes ${dir} to declare the relation.`);
    }
  }
  if (m.driver !== undefined) {
    const j = m.driver && m.driver.jarl;
    if (!j || !['sibling', 'release'].includes(j.source)) out.push('"driver.jarl.source" must be "sibling" or "release".');
    else if (j.source === 'sibling') {
      if (!j.repo) out.push('"driver.jarl.repo" names the registry entry of the sibling checkout.');
      if (!SHA.test(String(j.commit))) out.push('"driver.jarl.commit" must be the full 40-character commit the driver is pinned to.');
    } else if (!SEMVER.test(String(j.release))) out.push('"driver.jarl.release" must name the release whose Jarl tag drives this loop.');
  }
  if (!m.repos || typeof m.repos !== 'object') { out.push('"repos" must map repository names to their entries.'); return out; }
  const coreVersions = new Map();
  for (const [name, r] of Object.entries(m.repos)) {
    if (!r || typeof r !== 'object') { out.push(`repos.${name} must be an object.`); continue; }
    if (name === 'althing') continue; // Althing is not released; its row names its branch and check.
    if (r.version !== undefined && !SEMVER.test(String(r.version))) out.push(`repos.${name}.version must be x.y.z.`);
    if (m.state === 'open' && r.commit !== null && r.commit !== undefined) out.push(`repos.${name}.commit must be null while the release is open.`);
    if ((m.state === 'candidate' || m.state === 'published') && !SHA.test(String(r.commit))) out.push(`repos.${name}.commit must be a full 40-character commit once the release is ${m.state}.`);
    if (registry && registry.repos) {
      const reg = registry.repos[name];
      if (!reg) out.push(`repos.${name} is not in family/registry.json.`);
      else if (reg.kind === 'core' && r.version) coreVersions.set(name, r.version);
    }
  }
  if (new Set(coreVersions.values()).size > 1) out.push(`the core ships on one version, but the manifest names ${[...coreVersions].map(([n, v]) => `${n} ${v}`).join(', ')}.`);
  if (m.state === 'published' && !(frozen && frozen.has('family.json'))) out.push('a published manifest is frozen: run node workspace/ws.mjs freeze releases/' + dir + ' so FROZEN.sha256 holds its hash.');
  return out;
}
