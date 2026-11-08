# 082 · Jarl: the takeover advice's findings list loses round positions, names only the last model, mis-handles a Tier outside the profile, and four references still describe only the third round

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 003
**Found by:** rev-jarl-003b-opus
**Where:** Review of 003 round 1 (2026-11-03)
**Branch:** jarl/082-takeover-and-brief
**Merged:** 1d09fe34ad818f3447059db6964f1a998f07f5eb in ../../../JarlSkill
**CI:** none

## What
Findings per round skips rounds without a count, so positions stop matching round numbers; later advice says the same model failed and names only the last; an issue whose Tier is not in the profile gets the profile's first tier as one tier up; record.mjs's addRound takes no findings count; models.md, glossary.md, jarl.md and merger.md still describe only the third round.

## Why
Each misleads a coordinator reading a takeover block.

## Acceptance
Each of the five is fixed or documented as it is, with a test where behaviour changes

## Changelog
- Fixed (in the entry on the suggestion after three failed rounds): The suggestion names every model that has worked on the task, and offers no level up for a task whose level the loop does not list. A round that recorded no count of findings shows as a dash in its place.

## Evidence

- **ran:** cd skills/jarl/scripts && nice -n 15 node --test --test-name-pattern 'findings per round keep|names every model|Tier is not one|every record operation writes' tests/models.test.mjs tests/library-parity.test.mjs (the new tests on the code of 3269ebd) · **saw:** tests 4, pass 0, fail 4: 'Findings per round: 29, 3.' for rounds 29, none, 3; the second takeover said '(the last was big-model@high)' and 'the same model at the same tier has failed'; a Tier outside the profile got 'one tier up from standard (to small)'; the parity case of round --findings against addRound differed with no row naming it
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/models.test.mjs tests/library-parity.test.mjs tests/record-contract.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs (commit b865d19) · **saw:** tests 147, pass 146, fail 0, skipped 1; record-contract green with addRound unchanged as (root, id, what)
- **ran:** copy of releases/6.3.0/.jarl: round 090 'red three' --findings 2, with the code of b6f670c and with b865d19 · **saw:** b6f670c: 'Findings per round: 2.' for its third round; b865d19: 'Findings per round: -, -, 2 (a dash: the round recorded no count).'

Point 4 (addRound takes no findings count) is documented as it is: any added parameter changes addRound's shape in the frozen tables jarl-record/1 to /3, which the record contract test refuses, so the difference is a row of the command-line-only list in references/composers.md, held by a new parity case (round with findings), and a comment on addRound in record.mjs. Point 5: jarl.md and merger.md already describe the takeover by the limit the goal sets and no longer reproduce; glossary.md, models.md and the round row of commands.md led with the third round or named one model and are reworded.
- **ran:** cd skills/jarl/scripts && TMPDIR=<a mktemp -d folder> nice -n 15 timeout 1800 node tests/suite.mjs (branch tip be25e1f) · **saw:** tests 1454, pass 1432, fail 0, skipped 22 (the run before be25e1f failed only the writer test, whose round line still had the shape before 3269ebd; be25e1f updates it)
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on the command map and a comment of tests/old-jarl.mjs, resolved by keeping the entries of both sides · **saw:** tests 1495, pass 1473, fail 0, skipped 22, merge 1d09fe3

