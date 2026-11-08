# 196 · Jarl: the diff parser names no file when diff.noprefix or diff.srcPrefix is set, and a linked worktree whose path holds a line break is not seen as linked

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-163-opus-i1
**Where:** lib/rounds.mjs headerPath; lib/repositories.mjs mainCheckoutOf
**Branch:** jarl/194-small-views-and-refusals
**Merged:** 89bb93b2265908ce93dbd1eabf6a7790c7289770 in ../../../JarlSkill
**CI:** none

## What
A user git setting diff.noprefix, diff.srcPrefix or diff.dstPrefix makes the diff parser name no file in the marker and large-file notes. A linked worktree whose path holds a line break is not seen as linked, so new files there instead of refusing.

## Why
A note should name the file whatever the user's git settings, and a refusal should not depend on the shape of a path.

## Acceptance
The git commands that feed the parser are run with the prefix settings forced to their defaults, and mainCheckoutOf reads linked worktrees without splitting on line breaks; a test per case

## Changelog
- Fixed: A working copy whose folder path holds a line break is now known for what it is. Filing an issue from a second working copy of a loop is refused there too, as everywhere else, instead of filing into a copy that may be behind.

## Evidence

- **ran:** node --test --test-name-pattern='whatever prefixes' tests/added-content-notes.test.mjs (repository config diff.noprefix true, on b3104b1's code) · **saw:** 1 fail: the conflict-marker notes named file null instead of a.txt
- **ran:** node --test --test-name-pattern='whatever prefixes' tests/added-content-notes.test.mjs (at 7ef3e68; noprefix, srcPrefix and dstPrefix, mnemonicPrefix, noprefix with dstPrefix) · **saw:** 1 pass: every case names a.txt:2, :4 and :6; the large-file note did not reproduce: git diff --raw -z writes no prefix, so it named its file under every setting
- **ran:** node --test --test-name-pattern='hold a line break are read whole' tests/repositories.test.mjs (on b3104b1's code) · **saw:** 1 fail: a main checkout named with a line break: new from its linked worktree exited 0 and printed 'filed 2 · …/hub-worktree/.jarl/issues/2-from-the-worktree.md'; a worktree named with a line break: copies listed the main checkout twice
- **ran:** node --test tests/repositories.test.mjs tests/added-content-notes.test.mjs tests/merge-cleanup.test.mjs tests/lease-holds.test.mjs tests/in-place.test.mjs tests/liveness.test.mjs (at 7ef3e68) · **saw:** all pass, 0 fail: the three line-break cases refuse new with 'is a linked worktree of …, which holds this loop' and read main, linked and both copies whole
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, decisions --live, report, sources, branches, models, profile, verify, goal, status and resume --as jarl, and show, show --full, brief and brief --role reviewer of each of the 205 issues), text and --json, base b3104b1 against tip 59132f7 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1680 calls, 1676 identical; the 4 others (resume, status and both --as jarl, in --json) differ only in ageMs; closedGate holds only 028
- **ran:** git merge --no-ff jarl/194-small-views-and-refusals into release/6.2.1 (two conflicts kept both sides); cd skills/jarl/scripts && node tests/suite.mjs on the merge 89bb93b2265908ce93dbd1eabf6a7790c7289770 · **saw:** 1685 tests, 1663 pass, 0 fail, 22 skipped

