# 672 · Yggdrasil: the deterministic worker pool sizes each worker at 20 bytes of tree per byte of source (…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2240-rxfm
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561b-opus
**Where:** the review of 561, 610
**Branch:** jarl/561-parser-abort
**Merged:** 202908c78 in Yggdrasil
**Merge check:** bash scripts/repo-check.sh (in the dev container, on the merged release/6.2.0) · saw [repo-check] All checks passed

## What
Yggdrasil: the deterministic worker pool sizes each worker at 20 bytes of tree per byte of source (cli/det-concurrency.ts:74), but a 64 KiB file can fill a worker's whole 2 GiB of parser memory, so a fill on N workers can peak near N times 2 GiB. Seen with 33 per-file script pairs, 24 of them on such files: 4 workers, peak resident 8.4 GiB, the same on release/6.2.0 at 03ac2699d. On a machine with many cores and less memory than that, the fill swaps or is killed. Minor.

## Why


## Acceptance


[test] The deterministic worker pool sizes a worker by a bound that keeps the pool's total under the machine's memory on dense small files (a 64 KiB file that fills a parser), measured peak stated in the test, red before and green after · by: cd source/cli && npm test

## Changelog
- Fixed: the worker threads that run script rules stay under the machine's memory on dense files (the pool is also sized for every worker's 2 GiB parser being full at once).

## Reviews
- **approve** · by rev-561c-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0018-nwne
  Round 3, approve: round 2's two Importants are met and nothing breaks. Reruns, in sibling containers of the dev image capped at 8 GiB (12 GiB for the timing): the e2e file passes 11 of 11 on the tip; its round-3 tests fail 5 of 5 on ea4c572eb, each for its reason; the touched unit and integration files pass (18 files, 294 tests); the 672 and 673 unit tests fail on ea4c572eb for their reasons. Round 2's repros: with 64 KiB of 'a<b,' and with a 56 MiB dense bundle as a subject of a per-file reviewer rule, yg check, yg check --json, yg check --approve and yg aspect-test --node end in error[internal] on ea4c572eb and in their own reports on the tip; yg drill on a plain reviewer rule ends in error[internal] on ea4c572eb and records the case as unrun with the reason on the tip, passing the other case. --approve calls the reviewer for the 4 other subjects; aspect-test judges them and says 'incomplete'. Side by side (two companion rules whose trees fit alone and not together): no rule is reported for the other rule's files at parallel 4 or 10 (ea4c572eb names src/delta/p4.ts for reads-target at parallel 4 and makes no progress on a rerun); at parallel 4 the tip verifies 6 of 9, then 9 of 9 on a second run; at parallel 10, 4 of 9, then 7 of 9. Plain yg check: the pair is shown as '1 pair with no verdict yet', fix 'yg check --approve (1 reviewer pair · 1 call · paid)', without the cause; the same output's relation-parse-failed names the file and the reason when the relation check reads that language, and --approve names it, so the user has a next step; accepted as the suppress-marker precedent. 672's cost, yg check --approve --only-deterministic on Yggdrasil's own tree, 6776 script pairs, warm relation cache: release 13 workers, fill 15-17 s, command about 21 s, also when the machine reports 8 GiB; tip 13 workers at 29.4 GiB, 7 at 16 GiB (fill 19 s), 3 at 8 GiB (fill 24 s, command 29-30 s, peak about 570 MiB against 1.5 GiB); same report on every run (8285 pairs on the tip). Slower on a many-core machine with little memory, unchanged on a machine of 4 cores; not a reason for changes. The release merge aaa813ce4 equals a recomputed merge of e59abc0c9 and f36bffcc0 in every file but the two conflicted logs (aspect-test log.md, yg-lock.logs.json), resolved by keeping both entries, so 620's and the keys package's changes stand; e2abb6770 touches only logs. scripts/repo-check.sh not run here: the jarl's log of the tip says All checks passed (10703 tests, coverage 97.56/96.55/96.99/91.43, Graph: check PASS with 8285 pairs). Findings, all Minor. (1) Minor, filed outside: --approve's closing summary counts a reviewer pair whose subject the parser has no memory for among provider and configuration failures and advises fixing the reviewer connection (core/review-package.ts:220-222, kind infra). (2) Minor, a known limit: a side-by-side report where the run held trees of its own and the other runs held theirs advises reading fewer trees or leaving the named file out, never lowering parallel (ast/parse-guard.ts:143-150), so at parallel 10 the last pair of each rule run together and fail again on every rerun; reading fewer trees is a real way out. (3) Minor: the per-worker floor MIN_WORKER_FOOTPRINT_BYTES can no longer bind (cli/det-concurrency.ts:121-126: the new term allows at most total/2 GiB workers, the floored estimate total/256 MiB), so the test 'applies a floor to the per-worker estimate' (tests/unit/cli/det-concurrency.test.ts:42) passes with the floor removed; what it protected holds through the new bound. (4) Minor, wording: yg drill's next step for such a case file says to leave it out of the component's mapping and run yg check --approve (core/drill-runner.ts:578), which does not fit a case file; the grouped heading for side-by-side reports still reads 'Companion resolution for ... failed to run on N units (aspect-companion-runtime-error)', without companion.mjs. Assumptions judged: plain check leaving the pair unverified without the cause, accepted (above); failure records and held-tree counts per run, accepted and shown on two real runs; the pool bound against the whole machine with every parser full, accepted. Not run: a Windows host; drill on a rule with a companion (drill does not support one).
  outside the issue, filed as 688: Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of yg check --approve counts the pair among provider and configuration failures: '1 pair failed on provider/config errors — re-running will not help until the connection/config is fixed (ollama / standard). Cause: the parser ran out of memory on src/alpha/f1.ts', with the fix 'Fix the reviewer connection or configuration ... To unblock CI without a reviewer, set the affected rules to status: draft'. core/review-package.ts returns the pair as an infra disposition. The pair's own report and the check's error block name the file and the reason. The reviewer-rule counterpart of issues 655 and 673. Minor.

## Evidence

### Proof

- **ran (line 722709eccfbd):** cd source/cli && npx vitest run (this round's test files, filtered to the new tests, on a scratch copy of the branch at ea4c572eb, built) · **saw:** RED before: resolveDetConcurrency gives 16 workers on a 4 GiB machine with 64 KiB files (worst case 36142317568 bytes against 4294967296), and 5 where one worker fits.
- **ran (line 722709eccfbd):** cd source/cli && npx vitest run tests/unit/cli/det-concurrency.test.ts (branch at e8798d4f6 and after) · **saw:** GREEN after: all passed. On machines of 4, 8, 16, 32 and 64 GiB the parent plus every worker at its own size plus a full 2 GiB parser stays within the machine's memory: 3 workers on 8 GiB, 1 on 2 GiB. The measured peaks are stated in the test: one worker goes from about 60 MiB to 2.1 GiB resident on a 64 KiB file; 8.4 GiB on 4 workers before.
- **ran (line 722709eccfbd):** cd source/cli && npx vitest run tests/unit/cli/det-concurrency.test.ts on built extractions of 14b429a00 and of ea4c572eb with the tip's test file; then yg check --approve --only-deterministic on Yggdrasil's own tree (release/6.2.0 at f36bffcc0 with its binary, the tip with its binary, a sibling container capped at 12 GiB, 14 cores, warm relation cache, no script verdicts), with the machine's memory reported as 29.4, 16 and 8 GiB through a preload that also counts worker threads, twice each · **saw:** GREEN on the tip, RED on ea4c572eb for its reason: 'expected 32 to be 3', '4 GiB machine, 16 workers: expected 36142317568 to be less than or equal to 4294967296', 'expected 5 to be 1'. Timing, 6776 script pairs: release 13 workers at 29.4, 16 and 8 GiB, fill 15-17 s, command about 21 s; tip 13 workers at 29.4 GiB (fill 16-21 s), 7 at 16 GiB (fill 19 s, command 24 s), 3 at 8 GiB (fill 24 s, command 29-30 s, peak 558-578 MiB against about 1.5 GiB). Same report on every run: 8285 pairs verified on the tip, 8261 on release.

### Notes

Assumed: the bound is the whole machine, not the half the usual estimate is held to: workers times (the parent's size plus 2 GiB) plus the parent stays within total memory. It is a ceiling beside the existing estimate, so large repositories are sized as before and small machines get fewer workers (3 on 8 GiB, 7 on 16 GiB).

