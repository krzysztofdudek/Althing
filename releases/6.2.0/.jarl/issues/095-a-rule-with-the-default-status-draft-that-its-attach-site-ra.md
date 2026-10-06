# 095 · A rule with the default `status: draft` that its attach site raises to enforced is reported as '1 draft rule skipped' (totals.draftSkipped: 1) in the same run that evaluates and refuses it

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/check.ts, Yggdrasil/source/cli/src/formatters/check-render-header.ts, Yggdrasil/source/cli/src/core/check-json.ts, Yggdrasil/source/cli/src/portal/derive-counts.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/check.ts:681-687 (countDraftAspectsAcrossGraph counts a rule when `(aspect.status ?? 'enforced') === 'draft'`, i.e. only the aspect's default status; the comment :674-680 says so outright), called at :537; the result goes to formatters/check-render-header.ts:226 ('N draft rule(s) skipped'), core/check-json.ts:240 (totals.draftSkipped) and portal/derive-counts.ts:101 (the draft counter); the same mistake was fixed for `yg adopt` in issue 141 of 6.1.0: raisedAboveDraft() in cli/adopt.ts:104, used at :257-260
**Branch:** jarl/032-check-report
**Merged:** 27d1e12f8f5b3f49d31a66d8c13078164c0c909e
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0 and clone 2493aa16; check.ts the same at tag v6.1.0; a script with three cases): A. rule no-todo with the default `status: draft`, raised to `enforced` at its only attach site (the pattern docs/aspect-status.md recommends: 'give the aspect the lower default and raise it at the sites that need more'; `yg pack new` scaffolds rules at draft): the header `yg check: FAIL  1 error ... · 1 draft rule skipped`, and in the same report `error[refused] no-todo — 1 violation in n`, exit 1; JSON `draftSkipped = 1` and pairs `[('no-todo','n','enforced','refused')]`; `yg aspects --json --reach` shows the rule's only unit with status enforced, so none of its pairs left the expected set. B. control without raising: `PASS ... 1 draft rule skipped` and an empty list of pairs (correct). C. raised on n, draft on m: also '1 draft rule skipped' (whether a partly raised rule should count is a design decision; case A is wrong under any reading). The schema, cli-reference.md:353 and :599, family-contracts and the model comment in check-result.ts describe totals.draftSkipped as 'How many rules stand at draft — each one's pairs are removed from the expected set entirely'. The variant with a rule from an installed package takes the same path (the counter reads graph.aspects regardless of the source), not checked separately. This is not 141, 237, 093 or 105 of 6.1.0. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-66/verify-66-draft-skipped.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-66/repro/draft-skipped.sh); issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/find-9-draft-skipped.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-9/repro/draft-skipped.sh.

## Why
The header, the JSON and the portal contradict the rest of the same report and the published contract; a consumer who reads draftSkipped > 0 as “some rule is asleep” is misled. Gating, verdicts and the exit code are right, so minor.

## Acceptance
draftSkipped (and also the header segment and the portal's draft counter) counts only rules none of whose units stands above draft (e.g. through raisedAboveDraft from adopt.ts or from the units of the expected-pairs computation): in case A `totals.draftSkipped` is 0 and the header has no 'draft rule skipped' segment, and in B it stays 1 (a test).

## Changelog
- Fixed: yg check no longer reports a draft rule an attach site raises as skipped — the header segment, totals.draftSkipped and the portal's draft count only count rules that are draft everywhere they reach.

## Evidence

- **ran:** git commit (merge of jarl/032-check-report into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.19%; [repo-check] All checks passed; [release/6.1.1 27d1e12f8] Merge jarl/032-check-report

