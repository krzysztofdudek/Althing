# 227 · Jarl 6.3.0, piece 3: the removals: format machinery, composer mode, older readers

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 226
**Found by:** jarl
**Where:**
**Branch:** jarl/227-removals
**Merged:** 10aaa920289cd87b8dd07181ceaf094ed7ec57b6 in ../../../JarlSkill
**CI:** none

## What
section 12's removals in code, and the refusal of section 3. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 3.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [test] a loop whose `goal.md` holds no `Format: 4` line, or another number, is refused on every command, before anything else, and the refusal names `references/converting-from-6-2.md`
- [test] `init` writes the line, and no command changes it
- [test] a lease without a worker's name is refused, ending with the form
- [test] every write at the command line and through MCP without `--by`, and a lease or verdict without `--model`, is refused, ending with the form; the library takes the writer it is given
- [check] nothing in `skills/jarl/scripts` matches `needFormat`, `needRaisable` or `FORMAT_LINES` · by: `grep -rEl "needFormat|needRaisable|FORMAT_LINES" skills/jarl/scripts` prints nothing
- [check] the frozen older readers and the tests about them are gone · by: `ls skills/jarl/scripts/tests/fixtures | grep -E "^jarl-6\." ; grep -rl "old-jarl" skills/jarl/scripts/tests` prints nothing
- [test] the log reader reads only the current shape of each line, a writer of `unrecorded` and a history row included; a line of an older shape is named by `verify`; an issue closed before a `converted` line is not re-read against the gate
- [check] composer mode is gone from the code · by: `grep -rEil "external.scheduler|composer" skills/jarl/scripts/lib skills/jarl/scripts/*.mjs` prints nothing
- [test] `record.mjs` holds one contract, `jarl-record/4`, with the older tables gone, and its contract test holds that one
- [test] the `identical-output` tag has no effect, and `compare` does its work
- [test] the four-issue cut of review units and the package size are gone: a lease is one unit, whatever it carries
- [test] the reviewer's re-run rule by tier is gone
- [test] the "grew after the lease" mark is gone: the whole old text kept in the log does its work
- [check] the full suite passes on the merged result
- [read] an independent examiner: what went is what section 12 says went, and nothing else

## Changelog
- Changed: A loop now states which version of Jarl's record it is in, on a line of its goal, and a loop in any other version is refused by every command, with the file that explains how an agent converts it. Every write names who made it, and every lease and review also names the model it ran on. Removed: Jarl reads only the current record. Support for older records, for loops scheduled by another tool, for the identical-output tag (replaced by a line that compares the output before and after) and for the limit of four tasks to one shared review is gone.

## Evidence

- **ran:** line 1: node --test skills/jarl/scripts/tests/record-format.test.mjs (before the change) · **saw:** pass 0, fail 14
- **ran:** lines 1-2: node --test skills/jarl/scripts/tests/record-format.test.mjs · **saw:** pass 14, fail 0
- **ran:** lines 3-4: node --test skills/jarl/scripts/tests/required-names.test.mjs · **saw:** green, in the run of the six proof files: pass 73, fail 0
- **ran:** line 5: grep -rEl 'needFormat|needRaisable|FORMAT_LINES' skills/jarl/scripts · **saw:** prints nothing
- **ran:** line 6: ls skills/jarl/scripts/tests/fixtures | grep -E '^jarl-6.' ; grep -rl old-jarl skills/jarl/scripts/tests · **saw:** prints nothing
- **ran:** line 7: node --test skills/jarl/scripts/tests/log-reader.test.mjs · **saw:** green; a real defect found by it fixed (the converted line was never placed)
- **ran:** line 8: grep -rEil 'external.scheduler|composer' skills/jarl/scripts/lib skills/jarl/scripts/*.mjs · **saw:** prints nothing
- **ran:** line 9: node --test skills/jarl/scripts/tests/record-contract.test.mjs · **saw:** jarl-record/4 alone, green
- **ran:** lines 10-13: node --test skills/jarl/scripts/tests/gone-rules.test.mjs skills/jarl/scripts/tests/review-units.test.mjs · **saw:** green
- **ran:** line 14: cd skills/jarl/scripts && node tests/suite.mjs · **saw:** RED: pass 1478, fail 181 of 1681; NOT MET, the worker stops here

Assumed: a bot's verdict and the owner's own verdict name no model; every other verdict does. A library call that names no writer writes by unrecorded; a lease needs a worker on the library too. --by unrecorded is refused. A history row is '(history)' in the log and '**ran (history):**' in the file. profile.json loses its format key, a marker-only file is deleted, in the conversion. A log note 'converted' is refused. Archived loops of an older shape are read as they fall: their lines are not placed, nothing refuses.
- **ran:** line 14: cd skills/jarl/scripts && node tests/suite.mjs (at eb5575e) · **saw:** GREEN: tests 1676, pass 1654, fail 0, skipped 22; exit 0, nothing left in its empty temporary directory; this replaces the RED row above

Assumed: a lease written by jarl shows no 'leased by' unless the goal names coordinators. No acceptance line requires it. Every lease now names its writer, so the rule of before would print 'leased by jarl' on every in-flight line of an ordinary one-director loop; with this rule that loop's output does not change, a loop with coordinators or a lease by another writer still shows it. The owner may ask to change it.
- **ran:** line 14: cd skills/jarl/scripts && node tests/suite.mjs (at 9a269ec, after the changes round) · **saw:** GREEN: tests 1685, pass 1663, fail 0, skipped 22; exit 0

Assumed: a printed write holds --by with the holder of its row where next names one, the worker on a row of the worker's, the goal's merger in the merger's brief, and the placeholder elsewhere; a wait's row keeps the placeholder, since the outside person does not run it.
- **ran:** line 14: cd skills/jarl/scripts && node tests/suite.mjs (at 34e0ea6, after round 2) · **saw:** GREEN: tests 1690, pass 1668, fail 0, skipped 22; exit 0
- **ran:** git merge --no-ff jarl/227-removals into release/6.2.1 at 10aaa920289cd87b8dd07181ceaf094ed7ec57b6; git rev-parse of both trees; the examiner's node tests/suite.mjs on a clean extraction of 34e0ea6 · **saw:** the merge's tree is the tip's tree; 1690 tests, 1668 pass, 0 fail, 22 skipped

