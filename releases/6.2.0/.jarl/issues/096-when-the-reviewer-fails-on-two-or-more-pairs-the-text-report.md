# 096 · When the reviewer fails on two or more pairs, the text report never names the cause, although every fix line says 'Fix the cause named above'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/fill-report.ts, Yggdrasil/source/cli/src/core/fill-llm.ts, Yggdrasil/source/cli/src/core/fill-llm-phase.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/fill-report.ts (emitGroupedDiagnostics): the group key is aspectId + why + next (:116); for the kind 'pool-infra' with more than one unit, `what` is replaced by a generic sentence (:143), and only first.why and first.next are emitted (:145); the messages from core/fill-llm.ts:146-150 (provider error) and :130-134 (exception or unparseable response) hold the reason only in `what`, while why and next are fixed; fill-llm-phase.ts:268 adds `reason` to infraReport, but FillTotals.infraReport in fill-report.ts:188 has no `reason` field, and the summary warning (:241-248) prints only the provider and the tier
**Branch:** jarl/032-check-report
**Merged:** 27d1e12f8f5b3f49d31a66d8c13078164c0c909e
**CI:** none

## What
Reproduction (fresh clone of v6.1.0 e5441101 and npm @chrisdudek/yg@6.1.0 on node v24.11.1; own scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-68/repro2.sh and <the session scratchpad, since lost>/bughunt/yggdrasil/verify-68/mixed-server.mjs; an openai-compatible reviewer with consensus 1, an aspect audit per: file on node m0): (A) 1 pair, nothing listening on 127.0.0.1:18368: the fill warning names 'OpenAI request failed: could not reach http://127.0.0.1:18368: ECONNREFUSED' (1 line with the cause). (B) 2 pairs, the same failure: "Reviewer could not verify aspect 'audit' on 2 units — left unverified: file:src/m0/f1.ts, file:src/m0/f2.ts"; the fix line, the fix of the error[unverified] block and the closing next: say 'Fix the cause named above' (3 lines), 0 lines with ECONNREFUSED or 'could not reach'; the summary warning names only '(openai-compatible / standard)'; --json carries the full cause in the `what` of every reviewer-failed. (C) the mock answers the first request with HTTP 401 and the second with HTTP 503 (the server log confirms it): the two pairs need different fixes (a refused key and a provider failure), and the text merges them into one message 'on 2 units' with neither of them (0 lines with 401 or 503); --json shows 'HTTP 401 Unauthorized — the API key was refused: check OPENAI_COMPATIBLE_API_KEY…' and 'HTTP 503 Service Unavailable — the provider's server failed; retry later'. So the grouping also loses distinct causes. A timeout takes the same path (fill-llm.ts:146-150), not run separately. The pattern came in with 4dbf4258 (issue 156 of 6.1.0, 'name the cause of every reviewer failure'), which changed next to 'Fix the cause named above'; the test fill-infra-grouping.test.ts:509 mocks the reasons in why and next, not in `what` as fill-llm does. The same code on main 2493aa16. This is not 156, 231 or 159 of 6.1.0, nor 032 here. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-68/logs/verify-68-reviewer-cause-dropped.log; the run's results (one.txt, two.txt, two.json, mixed.txt, mixed.json) in <the session scratchpad, since lost>/bughunt/yggdrasil/verify-68/runs/run-20261002093417-99048/; issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/06-reviewer-failure-cause-dropped.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/06-reviewer-failure-cause-dropped.sh.

## Why
A misconfigured or unreachable reviewer fails on every pair, so the text report the user or the agent sees almost never names the cause it says to fix, which in practice undoes issue 156; the comment fill-report.ts:108-111 promises lossless grouping. The verdicts are right, and the cause can be pulled out of --json, `debug: true` or a single pair, so minor.

## Acceptance
The grouped reviewer-failed message keeps the provider's cause (one shared cause, or 'N × <cause>' for each distinct one), and the summary warning names the reason from infraReport: in scenario B the text contains ECONNREFUSED, in C it contains 401 and 503 (a grouping test with the reason in `what`, as fill-llm produces it).

## Changelog
- Fixed: when the reviewer fails on two or more pairs, yg check --approve names the provider's reason (ECONNREFUSED, HTTP 401, …) in the grouped message and the closing warning — the shared cause, or each distinct cause with its count.

## Evidence

- **ran:** git commit (merge of jarl/032-check-report into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.19%; [repo-check] All checks passed; [release/6.1.1 27d1e12f8] Merge jarl/032-check-report

