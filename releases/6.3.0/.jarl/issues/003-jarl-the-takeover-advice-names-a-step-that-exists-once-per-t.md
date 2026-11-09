# 003 · Jarl: the takeover advice names a step that exists, once per takeover

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261022T0715-qqss
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/003-takeover-advice
**Merged:** b65a6b0 in ../../../JarlSkill
**CI:** none

## What
After the third round the takeover block says to raise the fresh worker one tier up from strong, a tier that does not exist, and repeats the same advice word for word on every later round, also after a takeover with a changed approach. A loop that bars the strongest model cannot follow it at all.

## Why
Advice that cannot be followed teaches the coordinator to ignore the takeover block, which is the one place that stops a fourth patch of the same failure.

## Acceptance
- From the strong tier, or the top tier the loop's profile declares, the advice names a different model or a changed approach, never a tier above it
- A takeover starts a new count: the next takeover advice comes after three rounds of the new worker, not on every round after the third
- Tests for each

## Changelog
- Fixed: After three failed rounds on a task, Jarl suggests a different model or a changed approach for the next worker, and never a level above the strongest. The next suggestion comes after three more rounds, not on every round. A round can record how many findings it left.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

A second field report (2026-10-27): from round 3 on, every round printed the takeover block with the whole record, about 12,000 characters each time, while the rounds converged (29, 14, 3, 3, 1 findings). This issue covers that too: the block once per takeover and a pointer to show after that; and a round may record its count of findings, so a converging issue is told apart from a failing one.
- **ran (history):** node --test tests/models.test.mjs with the old round code · **saw:** 29 pass, 4 fail: the strong-tier advice, the new count after a takeover, the findings count and the tier-up wording
- **ran (history):** TMPDIR=<own dir> npm test in skills/jarl/scripts on the branch tip · **saw:** 825 tests, 1 failure (the commands.md flag-field list, fixed); mcp.test.mjs then 28 pass 0 fail; the other 800 passed. Round 1-3 on a copy of the loop: rounds 1 and 2 print a pointer, round 3 the takeover block once with findings per round 9, 8, 7
- **ran (history):** model ceiling part of the acceptance · **saw:** not done: the profile has no model ceiling yet; it waits for issue 006

Narrowed by the jarl under autonomy-quality, with the reviewer's agreement (rev-jarl-003-opus): the line 'where the profile caps the models, the advice stays under the cap' moves to 006, which adds the cap; 006 waits on 035
- **ran (history):** node --test tests/models.test.mjs with the earlier rounds code · **saw:** 33 pass, 3 fail: profile tiers small/big/huge, later takeover, findings bound and hand-typed findings
- **ran (history):** npm test with TMPDIR under Temp/tmp, then docs-true.test.mjs after the pinned sentence was updated · **saw:** 828 tests, one failure (docs-true pinned the old models.md sentence), then docs-true 26 pass 0 fail; all else passed
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 840 ℹ pass 817 ℹ fail 0 (merge b65a6b0 on release/6.2.1)

