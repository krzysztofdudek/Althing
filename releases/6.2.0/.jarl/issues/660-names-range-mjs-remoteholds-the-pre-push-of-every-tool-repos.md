# 660 · names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commi…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2100-wdab
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-658-opus
**Where:** the review of 657, 658
**Branch:** jarl/658-names-remote-asked
**Merged:** 38f3733 in Althing
**Merge check:** yg check && npm test · saw npm test 203 tests, 191 pass, 0 fail, 11 skipped, 1 todo on the merge; yg check PASS

## What
names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commits that pull-request refs reach, as in Important 1 of 657/658: a contributor's or dependabot's pull request merged locally in a tool repository and pushed is not scanned for the commits a host lists under refs/pull; asking only for heads and tags in remoteHolds closes both.

## Why


## Acceptance


[test] The tool repositories' pre-push (remoteHolds) excludes only commits reachable from the remote's heads and tags, never from pull-request refs, so a fork's commit under refs/pull only is scanned when pushed, red before and green after · by: yg check && npm test

## Reviews
- **approve** · by rev-658b-opus (fresh) · 2026-11-11 · model claude-opus-5-5@high · batch 20261111T2108-puur
  No findings. Examined 9c6d3b5 (tests f7a6d29) on scratch extractions whose digests come from an invented list under a test key, with a scratch home; the real key and list were never read. Round 1 closed: Important 1, remoteHolds now asks git ls-remote --heads --tags, and real pushes to local bare remotes under krzysztofdudek/Althing.git through Althing's own pre-push and through the tool repositories' hook template refuse, with nothing landed, a fork's commit present only under a hidden refs/pull/7/head, refs/pull/7/merge, refs/changes/01/1/1 (Gerrit-style), refs/notes/commits or refs/keep/x, merged here and pushed, and a leaked commit whose branch was deleted while such a ref keeps it, pushed again on a new branch (20 of 20); d9792bf let all 20 through as clean, and 9c55826's tool template its 10. A remote whose HEAD is detached at a leaked commit no branch reaches: refused (d9792bf and 9c55826's template: clean). Minor 2, hooks.test.mjs sets GIT_ALLOW_PROTOCOL=file: under GIT_TRACE and GIT_TRACE_CURL it still calls ls-remote with the github.com addresses but no transport starts and no curl trace is written; 11 of 11 pass. Minor 3, the compatObjectFormat tag limit is named in rails/README.md's known limits. Tried and holding: a remote with HEAD symbolic to main that holds a public word: a new branch 1 commit clean, a new tag 0 commits clean; a new lightweight tag, a new annotated tag and a new branch on a 694-commit copy of Althing: 0 commits, clean, about 0.08 s including Node's start. Safe-side false reds, documented by the README's 'branches and tags': a commit under a visible non-branch ref (refs/changes, refs/notes) is read and refused although git would not send it, and a remote that hides its branches from fetch (uploadpack.hideRefs=refs/heads) means the whole range. The two new tests fail at f7a6d29 for the right reason ('2 commits: clean') and pass at 9c6d3b5. npm test 203, pass 191, fail 0, skipped 11, todo 1 (the existing direct.test.mjs one); yg check --no-approve PASS 17 nodes, 1360/1360 files, 5833 pairs. No output carried a test word. Only the issue's files moved (rails/README.md, rails/names-range.mjs, the two test files, workspace/README.md); no test, rail or hook was weakened; tests and fix are separate commits, no amend.

## Evidence

### Proof

- **ran (line 942df257c862):** node --test --test-name-pattern 'pull-request ref' rails/test/run.test.mjs workspace/test/names-range.test.mjs, at f7a6d29 (tests only, remoteHolds asking for every ref) · **saw:** both tests failed: 'rails range (2 commits): clean.' and 'names range (2 commits): clean.' for a leaked commit only a pull ref reaches
- **ran (line 942df257c862):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test · **saw:** tests 203, pass 191, fail 0, skipped 11, todo 1 (the existing direct.test.mjs one); the pull-request tests green in rails/test/run.test.mjs and workspace/test/names-range.test.mjs
- **ran (line 942df257c862):** timeout 300 yg check --no-approve · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script), at 9c6d3b5
- **ran (line 942df257c862):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test, in the worktree at 9c6d3b5 · **saw:** tests 203, pass 191, fail 0, skipped 11, todo 1 (the existing direct.test.mjs one); the type-change, signature and pull-request tests green in rails/test/run.test.mjs and workspace/test/names-range.test.mjs
- **ran (line 942df257c862):** timeout 300 yg check --no-approve, in the worktree at 9c6d3b5 · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script)
- **ran (line 942df257c862):** node --test --test-name-pattern 'pull-request ref' rails/test/run.test.mjs workspace/test/names-range.test.mjs on an extraction of f7a6d29 (tests only, remoteHolds asking every ref), then the same tests in npm test at 9c6d3b5 · **saw:** at f7a6d29 both fail: 'rails range (2 commits): clean.' and 'names range (2 commits): clean.' for a leaked commit only a pull ref reaches; at 9c6d3b5 both pass
- **ran (line 942df257c862):** real pushes through the tool repositories' hook template and through Althing's own pre-push, to local bare remotes under krzysztofdudek/Althing.git, on scratch extractions of 9c6d3b5, d9792bf and 9c55826 whose digests come from an invented list under a test key: a fork's commit only under a hidden refs/pull/7/head, refs/pull/7/merge, refs/changes/01/1/1, refs/notes/commits or refs/keep/x, merged here and pushed, and a leaked commit whose branch was deleted while that ref keeps it, pushed again on a new branch · **saw:** 9c6d3b5: all 20 refused by both hooks, nothing landed, no output carried the test word; d9792bf: all 20 landed as clean through both hooks; 9c55826: Althing's hook refused all (whole range), the tool template let all 10 of its own through as clean

### Notes

Assumed: remoteHolds asks git ls-remote --heads --tags, so HEAD and every other namespace (refs/pull, refs/changes, refs/notes) exclude nothing; the examiner's repro shape is covered for Althing's hook and the tool repositories' template.

