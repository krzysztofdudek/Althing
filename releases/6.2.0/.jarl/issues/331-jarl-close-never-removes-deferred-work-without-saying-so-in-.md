# 331 · Jarl: close never removes deferred work without saying so; in the default mode it refuses while issues are deferred

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** jarl, invariants
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/close-deferred.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (cmdClose); probe: set 4 deferred, then close prints "removed .jarl · 1 deferred still waiting: 004" and the directory that held 004 is gone; SKILL.md does not explain close --force
**After:** 330
**Branch:** jarl/328-invariants
**Merged:** 0afdb65b4c7f60c4e6e3312036aa9f58e7942379 in ../../../JarlSkill
**CI:** pending

## What
In the default mode (the loop kept out of git) close removes .jarl/ once nothing is open or in progress, and deferred counts as finished for that check, while SKILL.md calls deferred work that waits, not work that is gone. Probe: set 4 deferred, then close prints removed .jarl · 1 deferred still waiting: 004, and the directory that held 004 is gone, so the work waits nowhere. close --force, which removes a loop with open work, is not explained in SKILL.md. The change: in the default mode close refuses while any issue is deferred, names those issues and the two ways forward: archive "<slug>", which keeps the loop under .jarl/archive/ with its deferred issues, or close --force, which removes them. SKILL.md explains close --force: what it removes and that no copy is kept in the default mode. close never prints that work is still waiting when the directory that held it is removed; it says what was removed. A permanent loop keeps its directory and its output.

## Why
Deferred is the status for work that waits, and a close that deletes it while printing that it still waits destroys the work and tells the owner the opposite. Refusing costs one more command; losing deferred work costs work nobody can recover in a loop that git never saw.

## Acceptance
- A test: a default-mode loop, set 4 deferred, close: refused with a non-zero exit, .jarl/ and issue 4 still on disk, and the message names 4, archive and close --force
- A test: the same loop, close --force: .jarl/ is removed and the output names the deferred issues as removed; no output of close contains still waiting
- A test: archive <slug> keeps issue 4 under .jarl/archive/<date>-<slug>/, and a later init and close leave .jarl/archive/ in place with issue 4 inside, and close says it left the archive
- A default-mode loop with no deferred issue closes as before, and a permanent loop with a deferred issue keeps its directory and its output
- SKILL.md and the help text of close describe the refusal on deferred issues, what close --force removes, and that close and init leave the archive in place

## Changelog
- Changed: in a loop kept out of git, close refuses while any issue is deferred and names the two ways forward, archive to keep the work or close --force to remove it. close --force is described in the skill.

## Evidence

- **ran:** node --test tests/close-deferred.test.mjs, on the base and on the change · **saw:** base: 2 of 5 fail (the refusal, the --force output); change: 5 of 5 pass
- **ran:** close on a frozen copy of the 6.2.0 loop · **saw:** refused: 101 issue(s) still open or in progress, as before
- **ran:** cd skills/jarl/scripts && npm test · **saw:** 434 tests, 0 fail; one assertion changed in jarl.test.mjs: the deferred-only close now passes --force
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 0afdb65 · **saw:** 436 tests, 418 pass, 0 fail, 18 skipped

