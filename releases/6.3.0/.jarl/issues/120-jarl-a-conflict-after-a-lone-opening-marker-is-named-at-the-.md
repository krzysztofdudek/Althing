# 120 · Jarl: a conflict after a lone opening marker is named at the lone marker's line, the lease-conflict row's command is refused when the lease to keep is the one the log already reads, and SKILL.md does not mention the marker escape

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 084
**Found by:** rev-jarl-084e-opus
**Where:** Review of 084 (2026-11-04): verify, the lease-conflict row
**Branch:** jarl/108-small-gaps
**Merged:** 4e89d0ba43de04503c11bcd97ef430ec04e9fdef in ../../../JarlSkill
**CI:** none

## What
Three small gaps after the issue keys: a conflict after a lone opening marker is reported at the lone marker's line and the test that checked the line was loosened; the command a lease-conflict row offers is refused when the lease to keep is the one the log already reads; the guidance says nothing about the escape of marker lines.

## Why
Each makes a report or an offered command not quite right.

## Acceptance
Each is fixed or stated in references/jarl.md (the guidance does not grow), with a test where behaviour changes

## Changelog
- Fixed: When two copies of a loop each leased the same task, the command Jarl offers to settle it now works whichever of the two leases you keep, including the one the task's file already shows. A conflict git left in an issue file after a stray opening line is reported at the line where the conflict itself begins.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/two-copies.test.mjs, with the test of the line restored to the exact line number and a new case that runs the offered handover for each of the two leases, code before the change · **saw:** not ok: 'a lone opening marker is no conflict, and a conflict after it is still refused' (the conflict was named at the lone marker's line); and the handover that keeps the lease the issue file reads was refused with 'names the lease already has'
- **ran:** cd skills/jarl/scripts && node --test tests/two-copies.test.mjs tests/modules.test.mjs tests/seams.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs, on commit 3942bff · **saw:** pass 100 fail 0; the conflict is named at its own opening line and not at the lone marker; the handover settles the conflict whichever of the two leases is kept. The escape of marker lines is stated in references/record.md (one sentence), SKILL.md unchanged
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, once for the group, on commit 56dd68a · **saw:** tests 1503 pass 1481 fail 0 skipped 22
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1552, pass 1530, fail 0, skipped 22, merge 4e89d0b

