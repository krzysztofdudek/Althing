# 160 · Jarl: the identical-output tag can be set by anyone and the models view counts a light approve of a tagged change as clearing on a lower-ranked model

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261105T1151-khhk
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-098-opus
**Where:** Review of 098 and 049 (rev-jarl-098-opus), Minor finding of 049 and Outside the issue
**Branch:** jarl/169-review-gate-bugs
**Merged:** 969f84bc4dcd34903807abe5e9ac3814dcc2ec1c in ../../../JarlSkill
**CI:** none

## What
(1) The tag identical-output, which lets a light approve clear an issue, is set by anyone, the issue's own worker included, and nothing checks that a comparison proof row exists; it silences the rank note. (2) The models view (lib/models.mjs) still counts a light approve of a tagged change as a clearing approve on a lower-ranked model. Done still needs a fresh approve either way, so the gate is not weakened.

## Why
A tag that relaxes a rule should be set by the party the rule protects against only with its evidence.

## Acceptance
The rank note is silenced only for an issue that carries the tag AND a proof row naming the comparison, and the models view treats such an approve as the rule says; tests for both; who may set the tag is said in references/reviewer.md

## Changelog
- Fixed: the lighter review of a change tagged as meant to alter nothing counts only when the proof also holds a row that names the comparison; the tag is for the person who runs the loop to set, not for the worker.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/identical-output.test.mjs (library code reverted, the new tests in place) · **saw:** pass 4, fail 3: the rank note, the model-rank gate and the models count treat the tag alone as enough
- **ran (history):** cd skills/jarl/scripts && node --test tests/identical-output.test.mjs tests/models.test.mjs tests/models-loops.test.mjs tests/reviewer-rule.test.mjs tests/docs-true.test.mjs tests/modules.test.mjs tests/brief.test.mjs tests/tense.test.mjs tests/words.test.mjs · **saw:** pass 143, fail 0 after the reviewer-rule fixture gained the comparison row its tagged change needs; identical-output alone pass 7
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip, all four issues committed) · **saw:** tests 1382, pass 1360, fail 0, skipped 22 (a first run failed only the timing test of resume under a machine load of 27, which passes alone; this is the clean rerun)
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; then node --test tests/refusals-walk-reviewers-a.test.mjs alone for the one failure · **saw:** tests 1382, pass 1359, fail 1 (ENOSPC on the shared temp filesystem while another suite ran), skipped 22; the failed file alone: pass 1 of 1; merge 969f84b

