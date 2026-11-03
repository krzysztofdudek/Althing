# 066 · Jarl: the takeover limit is fixed at three rounds

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-ce9878f6
**Where:** JarlSkill/skills/jarl/scripts/lib/base.mjs (ROUNDS_BEFORE_TAKEOVER), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:25 at a1132a8
**Branch:** jarl/066-takeover-limit
**Worker:** w-jarl-066-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-066
**Since:** 2026-11-03 12:44

## What
Claim: Format and visual work could take over after two rounds, where each round is costly to verify.

ROUNDS_BEFORE_TAKEOVER is a constant of 3. Map row fr-34.

## Why


## Acceptance
- The goal may set, per kind, the number of red rounds before a takeover (a Takeover (kind) line, bare Takeover for the other kinds), three by default; a profile key is left to the format marker (ruling takeover-limit-in-the-goal)
- Changing the limit partway through a loop counts the rounds since the last takeover or since the change in a way that never hands over a new worker early and never skips a takeover, with a test for lowering and raising it

## Changelog
- Added: A loop can now say after how many failed rounds a kind of task is handed to a fresh worker, with a line such as 'Takeover (docs): 2' in its goal. A line 'Takeover: 4' sets it for every other kind, and a loop that says nothing keeps three.

## Evidence

Kept small by the model (report section 11): a goal or profile line sets the round limit per kind, read by the takeover row; acceptance as filed.

Correction to the note above: the limit is a profile line per kind, as the acceptance says, not a goal line.
- **ran:** node --test tests/models.test.mjs (in skills/jarl/scripts, before the change, with the six new takeover tests) · **saw:** pass 38, fail 6: the limit is undefined, a docs issue is not taken over at round 2, goal --set refuses a Takeover line, verify lists nothing
- **ran:** node --test tests/models.test.mjs tests/goal-lines.test.mjs tests/docs-true.test.mjs tests/printed-texts.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/modules.test.mjs tests/record-contract.test.mjs tests/mcp.test.mjs tests/grammar.test.mjs tests/jarl.test.mjs (in skills/jarl/scripts, after the change) · **saw:** pass 343, fail 0, including the kind with 2 rounds, the default of 3, the bare line, goal --set, verify and the pinned 6.1.0 reader
- **ran:** npm test (in skills/jarl/scripts, branch tip) · **saw:** tests 919, pass 896, fail 0
- **ran:** jarl.mjs round 066 on a copy of the 6.3.0 loop with Takeover (gap): 2 set by goal --set (before: the 6.1.0 round on the same copy) · **saw:** before: round 1 of 3 before a takeover; after: round 2 printed the takeover block, 'failed this 2 times'; the 6.1.0 driver then read status and round on that copy without a refusal, and verify listed nothing for goal.md
- **ran:** jarl.mjs status on a copy of the loop whose profile.json holds a takeover key, run by the pinned 6.1.0 driver · **saw:** refused: 'unknown key takeover-rounds — a profile takes jarl-profile, format, name, ...': a profile key is refused, not ignored, so the limit is carried by the goal, which the driver ignores
- **ran:** node --test tests/models.test.mjs (in skills/jarl/scripts, the previous commit with the four new tests: lowering, raising, a limit of one, verify on an unknown kind) · **saw:** pass 44, fail 4: a lowered limit gave the takeover a round late, a raised one handed over early, 1 times, verify silent
- **ran:** node --test on models, goal-lines, docs-true, printed-texts, skill-shape, tense, vocabulary and modules tests (in skills/jarl/scripts, after the change) · **saw:** pass 120, fail 0
- **ran:** npm test (in skills/jarl/scripts, branch tip) · **saw:** tests 923, pass 900, fail 0

