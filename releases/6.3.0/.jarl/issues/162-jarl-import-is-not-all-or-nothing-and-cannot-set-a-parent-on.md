# 162 · Jarl: import is not all-or-nothing, and cannot set a parent on the issues it files

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261105T1153-duqb
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-044b-opus
**Where:** Review of 044 (rev-jarl-044b-opus), Outside the issue
**Branch:** jarl/094-import-and-files
**Merged:** 8bd98ee27c71e3b1c301218d570e7ecf6e24b624 in ../../../JarlSkill
**CI:** none

## What
(1) A refusal on a later finding leaves the earlier findings filed and exits 1 (the cmdImport loop in lib/import.mjs); it was so before issue 044. (2) import cannot set Parent on the issues it files: --field Parent=<id> is refused in a loop without a profile ('declares no fields'), so the changelog's 'file them under one parent task' takes one field <id> Parent <p> per issue afterwards.

## Why
A findings file is one act; a half-filed result is hard to repair, and a tree is the way external requirements are held (issue 078).

## Acceptance
import checks every finding against the filing rules before the first write and refuses the whole file with a form when one fails, and a --parent <id> option (one meaning, in the flag table) files every issue under that parent; tests for both

## Changelog
- Added: Importing research findings can put every task it files under one parent task with --parent <id>, so a set of outside requirements is filed as a tree in one call. A findings file is also refused whole when one finding cannot be filed.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/import-whole-file.test.mjs tests/import-parent.test.mjs (red: the branch before the changes, tests added) · **saw:** whole-file: tests 3 · pass 1 · fail 2 (the bad finding is refused only after the ones before it were filed); parent: tests 6 · pass 1 · fail 5 (--parent is an unknown flag)
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-whole-file.test.mjs tests/import-parent.test.mjs (green, branch jarl/094-import-and-files) · **saw:** whole-file: tests 3 · pass 3 · fail 0 (bad finding first, middle, last; the form ends the refusal; a dry run refuses the same); parent: tests 6 · pass 6 · fail 0 (filed under the parent with a log line each, shown in the text and the dry run, refused for an unknown, finished or non-numeric parent, for a loop that stays at its format, for a profile with its own Parent field, and with a refused finding nothing is filed)
- **ran (history):** import <two findings> --source scn --parent 162 on a copy of the 6.3.0 loop, then show 178 · **saw:** scn: 2 finding(s) · filed 2 · already filed 0 · under 162; show 178 prints Parent: 162; the log has one 'field Parent · 162 · was (none)' line per issue; --parent 9999 is refused with the form jarl.mjs import <findings.json> --source <report-dir> --parent <id>
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1414 · pass 1392 · fail 0 · skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-whole-file.test.mjs (red: the new tests on 4eeb02e, the round-1 tip) · **saw:** tests 7 · pass 4 · fail 3: each of --field Area=nowhere, --field Colour=red and --field Area is blamed on finding "finding-1" and ends with jarl.mjs import "<findings.json>" --dry-run, dropping the flag; the right --field with a refused finding still names the finding (passes)
- **ran (history):** cd skills/jarl/scripts && node --test tests/import-whole-file.test.mjs (green, fa6c85d) · **saw:** tests 7 · pass 7 · fail 0: one test per wrong --field call (a value outside the enum, an undeclared field, a pair without =) pins the reason naming the pair, no finding blamed, and the form jarl.mjs import "<findings.json>" --source "<report-dir>" --field "<name=value>", a dry run alike; a finding whose own text is refused is still named with the right --field, and a finding key named Area is let through as an extra key, not read as the field
- **ran (history):** import findings.json --source ext/r --field Area=nowhere, then Colour=red, then Area, on a scratch loop whose profile declares Area (core, cli), with the Jarl of 9d95346 (base), of 4eeb02e and of the fixed tip · **saw:** 9d95346 and the fixed tip print the same three refusals: Area must be one of: core, cli (got "nowhere") / Colour is not a field this loop's profile declares — it declares Area (got "Colour=red") / --field takes <name>=<value> (got "Area"), each ending jarl.mjs import "<findings.json>" --source "<report-dir>" --field "<name=value>"; 4eeb02e printed finding "finding-1" cannot be filed: … — nothing was filed, ending jarl.mjs import "<findings.json>" --dry-run
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip ec118b9) · **saw:** tests 1420 · pass 1398 · fail 0 · skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on two import lines and one flag-list sentence, resolved by keeping both sides, then a follow-up commit added the parent flag to the import entry · **saw:** tests 1442, pass 1420, fail 0, skipped 22, tip 8bd98ee

