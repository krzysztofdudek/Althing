# 060 · Jarl: resume shows an answered question instead of its decision

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-95fc042c
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (renderResume), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5967 at a1132a8
**Branch:** jarl/060-resume-answered-question
**Worker:** w-jarl-060-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-060
**Since:** 2026-11-03 16:17

## What
Claim: Answered asks appear as Question: lines in the rulings in force.

resume on the loop copy printed 'ask-001 · by owner — **Question:** Should 6.1.1 release...'. Map row fr-26.

## Why


## Acceptance
- resume and decisions print an answered question's ruling (ask-NNN) with its answer first and the question after
- Tested on a copy of the 6.2.0 loop, whose ask-001 resume prints today as the question; red on 71ebc5b

## Changelog
- Fixed: resume and decisions show an answered question with its answer first, then the question.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs · **saw:** Red before the change: 8 tests, 6 pass, 1 skipped (the live-loop copy, JARL_LIVE_LOOP unset), 1 fails: the answered-question test. resume lists each answered ruling as '**Question:** ...' with no answer; the test expects the answer line first.
- **ran:** node skills/jarl/scripts/jarl.mjs resume --root <copy of the 6.2.0 loop> · **saw:** Before the change, ask-001 prints as '- 2026-10-02 · ask-001 · by owner — **Question:** Should 6.1.1 release the fixes that close false greens …': the question, with no answer.
- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs · **saw:** Green after the change: 8 tests, 7 pass, 0 fail, 1 skipped (the live-loop copy, JARL_LIVE_LOOP unset). The answered-question test passes: resume and decisions list each answered ruling with its answer first and its question after.
- **ran:** node skills/jarl/scripts/jarl.mjs resume --root <copy of the 6.2.0 loop> · **saw:** After the change, ask-001 prints as '- 2026-10-02 · ask-001 · by owner — **Answer:** The owner chose the option 'Blocking right away (Recommended)' … · **Question:** Should 6.1.1 release the fixes …': the answer first, then the question.
- **ran:** node skills/jarl/scripts/jarl.mjs decisions --root <copy of the 6.2.0 loop> · **saw:** After the change, ask-001 prints as '2026-10-02 · ask-001 · by owner — **Answer:** The owner chose the option 'Blocking right away (Recommended)' … · **Question:** Should 6.1.1 release the fixes …': the answer first, then the question.

