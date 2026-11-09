# 125 · Jarl: Horde has left the family; drop it from the skill, references, comments and tests, and settle the constraints it put on this release

**Status:** done
**Kind:** cleanup
**Priority:** 2
**Tier:** strong
**Key:** 20261104T1157-ijba
**Tags:** family, horde
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl-analysis
**Where:** release/6.2.1: skills/jarl/SKILL.md, references (composers.md, profile.md, jarl.md, repositories.md, glossary.md), jarl-lib.mjs comments, tests that name Horde; briefs/worker-jarl.md
**Branch:** jarl/125-horde-out
**Merged:** 7d13f3d in ../../../JarlSkill
**CI:** none

## What
On 2026-11-04 the owner took Horde out of the family (ruling horde-leaves-the-family) and its repository became private. Jarl's main carries the new family section in README and CLAUDE.md. The skill, its references, two comments in jarl-lib.mjs and several tests still name Horde as the composer that runs on Jarl's loop, and this release still holds constraints that existed only for Horde: record.mjs exports kept unchanged because Horde vendors them (briefs/worker-jarl.md), Horde re-vendoring Jarl at the tag, and the Horde half of ruling one-format-raise-horde-later (a composer's loop is never raised).

## Why
A skill that sends its reader to a private repository is wrong on the day 6.3.0 ships, and a constraint kept for a consumer that no longer exists costs the release work for nothing.

## Acceptance
- No file on release/6.2.1 outside CHANGELOG.md names Horde as a tool that exists today; a composer, where the skill keeps the idea, is described without naming one
- The owner's word or a recorded ruling says whether the jarl-record/1 freeze, the composer-loop protections and the Horde half of one-format-raise-horde-later stay, change or go, and the brief and the code follow it
- Jarl's suite is green on the branch

## Evidence

Ruling horde-constraints-fall-away: Under autonomy-quality, on the owner's decision as relayed by the Jarl Evolution session on 2026-11-04 (the relay's words, not his own): Jarl is to be simply fixed, with no further questions, because Horde has left the family (ruling horde-leaves-the-family) and the constraints kept only for it fall away. (1) The freeze of record.mjs exports that briefs/worker-jarl.md names, and Horde re-vendoring Jarl's code at the tag, are gone. (2) The Horde half of ruling one-format-raise-horde-later is gone: Horde is no longer a later topic. A line shape that the pinned 6.1.0 driver or Jarl 6.2.0 would misread still rides the one format raise (needFormat in lib/profile.mjs), and a composer profile that keeps its loop's format stays a mechanism of the tool until an issue removes it; no code is deleted on this ruling alone. (3) The jarl-record/1 contract test (RECORD_API in tests/record-contract.test.mjs) stays: it guards Jarl's own surface. (4) Horde is removed from the skill, the references, the comments and the tests on the release branch (issue 125). Settles issue 125 acceptance line 2.

Ruling ask-013 (ratify): yes. Krzysztof chose 'I confirm all three' (an option label, not his wording) on 2026-11-05: the freeze of record.mjs exports, Horde re-vendoring Jarl at the tag and the Horde half of one-format-raise-horde-later fall away; the jarl-record/1 contract test (RECORD_API) stays.
- **ran (history):** grep -rIni horde . --exclude-dir=.git --exclude-dir=node_modules (on jarl/125-horde-out) · **saw:** hits only in CHANGELOG.md (lines 5, 19, 41, 123, 157), tests/fixtures/jarl-6.1.0/jarl-lib.mjs (267, 2618), tests/fixtures/jarl-6.2.0/jarl-lib.mjs (395, 5388), and skills/jarl/scripts/tests/guard.test.mjs (17, 18, 57: the guard's list of other tools' state paths and commands, left unchanged pending a decision)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1200 node --test tests/lifecycle-guard.test.mjs tests/lease-holds.test.mjs tests/profile-keys.test.mjs tests/one-store.test.mjs tests/vocabulary.test.mjs tests/description.test.mjs tests/next-as.test.mjs tests/ratify-batch.test.mjs tests/repositories.test.mjs tests/record-contract.test.mjs · **saw:** tests 189, pass 186, fail 0, skipped 3
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (jarl/125-horde-out at 97ee616) · **saw:** tests 1181, pass 1161, fail 0, cancelled 0, skipped 20
- **ran (history):** grep -rIni horde . --exclude-dir=.git --exclude-dir=node_modules (jarl/125-horde-out at f939d07) · **saw:** remaining hits: CHANGELOG.md (history: lines 5, 19, 41, 123, 157); the frozen fixtures tests/fixtures/jarl-6.1.0/jarl-lib.mjs (267, 2618) and tests/fixtures/jarl-6.2.0/jarl-lib.mjs (395, 5388); and the deny-list entries of tests/guard.test.mjs (19, 20, 60), kept so the guard still refuses a reach into a state directory or command of a tool that has left the family
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 300 node --test tests/guard.test.mjs tests/tense.test.mjs; then nice -n 15 timeout 2400 npm test (at f939d07) · **saw:** guard and tense: tests 6, pass 6, fail 0; full suite: tests 1181, pass 1161, fail 0, skipped 20
- **ran (history):** npm test in skills/jarl/scripts of the release worktree, at 7d13f3d with 125 merged into release/6.2.1 (TMPDIR a mktemp -d folder under the system temporary directory) · **saw:** tests 1181, pass 1161, fail 0, skipped 20, exit 0

