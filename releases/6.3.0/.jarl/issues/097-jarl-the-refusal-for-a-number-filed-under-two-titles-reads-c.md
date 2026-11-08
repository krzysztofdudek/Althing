# 097 · Jarl: the refusal for a number filed under two titles reads 'cannot be moved → done', and a hand edit to Status done in such a file passes verify; two clones filing one title are undetected after renumbering

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 031
**Found by:** rev-jarl-031g-opus
**Where:** Review of 031 round 7 (2026-11-03)
**Branch:** jarl/105-record-integrity
**Merged:** fc01fdfa7df54a60ede59eedf8b603f442b539f9 in ../../../JarlSkill
**CI:** none

## What
The wording of the refusal for an ambiguous number is awkward; a hand edit of Status to done in such a file passes verify; two clones that filed the same title go undetected after renumbering (the hand-copy class: nothing in the record tells them from an ordinary issue; the docs could say under two titles).

## Why
Each is a limit the per-issue key of issue 084 removes; they are noted so the docs say so honestly.

## Acceptance
The refusal wording is plain, the docs say under two titles, and verify names a hand-set done on an ambiguous number or the issue is closed by 084's key

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern="set to done by hand" tests/shared-number.test.mjs (release tip with the new test only) · **saw:** pass 0, fail 1: verify exits 0, clean, on a number read from its header whose Status was set to done by hand with a proof row in its file
- **ran:** cd skills/jarl/scripts && node --test tests/shared-number.test.mjs (at 192cd08) · **saw:** tests 20, pass 20, fail 0: verify names the hand-set done after the renumbering and while two files carry the number; a closed issue closed through Jarl stays unflagged
- **ran:** verify on a copy of the 6.3.0 loop, the release tip's jarl.mjs against 192cd08's · **saw:** identical output: 6 findings, all in log.md, as before
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at d6dd8ac) · **saw:** tests 1469, pass 1447, fail 0, cancelled 0, skipped 22; exit 0
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1469, pass 1447, fail 0, skipped 22, merge fc01fdf

