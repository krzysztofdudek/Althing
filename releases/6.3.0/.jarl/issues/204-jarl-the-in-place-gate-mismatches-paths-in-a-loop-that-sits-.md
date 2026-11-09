# 204 · Jarl: the in-place gate mismatches paths in a loop that sits in a subdirectory of its repository, a declared symlink can never close, and the gate reads the hook's git variables

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261108T1310-taym
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-023-opus-l1b
**Where:** lib/commands.mjs inPlaceRefusal and touches; lib/git.mjs git versus gitHere
**Branch:** jarl/203-range-extend-inplace
**Merged:** 0556c16208c09ce0faf295bce31a279416239fdb in ../../../JarlSkill
**CI:** none

## What
(1) In a loop that sits in a subdirectory of its repository (as Althing's loops do) the in-place gate matches a declared path by equality or by ending against paths relative to the top of the repository: an unrelated uncommitted other/docs/a.md blocks done for docs/a.md, and a commit that changed only other/docs/a.md closes the issue though its own file was never touched. (2) A declared file that is a symlink can never close an in-place issue. (3) The gate uses git(), which keeps a hook's GIT_DIR and related variables, rather than gitHere. (4) Every --by write of this Jarl raises a format-1 loop to 3, after which the pinned 6.1.0 driver refuses it: the coordinator must not run this Jarl with --by on the real loop before the family driver moves.

## Why
The gate must test the issue's own file in the repository's own terms.

## Acceptance
The gate compares paths relative to the top of the repository, a symlink is resolved or refused with a form, the gate runs git without a hook's variables, and item 4 is said once in the release notes; a test for each of the first three

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/in-place.test.mjs, the test file of 11218ca on the code of the release branch at b3104b1, TMPDIR from mktemp -d · **saw:** red: tests 11, pass 6, fail 5 — in a loop in a subdirectory of its repository a commit of other/docs/a.md and of docs/a.md at the top closed the issue on loop/docs/a.md, and an uncommitted other/docs/a.md held it back; a declared path with letters beyond ASCII never closed (git quoted it); an edit through a declared symlink was never seen and its commit never closed it; with a hook's GIT_DIR and GIT_INDEX_FILE set, done read the other repository and refused a committed file
- **ran (history):** cd skills/jarl/scripts && node --test tests/in-place.test.mjs, at 11218ca · **saw:** green: tests 11, pass 11, fail 0 — a declared path is read from the loop root (or the checkout its Repo names) and compared whole from the top of the repository: a file with the same tail elsewhere neither holds done back nor closes it, the own file uncommitted is named loop/docs/a.md; a non-ASCII path closes; a symlink is followed (the edit of its target holds it back, the commit of the target closes it) and one that leads out of the repository is refused ending with jarl.mjs field "<ids>" Files "<paths>"; done closes with a hook's GIT_DIR set
- **ran (history):** the in-place scenario table of the round-2 review of 021 (27 scenarios: tag after a Branch, lease with --branch and with --worktree, a second issue on one file, a commit on another branch, of another file, in another repository, before an amend, a merge commit, reopen with the old row and with a proofread row, a retracted row, an old commit with the edit uncommitted, history rewritten, paths with spaces, untracked, staged, deleted, a committed deletion, a commit in the minute of the lease, a Repo checkout dirty, committed, reached through a symlink, Files with the Repo name, a declared directory), base b3104b1 against 11218ca on scratch loops · **saw:** 26 of 27 the same (every refusal and every close as before); one differs: a path with letters beyond ASCII, committed, was refused at base and closes at the tip
- **ran (history):** grep of the Unreleased section of CHANGELOG.md for the format raise of a named write (item 4) · **saw:** already said once: 'Every command that records work can now say who did it ... The first named entry moves the loop to format 3.'; the known-limitations list says the pinned first driver then refuses the loop (from the review of 016); no new text written
- **ran (history):** every read view (status, resume, report, report --metrics, list, list --all, next, next --all, next --as jarl and owner, verify, decisions, decisions --live, models, branches, goal, profile, sources; show, show --json and brief of each of the 205 issues; show --full and the reviewer's brief of the last 20), text and --json, base b3104b1 against cb00e5e on a copy of the 6.3.0 loop with its repositories linked, ages masked · **saw:** 686 views, each run with both: 1 differs, report --json, whose 205 issue rows each gain parent: null (no issue of the loop has a parent), as list and show already give it; closedGate is 028 alone in both; the copy is unchanged by the views
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 2b7c932 (release/6.2.1 at f3d0963 merged), TMPDIR from mktemp -d; then node --test tests/queue-views.test.mjs at efcdc93 · **saw:** tests 1686, pass 1663, fail 1, skipped 22 (the record contract test included): the one failure was tests/queue-views.test.mjs, whose exact report row lacked the parent key report --json now carries; the row is expected with parent: null at efcdc93, and that file passes, tests 7, pass 7, fail 0

Ruling in-place-paths-read-from-the-repository-top: A path an in-place issue declares in Files is read from the top of the repository its Repo names (or of the loop's own repository when it names none), the same base scope reads, so loops kept in a subdirectory that already write research/... or method/... from the top keep closing as before. A path written relative to the loop's own folder is not read as a second base. Issue 204 carries the change; the gate, scope and references/jarl.md read the one base.
- **ran (history):** cd skills/jarl/scripts && node --test tests/in-place.test.mjs, the test file of a68dd4d on the code of efcdc93 (the reviewed tip) · **saw:** red: tests 12, pass 9, fail 3 — in a loop at releases/9.9.9 with Files method/environment.md written from the top, a commit of releases/9.9.9/method/environment.md closed the issue, an uncommitted edit of method/environment.md at the top did not hold it back, and ../outside.md was read from the loop folder, so not refused
- **ran (history):** cd skills/jarl/scripts && node --test tests/in-place.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs tests/modules.test.mjs, at a68dd4d · **saw:** green: tests 86, pass 86, fail 0 — a declared path is read from the top of its repository (ruling in-place-paths-read-from-the-repository-top): the commit of method/environment.md closes, its uncommitted edit holds the issue back and is named method/environment.md, files with the same tail under the loop folder or in other/ neither close nor hold it; ../outside.md lies outside its repository and ends with jarl.mjs field "<ids>" Files "<paths>"; symlink, hook variables and non-ASCII tests pass as before
- **ran (history):** the in-place scenario table of 021 (27 scenarios) plus the reviewer's two loop-in-a-subdirectory scenarios, on b3104b1, on efcdc93 and on a68dd4d, scratch loops · **saw:** base against a68dd4d: the same in every scenario but one (a non-ASCII path, committed, refused at base, closes now) and two stamps of the minute; the subdirectory loop with Files from the top closes on the commit and is held back by the uncommitted edit, as at base; efcdc93 refused both, a68dd4d gives them back
- **ran (history):** merged jarl/203-range-extend-inplace into release/6.2.1 (one conflict in references/commands.md, status row of 195 and report row of 158 kept); suite on the merge in skills/jarl/scripts · **saw:** see the suite row of the merge
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merge 0556c16208c09ce0faf295bce31a279416239fdb of jarl/203-range-extend-inplace into release/6.2.1 · **saw:** 1699 tests, 1677 pass, 0 fail, 22 skipped

Ruling ask-023 (ratify, by owner): yes: Krzysztof, 2026-11-09 (translated from Polish): I ratify everything.

