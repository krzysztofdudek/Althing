# 230 · Jarl 6.3.0, piece 6: the proof: blind runs, cold start, three-arm comparison

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261108T1910-ntot
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 229
**Found by:** jarl
**Where:**

## What
the design's section 16 made real. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 6.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [test] the six end-to-end scenarios of 076 are scripted and pass
- [read] `releases/6.3.0/plans/blind-tests.md` is updated: the commands of 6.3.0, a raised agent is given only its brief, and a coordinator trigger scenario is added. The runs of 076 are done as it says, with light and mid agents, one failure of a check being an issue
- [read] the cold-start drill: a fresh agent given only the record of this loop answers a fixed list of questions about its state, scored against known answers, and a wrong answer is filed
- [test] every rule of the design has a test that fails without it: a table in `skills/jarl/scripts/tests/` lists each rule of sections 3 and 6 and the name of its test, the table fails when a named test is missing, and the red run of each with its guard removed on a scratch copy is a recorded row
- [read] an independent examiner: the code does what the design says, section by section
- [check] the full suite passes on the merged result

## Evidence

