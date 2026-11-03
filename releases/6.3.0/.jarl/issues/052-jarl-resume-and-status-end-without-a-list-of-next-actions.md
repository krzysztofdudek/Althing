# 052 · Jarl: resume and status end without a list of next actions

**Status:** done
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
**Merged:** ffbadec in ../../../JarlSkill
**CI:** none

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

## Changelog
- Added: You can ask Jarl what is waiting on one person: the owner's open questions, or the next step of every task for whoever runs the loop, each with the command that takes it. The status and the resume of a loop can end with that list.

## Evidence

- **ran:** node --test tests/next-as.test.mjs (JarlSkill skills/jarl/scripts, at 2236405 with the test file only) · **saw:** tests 9, pass 0, fail 9: unknown flag --as for next and for status
- **ran:** node --test tests/next-as.test.mjs (at 95e9340) · **saw:** tests 9, pass 9, fail 0
- **ran:** npm test (skills/jarl/scripts, at 95e9340) · **saw:** tests 922, pass 899, fail 0, cancelled 0, exit 0
- **ran:** jarl.mjs next --as jarl, next --as owner --all, status --as owner, resume --as jarl on copies of releases/6.3.0/.jarl and releases/6.2.0/.jarl under ~/Temp, then diff -r against a second copy · **saw:** 6.3.0: On the jarl (39), 7 lines then 'and 32 more, and 51 issue(s) waiting on the jarl'; On the owner (1), a-012 to ratify; 6.2.0: On the jarl (83), On the owner (8) with the charter question a-032 first; diff after the reads: no difference
- **ran:** Jarl 6.1.0 driver status and resume on the copy of releases/6.3.0/.jarl after the reads · **saw:** exit 0 for both: the record is only read, nothing written
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 922 ℹ pass 899 ℹ fail 0 (merge ffbadec on release/6.2.1)

