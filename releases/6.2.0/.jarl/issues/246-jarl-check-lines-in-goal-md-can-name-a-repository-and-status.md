# 246 · Jarl: Check: lines in goal.md can name a repository, and status and report show per repository whether merges have an evidence row with its gate

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** jarl, check
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1345 at 2c12aa3 (merged --sha writes CI pending by default); :1318 (done notes CI not recorded); :1998 (a merge line read through its Merged field)
**After:** 249

## What
Reshaped by the design research/2026-10-08-jarl-field-report-and-repository-names/design.md (A.4) and the ruling jarl-6-2-0-scope-revised: 246 and 247 trade contents. 246 keeps its own subject, the check per repository, and becomes "a merge records the check that decided it"; the repositories entity (names, identity, the base) is 247. Today Jarl reads a Check: line as a command for the whole loop (this loop's goal names a repository in each of its six lines only as prose, ruling goal-check-lines), and whether a loop lands on its check is read from the declared line, so a hand-added line flips the banner for hundreds of issues with no merge proving anything (the previous architect's divergence 6). merged --sha writes CI pending when --ci is not given (jarl-lib.mjs:1345 at 2c12aa3; probe E), and a merge into a branch that is not pushed has no CI run that could resolve it, since ciOf reads runs for the exact commit (:2512); so this loop recorded CI none on all 193 of its merges, although Runes, Yggdrasil, Grain, JarlSkill and Horde all run CI, and both workarounds put a false statement in the record (a field report from a loop in another project, item 1). A merge that lands while its check is red for a cause outside the branch has no honest record, and the merger's only move, a round, charges the worker, while three rounds raise a takeover of work that was right (item 3). None of this needs repository names or a format change: Jarl 6.1.0 reads a Check (<name>): line as no check, which is the benign direction, and reads a merge line with no CI state through its Merged field (:1998). Rejected: merged --ci local, or a Check line read as CI (a label without proof; the bound check row is the proof), and a merged-but-red status (it would write the repository's state into an issue).

## Why
In a multi-repository loop, "did this merge pass the right check" is answered today by reading the evidence by hand. Tied to the repositories entity, the first item to set aside, the merge check would slip with it although it needs nothing from it.

## Acceptance
- Check (<name>): <command> lines in goal.md name the command each repository's check runs, <name> being the repository's name as its Files prefix writes it; a bare Check: line keeps its meaning today
- merged <ids> --sha <sha> --ran "<check>" --saw "<summary>" records the merge and the check that decided it in one call: the evidence row as today, and a merge line that names its check
- status --by repo and report show, per repository, how many merges carry a passing check row and how many carry none (every merge from before this change); init says once that a loop with no check lands on testimony; nothing refuses done for a missing or a red check
- The merger's brief in SKILL.md: on green, one merged --sha --ran --saw call. A red whose cause lies outside the branch is not a round (rounds count the worker's failures, and the third raises a takeover): the cause is filed as its own issue, and the branch stays approved in the queue until the check is green
- Tests: a merge with a passing check and one with no check row, in a loop of one repository and one of several; a loop from before the change reads its merges as "no check row recorded", never as failed
- Growth, on the owner's word (ask a-018): merged --sha records CI only when --ci is given, with no default pending (pending means a pushed commit whose CI will report, and only that state makes status count "CI pending" and done note it); done no longer notes "CI not recorded" for a merge that carries a passing check (jarl-lib.mjs:1318); SKILL.md's two descriptions of the old default change with it (SKILL.md:84, :190). merged --red <id> records instead a merge that landed while its check was red for a cause outside the branch, which issue <id> (it must exist) tracks, never counted as a passing check; the merger lands such a branch with --red only on the jarl's ruling. Whether a repository lands on its check is derived from the merge rows, no longer from a declared Check: line, and status --by repo and report also count the merges landed on red, with their cause. Tests: a merge landed on red; a merge line with no CI state counted by 6.2.0's metrics, and by Jarl 6.1.0 through the Merged field (:1998)

## Evidence


