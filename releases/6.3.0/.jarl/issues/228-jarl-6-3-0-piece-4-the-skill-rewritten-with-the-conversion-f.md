# 228 · Jarl 6.3.0, piece 4: the skill rewritten, with the conversion file

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 227
**Found by:** jarl
**Where:**
**Branch:** jarl/228-skill
**Worker:** w-jarl-228-opus
**Worktree:** /home/me/Worktrees/JarlSkill/228-skill
**Since:** 2026-11-09 02:16

## What
section 13, and the file named by piece 3's refusal. The specification is releases/6.3.0/plans/jarl-6-3-0-design.md and releases/6.3.0/plans/jarl-6-3-0-work.md, piece 4.

## Why
The owner accepted the design as the shape of 6.3.0 (a-024, narrowed by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost).

## Acceptance
- [read] before any part over 200 words leaves the skill, its history is read and the real failure it was the lesson of is named, added to `releases/6.3.0/plans/skill-lessons-kept.md` with where it now lives
- [read] `SKILL.md` and a director's reference hold what section 13 says a director reads, and a raised agent is told it needs only its brief
- [read] `skills/jarl/references/converting-from-6-2.md` describes, shape by shape, what a 6.2.0 loop holds and what each becomes, including what this loop holds as a driver older than 6.2.0 wrote it: keys generated, `unrecorded` writers, history rows, the `converted` line, the `Format: 4` line, and `Check (JarlSkill):` style lines; an agent can convert a loop from it alone
- [check] the word budgets per role hold by a test: worker, examiner, merger and director as section 13 gives them
- [check] the words of section 13 are gone · by: the budget test counts the 088 set at no more than 5,000 words
- [read] one director's reference says each thing once: shapes (209), committing early, same or fresh worker, when to add a slice (218), first moves (219), the sentence on a dead merger (220), the recipe for restarting a dead director
- [read] section 12 of the design has its home as a maintainer's document no agent reads
- [read] the help and the skill agree, the top-level help prints less than today (149), and the refusal and help texts of 221 and 222 say what the tool does
- [read] "What Jarl will not grow" gives each exclusion its own reason and names no absent tool
- [check] the full suite passes on the merged result
- [read] an independent examiner: an agent given only the rewritten skill can direct a loop, and no lesson was lost

## Changelog
- Changed: Jarl reads one record format and refuses a loop in any other, naming the file an agent follows to convert it. A raised worker, examiner or merger reads only the brief the tool prints, and --help prints a short list.

## Evidence

- **ran:** line 1: git log -S on each part over 200 words of SKILL.md and the references, read commit by commit · **saw:** 26 parts named with the failure each was the lesson of, or that none is recorded, in releases/6.3.0/plans/skill-lessons-kept.md, each with where it lives now
- **ran:** line 3: converted a copy of releases/6.3.0/.jarl by a script written from references/converting-from-6-2.md alone, then verify --root on the copy · **saw:** verify: clean — every line of the record is placed; issues 231, rulings 83, questions 29, evidence rows 1235, log lines 2906 and 1 converted line, as before; status and resume read it
- **ran:** line 4: node --test tests/word-budget.test.mjs (red with SKILL.md at the release branch) · **saw:** not ok: SKILL.md stays within its budget of 1200 words; the director set; the role references; fail 3
- **ran:** line 4: node --test tests/word-budget.test.mjs at the branch tip · **saw:** pass 6, fail 0; SKILL.md 1147, jarl.md 2291, repositories.md 1069, models.md 789, composers.md 299; briefs capped by moves-briefs.test.mjs
- **ran:** line 5: the budget test's director set, wc -w of SKILL.md, jarl.md and composers.md · **saw:** 3737 words, under 5000; worker.md, reviewer.md and merger.md are gone
- **ran:** line 8 (221): node --test tests/in-place.test.mjs with done-gate.mjs as on the release branch, then at the tip · **saw:** red: not ok, a declared path written from the loop's folder; green: pass 12, the refusal names the top of the repository and ends with the Files form; 222 needed no change, the decide help already names the spellings the check reads
- **ran:** line 8: node jarl.mjs --help | wc -c, before and after; node jarl.mjs set --help · **saw:** more than 65 KB before, 4.6 KB after, ending with the section on parallel workers; set --help prints that command's block alone
- **ran:** line 10: cd skills/jarl/scripts && node tests/suite.mjs at the branch tip · **saw:** tests 1700, pass 1678, fail 0, skipped 22
- **ran:** line 8: node jarl.mjs --help | wc -c at the tip, correcting the row above · **saw:** 5060 bytes
- **ran:** round: node --test on the seven new tests before the fixes of 83e34ea · **saw:** not ok 7 of 7: read lines ask no row, the examiner's note, the merger's checkout, the integration worktree, push and lock files, the closed-before-conversion approve, the lone agent
- **ran:** round: cd skills/jarl/scripts && node tests/suite.mjs at 8662c7f · **saw:** tests 1707, pass 1685, fail 0, skipped 22
- **ran:** round: converted a copy of releases/6.2.0/.jarl by the file alone, then verify --root and status · **saw:** verify clean, exit 0 once the citations of superseded rulings were rewritten; done reviewed by: fresh 290, coordinator 4, self 0, as the driver reads the original
- **ran:** round 2: node --test on the four new tests before the fixes of ce25143 · **saw:** not ok 4 of 4: a citation carried over by a conversion, resume and status on a read-only lease, a worker's list, the owner's tick with no row
- **ran:** round 2: converted copies of releases/6.2.0/.jarl and releases/6.3.0/.jarl by the file alone, no issue text rewritten, verify --root on each · **saw:** both clean, exit 0; the 6.2.0 copy prints its three citations as notes
- **ran:** round 2: cd skills/jarl/scripts && node tests/suite.mjs at the branch tip · **saw:** tests 1711, pass 1689, fail 0, skipped 22

