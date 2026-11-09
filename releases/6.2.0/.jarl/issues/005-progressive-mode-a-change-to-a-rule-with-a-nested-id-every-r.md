# 005 · Progressive mode: a change to a rule with a nested id (every rule from a package, every rule in a grouping folder) never comes into scope, so the refusals and stale reviewer verdicts it causes pass as inherited debt

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-heyx
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/progressive-scope.ts, Yggdrasil/tests/unit/core/progressive-scope.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/progressive-scope.ts:607-613 (computeBurnSet, the rule folder row): `const aspectId = slash < 0 ? rest : rest.slice(0, slash);` (:610); comment :446
**Branch:** jarl/005-progressive-scope
**Merged:** 7b3cdde70646e95de91d8e3687e373938bfd9627
**CI:** none

## What
computeBurnSet cuts the path after `.yggdrasil/aspects/` at the FIRST slash, so for the rule security/no-bad it looks for a rule 'security', for quality/llm-rule 'quality', for a rule from a package 'packages'; none of them exists, closureOf/pairKeysByAspect return nothing and nothing comes into scope. Reproduction (GitHub clone 2493aa16 built with tsup, and npm 6.1.0, the verifier's own scripts): (a) the script rule security/no-bad, progressive.reference: main; on main fill PASS; on the feat branch only its check.mjs changes (it starts forbidding a word present in src/a.ts); `yg check --approve --only-deterministic`, then `yg check --no-approve`: `warning[refused-outside] security/no-bad — 1 violation in alpha — outside your changes` with the note 'that is the baseline this repository already had', PASS, exit 0; `yg check --full`: error[refused], exit 1. Control with a top-level id (no-bad): error[refused], FAIL, exit 1 on the same steps. (b) the reviewer rule quality/llm-rule on two nodes (fake Ollama, no cost); the branch rewrites only content.md; `yg check --approve`: 'fill 2 reviewer pairs outside this change left alone', 0 reviewer calls, warning[unverified-outside], PASS, exit 0; `--full`: error[unverified]; the top-level control llm-rule makes 2 calls. (c) a rule from a package: a marketplace from `yg marketplace init`/`yg pack new mypkg`, tag pack/mypkg@0.1.0, `yg pack add <path>#mypkg --as acme/law`, status: enforced in adapt on main; the branch changes only config.example in yg-aspect.adapt.yaml: refused-outside, PASS, exit 0; `--full`: exit 1. The note about 'baseline' is false: main passed. Probably the same path also loses `yg pack update` changing check.mjs or the defaults in yg-package.yaml (not run). The unit tests (progressive-scope.test.ts:360, 377, 1068) cover only top-level ids. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-2/repro/ (a-nested-script-rule-src.log, a-toplevel-control-src.log, a-nested-script-rule-npm610.log, b-nested-reviewer-rule.log, b-toplevel-reviewer-control.log, c-package-adapt.log; scripts nested-script-rule.sh, reviewer-rule.sh, package-adapt.sh).

## Why
docs/progressive-mode.md:184 promises that a change to a rule's folder makes all its uses yours. Nested ids are legal (docs/aspects.md:17), and every rule from a package has a nested id (packages/<owner>/<repo>/<pkg>/<rule>), so the PR gate in progressive mode lets through a branch whose own change introduces an enforced refusal, and leaves stale reviewer verdicts unreviewed, describing both as debt from before the change. Only `--full` after the merge catches it.

## Acceptance
- A change to a file under .yggdrasil/aspects/<nested id>/ burns the pairs of the longest matching known rule id and its implies closure; a unit test for security/no-bad and packages/<o>/<r>/<pkg>/<rule>.
- A change to a package's yg-package.yaml (with no rule id) burns the pairs of all rules under that prefix.
- Scenarios (a), (b) and (c) give FAIL on the PR step, just like the control with a top-level id.

## Changelog
- Fixed: In progressive mode, a change to a rule in a grouping folder or installed from a package (its check, text, yg-aspect.adapt.yaml, or the package's yg-package.yaml) puts every use of that rule in scope; before, yg check passed and reported the refusals it caused as inherited debt.

## Evidence

- **ran (history):** git commit (merge of jarl/005-progressive-scope into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8102 pairs verified; [repo-check] All checks passed; [release/6.1.1 7b3cdde70] Merge jarl/005-progressive-scope

