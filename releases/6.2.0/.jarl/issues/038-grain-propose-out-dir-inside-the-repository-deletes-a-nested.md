# 038 · grain propose <out-dir> inside the repository deletes a nested project's hand-written .yggdrasil/ and writes a .gitignore with `*`, which hides every new file in that directory from git

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0737-tymk
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-export.mjs, Grain/plugins/grain/engine/propose-write.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-export.mjs:71-84 (the guard refuses only the root, the root's .yggdrasil/ and paths under it) and :132-134 (writing `*` to <out-dir>/.gitignore when there is none); propose-write.mjs:323 (v6.1.0; :324-325 on release/6.1.1) `rmSync(join(outDir,'.yggdrasil'), {recursive:true, force:true})`
**Branch:** jarl/037-propose-outdir-guard
**Merged:** ed22555
**CI:** none

## What
Reproduction (Grain v6.1.0 ae6152f, yg 6.1.0): a monorepo with src/api, src/core, services/auth and services/billing; services/billing/.yggdrasil/ is a hand-written, uncommitted graph of a nested project (yg-architecture.yaml, model/yg-node.yaml). From the root, `node <grain>/plugins/grain/bin/grain.mjs propose services/billing` (an easy mistake in a monorepo: the positional argument is the out-dir, and the scope is `--scope`) → exit 0 with no warning, 'proposed a graph … — services/billing/.yggdrasil/'. services/billing/.yggdrasil/yg-architecture.yaml starts with '# PROPOSAL — written by grain', the hand-written content is gone and cannot be recovered. Grain also wrote services/billing/.gitignore with `*`: a new services/billing/src/new-feature.ts does not show in `git status` and `git add -A` does not add it (`git check-ignore -v` → services/billing/.gitignore:2:*). When the nested graph was committed, `git add -A` stages the deletion of yg-node.yaml and the replaced yg-architecture.yaml, while the rest of the proposal stays hidden by `*`, so a commit would record a half-replaced graph. Variant without a nested graph: `grain propose src` on an ordinary code directory also writes src/.gitignore with `*` and hides a new src/s4.ts (a new lib/l4.ts is visible). Grain knows about nested projects (propose-nodes.mjs nestedProjectRoots, ~:89), but the guard does not use that. Related: issue 037 (the guard loses to letter case on macOS). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-27/logs/repro-uncommitted.log, repro-committed.log, repro-plain-code-dir.log.

## Why
docs/reference.md:289-292 promises that the proposal 'never shows as an uncommitted change and can never be committed by accident, and deleting it is always safe … The repository's own .yggdrasil/ is never written by grain, at all', and CHANGELOG.md:120 'It never touches a graph you already have'. Here one mistake in an argument ends in a silent, irreversible deletion of someone else's work and in new source files that silently drop out of git.

## Acceptance
- propose refuses an out-dir that contains a .yggdrasil/ not written by Grain (without a proposal.json of schema grain-proposal/1 beside it and without the '# PROPOSAL — written by grain' header), and an out-dir containing any tracked file (`git ls-files -- <out-dir>` non-empty); the default .yggdrasil-proposal/ still works.
- `*` in .gitignore goes only into a directory that is new or contains nothing but Grain's output; test: `grain propose services/billing` and `grain propose src` in the fixture from the reproduction end in a refusal, and the files and the graph stay untouched.

## Changelog
- Fixed: `grain propose <dir>` refuses a directory that holds a graph it did not write, a file of yours under a name it writes (such as PROPOSAL.md), or files git tracks, instead of replacing them and hiding new files there from git; the part of the repository to propose for is named with `--scope`. A proposal written into a directory that already holds other files is now visible to git.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/propose-out-dir-foreign-contents.test.mjs (plugins/grain, worktree Grain-037; engine before the fix, then at 485ebbe) · **saw:** before the fix: tests 6, pass 1, fail 5 — 'expected a refusal for services/billing, got exit 0', same for src and for an out-dir holding a hand-written graph, 'Missing expected rejection' from the renderer, and 'a `*` .gitignore went into a directory holding someone else's files'; after 485ebbe: tests 6, pass 6, fail 0 (the default .yggdrasil-proposal/, a fresh dir, an empty dir and re-runs still work and ignore themselves)

docs: docs/reference.md (propose, the out-dir paragraph ~:289-292): add that propose refuses an out-dir holding a .yggdrasil/ grain did not write or any file git tracks, and writes its ignore-everything .gitignore only into a new directory or one holding nothing but an earlier proposal (otherwise the report says no .gitignore was written). Optional: bin/grain-mcp.mjs:61 tool description says only 'your own .yggdrasil/ is refused'.
- **ran (history):** YG_BIN=<scratchpad>/grain-611/ci/yggdrasil/source/cli/dist/bin.js HORDE_DIR=<scratchpad>/grain-611/ci/horde GRAIN_CORPUS_CLONES=<scratchpad>/grain-611/corpus npm test (plugins/grain, branch jarl/037-propose-outdir-guard at 485ebbe) · **saw:** exit 0 · tests 1863, pass 1862, fail 0, skipped 1
- **ran (history):** node --import ./tests/git-env.mjs --test tests/propose-out-dir-foreign-contents.test.mjs (round 2: engine at 485ebbe, then at 667d561) · **saw:** at 485ebbe: tests 7, pass 6, fail 1 — 'expected a refusal for rfc-proposalmd holding PROPOSAL.md, got exit 0'; at 667d561: tests 7, pass 7, fail 0 (PROPOSAL.md, alternatives.md, sizing.json, REFACTOR-BACKLOG.md, proposal.json each refused and intact; re-runs, a fresh dir and a run cut short before proposal.json still work)
- **ran (history):** correction to the row above, by hand in a scratch repo: grain propose <dir>; move <dir>/proposal.json aside; grain propose <dir> again · **saw:** exit 0 — the run-cut-short case (grain's header and grain-marked reports, no proposal.json) is checked by hand only; the test file does not cover it
- **ran (history):** nice -n 15 node --import ./tests/git-env.mjs --test tests/propose-out-dir-foreign-contents.test.mjs (round 3: engine at 667d561, then at 8a17372) · **saw:** at 667d561: tests 8, pass 7, fail 1 — 'expected a refusal for <tmp>/handoff, got exit 0' (grain-proposal/1 proposal.json naming another repository beside a hand-written PROPOSAL.md); at 8a17372: tests 8, pass 8, fail 0 (both the PROPOSAL.md and the .yggdrasil/-beside-code shapes refused and intact, and the renderer called directly rejects the latter)
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1929, pass 1928, fail 0, skipped 1, merge ed22555

