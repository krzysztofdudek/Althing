# 680 · Grain: grain check reads a tracked project file through a symbolic link when the file was replaced on disk by a link to an ignored generated one and not yet staged

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2331-imuo
**Tags:** grain, check
**Files:** 
**Repo:** Grain
**After:** 143
**Found by:** jarl
**Where:** rev-143b-opus, review of 674
**Branch:** jarl/662-grain-small
**Merged:** cb8ae6bd in Grain
**Merge check:** cd plugins/grain && npm test · saw tests 2409,pass 2403,fail 0,skipped 6

## What


## Why
674 leaves out links only among untracked files, so a tracked file swapped for a link reaches check and gives a dependency the index after the commit does not have.

## Acceptance
[test] A tracked project file replaced on disk by a link to an ignored generated file, not staged, gives grain check no dependency the index after the commit lacks, red before and green after · by: cd plugins/grain && npm test

## Changelog
- grain check no longer reads a tracked file you replaced with a link to an ignored generated file, so it gives no dependency the index after the commit would not have.

## Reviews
- **changes** · by rev-662-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0158-dczf
  Important (691, plugins/grain/engine/yggdrasil-graph.mjs:420 with :472): the probe now leaves the files the path rules out of the prefetch, but the final pass (files.filter(rel => evalWhen(when, rel, ctx))) still evaluates the parts in their written order, so a content part before the path reads the head of every file the path leaves out, each through view.read, which commitFileView answers with one git cat-file call per file (commit-view.mjs:49). Measured with the real commitFileView on 1000 files, 10 under the path: content first, 3 fetch calls on d9df4a36 and 991 on 09ba82bd (1000 blobs both); path first, 1 call on both. 6000 random predicates: answers equal to reading every file on both trees, reads outside the prefetch 0 before and about 18700 per 3000 rules after. The 691 test counts only prefetch calls, not reads, so it is green while every excluded file is still read, now one process each; the changelog line 'reads only the files the path admits' is not true. Fix direction: the final pass takes the probe's settled true/false and evaluates only the files the probe left open, and the test counts view.read. · Minor (record): the changelogs of 662 and 691 are the same joined text, each carrying the other's sentence. · Met: 662, red before (2 fail) and green after (5 pass); headTs and isShallow throw the remembered start failure, an ordinary failure still answers 0 and false. 678, red before (2 fail) and green after (3 pass); against yg check on one no-commit repository the same code files are counted, apart from a tracked file matched by .gitignore, which Grain indexes with a commit too (consistent with the 674 review); outside a repository worktreePaths is null and the walk is kept. 680, red before (1 fail) and green after; tried: a staged link, an unstaged link to an ignored file, an unstaged link to a tracked file, a staged link then a file on disk: each left out of the view. Tried on the guard: a tracked directory swapped for a link gets past it (filed outside). Full suite in a clone at 09ba82bd under the gate's full-gate.sh: 2405 tests, 2399 pass, 0 fail, 6 skipped for the platform; runes 127 files match v1.1.0. The diff touches only engine/ and tests/: nothing tells an agent to call Grain. engine/learn.mjs is 50152 bytes on disk.
  outside the issue, filed as 697: Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both older than 680: (1) a tracked directory replaced on disk by a link to an ignored generated directory, not staged: git ls-files --deleted does not name the files beneath it (git status says D), lstat follows the directory link, so the view keeps src/a/x.ts and reads the ignored gen/a/x.ts through it, while git add -A would delete those paths and add src/a as a link; reproduced on d9df4a36 and 09ba82bd. (2) a tracked link replaced on disk by a regular file, not staged: the index mode 120000 drops it from the view, though git commit -a would commit it as a file.
- **approve** · by rev-662b-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0210-hepv
  Met (round 2, judging only the 691 fix and the changelogs): f33e3c8a settles each file true, false or open in the probe, hands only the open files to prefetch and evaluates only those for real, keeping the original order (plugins/grain/engine/yggdrasil-graph.mjs:415-421). The round 2 test is red on 09ba82bd (3 fail: content first and content key before path key read the src files; real view 991 calls and 1000 blobs against 1 and 10) and green on f33e3c8a (11 pass); it counts view.read and git fetch calls, so it fails for the right reason. Round 1's measurement repeated on 1000 files, 10 under the path: path first, content first and content key before path key each 1 git call, 10 blobs, 10 view reads on the tip. 4000 random predicates (all_of, any_of, not, lists, nesting, key orders, an invalid regex) against reading every file: 0 wrong answers on both trees, reads outside the prefetch 20886 before and 0 after, nothing prefetched and left unread. Changelogs of 662 and 691 are now separate, each its own sentence, and 691's line is now true. Commits: test then fix, each naming 691, no amend; only yggdrasil-graph.mjs and the 691 test moved. Full suite in a clone at f33e3c8a under full-gate.sh: 2409 tests, 2403 pass, 0 fail, 6 skipped for the platform; runes 127 files match v1.1.0. Findings: none.

## Evidence

### Proof

- **ran (line e2445d252198):** node --import ./tests/git-env.mjs --test tests/check-reads-no-replaced-link.test.mjs (red before the fix; green after) · **saw:** 2 pass; and cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test: 2405 tests, 2399 pass, 0 fail
- **ran (line e2445d252198):** node --import ./tests/git-env.mjs --test tests/check-reads-no-replaced-link.test.mjs, on d9df4a36 with the new test and on 09ba82bd; worktreePaths on six link scenarios · **saw:** d9df4a36: 1 pass, 1 fail (check gave FIRST edge src/Api → src/Lib); 09ba82bd: 2 pass. A tracked file swapped for an unstaged link to an ignored file, a staged link, an unstaged link to a tracked file, a staged link then a file on disk: each left out. A tracked directory swapped for a link to an ignored directory: its files stay and read through the link (filed outside)

### Notes

Assumed: a tracked file swapped for a link and not staged leaves the view, as it would be a link (not read by the index) once committed.

