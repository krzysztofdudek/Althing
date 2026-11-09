# 117 · Jarl: a question of several lines breaks its row in next --as; ask --kind rule accepts --option that no option can answer; the jarl misses coordinator rules for issues outside every slice

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261104T0845-vdyk
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 086
**Found by:** rev-jarl-086b-opus
**Where:** Review of 086 (2026-11-03): lib/ball.mjs, ask --kind rule, record.mjs comments
**Branch:** jarl/099-views-and-printed-commands
**Merged:** f1c6df3894bc06fedec9a5ce9a8eb6b277f69d7c in ../../../JarlSkill
**CI:** none

## What
Small gaps found around scoped rules: a multi-line question breaks its row in next --as (already so before 086); ask --kind rule takes --option that cannot answer it; in a loop with slices the jarl gets no coordinator rules for issues it leases or reviews outside every slice; record.mjs comments do not document applies-to, until and to.

## Why
Each makes a view or a command say something that is not quite true.

## Acceptance
Each is fixed or stated in references, with a test where behaviour changes

## Evidence

- **ran (history):** node --test --test-name-pattern='several lines is one row|coordinator of the issues in play in no slice|an agent proposes a rule' on tests/next-as.test.mjs and tests/scoped-rules.test.mjs in a copy of the release branch before the change (new tests and assertions) · **saw:** fail 3: a question of three lines printed on three lines in its row of next --as; in a loop with slices the jarl got no coordinator rules while it leased an issue in no slice (odin got three); ask --kind rule --option a:one --option b:two was filed, a rule that no option can answer
- **ran (history):** the same tests on the branch tip, and node jarl.mjs next --as jarl, next --as owner and ask --kind rule --option on a scratch loop with slices · **saw:** pass 3; the row reads '- a-1 first line of the question second line that goes on third: question (stuck) — ...'; the jarl lists the same three coordinator rules odin has; ask --kind rule with --option is refused with 'a proposed rule is answered yes or reject, so it takes no --option' and ends with the form that leaves --option out. The list marks points 1, 2 and 4 of this issue as known limitations; they are fixed here because the coordinator's lease asked for points 1 and 2, point 4 (record library comments) is left
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip 8aa658d, TMPDIR in one mktemp folder) · **saw:** tests 1420, pass 1398, fail 0, skipped 22, exit 0; record-contract and library-parity pass
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1463, pass 1441, fail 0, skipped 22, merge f1c6df3

