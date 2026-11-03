# 038 · Jarl: one model is recorded under two spellings and splits models

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-46d8748a
**Where:** JarlSkill/skills/jarl/scripts/lib/models.mjs (modelValue), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4084 at a1132a8
**Branch:** jarl/038-model-spellings
**Merged:** 2d7a680 in ../../../JarlSkill
**CI:** none

## What
Claim: claude-sonnet-5-5 and claude-sonnet-5.5 are counted as two models.

Verdicts with --model claude-opus-5-5 and claude-opus-5.5 on the loop copy show as two reviewers in models; --model is stored as given. Map row fr-02.

## Why


## Acceptance
- models folds model ids that differ only in '.' against '-' into one row and says which spellings it folded; the log keeps every id as written
- A lease or a verdict whose --model is a new spelling of a model already in the record prints a note naming the known spelling
- Tests for the fold and for the note; red on 71ebc5b

## Changelog
- Fixed: `models` counts a model written with dots and the same model written with dashes, such as `claude-opus-5.5` and `claude-opus-5-5`, as one model, and its row names both spellings. A review or a task that uses the other spelling gets a note naming the spelling the record holds.

## Evidence

- **ran:** node --test --test-name-pattern='dots' tests/models.test.mjs, on the release tip 3b664fc with the new test file (before the change to lib) · **saw:** tests 2, pass 0, fail 2: the fold of dotted and dashed ids into one row, and the goal-line placement of a dotted id, both fail
- **ran:** node --test --test-name-pattern='dots' tests/models.test.mjs · **saw:** tests 2, pass 2, fail 0 (the fold of dotted and dashed ids into one row, and the goal-line placement of a dotted id)
- **ran:** node --test --test-name-pattern='another spelling' tests/models.test.mjs, on the release tip 3b664fc with the new test file (before the change to lib) · **saw:** tests 2, pass 0, fail 2: the lease note and the review note do not exist yet, so neither names the spelling the record holds
- **ran:** node --test --test-name-pattern='another spelling' tests/models.test.mjs · **saw:** tests 2, pass 2, fail 0 (the lease note and the review note, each naming the spelling the record holds; no note for the spelling it holds, nor on a library call)
- **ran:** node --test tests/models.test.mjs · **saw:** tests 61, pass 60, fail 0, skipped 1 (the live-loop test, which runs only when JARL_LIVE_LOOP is set)
- **ran:** node skills/jarl/scripts/jarl.mjs models --root <a copy of this loop>, run with the release tip and with the branch · **saw:** on the copy of the loop's record the output is the same before and after, except the intro line; on a copy whose leases and verdicts carry dotted and dashed ids, two worker rows and two reviewer rows before the change, one row each after it, each naming both spellings
- **ran:** npm test in skills/jarl/scripts (the whole suite, on the branch with the changes that this commit holds) · **saw:** tests 982, pass 959, fail 0, cancelled 0, skipped 23
- **ran:** npm test (in skills/jarl/scripts of the release worktree, at 2d7a680 with 060 and 038 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1003 tests, 980 pass, 0 fail, 23 skipped

