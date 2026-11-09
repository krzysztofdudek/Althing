# 179 · Jarl: review --outside files each outside finding with the same next number, so two of them at the edge of a scheduler profile's numbers file one and then refuse

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261106T2044-bqpp
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-094-opus-h1b
**Where:** skills/jarl/scripts/lib/review.mjs fileOutside
**Branch:** jarl/173-views-and-refusals
**Merged:** 0e17fb92e93c4507d564e47f6ebb71403b6a3391 in ../../../JarlSkill
**CI:** none

## What
With two --outside findings on a loop whose profile names an external scheduler and whose highest issue is 998, review files 999 and then refuses the second, saying nothing was written. The base does the same.

## Why
A message that says nothing was written must be true, as issue 103 now makes import.

## Acceptance
review checks every outside finding with the number it would be filed under before the first write, and a test holds the 998 case

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs with the new test (external scheduler profile, highest issue 998, two --outside findings), before the fix · **saw:** fails: the review files 999 and then refuses the second finding with 'a number written plain, below 100 or of 1000 or more needs record format 2 ... nothing was written'
- **ran (history):** cd skills/jarl/scripts && node --test tests/outside-findings.test.mjs at the tip · **saw:** tests 15, pass 15, fail 0: two --outside findings at 998 refuse the review naming the second with issue number 1000, the loop is as it was and holds 001 and 998; one finding is filed as 999. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on five files (import lines of ball, evidence and models, two reference tables), resolved by keeping both sides, holderKey exported from loop.mjs, and a follow-up commit dropped the unused leaseOfMove import the modules test refused · **saw:** first run tests 1583, pass 1560, fail 1 (the imports-only-names-it-uses test); after the follow-up tests 1583, pass 1561, fail 0, skipped 22, tip 0e17fb9

