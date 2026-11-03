# 052 · Jarl: resume and status end without a list of next actions

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-e9558e49
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (renderResume), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5975 at a1132a8
**After:** 035
**Branch:** jarl/052-next-as
**Worker:** w-jarl-052-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-052
**Since:** 2026-11-03 12:44

## What
Claim: After a compaction the coordinator works out the next step from about 200 lines of state.

resume prints ready issues, the merge queue and questions as separate blocks and ends with log lines. Map row fr-17.

## Why


## Acceptance
- next --as <holder> lists what is on that holder: the owner, the jarl, a named coordinator or a named outside person. 052 derives the rows of report section 3 (research/2026-11-03-jarl-as-a-loop-tool) that the record at 71ebc5b already holds (a ready issue, a lease, a proof with no verdict, a changes verdict, an approve not merged, a question or ratify item, a ruling that names work and settles no live issue) from the profile's status flags and from verdicts, questions and rulings, never from status names; with no slice, what the table gives a coordinator is the jarl's
- The rows of what other issues add are theirs, each ordered after 052: owner-only lines (039), promises and waits with their named outside person (073), slices, escalations and the merger (085), parents of sub-issues (078) and liveness ages (042)
- At most seven lines, on the owner first, then by direct dependents, each with the command that moves it, then a count of the rest; --all prints every line; next --as owner --all is the owner's digest (070); a waiting issue shows waits on X via N (069)
- Under an external scheduler it lists only what is not scheduling and names the composer's command for the rest
- status --as and resume --as end with the asker's list
- Tests, one of them on a loop opened with Horde's profile

## Evidence

