# 678 · In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored f…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2330-auci
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-143b-opus
**Where:** the review of 143, 632, 633, 674
**Branch:** jarl/662-grain-small
**Merged:** cb8ae6bd in Grain
**Merge check:** cd plugins/grain && npm test · saw tests 2409,pass 2403,fail 0,skipped 6

## What
In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored files included: an ignored generated src/Api/Api.csproj with a Using item gives the index an edge src/Api/Controller.cs > src/Lib/Customer.cs that Yggdrasil's view (the files git does not ignore) would not give; check agrees with that index, so 674's view changes nothing there; the same at fcdc6bb1 and a2cd6e3b, so it predates 674.

## Why


## Acceptance


[test] In a repository with no commits, Grain's index and check leave out files git ignores, as Yggdrasil does, red before and green after · by: cd plugins/grain && npm test

## Changelog
- In a repository with no commit yet, the index and check leave out the files git ignores, as Yggdrasil does; an index built there may give fewer dependencies than before.

## Reviews
- **changes** · by rev-662-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0158-dczf
  Important (691, plugins/grain/engine/yggdrasil-graph.mjs:420 with :472): the probe now leaves the files the path rules out of the prefetch, but the final pass (files.filter(rel => evalWhen(when, rel, ctx))) still evaluates the parts in their written order, so a content part before the path reads the head of every file the path leaves out, each through view.read, which commitFileView answers with one git cat-file call per file (commit-view.mjs:49). Measured with the real commitFileView on 1000 files, 10 under the path: content first, 3 fetch calls on d9df4a36 and 991 on 09ba82bd (1000 blobs both); path first, 1 call on both. 6000 random predicates: answers equal to reading every file on both trees, reads outside the prefetch 0 before and about 18700 per 3000 rules after. The 691 test counts only prefetch calls, not reads, so it is green while every excluded file is still read, now one process each; the changelog line 'reads only the files the path admits' is not true. Fix direction: the final pass takes the probe's settled true/false and evaluates only the files the probe left open, and the test counts view.read. · Minor (record): the changelogs of 662 and 691 are the same joined text, each carrying the other's sentence. · Met: 662, red before (2 fail) and green after (5 pass); headTs and isShallow throw the remembered start failure, an ordinary failure still answers 0 and false. 678, red before (2 fail) and green after (3 pass); against yg check on one no-commit repository the same code files are counted, apart from a tracked file matched by .gitignore, which Grain indexes with a commit too (consistent with the 674 review); outside a repository worktreePaths is null and the walk is kept. 680, red before (1 fail) and green after; tried: a staged link, an unstaged link to an ignored file, an unstaged link to a tracked file, a staged link then a file on disk: each left out of the view. Tried on the guard: a tracked directory swapped for a link gets past it (filed outside). Full suite in a clone at 09ba82bd under the gate's full-gate.sh: 2405 tests, 2399 pass, 0 fail, 6 skipped for the platform; runes 127 files match v1.1.0. The diff touches only engine/ and tests/: nothing tells an agent to call Grain. engine/learn.mjs is 50152 bytes on disk.
  outside the issue, filed as 697: Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both older than 680: (1) a tracked directory replaced on disk by a link to an ignored generated directory, not staged: git ls-files --deleted does not name the files beneath it (git status says D), lstat follows the directory link, so the view keeps src/a/x.ts and reads the ignored gen/a/x.ts through it, while git add -A would delete those paths and add src/a as a link; reproduced on d9df4a36 and 09ba82bd. (2) a tracked link replaced on disk by a regular file, not staged: the index mode 120000 drops it from the view, though git commit -a would commit it as a file.
- **approve** · by rev-662b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0210-hepv
  Met (round 2, judging only the 691 fix and the changelogs): f33e3c8a settles each file true, false or open in the probe, hands only the open files to prefetch and evaluates only those for real, keeping the original order (plugins/grain/engine/yggdrasil-graph.mjs:415-421). The round 2 test is red on 09ba82bd (3 fail: content first and content key before path key read the src files; real view 991 calls and 1000 blobs against 1 and 10) and green on f33e3c8a (11 pass); it counts view.read and git fetch calls, so it fails for the right reason. Round 1's measurement repeated on 1000 files, 10 under the path: path first, content first and content key before path key each 1 git call, 10 blobs, 10 view reads on the tip. 4000 random predicates (all_of, any_of, not, lists, nesting, key orders, an invalid regex) against reading every file: 0 wrong answers on both trees, reads outside the prefetch 20886 before and 0 after, nothing prefetched and left unread. Changelogs of 662 and 691 are now separate, each its own sentence, and 691's line is now true. Commits: test then fix, each naming 691, no amend; only yggdrasil-graph.mjs and the 691 test moved. Full suite in a clone at f33e3c8a under full-gate.sh: 2409 tests, 2403 pass, 0 fail, 6 skipped for the platform; runes 127 files match v1.1.0. Findings: none.

## Evidence

### Proof

- **ran (line 5a6e51d5e1f2):** node --import ./tests/git-env.mjs --test tests/no-commit-index-leaves-out-ignored-files.test.mjs (red before the fix: 2 fail; green after) · **saw:** 3 pass; and cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test: 2405 tests, 2399 pass, 0 fail
- **ran (line 5a6e51d5e1f2):** node --import ./tests/git-env.mjs --test tests/no-commit-index-leaves-out-ignored-files.test.mjs, on d9df4a36 with the new test and on 09ba82bd; yg check --no-approve --details --full (the gate's YG_BIN) against worktreeTree on one no-commit repository with tracked, staged, staged-then-deleted, untracked, ignored, linked and tracked-but-ignored files · **saw:** d9df4a36: 1 pass, 2 fail (edges to src/Api/Gen.cs and src/Lib/Customer.cs from ignored files); 09ba82bd: 3 pass. yg counts .gitignore, src/a/x.ts, src/b/y.ts, sub/staged.ts; Grain indexes the same code files plus src/a/ign.ts, tracked and matched by .gitignore, which yg calls invisible and Grain indexes with a commit too (judged consistent in the 674 review); links, the deleted staged file and the ignored gen/ left out by both

### Notes

Assumed: a repository with no commit is indexed from the files git would put in its first commit (tracked, staged, and untracked not ignored; no link), the list check already uses; no stamp changes, as a commit-less index has no HEAD to be stale against and the engine version already differs between releases.

