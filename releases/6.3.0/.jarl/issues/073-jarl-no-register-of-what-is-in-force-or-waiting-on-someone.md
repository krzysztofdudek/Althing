# 073 · Jarl: no register of what is in force or waiting on someone

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-9b524b85
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdAsk), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5540 at a1132a8
**After:** 035, 052, 083
**Branch:** jarl/073-register-in-force
**Worker:** w-jarl-073-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-073
**Since:** 2026-11-03 17:49

## What
Claim: Standing orders, sign-offs, promises, external waits and guesses lived in chat and loose notes and were lost in compactions. Corrected by the sceptic: Severity medium rather than high: rules, decisions and questions already survive compaction; the owner's decision is about the new kinds and the ball, and 020 covers the standing brief.

Rulings, questions, ratify items and After hold part of it; promises, external waits, validity, certainty and who holds the ball do not exist. Map row fr-41; issues 020 and 005 cover small parts.

## Why


## Acceptance
- Two built-in kinds of issue, written under format 3 (083): promise, held by the level of the agent that made it (the one its Found by names), and wait, held by a named outside person, with when to check
- Each adds its row to next --as (052): a promise on its maker's list, a wait on next --as <that person>, which 052's derivation does not give without them
- Unchecked notes and validity by date or event are not built: a promise or wait ends when its issue closes; reason in research/2026-11-03-jarl-as-a-loop-tool/materials/revision.md (M-I4, T-M4)
- Tests for both kinds in next --as, a named outside person's list among them

## Changelog
- Added: A loop can now record a promise someone made, or something it waits for from a person outside the loop, and each stays on that person's list, a wait with when to check, until it is closed. Jarl never gives either to a worker.

## Evidence

- **ran:** node --test tests/next-as.test.mjs (skills/jarl/scripts), the new tests on release/6.2.1 at ffef4cc before the change (TMPDIR under ~/Temp/tmp) · **saw:** tests 14, pass 9, fail 5: a promise on its maker's list, a wait on its named person's list (next --as 'Dana Smith'), the Person and Check when refusals, the raise to format 3 and the composer's refusal, a finding never filed as a promise or a wait
- **ran:** on a copy of releases/6.3.0/.jarl: next --as jarl --all, next --as owner --all, next --all and status by the release library and by this branch, then new --kind wait --person 'Dana Smith' --check-when 2026-11-10 and new --kind promise by this branch, then the pinned driver's status · **saw:** the four views identical before any promise or wait, record format 1, no profile.json; after the filings profile.json says format 3, next --as 'Dana Smith' lists 111 with check when 2026-11-10; the driver refuses: 'written for record format 3, and this Jarl reads format 1'
- **ran:** node --test tests/next-as.test.mjs at 2b0dd97, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** next-as 14 of 14 pass; full suite 1019 tests, 995 pass, 1 fail, 23 skipped: the one failure is 'resume stays fast on a loop of hundreds of issues' (resume took 6793 ms against 6 s, load average 22 to 25; issue 101); resume.test.mjs alone right after: 8 tests, 7 pass, 0 fail. The run before the four pinned field-list strings were updated: 1019 tests, 991 pass, that test passing
- **ran:** node --test --test-name-pattern 'resume lists the open promises|already declares a field Person|given to init or to profile' tests/next-as.test.mjs, the three new tests on 10f79df (round 1 with release/6.2.1 merged) before the round-2 change (TMPDIR under ~/Temp/tmp) · **saw:** tests 3, pass 0, fail 3: resume lists the promise and the wait apart from Held, a loop whose profile declares Person and its own kind wait stays readable with its own meaning, init and profile <file> refuse a profile with the reserved names
- **ran:** the same three tests on the worktree after the round-2 change · **saw:** tests 3, pass 3, fail 0
- **ran:** nice -n 15 timeout 1800 npm test in skills/jarl/scripts at 90ced4e (TMPDIR under ~/Temp/tmp); the run before it, on the uncommitted round-2 change, showed 2 failures (setKeptField read no profile; resume's pinned --json key list lacked kept), both fixed in 90ced4e · **saw:** tests 1033, pass 1010, fail 0, skipped 23, exit 0

