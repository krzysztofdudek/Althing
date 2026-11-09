# 136 · Jarl: four README sentences say more than the code does or sit under the wrong heading

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261104T1355-leyy
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-134-opus
**Where:** Review of 134 (rev-jarl-134-opus), Minor findings 2 to 5
**Branch:** jarl/136-docs-and-horde-words
**Merged:** 9d9534631f9bdcc954a4e25bc3075fb140d12d31 in ../../../JarlSkill
**CI:** none

## What
(1) 'the merger merges into the branch' reads as the approved branch, merger.md says the feature branch. (2) The CLI ignores JARL_ROOT, only the MCP server reads it (jarl-mcp.mjs:165), and the README omits 'the server's'. (3) 'nothing is closed without … an approve' describes the built-in gate only: a profile with approve none and requires-merged closes on a landed merge, and the review split can print a fifth label, retracted. (4) The loop-discovery sentence sits under 'What it does not do'.

## Why
A README that claims more than the record gives is the fault the tests were written against.

## Acceptance
Each of the four sentences says exactly what the code does and sits under a fitting heading, and the tests that read the README still pass

## Evidence

- **ran (history):** node --test tests/docs-true.test.mjs (before the README edit, with the README test and the discovery assertion extended) · **saw:** pass 25, fail 2: the merger sentence did not say the feature branch, and the new README test failed on 'merges into the branch'
- **ran (history):** node --test tests/docs-true.test.mjs tests/tense.test.mjs tests/seams.test.mjs (after the README edit) · **saw:** pass 47, fail 0
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1372, pass 1350, fail 0, skipped 22
- **ran (history):** node --test --test-name-pattern 'the README names the branch' tests/docs-true.test.mjs (before the README edit, with the test extended to derive the six labels from the code) · **saw:** failed: the README sentence did not match 'closes on recorded evidence and a merge in the base, which it must require'; the waived label was also absent
- **ran (history):** node --test tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/record-contract.test.mjs tests/review-waiver.test.mjs (after the README edit) · **saw:** docs-true 29 pass 0 fail; tense, vocabulary, record-contract and review-waiver 41 pass 0 fail
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs · **saw:** tests 1372, pass 1350, fail 0, skipped 22, no ENOSPC and no unrelated failures
- **ran (history):** node --test tests/docs-true.test.mjs on the branch tip (commit 58cbbf6) · **saw:** 29 pass, 0 fail
- **ran (history):** node --test tests/docs-true.test.mjs on a scratch copy of the tip, with one review label removed from the README's list at a time (fresh, waived by the owner, coordinator, self, unrecorded, retracted) · **saw:** each of the six removals red, each naming the dropped label (the removal of fresh also trips the neighbouring pin on the list's start); one line of the README changed per copy
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs on the branch tip (commit 58cbbf6) · **saw:** 1372 tests, 1350 pass, 0 fail, 22 skipped
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1385, pass 1363, fail 0, skipped 22, merge 9d95346

