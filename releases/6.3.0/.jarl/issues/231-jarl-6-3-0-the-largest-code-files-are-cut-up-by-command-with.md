# 231 · Jarl 6.3.0: the largest code files are cut up by command, with no change of behaviour

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 225
**Found by:** owner
**Where:** skills/jarl/scripts/lib/commands.mjs (2306 lines), skills/jarl/scripts/jarl.mjs (1682 lines)
**Branch:** jarl/231-cut
**Merged:** dd82745642b4a5f59a4aaa5ed97d0accf24b279a in ../../../JarlSkill
**CI:** none

## What
Workers spend about half of their commands finding where things are, and the largest file was touched by 76 commits in one week, so merges collide there. Cut the largest files into smaller modules, each named for what it holds, moving code only.

## Why
The owner asked for it on 2026-11-08, to make the workers' work on the release faster; done between piece 1 and piece 2 because piece 1 is changing these files now.

## Acceptance
- [compare] every read view of a copy of this loop is unchanged, text and --json · by: the comparison of views the release workers use, base against tip
- [check] the full suite passes on the merged result
- [check] no file under skills/jarl/scripts/lib holds more than 800 lines · by: wc -l on the files of skills/jarl/scripts/lib
- [read] an independent examiner: the change moves code and nothing else, and the exports of record.mjs are the same

## Evidence

- **ran:** every read view of a copy of the 6.3.0 loop (status, resume, next, next --all, next --as jarl, next --as owner, list, list --all, decisions, report, verify, models, branches, profile; show and brief for 20 issues, show --full and --at-lease for 5), text and --json, run with the code at 2db9bca and with the branch tip, then diff -r of the two outputs · **saw:** 168 outputs each; identical except the ageMs fields in resume.json and status.json (2 files differ, only elapsed-time values)
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs at the branch tip · **saw:** tests 1753, pass 1731, fail 0, skipped 22
- **ran:** wc -l skills/jarl/scripts/lib/*.mjs · **saw:** largest file lib/evidence.mjs 797 lines, none over 800 (commands.mjs 2280 and loop.mjs 845 are cut into 16 and 3 new modules plus a smaller loop.mjs; jarl.mjs 1682 -> 1059 by moving its usage text to jarl-usage.mjs)
- **ran:** diff of the sorted non-import lines of the old commands.mjs and loop.mjs against the new modules · **saw:** same lines; only added: export keywords, module header comments; dropped: two comments on dissolved export lists
- **ran:** git merge --no-ff jarl/231-cut into release/6.2.1 at dd82745642b4a5f59a4aaa5ed97d0accf24b279a; git rev-parse of both trees; the examiner's comparison of 324 views and node tests/suite.mjs on a clean extraction of 04073f6 · **saw:** the merge's tree is the tip's tree; views identical except ageMs; 1753 tests, 1731 pass, 0 fail, 22 skipped

