# 344 · Yggdrasil: files other family tools keep in a covered folder (a folder's own .gitignore, a committed Jarl loop's dot files) are not reported unmapped

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261028T0923-bgsj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:**
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:54

## What
A field report from a workspace graph: a node maps only markdown under a required coverage root, and a topic that carries its own .gitignore, or a committed Jarl loop (.jarl/.gitignore, .jarl/.gitattributes), turns yg check red with unmapped files that nobody can usefully map.

## Why
The family's tools write these files into the folders Yggdrasil covers; a family whose tools trip each other's gates is not coherent.

## Acceptance
- The dot files the family's own tools write (Jarl's loop files, a folder's .gitignore and .gitattributes) are either outside coverage by default or covered by a documented exclusion, and yg check is green on a covered folder that holds a committed Jarl loop
- A test with a covered folder holding a committed Jarl loop

## Changelog
- Fixed: a folder's own .gitignore and .gitattributes are no longer reported as unmapped files; the dot files of a committed Jarl loop leave coverage with coverage.excluded: ["**/.jarl/.*"].

## Reviews
- **changes** · by rev-226-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T2314-rvyp
  Tip d6c28086b; scripts/repo-check.sh on a clone of it: All checks passed (719 files, 10672 tests; the five new test files ran, none skipped). Red before, green after, run by me: 243 (release/6.2.0 fails as root, tip 33/33 as node and root), 598 (destructuring error on release/6.2.0, served clean on the tip), 599 (exit 0 on release/6.2.0 with tree-sitter-cli 0.26.0, refused on the tip, also on a warm cache with a source-built grammar), 226/344/345 e2e (tip green; on release/6.2.0 the variable case passes the moved-reference branch with exit 0, the dot-file and split cases fail). Read lines: 226.1 'yg check accepts a reference from outside (a flag and an environment variable, documented for GitHub Actions and general CI) ... a change of the block in a branch without that reference's agreement ends in a check of the whole project with a message': met in code (flag, variable, precedence, whole-project notice naming the source), not met in the docs, Important 1. 226.2 'moving the reference to one's own branch in several commits on a push build with a reference from CI gives FAIL; an ordinary PR and main after a merge pass; Grain's sentence stays true': met. Tried to get past it: moving the block and back (measured, alpha fails), dropping the block (whole project, 'not used' notice), the PR merge commit of the moved branch (whole project, fails), --reference HEAD, @, --all, -h, a missing branch (whole project, fail), an empty variable (unset); HEAD@{0} and the branch's own name pass quietly (Minor 3; the own name is the documented reference-branch row). 267.1 canon-sync reports no difference for Yggdrasil (only Grain differs). 267.2 surface-truth.mjs names Althing and no private repository; the AGENTS.md pointer sits outside the managed block and survived yg init --upgrade rewriting that block in a scratch copy; nothing private in the diff. 267.3 green through repo-check. 344.1/344.2 met: git's two files below the root never unmapped, a real loop's third dot file (.permanent) leaves coverage by the documented line; a built-in default would name another tool's folder in Yggdrasil source, so the docs are the right place. 345.1/345.2 met: the split reads the outside twins; a branch that deletes committed verdicts still counts them as its own (the base verdict keys bring them into scope). FINDINGS. Important 1: docs/progressive-mode.md:67-69 tells the reader to 'take the reference out of the file altogether and have the pipeline name it', but a pipeline reference in a project whose config names none is not used: the run gates the whole project with the 'was not used' notice (run: a branch dropping the block, YG_PROGRESSIVE_REFERENCE=main). It contradicts the same page's 'It does not turn the mode on' and the CLI reference; a reader who follows it loses progressive mode. It should say to keep the block and let the pipeline's reference win. Minor 2: source/cli/src/core/progressive-preflight.ts:131-133, fetchCommand reads every slash as remote/branch: --reference release/nope remedies 'git fetch release nope', a dash-leading value 'git fetch origin --all'; the fallback the worker flagged is untested. Minor 3 (pre-existing pattern, filed outside): source/cli/src/core/progressive-scope-resolve.ts:449 refuses HEAD and @ but not reflog forms; --reference HEAD@{0} measures the branch against itself and passes quietly. Minor 4: source/cli/tests/unit/cli/pack.test.ts:383-395, the rewritten test no longer reaches the EACCES/EPERM message of source/cli/src/io/package-store.ts:493-499 ('one of them is not writable'), and no other test does. Minor 5: source/cli/src/cli/check.ts:193 names the project root for git config safe.directory; for a graph below the repository's top level git needs the top level, so the filled-in command does not clear the warning there.
  outside the issue, filed as 675: Yggdrasil progressive mode: the HEAD-relative reference pattern (source/cli/src/core/progressive-scope-resolve.ts:449) misses reflog forms such as HEAD@{0} and @{0}; a reference so written, committed or from --reference/YG_PROGRESSIVE_REFERENCE, measures the branch against itself and passes quietly instead of being refused like HEAD.

## Evidence

### Notes

Assumed: git's own .gitignore and .gitattributes below the project root are never reported as unmapped (a node mapping one still has it reviewed; the root's own two are unchanged because yg init lists them under coverage.excluded); the loop's other dot file (.jarl/.permanent) leaves coverage through the documented line coverage.excluded: ["**/.jarl/.*"], because Yggdrasil's source may not name another family tool's folder (the family guard test fails on it), so no built-in list names it.

