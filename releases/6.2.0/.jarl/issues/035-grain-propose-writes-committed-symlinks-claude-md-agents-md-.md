# 035 · grain propose writes committed symlinks (CLAUDE.md -> AGENTS.md, HomebrewFormula -> pkg/brew) and files tracked despite .gitignore into the explicit mapping of the repo-root node, so yg adopt refuses the whole proposal, while the preview says 'would accept'

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0737-iqav
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-base.mjs, Grain/plugins/grain/engine/propose-nodes.mjs, Grain/plugins/grain/engine/propose-write.mjs, Grain/tests/stress/edge-cases.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/propose-base.mjs gitFiles() (v6.1.0 :163-207, unchanged on release/6.1.1): `git ls-files -s -z`, drops only gitlinks (:184 `if (m[1] === '160000') continue;`), lets through mode 120000 and files matching .gitignore; then propose-types.mjs:185 (rootFiles → rootGlob, `when: path '*'`) and propose-write.mjs:217 (`mapping: n.useDir ? [dir/] : [...n.ownFiles].sort()`)
**Branch:** jarl/035-proposal-yg-accepts
**Merged:** ebdd56c
**CI:** none

## What
Reproduction (Grain v6.1.0 ae6152f, yg 6.1.0 from npm): a synthetic TS repo with AGENTS.md and a committed symlink CLAUDE.md -> AGENTS.md (mode 120000), without .gitignore. `grain propose` → the repo-root node maps `AGENTS.md, CLAUDE.md, package.json`, preview 'yg adopt: would accept', exit 0; `yg adopt .yggdrasil-proposal --dry-run` → 'would accept'; `yg adopt .yggdrasil-proposal` → exit 1 with `file-mapping-gitignored repo-root File 'CLAUDE.md' is in mapping of node 'repo-root' but is excluded by .gitignore`, although `git check-ignore` says the file is not ignored. After removing that one line from the mapping, adopt passes. A symlink to a directory (ripgrep @3fce3b5: HomebrewFormula -> pkg/brew; or docs -> pkg/docs) ends in `type-when-mismatch repo-root File 'HomebrewFormula/ripgrep-bin.rb' … does not satisfy 'repo-root-file'.when: path does not match "*"`. Variant: a tracked file that .gitignore excludes (`*.local` in .gitignore, `git add -f settings.local` at the root) gives the same file-mapping-gitignored refusal, although Yggdrasil itself rates such a file only as warning[tracked-file-gitignored]. In a survey of 17 real repositories, 3 could not be adopted for this reason alone: ripgrep, mvdan/sh @9a79a44 (CLAUDE.md) and colinhacks/zod @004d800 (.cursorrules, CLAUDE.md, README.md); koel has the same layout (CLAUDE.md, docs/CLAUDE.md, resources/assets/js/CLAUDE.md as 120000). It concerns only explicit file lists: the repo-root node and a directory with a nested project under it (propose-nodes.mjs:149); a symlink inside a node mapped by directory passes. On the release/6.1.1 code propose still ends with exit 0 and adopt refuses, because the 6.1.1 guard reads the dry-run, which does not run these checks (issue 034). Cause: Yggdrasil's walk (walkRepoFiles, io/repo-scanner.ts:597-615; listGitTrackedFiles with lstat().isFile()) skips symlinks and ignored files, and Grain's gitFiles does not; Grain's own fallback walkWorktree (:159, `e.isFile()`) already skips symlinks. Case 4 ('symlinks') in tests/stress/edge-cases.mjs runs only status and check, never propose → adopt. Related on Yggdrasil's side: issue 022 (a symlink in the mapping is tracked). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-1/ (01-05 the synthetic case, 11-14 ripgrep, 21-24 the ignored file, 31-32 mvdan-sh), <the session scratchpad, since lost>/bughunt/grain/verify-2/repro-min.log, repro-ripgrep.log, repro-611.log, prevalence.log.

## Why
The CLAUDE.md -> AGENTS.md layout is ordinary and increasingly common, and for it Grain's main path (propose, then adopt) fails end to end. Propose and the preview say everything is fine, yg's message points at a .gitignore that does not exist, and its `next:` says to generate the proposal again, which gives the same result. The 6.1.1 CHANGELOG draft promises 'Every proposal can be accepted', and this bug contradicts it.

## Acceptance
- gitFiles() skips mode 120000 entries just as it skips 160000 and subtracts `git ls-files -ci --exclude-standard -z`, so Grain's set of files equals what yg's walk sees.
- A propose → real `yg adopt` test (not only status and check): a repo with a CLAUDE.md -> AGENTS.md symlink, with a symlink to a directory at the root and with a file added through `git add -f` despite .gitignore; adopt accepts the proposal (exit 0).
- ripgrep @3fce3b5 and mvdan/sh @9a79a44: `grain propose`, then `yg adopt .yggdrasil-proposal` ends with exit 0.

## Changelog
- Fixed: a proposal for a repository with a committed symlink (such as CLAUDE.md pointing to AGENTS.md) or a file tracked despite .gitignore is now accepted by yg adopt; before, the adoption refused the whole proposal although the preview said it would accept.

## Evidence

docs: docs/reference.md: in the grain propose contract paragraph (next to the worktree-walk fallback), say the proposal covers the files Yggdrasil's own walk sees: tracked regular files, leaving out symlinks and tracked files a .gitignore excludes.

grain-035 @45b5025 (branch jarl/035-proposal-yg-accepts): tests/propose-yg-visible-files.test.mjs 4/4 red before (<the session scratchpad, since lost>/patch-611/grain-035/035-red.log: file symlink, ignored tracked file and worktree drift kept; real yg adopt refused with file-mapping-gitignored x2 + type-when-mismatch x2), 4/4 green after (<the session scratchpad, since lost>/patch-611/grain-035/035-green.log). Real yg adopt (6.1.0, YG_BIN ci copy) on the three repro repos A/B/C: exit 1 before (<the session scratchpad, since lost>/patch-611/grain-035/run-before), exit 0 after (<the session scratchpad, since lost>/patch-611/grain-035/run-after). Stress edge case 4 (symlinks, propose + real adopt): FAIL before (124 type-when-mismatch through src-link), ok after. ripgrep @3fce3b5 and mvdan/sh @9a79a44: grain propose exit 0, then real yg adopt .yggdrasil-proposal exit 0 (<the session scratchpad, since lost>/patch-611/grain-035/corpus/run-after.log). Ignore sources: --exclude-standard (as the acceptance says), not the plan's .gitignore-only mirror: to yg 6.1.0 a file only info/exclude names is then unmapped (never blocks, verified), and a walk with Yggdrasil 004 fixed would refuse it if mapped. Full gate with YG_BIN/HORDE_DIR/corpus: 1865 tests, 1864 pass, 1 skip, 0 fail.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1915, pass 1914, fail 0, skipped 1, merge ebdd56c

