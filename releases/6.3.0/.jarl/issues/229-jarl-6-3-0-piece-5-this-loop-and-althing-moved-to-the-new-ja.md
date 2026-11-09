# 229 · Jarl 6.3.0, piece 5: this loop and Althing moved to the new Jarl

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261108T1910-dqno
**Tags:** 
**Files:** 
**After:** 228
**Found by:** jarl
**Where:**
**Branch:** jarl/229-move
**Worker:** w-jarl-229-opus
**Worktree:** /home/me/Worktrees/Althing/229-move
**Since:** 2026-11-09 04:07

## What
the loop and `workspace/` on the tool they ship with. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 5.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [check] an agent converts `releases/6.3.0/.jarl` following the conversion file and nothing else, and `verify` is clean · by: `jarl verify --root releases/6.3.0`
- [read] the conversion lost nothing: issue, ruling and evidence counts match, and a sample of 20 issues reads the same
- [check] `ws` drives the new Jarl with the commands of 6.3.0, and the workspace's own tests pass · by: `npm test`
- [read] AGENTS.md, the skills `directing-a-release-loop` and `releasing-the-family` and the briefs in `releases/6.3.0/briefs/` say what the new Jarl does, the driver pin in the release's manifest points at the new Jarl, and the rails accept a converted loop
- [read] the contracts page names `jarl-record/4` (155), and `ws status` reads the counts of a loop with a profile (207)
- [read] the canon's sentence on Jarl says what section 15 of the design says, by the canon's own procedure
- [check] the gate passes · by: `yg check && npm test`

## Evidence

