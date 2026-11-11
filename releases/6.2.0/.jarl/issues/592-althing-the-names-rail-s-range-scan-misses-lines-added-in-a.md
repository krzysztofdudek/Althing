# 592 · Althing: the names rail's range scan misses lines added in a merge commit, a name split across an old and an added line, and author e-mails, and passes an unreadable range as 0 commits

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261111T1421-uzsy
**Tags:** althing, rails, names, security
**Files:** Althing/rails
**Repo:** Althing
**Found by:** jarl
**Where:** w-363-fable, issue 363
**After:** 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
Althing's pre-push gate is the last check before its commits go public; each gap is a way a private name leaves without being seen, and an unreadable range that reads as clean is a false green.

## Acceptance
[test] A fixture with a planted test-list word in a merge commit's added lines, split across an old and an added line, and in an author e-mail is refused with the commit and file, and an unreadable range is an error, not 0 commits · by: yg check && npm test

## Evidence

### Proof

- **ran (line 9fba42f24c17):** node --test rails/test/run.test.mjs (a git archive export of df39a35, the code before the fix, with the file's 13 tests as they stand at 31111f2) · **saw:** tests 13, fail 11, pass 2: among the failing a name or a secret a merge adds, a name split over an old line and an added one, a name in an author e-mail or a committer name, a range that cannot be read (answered as 0 commits, clean); the 2 passing are the tests of 602 and 608
- **ran (line 9fba42f24c17):** node --test rails/test/names.test.mjs workspace/test/names-range.test.mjs (a git archive export of df39a35 with the two test files of 59e2290) · **saw:** tests 46, fail 4, pass 42: the window that carries its last line, the two expected values that gained it, and the names-range test of a removed line, a line of punctuation and a line added after a public name
- **ran (line 9fba42f24c17):** node --test rails/test/*.test.mjs workspace/test/names-range.test.mjs (the tree of 83df69c, the fix) · **saw:** tests 115, pass 114, fail 0, todo 1 (rails/english.mjs through a link, a-35): a merge's own name and secret refused at the merge with the file and the line, a split name refused in the staged lines and in a pushed commit, an author e-mail and a committer name refused with the commit, an unreadable range exit 2 with one line and never clean
- **ran (line 9fba42f24c17):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at 9b15fcf, the worktree clean); timeout 300 yg check --no-approve · **saw:** tests 190, pass 178, fail 0, skipped 11, todo 1; yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified
- **ran (line 9fba42f24c17):** node --test rails/test/run.test.mjs (the code of 9b15fcf with the test file of 5beed75, then the tree of c46972a) · **saw:** before: tests 17, fail 3: the English rail and the message rail print a word of a test entry written with a Polish letter, in a commit message, a file's line and a tag's message; at c46972a: tests 17, pass 17, each such refusal stands with its place and without its words
- **ran (line 9fba42f24c17):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at c46972a, the branch's head, the worktree clean); timeout 300 yg check --no-approve · **saw:** tests 191, pass 179, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, a-35); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified
- **ran (line 9fba42f24c17):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at c72089e, the branch's head, the worktree clean); timeout 300 yg check --no-approve · **saw:** tests 196, pass 184, fail 0, skipped 11, todo 1; yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified

### Notes

Assumed: only the reading is shared with the names range. Althing's own range keeps its way of choosing commits (those the pushed commit reaches and the remote commit git names does not; the whole history when that commit is not here or the ref is new) and does not ask the remote. An unreadable range ends with exit code 2, and an empty push says it has nothing to scan and exits 0, as the names range does.

Assumed: a name counts by the lines its words stand on, in both scans: when one of them is added, or when lines were removed between two of them. This closes the two known limits of the names range (a removed line, a line of punctuation) and its false red on a line added after a public two-word name. The proper-noun glance of pre-commit leaves out lines a refusal covers, and a path or a pushed ref that carries a name is not printed by any rail.

Found outside the twelve issues, for filing (w-592-fable): (1) rails/messages.mjs drops every line of a message that begins with # before it reads it, in a range too, so a private URL or a local path on such a line of a committed message passes the message rail (the names rail reads the whole text). (2) A pushed new ref (a tag, a new branch) makes Althing's own pre-push read the whole history of the pushed commit: about 1,500 commits here at about 1.25 s each, because the 2.3 MB loop log is scanned whole for every commit that touches it (42 commits took 52 s with the old code and with the new); a tag push to Althing would wait about half an hour, and the nightly history scan costs the same. The names range asks the remote what it has instead. (3) A text file in an encoding other than UTF-8 is read as UTF-8, so a name with a non-ASCII letter in it can pass; only a commit's and a tag's own text is refused when it is not UTF-8. (4) What a signature's bytes hold (an X.509 certificate's subject, an OpenPGP signer's user id) is not read. (5) The rail code/read-only-to-tools misses a tag made in the call shapes 613 names for a push (options before the name in an array, the name handed to a helper). (6) yg check prints the word the rule lang/english refuses, at pre-commit and in CI, so a listed name written with a Polish letter is printed there; that rule has no key to know it. (7) In a SHA-256 repository a deletion line of a push (64 zeros) is not read as a deletion by either scan, which compares with 40 zeros; it ends with exit code 2. (8) A refusal line prints a file's path as it is, control characters and line breaks included.

