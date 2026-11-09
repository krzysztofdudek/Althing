# 031 · Jarl: two clones or branches of a committed loop give two issues one number, and every move of that number lands on both

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261103T0718-ahtg
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#jarl-rethink-dupnum
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:1562 at a1132a8
**Branch:** jarl/031-duplicate-numbers-detected
**Merged:** 2236405 in ../../../JarlSkill
**CI:** none

## What
Claim: Numbers are taken from the clone's own issues, so two clones that each file an issue take the same number; git merges the two files without a conflict because their slugs differ; list then shows two issues numbered 2, verify reports clean, and show and set reach only the first file, so the second issue cannot be addressed by number. Corrected by the sceptic: Add to the claim: every move of the number lands on both issues in the record (log.md), so list, resume and the done gate treat the second issue as moved too. verify reports the second file only as a header that disagrees with the log, and its advice would copy the wrong state into it. The cause also covers two branches of one checkout, not only separate clones.

Run on scratch repositories with Jarl a1132a8: materials/two-clones.md, section 'Two clones file one number'. The numbering reads this checkout and its worktrees only (jarl-lib.mjs:1562-1564), and new is refused in a linked worktree because "the number would be used twice" (jarl-lib.mjs:1523); nothing covers a separate clone. findIssue returns the first file with the number (jarl-lib.mjs:881).

## Why


Two sessions or two machines driving one loop is the shape Jarl is meant for, and the docs promise that numbers never collide; when they do, the record moves an issue nobody moved and verify's advice spreads the damage.

## Acceptance
- A test files one issue in each of two clones of a committed loop (and, apart, on two branches of one checkout), merges them, and verify then reports the two files with one number, naming both; it is red on a1132a8
- While two issue files share a number, every command that moves or edits an issue by that number is refused with both file names, so no move lands on both; tested
- SKILL.md, references/jarl.md and references/repositories.md say what the numbering guarantees and where it does not hold (separate clones, branches of one checkout)

## Changelog
- Fixed: When two copies of a shared loop each file an issue and are then merged, both issues can get the same number. Jarl now says so and names both files, refuses to change either one by that number, and shows each one at the status its own file says, so one issue's status is never copied into the other. Neither can be closed or approved under that number, because Jarl cannot tell whose test results and reviews are whose: you file the work again under a new number. It also says how to give one of them a new number by hand.

## Evidence

Title and tier corrected by hand after import: the driver Jarl cut the imported title at its limit and has no command for the tier (017 was folded into 029); tier strong because the fix touches the record's ids and data integrity

jarl-lib.mjs was split into skills/jarl/scripts/lib/ at merge 71ebc5b (issue 030); any file:line in this issue that names jarl-lib.mjs now lives in one of the lib/ modules

Acceptance narrowed by the analysis session: detection, refusal and honest docs are bug fixes outside the direction and may start now; ids that cannot collide across clones are a design question and belong to 035 (research/2026-11-03-jarl-as-a-loop-tool, safety with many drivers).
- **ran (history):** node --test tests/shared-number.test.mjs (on a copy of release/6.2.1 at 71ebc5b) · **saw:** pass 1, fail 5: verify reports clean for two clones and for two branches, set, prio, body, show and answer land on both files
- **ran (history):** node --test tests/shared-number.test.mjs tests/record-contract.test.mjs (branch jarl/031-duplicate-numbers-detected) · **saw:** pass 15, fail 0: verify names both files, every command by that number and the library's findIssue refuse it with both named, nothing written
- **ran (history):** node --test tests/shared-number.test.mjs, the file as it stands at the branch tip, on a copy of release/6.2.1 at 71ebc5b · **saw:** pass 0, fail 9; this corrects the first red row, whose count (pass 1, fail 5) was taken before the library test was added: that file then failed 6 of 7, as the reviewer saw
- **ran (history):** node --test tests/shared-number.test.mjs, the branch tip's test file, on a copy of 93798f9 (the first fix) · **saw:** pass 6, fail 3: the settle advice, the list/next/report marks and import --adopt refusing before it writes are red there
- **ran (history):** TMPDIR=<scratch> npm test in skills/jarl/scripts at 3f0eeaa; node --test tests/shared-number.test.mjs · **saw:** full suite: tests 831, pass 808, fail 0, skipped 23; shared-number: pass 9, fail 0, the reviewer's case included (renumber, note, set 3 dropped, set 2 open, headers clean)
- **ran (history):** node --test tests/shared-number.test.mjs, the branch tip's test file, on a copy of 3f0eeaa · **saw:** pass 8, fail 2: after renumbering, verify, status and resume still advise writing Status: dropped into the file nobody dropped, and the finding does not name which file to renumber
- **ran (history):** TMPDIR=<scratch> npm test in skills/jarl/scripts at the branch tip; node --test tests/shared-number.test.mjs · **saw:** full suite: tests 832, pass 809, fail 0, skipped 23; shared-number: pass 10, fail 0, verify, status and resume checked after each settling step in both renumbering orders; verify on a copy of the 6.3.0 loop prints the same as before
- **ran (history):** node --test tests/shared-number.test.mjs, the takeover's test file, on a copy of release/6.2.1 and on a copy of 4d511fd (the round-3 tip) · **saw:** release/6.2.1: pass 0, fail 13, one renumbering order advising a header for 2 right after the renumbering; 4d511fd: pass 9, fail 4: an early '2 number settled' note switches the header advice on and verify then advises writing Branch jarl/2-one into the file that keeps 2 (the round-3 case), and the finding still names a file to renumber and asks for a settling line
- **ran (history):** TMPDIR=<scratch> npm test in skills/jarl/scripts at b692536; node --test tests/shared-number.test.mjs · **saw:** full suite: tests 853, pass 830, fail 0, skipped 23; shared-number: pass 13, fail 0: both renumbering orders checked after every step, the lease-and-drop case with an early note, and a third file merged after the renumbering
- **ran (history):** jarl.mjs verify on a copy of the 6.3.0 loop, at b692536 and at release/6.2.1; pinned driver list --all, show, status, resume and report on a scratch format-1 loop after a shared number was renumbered by hand with the tip · **saw:** verify output identical on both; the driver reads the scratch loop: 002 dropped, 003 open, the note a plain log line
- **ran (history):** node --test tests/shared-number.test.mjs, the 74ca70e test file, on a copy of b692536 · **saw:** pass 9, fail 6: after the renumbering and note the kept 2 shows at the log's state (dropped) and its Branch from the other file; no note apart from the disagreements; a contradicting hand edit to 2 not caught; the copied-by-hand finding text missing
- **ran (history):** TMPDIR=<scratch> npm test in skills/jarl/scripts at 74ca70e; node --test tests/shared-number.test.mjs · **saw:** full suite: tests 855, pass 832, fail 0, skipped 23; shared-number: pass 15, fail 0
- **ran (history):** node --test tests/shared-number.test.mjs, the branch tip's test file, on a copy of 74ca70e · **saw:** pass 17, fail 1: with the first clone's lines after the second's, set 2 done passes on B's file with no row or review of its own (rev-a's approve counted); the mirror order and the plain issue pass there
- **ran (history):** TMPDIR=<scratch> npm test in skills/jarl/scripts at b06b4f2; node --test tests/shared-number.test.mjs · **saw:** full suite: tests 858, pass 835, fail 0, skipped 23; shared-number: pass 18, fail 0
- **ran (history):** node --test tests/shared-number.test.mjs, the branch tip's test file, on a copy of b06b4f2 · **saw:** pass 14, fail 5: in both merge orders set 2 done, review 2 approve (the takeover's earlier worker included) and merged 2 are not refused with the never-closed message; the closed number kept is flagged by closedGate; the note lacks 'never closed or approved'
- **ran (history):** TMPDIR=<scratch> npm test in skills/jarl/scripts at dca4457; node --test tests/shared-number.test.mjs · **saw:** full suite: tests 859, pass 836, fail 0, skipped 23; shared-number: pass 19, fail 0; one-store's repeated filing line still resets nothing
- **ran (history):** git merge release/6.2.1 (merge fab5ab4, import-line conflicts in lib/commands.mjs and lib/questions.mjs resolved as the union of both sides); TMPDIR=<scratch> npm test; by hand on a scratch copy of the 6.3.0 loop: decide --by owner without --quote, prio 084 3, a second 084 file then set 084 done · **saw:** full suite: tests 913, pass 890, fail 0, skipped 23, the module layer tests included; decide refused for want of --quote; the log reads '084 field Priority · 3 · was 1'; set 084 done refused naming both 084 files
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 913, pass 890, fail 0, skipped 23 (merge 2236405 on release/6.2.1)

