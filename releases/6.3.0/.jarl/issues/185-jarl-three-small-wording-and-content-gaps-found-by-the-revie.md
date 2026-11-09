# 185 · Jarl: three small wording and content gaps found by the review of group F

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261106T2152-dwba
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-082-opus-f
**Where:** lib/rounds.mjs cmdRound; references/repositories.md; references/composers.md
**Branch:** jarl/122-wording-and-canon
**Merged:** d65727c039b363b868994b0278112710367f6805 in ../../../JarlSkill
**CI:** none

## What
(1) The takeover block printed by round quotes the issue's log lines whole, including the worktree paths of the machine that wrote them. (2) references/repositories.md still says a takeover after three rounds is a handover too. (3) The new composers.md row says a takeover block shows a dash for a round recorded through the library, but the findings line only appears when some round has a count.

## Why
A block read by a worker should carry no machine path, and the references should say what the output does.

## Acceptance
The takeover block holds no worktree path, the repositories reference follows the limit setting, the composers row says when the dash appears, with a test for the block

## Changelog
- Fixed: The advice given to a worker who takes a task over no longer lists the folder on another machine where the earlier worker had its working copy.

## Evidence

- **ran (history):** node --test --test-name-pattern "takeover block quotes" tests/models.test.mjs without the change (red), then with it (green) · **saw:** red: 1 fail, the block holds the paths of two other machines (a POSIX and a Windows one); green: 1 pass, the block keeps each move line up to the lease field before the worktree, a reason that says the word worktree is kept, and the record's own log is unchanged
- **ran (history):** node --test tests/docs-true.test.mjs tests/library-parity.test.mjs tests/models.test.mjs · **saw:** pass; the repositories reference says a takeover comes after as many red rounds as the goal's limit allows (three unless it says otherwise), and the composers row and its twin in the parity list say the dash appears when another round of the issue has a count and that no findings line is printed when none has
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on the branch tip · **saw:** tests 1557, pass 1535, fail 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1571, pass 1549, fail 0, skipped 22, merge d65727c

