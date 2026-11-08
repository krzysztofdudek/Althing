# 205 · Jarl: smaller points of the line rule and the artifact mark found by the last reviews

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-200-opus-m1b
**Where:** lib/review.mjs the note after an approve; lib/log.mjs the artifact mark reader; tests that read CHANGELOG.md
**Branch:** jarl/203-range-extend-inplace
**Merged:** 0556c16208c09ce0faf295bce31a279416239fdb in ../../../JarlSkill
**CI:** none

## What
(1) In a loop that names lines, the note after an approve that says there is no Proof row since the gate's window opened still prints the evidence form without --line, next to a form that has it. (2) A verdict line written by the pinned 6.1.0 driver or the installed 6.2.0 whose finding opens with the word artifact followed by a path and the log separator is read by the current Jarl as naming an artifact, so report counts it and the brief lists the finding twice; the model mark has the same ambiguity with older lines. (3) Only docs-true and version read CHANGELOG.md; tense and vocabulary read the skill, its references and the README, so a doubled changelog entry (as a merge once left) is caught by no test.

## Why
Every note should print the form that works, an older writer's line should not be taken for a mark, and a doubled changelog entry should fail a test.

## Acceptance
The note prints the evidence form with --line where the loop names lines; the two marks are read only from lines a writer that sets them wrote (or the ambiguity is on the known-limitations list with its reason); a test fails when the Unreleased section of CHANGELOG.md holds the same entry twice; a test for each

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern 'the note after an approve of an issue with no row' tests/proof-lines.test.mjs, before the fix (at 8bb097b's parent tree with the new test) · **saw:** red: tests 1, pass 0, fail 1 — the note read '002 holds no Proof row since the gate's window opened ... jarl.mjs evidence 002 --ran "<command>" --saw "<what-it-printed>"' with no --line, beside the note whose form has --line
- **ran:** cd skills/jarl/scripts && node --test tests/proof-lines.test.mjs tests/proof-notes.test.mjs, at d87a84a · **saw:** green: tests 46, pass 46, fail 0 — in a loop that names lines the note prints jarl.mjs evidence 002 --ran "<command>" --saw "<what-it-printed>" --line "<line-number>", and every evidence form the approve prints carries --line; the loop that names no line keeps its note
- **ran:** cd skills/jarl/scripts && node --test tests/changelog-entries.test.mjs, on a copy of the release branch at b3104b1 whose CHANGELOG.md holds the in-place entry twice, the second with a few words changed · **saw:** red: tests 2, pass 1, fail 1 — the test of the real CHANGELOG.md names the repeated entry; the unit test of the checker passes
- **ran:** cd skills/jarl/scripts && node --test tests/changelog-entries.test.mjs, at d87a84a · **saw:** green: tests 2, pass 2, fail 0 — the Unreleased section holds no entry twice; the checker finds an entry repeated word for word, with words changed after the first 80 characters, in another case and punctuation, and with CRLF line ends, and passes an entry of a released section and two entries that differ early
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern 'the note after an approve of an issue with no row' tests/proof-lines.test.mjs, on the tree of c61fb3c with only the new test added (this corrects the place the first red row of this issue names: it was this tree, not a parent of 8bb097b) · **saw:** red: tests 1, pass 0, fail 1 — the note printed the evidence form with no --line
- **ran:** every read view (status, resume, report, report --metrics, list, list --all, next, next --all, next --as jarl and owner, verify, decisions, decisions --live, models, branches, goal, profile, sources; show, show --json and brief of each of the 205 issues; show --full and the reviewer's brief of the last 20), text and --json, base b3104b1 against cb00e5e on a copy of the 6.3.0 loop with its repositories linked, ages masked · **saw:** 686 views, each run with both: 1 differs, report --json, whose 205 issue rows each gain parent: null (no issue of the loop has a parent), as list and show already give it; closedGate is 028 alone in both; the copy is unchanged by the views
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 2b7c932 (release/6.2.1 at f3d0963 merged), TMPDIR from mktemp -d; then node --test tests/queue-views.test.mjs at efcdc93 · **saw:** tests 1686, pass 1663, fail 1, skipped 22 (the record contract test included): the one failure was tests/queue-views.test.mjs, whose exact report row lacked the parent key report --json now carries; the row is expected with parent: null at efcdc93, and that file passes, tests 7, pass 7, fail 0
- **ran:** reviewer's note on point 2 · **saw:** point 2 is on the known-limitations list in releases/6.3.0/plans/known-limitations.md, with the sentence a user meets and the reason it stays (an older writer's line has the mark's shape; telling them apart needs a new line shape and another format raise)
- **ran:** merged jarl/203-range-extend-inplace into release/6.2.1 (one conflict in references/commands.md, status row of 195 and report row of 158 kept); suite on the merge in skills/jarl/scripts · **saw:** see the suite row of the merge
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merge 0556c16208c09ce0faf295bce31a279416239fdb of jarl/203-range-extend-inplace into release/6.2.1 · **saw:** 1699 tests, 1677 pass, 0 fail, 22 skipped

