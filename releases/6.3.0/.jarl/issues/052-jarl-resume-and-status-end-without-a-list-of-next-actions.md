# 052 · Jarl: resume and status end without a list of next actions

**Status:** open
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

## What
Claim: After a compaction the coordinator works out the next step from about 200 lines of state.

resume prints ready issues, the merge queue and questions as separate blocks and ends with log lines. Map row fr-17.

## Why


## Acceptance
- next --as <holder> lists what is on the owner, the jarl, a named coordinator or a named outside person, derived from the profile's status flags and from verdicts, questions, rulings and owner-only lines, never from status names (report section 3 of research/2026-11-03-jarl-as-a-loop-tool)
- At most seven lines, on the owner first, then by direct dependents, each with the command that moves it, then a count of the rest; --all prints every line; next --as owner --all is the owner's digest (070); a waiting issue shows waits on X via N (069)
- Under an external scheduler it lists only what is not scheduling and names the composer's command for the rest
- status and resume end with the asker's list
- Tests, one of them on a loop opened with Horde's profile

## Evidence

