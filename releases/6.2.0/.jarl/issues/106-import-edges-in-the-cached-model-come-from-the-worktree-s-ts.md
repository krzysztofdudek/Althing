# 106 · Import edges in the cached model come from the worktree's tsconfig.json at build time, not from HEAD, and the cache does not notice: after the edit is undone the model stays 'up to date', and check reports a false 'FIRST edge'

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/relations.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/arch.mjs, Grain/plugins/grain/engine/grain-context.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/learn.mjs:646 (applyRelationLayer with `root` = the checkout path), relations.mjs:362 (makeResolvePathToFile(root, …)), :364 (csScopesFor(root, …)), the comment :308-313 ('from disk, at the repository root'), arch.mjs:241 onward (composer.json from root), vendor/runes/dist/relations/resolve-path.mjs:54 (statSync for the target's existence), grain-context.mjs:215-222 (ensureFresh: the freshness key is only HEAD, versions, seeds and the history mode). measure.mjs:9-12 does it right (docs/reference.md:879).
**Branch:** jarl/099-index-from-head-tree
**Merged:** e10ff0c
**CI:** none

## What
Reproduction (fresh clone of Grain ae6152f, i.e. v6.1.0 plus a commit changing only CHANGELOG.md and CLAUDE.md; node 24.11.1; new repositories in verify-43/run-*/ and rund-*/):

A. A committed tsconfig.json maps @core/* → src/core/*, and 6 files in src/app import @core/x; `grain report`: src/app -> src/core (6). With the alias removed only in the worktree, `grain refresh` gives 0 dependencies. After `git checkout tsconfig.json` (git status: only `?? .grain/`) the index still gives '3 modules · 0 directed dependencies' and 'resolution does not cover 13 files', and status 'indexed HEAD 2ef87d0 · current HEAD 2ef87d0 · up to date'. `grain check src/app/use-a.ts` (a committed file whose import is one of the 6 existing ones): '[grain] architecture: your import of `src/core/a.ts` (line 1) is the FIRST edge src/app → src/core (0 existing)', with the stamp 'as of 2ef87d0' without +dirty. A fresh clone of the same commit: 1 dependency (6), and check stays silent. Only a second refresh with a clean worktree restores the model.
B. Without an explicit refresh: with a dirty tsconfig.json a separate commit lands (`git add` of one new file). The next query refreshes on the new HEAD 5569f48 and absorbs the dirty tsconfig. After the undo, the wrong model stays 'up to date' with the same false FIRST edge warning; a clone of 5569f48 gives 1 dependency. This is the ordinary working path: every HEAD move during a manifest edit bakes that edit into the next HEAD move.
C. The other way round: a committed tsconfig without the alias, and the worktree adds the alias before the refresh. The model gains src/app -> src/core (3), which HEAD does not have, still as 'up to date'.
D. Relative imports: two committed target files moved aside (mv) for the duration of the refresh and restored. The model holds src/app -> src/core (2) instead of (4), so the existence of source files also leaks into the model, not only the content of manifests.
E. npm workspace: the name in package.json changed in the worktree for the duration of the refresh and reverted; the model holds 0 dependencies instead of packages/app -> packages/core (4).

The same cause as in issue 099 (sparse checkout): there files are missing, here the worktree differs from HEAD at build time. Related: issue 010 (Yggdrasil/Runes, ignored build files on disk change the yg check verdict). A shared fix in Runes (an injected file reader based on the commit's tree) could cover all three.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f7c-worktree-manifest/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-43/repro.log (variants A, B, C; script repro.sh) and <the session scratchpad, since lost>/bughunt/grain/verify-43/repro-d.log (variants D, E; script repro-d.sh).

## Why
Architecture answers (report, map, export, propose's relations, and check's FIRST edge, cycle and boundary notes) come out wrong, marked 'up to date' and without +dirty, until the next commit or a manual refresh, and a fresh clone or CI on the same commit disagrees with them. The agent gets false 'first edge' warnings on committed imports or misses real new edges. This breaks the contracts: history.mjs:127-128 ('a pure function of the commit, never of the worktree'), docs/mathematics.md ('In git mode the universe is the HEAD tree'), README ('uncommitted work never feeds the norm, by design' and 'Delete the cache any time; the next query rebuilds the same bytes') and grain-context.mjs ('Worktree edits never trigger a rebuild (the norm is the accepted past — by design)').

## Acceptance
- During a HEAD refresh the resolvers read the manifests (tsconfig, package.json, go.mod, Cargo.toml, composer.json, .csproj) and check that targets exist in the HEAD tree, not in the worktree; alternatively, the freshness key covers everything the resolvers read from disk.
- Variants A–E from repro.sh and repro-d.sh: after the worktree is reverted to HEAD, `grain report` gives the same as a cold build of a fresh clone of the same commit, and `grain check src/app/use-a.ts` stays silent.

## Changelog
- Fixed: editing a tsconfig.json or package.json, or moving a file aside, while the index rebuilds no longer leaves wrong dependencies (and false first-edge warnings) in place after you undo the edit.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/index-ignores-worktree-manifests.test.mjs (release/6.1.1 vs branch 517a4ef) · **saw:** base: 5 of 5 fail (A/B/E '0 directed dependencies' vs cold 1; C '1 directed dependencies' vs cold 0; D edges 2 instead of 4); branch: 5 of 5 pass, each model.json equal to a fresh clone's cold build, grain check src/app/use-a.ts without 'FIRST edge'. Full npm test on branch: 2155 tests, 2121 pass, 0 fail, 34 skipped
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2178, pass 2177, fail 0, skipped 1, merge e10ff0c

