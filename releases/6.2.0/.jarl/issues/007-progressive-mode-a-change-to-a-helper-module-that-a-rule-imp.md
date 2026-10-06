# 007 · Progressive mode: a change to a helper module that a rule imports from outside its folder (counted into the verdict since 6.1.0) does not come into scope, so the refusals it causes pass as inherited

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/progressive-scope.ts, Yggdrasil/tests/unit/core/progressive-scope.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/progressive-scope.ts:487 (computeBurnSet): the rule folder row :604-614, the references index :528-533 (probe :588); the fold that already works: source/cli/src/io/artifact-reader.ts:224-297 (readSupportFileHashes, import tracking from :266) → aspect.supportFiles (model/graph.ts:500) → core/pair-inputs.ts:55
**Branch:** jarl/005-progressive-scope
**Merged:** 7b3cdde70646e95de91d8e3687e373938bfd9627
**CI:** none

## What
A file changed by the branch can reach a rule only through the rule folder row (the id from the first segment), through the references index or through recorded ctx.fs observations. A module imported by check.mjs is none of these, so the pair's hash changes, while the burn table never calls that pair yours. Reproduction (npm @chrisdudek/yg@6.1.0): case A: the check.mjs of the rule no-forbidden-words imports '../../../tools/forbidden-words.mjs' (a shared word list); progressive.reference: main; on main fill and `yg check --full --no-approve` PASS; on feat only tools/forbidden-words.mjs changes (a word present in src/a.ts is added); `yg check --approve --only-deterministic` prints '1 refused', then `warning[refused-outside] no-forbidden-words — 1 violation in alpha — outside your changes` with the false note 'that is the baseline this repository already had', PASS, exit 0; `yg check --no-approve` the same; `--full`: error[refused], exit 1. Case B (the documented shape): the helper .yggdrasil/aspects/shared/words.mjs imported as ../shared/words.mjs: identical, because the folder row takes 'shared' for a rule id, which has no pairs. Control C: the helper in the rule's folder (./words.mjs): FAIL, '0 obligations outside your changes'. Control D: without the progressive block every run gives FAIL (the fold from issue 367 works). Probably the same gap affects a `companion:` input from outside the rule's folder (inferred from the code, not checked). Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-4/repro-A.log (repro-B.log, repro-C.log, repro-D.log alongside; script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-4/repro.sh <yg> <case> <run>).

## Why
docs/the-lock.md:52 and docs/reviewers.md:723 say that editing a shared helper reopens every rule that imports it. In progressive mode the PR gate lets a newly introduced refusal through and describes it as debt from before the change; the red main after the merge is seen by someone who did not make that PR.

## Acceptance
- An index of helper paths (each rule's supportFiles resolved to repo paths): a change to such a file burns the pairKeysByAspect of that rule and its implies closure, just like the rule folder row.
- Cases A (tools/x.mjs) and B (.yggdrasil/aspects/shared/x.mjs) give FAIL on both PR steps; a unit test for a helper from outside the folder.

## Changelog
- Fixed: In progressive mode, editing a helper module a rule imports from outside its own folder (or the module its companion: names) puts every use of that rule in scope; before, yg check passed and reported the refusals as inherited debt.

## Evidence

- **ran:** git commit (merge of jarl/005-progressive-scope into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8102 pairs verified; [repo-check] All checks passed; [release/6.1.1 7b3cdde70] Merge jarl/005-progressive-scope

