# 099 · In a sparse checkout (common in monorepos) the same commit gives a different architecture: edges between packages disappear, and propose mines no dependency law

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/relations.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/engine/arch.mjs, Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/vendor/runes/dist/relations/resolve-path.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-context.mjs:283 (`learn({ root, ... })` with the worktree root), arch.mjs:290 (`buildEdges({ root, ... })`), relations.mjs:362 (`makeResolvePathToFile(root, …)`), vendor/runes/dist/relations/resolve-path.mjs:43 (`existsSync(path.resolve(projectRoot, p))`), :52-58 (statSync) and the manifest readers :157-801; the contract in history.mjs:127-130 (headTree). Unchanged on release/6.1.1.
**Branch:** jarl/099-index-from-head-tree
**Merged:** e10ff0c
**CI:** none

## What
Reproduction (fresh clone of Grain v6.1.0, ae6152f; generator gen/ws-mono.mjs): an npm workspaces monorepo in which packages/a imports '@acme/b' 12 times. Two clones; in one of them `git sparse-checkout set packages/a`. In both, `grain report` and `grain propose` on the same HEAD.

Full clone: '== architecture — 3 modules · 1 directed dependencies', 'packages/a/ → packages/b/ (12)', propose: '1 relations'. Sparse clone, the same sha: '0 directed dependencies' and '12 file-level edges resolved, none crossing a module boundary'; propose: 'no law about dependencies could be mined (36 references seen, 12 resolved, 0 survived the module cut)', a proposal without a `relations:` block, and `yg adopt --dry-run` would accept it. `grain status` still says 'up to date · history full' and discloses nothing.

Cause: the code comes from HEAD blobs (headTree, whose comment promises 'the model is a pure function of the commit, never of the worktree'), but relation resolution gets the worktree root and every resolver checks the disk. Every file tracked in HEAD that is not in the worktree (outside the sparse cone or deleted without a commit) is unresolvable. This affects manifests (package.json, tsconfig, go.mod, Cargo) and plain targets of relative imports: model.relStages in the full clone {seen 36, resolved 36, crossing 12}, in the sparse one {seen 36, resolved 12, crossing 0}; relative imports inside packages/b (`./util0` and the rest) are lost too, and `git ls-files -t` shows packages/b as `S` (skip-worktree).

More than in the issue:
- Log 03: the same clone, the same HEAD, two models. Index on the full worktree: 1 dependency; after `sparse-checkout set` the cache still 1; after `refresh --full` 0; after `git sparse-checkout disable` (the worktree full again) still 0 and 'up to date', until HEAD moves or someone runs a manual `refresh --full`. The cache is keyed by HEAD only.
- Log 04: `grain measure` materializes the commit's tree and sees 'out of it 0 → 12' for packages/a, while `grain report` in the same clone on the same commit sees 0 dependencies between modules.
- Log 06: without a sparse checkout, an uncommitted deletion of packages/b/package.json alone (` D` in git status) gives '0 directed dependencies', with the answer 'as of c1ef3c5' without +dirty.

`grain measure` already does this right: measure.mjs:9-13 and :55-67 write the commit's tree under the store and run learn with `root: work`. Related: issue 010 (Yggdrasil/Runes, ignored build files PRESENT on disk) is another channel of the same family; a shared fix in Runes (an exists/read layer based on the commit's tree) could handle both. The finder's sub-claim that propose proposes files absent from disk ('29 tracked files') is not a defect: in git mode the universe is the HEAD tree; the defect is that resolution does not follow the same universe.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-7/B-sparse-checkout-edges.log and B-sparse-checkout-propose.log (generator gen/ws-mono.mjs in the same directory); verification <the session scratchpad, since lost>/bughunt/grain/verify-31/01-report-full-vs-sparse.log (report and status, full clone against sparse, the same HEAD c1ef3c5) and 02-propose-full-vs-sparse.log, 03-cache-history-same-head.log, 04-measure-vs-report-sparse.log, 05-which-edges-survive.log, 06-dirty-worktree-no-sparse.log in that directory. The first line of each log is the exact command.

## Why
The architecture and the mined dependency law are silently wrong on the same commit, and the wrong model stays in the cache as 'up to date' even after the full worktree is restored. This affects sparse checkouts of monorepos and every uncommitted deletion or move of a file. It breaks three contracts: the comment history.mjs:128, README:155/285 ('Delete the cache any time; the next query rebuilds the same bytes', 'uncommitted work never feeds the norm, by design') and docs/mathematics.md:56 ('In git mode the universe is the HEAD tree'). Workaround: a full worktree plus `grain refresh --full`.

## Acceptance
- Refreshing the HEAD index resolves relations against the commit's tree (materialized as in measure, or through exists/read based on `git ls-tree`/`cat-file`), not against the worktree.
- Fixture from ws-mono.mjs: in a sparse clone (`git sparse-checkout set packages/a`) `grain report` gives 'packages/a/ → packages/b/ (12)', and `grain propose` mines 1 relation, like a full clone of the same sha.
- An uncommitted deletion of packages/b/package.json does not change the dependency count in `grain report`, and after the worktree is restored no 'up to date' model differs from a cold build of the same commit.

## Changelog
- Fixed: in a sparse checkout, or with a file deleted but not committed, the architecture now matches a full clone of the same commit instead of losing dependencies between packages.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/index-from-commit-tree.test.mjs (release/6.1.1 vs jarl/099-index-from-head-tree a44e7c9) · **saw:** base: 3 of 3 fail (sparse clone '3 modules · 0 directed dependencies'); branch: 3 of 3 pass (sparse clone reports packages/a/ → packages/b/ (12), model.json byte-equal to the full clone; after sparse-checkout disable and after an uncommitted delete of packages/b/package.json the model equals a cold build)

Not done, owner question: 'grain propose mines 1 relation in the sparse clone'. Index is fixed (model has the 12 crossing edges), but propose deliberately lists only files present on disk as regular files (propose-base.mjs, because yg adopt's walk reads the disk), so packages/b gets no node and no relation. Options: (a) propose for the commit (relation mined, but yg adopt in that sparse checkout would refuse mappings it cannot see — adopt must then run from a full checkout); (b) keep proposing for the disk and say in the report that N dependencies lead to files outside the checkout. Today it prints 'no law about dependencies could be mined (36 seen, 36 resolved, 12 survived the module cut)'.

cost: typeorm (3809 tracked files, 12.8 MB) — writing+removing the commit tree 2.3-2.7 s on macOS under load; grain refresh 25.5/25.8 s base vs 25.3/29.2 s branch. Needs: MODEL_V. docs: reference.md (freshness/store): the index resolves imports against the commit's tree, written to a temporary directory outside the repository for each build, never the worktree
- **ran:** node --import ./tests/git-env.mjs --test tests/index-from-commit-tree.test.mjs (propose-report change reverted vs 9367010) · **saw:** without it: the 'left out' test fails (old 'survived the module cut' line); with it: 4/4 pass, sparse line 'no dependency law in this checkout: 12 dependencies lead to files outside this checkout (tracked at <sha>, absent from disk), so the proposal leaves them out; a full checkout gives the complete proposal', full clone '1 relations' with no note. Full npm test: 2156, 2122 pass, 0 fail, 34 skipped

docs: reference.md (propose report): the architecture line names the dependencies leading to files outside the checkout and points to a full checkout
- **ran:** node --import ./tests/git-env.mjs --test tests/commit-tree-untrusted.test.mjs (previous writer vs cb11208) · **saw:** previous writer: 5/5 fail (crafted tree wrote payload.txt into the folder link A pointed at; trees left after SIGTERM/SIGINT; no sweep; binary kept). cb11208: 5/5 pass. Full npm test: 2161, 2127 pass, 0 fail, 34 skipped; no grain-tree-* left in TMPDIR

docs: reference.md (freshness/store): the commit's tree holds Git LFS pointer text, not content; a symbolic link is written as a plain file with its target; of two names differing only in case a case-insensitive disk keeps the first, as a checkout would
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2178, pass 2177, fail 0, skipped 1, merge e10ff0c

