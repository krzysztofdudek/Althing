# 184 · Jarl: the brief help in jarl.mjs still says every part whole

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261106T2133-ltpn
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-082-opus
**Where:** skills/jarl/scripts/jarl.mjs the brief help
**Branch:** jarl/122-wording-and-canon
**Merged:** d65727c039b363b868994b0278112710367f6805 in ../../../JarlSkill
**CI:** none

## What
After issue 157 the commands reference says what a finding whose entry is gone shows, but the brief help still says every part whole.

## Why
The help and the reference should say the same.

## Acceptance
The brief help says what a finding whose file entry is gone shows, and a test reads help and reference together

## Evidence

- **ran (history):** node --test --test-name-pattern "brief help" tests/docs-true.test.mjs with the old help (red), then with the new help (green) · **saw:** red: 1 fail, the help still says every part whole; green: 1 pass, the help and the commands reference both say a finding with no file entry shows as the log's line holds it, its first line and a count of the lines left out; docs-true, seams, help-workflow, tense pass
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on the branch tip · **saw:** tests 1557, pass 1535, fail 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1571, pass 1549, fail 0, skipped 22, merge d65727c

