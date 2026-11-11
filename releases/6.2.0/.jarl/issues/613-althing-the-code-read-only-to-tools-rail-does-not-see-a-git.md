# 613 · Althing: the code/read-only-to-tools rail does not see a git push written in the call shape the names-range tests use

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1546-oyxz
**Tags:** althing, rails
**Files:** Althing/rails
**Repo:** Althing
**After:** 363
**Found by:** jarl
**Where:** w-363-fable, 363 round 2 (workspace/test/names-range.test.mjs)
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
The rail is what keeps workspace/ from ever writing to a tool repository; a call shape it misses is a way a push could slip into workspace code unseen. The tests' pushes to local bare fixtures are legitimate, so the rail must see them and allow them by a stated rule, not miss them.

## Acceptance
[test] The rail flags a git push in every call shape workspace code uses (spawn and execFile with an args array, a shell string, a variable command), and a push to a scratch bare fixture under the system temporary directory is allowed only by a named, tested exception · by: yg check && npm test

## Evidence

### Proof

- **ran (line 2167e4b41aa3):** node --test workspace/test/scratch-push.test.mjs (a git archive export of f7da94b, the tests alone, then at 9b15fcf) · **saw:** before: fail, ERR_MODULE_NOT_FOUND workspace/test/scratch-push.mjs; at 9b15fcf: tests 4, pass 4: a push to a bare repository under the system temporary directory runs, and a push to a checkout, to an address that is no folder, over https or ssh, or outside the temporary directory (also through an insteadOf rule or a second push address) is not run
- **ran (line 2167e4b41aa3):** node --test rails/test/structure.test.mjs workspace/test/scratch-push.test.mjs (the rule's change uncommitted in the worktree; before it, a git archive export of 3ee9975 with the two changed test files) · **saw:** before: both files fail to load, rails/code.mjs has no export EXCEPTIONS, and scanCode misses 6 of 8 push shapes tried by hand (options before the name in an array and in a shell line, the name passed to a helper, a variable, an array defined apart); with the change: tests 17, pass 17. Not committed: it waits for the owner's admission of the rule (a-36)
- **ran (line 2167e4b41aa3):** node --test rails/test/structure.test.mjs workspace/test/scratch-push.test.mjs (at f858ace, the rule's change committed after the owner's ratification, ruling code-read-only-to-tools-v2-ratified) · **saw:** tests 17, pass 17, fail 0: fifteen push shapes flagged (a shell line with and without options before the name, an argument array with the name first or later, the name handed to a helper, a variable, an array defined apart, send-pack), eight lines not flagged, a push allowed only in workspace/test/scratch-push.mjs by the named exception scratch-fixture-push, and no workspace code pushing outside it
- **ran (line 2167e4b41aa3):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test (at c72089e, the branch's head, the worktree clean); timeout 300 yg check --no-approve · **saw:** tests 196, pass 184, fail 0, skipped 11, todo 1 (rails/english.mjs through a link, a-35); yg check: PASS 17 nodes, 1332/1332 files covered, 5721 pairs verified, with the ratification of rule version 9be9dab0b47602e2 in the rule's log

### Notes

Assumed: the named exception is one file by its path, workspace/test/scratch-push.mjs (scratch-fixture-push in rails/code.mjs), and what holds a push to a fixture is that file's own check at run time, because the rail reads text and cannot know where a push goes. A push it will not run throws. The rail also reads send-pack as a push.

Correction to a-36: the four prepared files are not left in the worktree. With them in place every commit there is refused by the pre-commit gate (the same type-law-unratified error), so the worktree is clean at the branch's head and the prepared change is the patch file alone: ~/Temp/'Althing 613 the rail sees every push.patch' on this machine (git apply it in the worktree; the machine empties ~/Temp after 7 days). The patch changes rails/code.mjs (the three push shapes, send-pack, the named exception scratch-fixture-push for workspace/test/scratch-push.mjs), rails/README.md (the rule's section), rails/test/structure.test.mjs (15 shapes flagged, 8 lines not flagged, the exception by path) and workspace/test/scratch-push.test.mjs (the helper is the file the rail names; no workspace code pushes outside it).

Ruling ask-36 (stuck, by owner): Option 1: ratify the new version of code/read-only-to-tools (the option label is not his wording).

a-36 is answered and done: the prepared change is committed as f858ace and the owner's ratification as c72089e (yg log add --aspect code/read-only-to-tools --ratify --by 'Krzysztof Dudek'). The ratification was written into the working tree before the first of the two commits, because the pre-commit gate reads the working tree and refuses the changed rule without it. The patch copy in ~/Temp is removed.

