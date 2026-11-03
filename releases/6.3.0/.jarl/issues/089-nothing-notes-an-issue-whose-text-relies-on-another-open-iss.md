# 089 · Jarl: verify and new note an issue whose text names another open issue that is neither in its After chain nor done

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#process-after-gaps
**Where:** JarlSkill/skills/jarl/scripts/lib/verify.mjs at 71ebc5b (verify)
**Branch:** jarl/089-named-open-issue-note
**Worker:** w-jarl-089-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-089
**Since:** 2026-11-03 12:44

## What
Claim: Laying out the model as issues, three fresh reviews in a row each found one more acceptance line that needed a command or kind another issue adds while nothing ordered the two, and a takeover's line-by-line check then found seven more (materials/after-check.md). Most of those lines name the other issue by number.

Issue 035 of the 6.3.0 loop: reviews rev-035-opus, rev-035b-opus, rev-035c-opus and the takeover commit c1afa59.

## Why


An order written by hand drifts from what the text relies on; in this loop three fresh reviews and a takeover found ten such gaps one by one.

## Acceptance
- verify lists each open issue whose What, Why or Acceptance names another open issue of the loop by its number when that issue is neither in its After chain (transitively) nor done or dropped, naming both
- new and body print the same note at the moment the text is written
- Tests; red at 71ebc5b, where verify is clean on such a pair

## Changelog
- Added: When the text of an open issue mentions another unfinished issue by number and nothing orders the two, filing or editing that text and checking the record now print a note naming both, so you can say which comes first. The note changes nothing and never stops anything.

## Evidence

Title set by hand after import to the loop's Jarl: form; the driver has no title command yet (029 in flight).
- **ran:** node --test tests/unordered-names.test.mjs (lib files at the release branch tip, new test in place) · **saw:** red: 4 of 6 fail (idsCited is not a function; verify, new and body print no note); the 2 negative cases pass
- **ran:** node --test tests/unordered-names.test.mjs (with the change) · **saw:** green: 6 of 6 pass, covering shas, dates, versions, line numbers, ranges and hyphenated names as non-matches
- **ran:** jarl.mjs verify --root <copy of the 6.3.0 loop under ~/Temp>, driver Jarl then this branch · **saw:** driver: no note about an unordered naming; branch: 5 notes (039 names 016, 040 names 007, 049 names 004, 059 names 039, 078 names 058), exit status unchanged
- **ran:** npm test in skills/jarl/scripts at 0265d97 · **saw:** 919 tests, 896 pass, 0 fail, 23 skipped
- **ran:** node --test tests/unordered-names.test.mjs against the previous commit's lib/ids.mjs, with the tightened tests · **saw:** red: 4 of 8 fail (amounts such as lines, characters, bytes and an exit status read as issues; real-text sentences)
- **ran:** node --test tests/unordered-names.test.mjs with the tightened rule · **saw:** green: 9 of 9 pass, including a 1200-issue After chain
- **ran:** jarl.mjs verify --root <fresh copy of the 6.3.0 loop under ~/Temp>, this branch · **saw:** 4 notes: 040 names 007, 049 names 004, 059 names 039, 097 names 084; exit status unchanged
- **ran:** npm test in skills/jarl/scripts at the branch tip · **saw:** 922 tests, 899 pass, 0 fail, 23 skipped
- **ran:** node --test tests/unordered-names.test.mjs against the previous tip's lib/ids.mjs and lib/commands.mjs · **saw:** red: 2 of 9 fail (a bracket thousands group read as issues; the new and body note prefix differs from verify)
- **ran:** node --test tests/unordered-names.test.mjs with the fix; npm test in skills/jarl/scripts · **saw:** green: 9 of 9; full suite 922 tests, 899 pass, 0 fail, 23 skipped
- **ran:** timing of the check on 2400 synthetic issues in one After chain, each citing the one before (scratch script under ~/Temp) · **saw:** 35 ms; 2653 ms with every chain kept

