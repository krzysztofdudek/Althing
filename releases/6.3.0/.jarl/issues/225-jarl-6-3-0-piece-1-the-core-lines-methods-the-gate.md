# 225 · Jarl 6.3.0, piece 1: the core: lines, methods, the gate

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261108T1910-jyds
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:**
**Branch:** jarl/225-core
**Merged:** 2db9bca471535437cf3779523addebab35af0f28 in ../../../JarlSkill
**CI:** none

## What
the design's section 3 and the gate of section 6: lines, methods, line state, the gate per method, the line digest, old line text kept whole, a `changes` that stands until a round. No new code calls `needFormat`: piece 3 removes it. The new shapes are written unconditionally. About 274 places in the suite write an acceptance line and about 400 write a row; moving them to marks and `--line` is part of this piece. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 1.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [test] `new` and `field` accept a line headed `[test]`, `[check]`, `[compare]`, `[read]` or `[owner]` in the form `[method] text · key: value`, and refuse any other line, ending with the form that names the five
- [test] a `[compare]` line without `· by:` is refused; a `[check]` line without `· by:` means the goal's declared check
- [test] a line with no mark reads as `read`; `import`'s "Proposed" line counts as no line
- [test] a lease on an issue with no line is refused, ending with the form that adds one
- [test] `done` asks of each line what its method asks: for `test`, `check` and `compare`, a counted row naming it by the holder of the lease and one by a name that has not held it (the landing's check for a `check` on the declared command); for `compare`, two rows with identical `--saw`; a live approve for `read`, or a waiver or a profile with no approve in its place; the tick for `owner`
- [test] `--without-rows` and the switch-on of the line rule are gone, and `--without-rows` is refused as an unknown flag
- [test] a row stores the digest of its line, not its number; after the line is reworded or another inserted before it, the row counts for no line other than the text it named
- [test] `evidence --ran --saw` without `--line` is refused; a free note is still taken
- [test] a `changes` stands until a round or a new commit: an approve by another examiner after it does not clear the issue
- [test] the log keeps the whole old text of the lines when they change, and the tool can print the lines as they were at the lease
- [test] `show` prints each line's state as the design defines it, and `status` counts lines by method
- [test] `merged` notes when `--ran` matches no declared check and prints the declared ones, and a `Check (<name>):` line matches the repository's own name
- [check] the full suite passes on the merged result
- [read] an independent examiner: the code does what sections 3 and 6 of the design say about lines, methods and the gate

## Changelog
- Changed: every acceptance line now starts with how it will be proved, and a task closes when each line has what its method asks.

## Evidence

- **ran (history):** line 1 red, code at 7b914a5 with tests/line-methods.test.mjs: node --test (a line of any other form is refused by new and by field) · **saw:** not ok; pass 2 fail 17 for the file; the half that accepts a marked line passes before, as nothing was refused
- **ran (history):** line 1 green at e0a61b2: node --test tests/line-methods.test.mjs (tests 1 and 2) · **saw:** pass 19 fail 0
- **ran (history):** line 2 red at 7b914a5: test [compare] without by is refused, [check] without by means the declared check · **saw:** not ok
- **ran (history):** line 2 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 3 red at 7b914a5: test a line with no mark reads as read, Proposed counts as no line · **saw:** not ok
- **ran (history):** line 3 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 4 red at 7b914a5: test a lease on an issue with no line is refused · **saw:** not ok
- **ran (history):** line 4 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 5 red at 7b914a5: tests for test, window, check, compare and read lines (6 to 10); the owner tick test (11) passes before, unchanged behaviour · **saw:** tests 6 to 10 not ok, test 11 ok
- **ran (history):** line 5 green at e0a61b2: tests 6 to 11 · **saw:** all ok
- **ran (history):** line 6 red at 7b914a5: test --without-rows is refused as an unknown flag · **saw:** not ok
- **ran (history):** line 6 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 7 red at 7b914a5: test a row stores the digest of its line · **saw:** not ok
- **ran (history):** line 7 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 8 red at 7b914a5: test evidence --ran --saw without --line is refused, a free note is taken · **saw:** not ok
- **ran (history):** line 8 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 9 red at 7b914a5: test a changes verdict stands until a round or a new commit · **saw:** not ok
- **ran (history):** line 9 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 10 red at 7b914a5: test the log keeps the whole old text and show --at-lease prints the lines · **saw:** not ok
- **ran (history):** line 10 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 11 red at 7b914a5: test show prints each line's state, status counts lines by method · **saw:** not ok
- **ran (history):** line 11 green at e0a61b2: same test · **saw:** ok
- **ran (history):** line 12 red at 7b914a5: tests merged notes a --ran that matches no declared check, Check (name) matches the repository's own name · **saw:** both not ok
- **ran (history):** line 12 green at e0a61b2: same tests · **saw:** both ok
- **ran (history):** line 13, branch only, at 0a9be8b: TMPDIR=folder nice -n 15 timeout 1800 node tests/suite.mjs; the commit after it touches only CHANGELOG.md, and the tests that read the changelog and the skill pass there · **saw:** tests 1750, pass 1728, fail 0, skipped 22, exit 0; the merged result is the merger's to run

Assumed: the part after the text of a line is key: value pairs, and each method takes a closed set of keys: by for test, check and compare, material and check for owner, none for read. Any other part is refused, so a misspelt key is not taken for proof. The specification gives the form and names no key beyond these.

Assumed: with no lease on record, an issue has no holder, so a mechanical line takes one named row and a row by a second name. A row with no writer counts for no side. The library cannot name a writer until piece 3, so a library caller cannot close a test, check or compare line yet.

Assumed: a check line on the declared command is proved by the landing or by the two rows, because an issue worked in place has no landing. A check line with a stated command that is not declared needs the rows.

Assumed: the design is silent on promises and waits. A promise or wait with no line is kept as before: its row needs no --line and done asks for that row. A lease on one still needs a line. Attachment rows also name no line, since they fill a slot.

Assumed: an issue with no line cannot be closed, as there is nothing done can ask of it. The owner's waiver clears a standing changes verdict, as it stands in for the approve. A pause and resume does not spend a changes verdict.

Assumed: the work file says piece 1 absorbs the --model requirement of 149 in part, but no acceptance line of 225 asks for it and piece 3 has the line, so it waits for piece 3, as does --by being required. The grew-after-the-lease mark stays: the design says the whole old text takes over from it, and no line of this issue removes it.

Assumed: a copy of this loop read by the new code at e0a61b2: status and show work, verify places the log. status flags 34 closed issues whose approve came after a changes verdict with no round, and the driver flags none. That history is read by today's rule until piece 3's converted line stops closed issues being re-read, so I left it.

Assumed, in place of the note on rows with no lease or writer: with no lease on record, one named row proves a test or check line, and compare asks two named rows with identical saw. A row with no writer counts for nobody. The library cannot name a writer until piece 3, so a library caller cannot close a test, check or compare line yet.
- **ran (history):** line 5 red after the examiner's changes, at 1e61826: node --test tests/line-methods.test.mjs (a check proved by its two rows; one named row with no lease; a parent with no code and no lease) · **saw:** those 3 not ok, pass 19 fail 3
- **ran (history):** line 5 green at 2a97ac1: same file, with proof-lines, retract, gate-decide-tips, lease-holds, modules, tense, left-the-family · **saw:** pass 95 fail 0
- **ran (history):** line 13, branch only, at 2a97ac1: TMPDIR=folder nice -n 15 timeout 1800 node tests/suite.mjs · **saw:** tests 1753, pass 1731, fail 0, skipped 22, exit 0; the merged result is the merger's to run
- **ran (history):** git merge --no-ff jarl/225-core into release/6.2.1 at 2db9bca471535437cf3779523addebab35af0f28; git rev-parse of both trees; the examiner's node tests/suite.mjs on a clean extraction of 2a97ac1 · **saw:** the merge's tree is the tip's tree, so the examiner's suite stands for the merge: 1753 tests, 1731 pass, 0 fail, 22 skipped

