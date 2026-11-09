# 072 · The yg-lock merge driver loses a verdict both branches recorded identically (the same hash and verdict) because they differ in filledAt or filledSha, so the pair is paid for again and a shared refusal is drawn anew

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-eznv
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/lock-store.ts, Yggdrasil/source/cli/tests/unit/io/lock-store-merge.test.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/lock-store.ts:1225-1234 (mergeLeaf, called per verdict key from mergeTwoLevels :1206-1222): "the same" is decided by canonicalJson of the whole VerdictEntry, including the record's fields that are not a hash input (filledAt, filledSha, promptChars, reason, judge); both sides changed the key relative to the base, so it returns undefined and the key drops out
**Branch:** jarl/023-merge-hooks-lock
**Merged:** 387472893ddf9a332a7fbcf60fa9f762ab92c46b
**CI:** none

## What
Reproduction (a fresh clone v6.1.0-5-g2493aa16 for the code, npm @chrisdudek/yg@6.1.0 with an identical mergeLeaf in dist/bin.js, a custom fake Ollama on port 11641 refusing on XFAILX, `yg init --provider ollama`, .gitattributes with merge=yg-lock and a configured merge.yg-lock.driver): node gamma committed on main without a fill; branches x and y each change one unrelated file and run `yg check --approve`. The approved case: both sides record node:gamma with hash 7a6be755…, verdict approved, the same filledSha and promptChars, only filledAt differs (41.694Z and 43.005Z); `git merge y` in x through the driver ends with exit 0 without the node:gamma entry (alpha and beta, changed on one side, remain); `yg check` → FAIL `error[unverified] 1 pair with no verdict yet — llm-rule @ gamma`, the dry run prices 1 call, and `--approve` makes exactly 1 call, which records the same hash and verdict. The refused case: both branches record the same refusal (hash 01a10031…, the same reason, only filledAt differs; the check on each says re-running the reviewer will change nothing); after the merge the pair is 'no verdict yet', and `--approve` asks the reviewer again (1 call), that is, it re-draws the refusal by a route docs/the-lock.md:111-121 does not provide for ('exactly three ways out of a refusal'). `yg merge-driver lock` run directly (base=main, ours=x^1, theirs=x^2) loses gamma; a control with theirs' filledAt rewritten to ours' value keeps gamma, so filledAt alone is the trigger. The driver's literal contract ('a key both sides changed to different values drops out', lock-store.ts:1100-1112, cli-reference.md:2514, the-lock.md:179) contradicts the-lock.md:66 (filledAt/filledSha 'not an input … writing or reading them invalidates nothing'), and decision 473 from 6.1.0 chose the per-key rule so that there would be fewer repeated verdicts. The fixtures of the lock-store-merge.test.ts test are bare {verdict, hash}. Note for the fix: with a real LLM two independent refusals also differ in `reason`, so the comparison must go by hash+verdict, not only by leaving out the dates. The same mergeLeaf as in 024, but a different symptom (there, the log baseline). Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-41/logs/repro-pass.log, repro-refuse.log, driver-direct.log, driver-control-same-filledAt.log; script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-41/tools/repro.sh <id> <pass|refuse>; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-1/repro/merge-same-fill.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-1/repro/merge-same-fill.sh.

## Why
Every pair filled on both branches with the same inputs (e.g. a commit on main without a fill, or main and a branch filling the same pair) costs one paid call after the merge, and a shared refusal is drawn again. The driver never invents a verdict, so there is no false PASS: minor.

## Acceptance
For verdict leaves, mergeLeaf compares only hash and verdict, and when they are equal keeps one record chosen independently of the merge direction (e.g. the canonically smaller one): in the approved and refused scenarios the node:gamma entry stays after `git merge`, and `yg check` passes (or shows the recorded refusal) without a reviewer call; a test in lock-store-merge.test.ts with equal hash+verdict and different filledAt, filledSha, promptChars and reason.

## Changelog
- Fixed: A verdict both branches recorded for the same code survives the merge: the lock merge driver keeps one of the two records when they agree on the input hash and the verdict, so a pair filled on both sides is no longer paid for again after git merge, and a refusal both branches share is not judged anew.

## Evidence

merged into release/6.1.1 at 387472893, gate green
- **ran (history):** git commit (merge of jarl/023-merge-hooks-lock into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 387472893] Merge jarl/023-merge-hooks-lock

