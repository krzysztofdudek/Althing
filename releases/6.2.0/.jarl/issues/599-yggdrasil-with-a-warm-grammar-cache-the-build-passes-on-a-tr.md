# 599 · Yggdrasil: with a warm grammar cache the build passes on a tree-sitter-cli other than the pinned on…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1445-ixqs
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-356-fable
**Where:** the review of 356
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
Yggdrasil: with a warm grammar cache the build passes on a tree-sitter-cli other than the pinned one; the pin is checked only when a grammar is built from source

## Why


## Acceptance


[test] The tree-sitter-cli pin is checked whether a grammar is built from source or taken from a warm cache: an installed tree-sitter-cli other than the pinned one fails the build either way, red before and green after · by: cd source/cli && npm test

## Reviews
- **changes** · by rev-226-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T2314-rvyp
  Tip d6c28086b; scripts/repo-check.sh on a clone of it: All checks passed (719 files, 10672 tests; the five new test files ran, none skipped). Red before, green after, run by me: 243 (release/6.2.0 fails as root, tip 33/33 as node and root), 598 (destructuring error on release/6.2.0, served clean on the tip), 599 (exit 0 on release/6.2.0 with tree-sitter-cli 0.26.0, refused on the tip, also on a warm cache with a source-built grammar), 226/344/345 e2e (tip green; on release/6.2.0 the variable case passes the moved-reference branch with exit 0, the dot-file and split cases fail). Read lines: 226.1 'yg check accepts a reference from outside (a flag and an environment variable, documented for GitHub Actions and general CI) ... a change of the block in a branch without that reference's agreement ends in a check of the whole project with a message': met in code (flag, variable, precedence, whole-project notice naming the source), not met in the docs, Important 1. 226.2 'moving the reference to one's own branch in several commits on a push build with a reference from CI gives FAIL; an ordinary PR and main after a merge pass; Grain's sentence stays true': met. Tried to get past it: moving the block and back (measured, alpha fails), dropping the block (whole project, 'not used' notice), the PR merge commit of the moved branch (whole project, fails), --reference HEAD, @, --all, -h, a missing branch (whole project, fail), an empty variable (unset); HEAD@{0} and the branch's own name pass quietly (Minor 3; the own name is the documented reference-branch row). 267.1 canon-sync reports no difference for Yggdrasil (only Grain differs). 267.2 surface-truth.mjs names Althing and no private repository; the AGENTS.md pointer sits outside the managed block and survived yg init --upgrade rewriting that block in a scratch copy; nothing private in the diff. 267.3 green through repo-check. 344.1/344.2 met: git's two files below the root never unmapped, a real loop's third dot file (.permanent) leaves coverage by the documented line; a built-in default would name another tool's folder in Yggdrasil source, so the docs are the right place. 345.1/345.2 met: the split reads the outside twins; a branch that deletes committed verdicts still counts them as its own (the base verdict keys bring them into scope). FINDINGS. Important 1: docs/progressive-mode.md:67-69 tells the reader to 'take the reference out of the file altogether and have the pipeline name it', but a pipeline reference in a project whose config names none is not used: the run gates the whole project with the 'was not used' notice (run: a branch dropping the block, YG_PROGRESSIVE_REFERENCE=main). It contradicts the same page's 'It does not turn the mode on' and the CLI reference; a reader who follows it loses progressive mode. It should say to keep the block and let the pipeline's reference win. Minor 2: source/cli/src/core/progressive-preflight.ts:131-133, fetchCommand reads every slash as remote/branch: --reference release/nope remedies 'git fetch release nope', a dash-leading value 'git fetch origin --all'; the fallback the worker flagged is untested. Minor 3 (pre-existing pattern, filed outside): source/cli/src/core/progressive-scope-resolve.ts:449 refuses HEAD and @ but not reflog forms; --reference HEAD@{0} measures the branch against itself and passes quietly. Minor 4: source/cli/tests/unit/cli/pack.test.ts:383-395, the rewritten test no longer reaches the EACCES/EPERM message of source/cli/src/io/package-store.ts:493-499 ('one of them is not writable'), and no other test does. Minor 5: source/cli/src/cli/check.ts:193 names the project root for git config safe.directory; for a graph below the repository's top level git needs the top level, so the filled-in command does not clear the warning there.
  outside the issue, filed as 675: Yggdrasil progressive mode: the HEAD-relative reference pattern (source/cli/src/core/progressive-scope-resolve.ts:449) misses reflog forms such as HEAD@{0} and @{0}; a reference so written, committed or from --reference/YG_PROGRESSIVE_REFERENCE, measures the branch against itself and passes quietly instead of being refused like HEAD.

## Evidence

### Proof

- **ran (line e27f3b4319a0):** cd source/cli && npx vitest run tests/unit/repo/grammar-cli-pin.test.ts (before wiring the check into scripts/grammars.mjs, then after) · **saw:** red before: the grammar step exited 0 on a scratch project holding tree-sitter-cli 0.26.0 (expected 1); green after: 4 passed, the step fails with 'the grammar manifest pins tree-sitter-cli 0.27.0, but 0.26.0 is installed' and builds with the pinned version
- **ran (line e27f3b4319a0):** cd source/cli && npx vitest run tests/unit/repo/grammar-cli-pin.test.ts with the release/6.2.0 grammars.mjs and with d6c28086b; plus scripts/grammars.mjs --only typescript (a source-built grammar) offline on a warm cache with tree-sitter-cli 0.26.0, 0.27.0 and none · **saw:** release/6.2.0: 'fails the build ... when another version is installed' failed (exit 0); d6c28086b: 4 passed; warm cache: 0.26.0 exit 1 'the grammar manifest pins tree-sitter-cli 0.27.0, but 0.26.0 is installed', 0.27.0 exit 0, none installed exit 0 (cache sha256-verified; a source build without it is refused by Runes' own message)

