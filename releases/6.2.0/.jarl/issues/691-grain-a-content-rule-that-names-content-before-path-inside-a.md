# 691 · Grain: a content rule that names content before path inside all_of fetches every file, including those the path leaves out

**Status:** in-progress
**Kind:** cleanup
**Priority:** 3
**Tier:** light
**Key:** 20261112T0047-jdxu
**Tags:** grain, performance
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** rev-143e-fable, review of the batch reads (plugins/grain/engine/yggdrasil-graph.mjs:413)
**Branch:** jarl/662-grain-small
**Worker:** w-662-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
The answer is right and the reads are batched, but a rule limited to a path should not read files outside it whatever order its parts are written in.

## Acceptance
[test] A content rule with content before path inside all_of fetches only the files the path admits, as with path first, red before and green after · by: cd plugins/grain && npm test

## Changelog
- A content rule written with its content before its path now reads only the files the path admits, as it already did with the path first.

## Reviews
- **changes** · by rev-662-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0158-dczf
  Important (691, plugins/grain/engine/yggdrasil-graph.mjs:420 with :472): the probe now leaves the files the path rules out of the prefetch, but the final pass (files.filter(rel => evalWhen(when, rel, ctx))) still evaluates the parts in their written order, so a content part before the path reads the head of every file the path leaves out, each through view.read, which commitFileView answers with one git cat-file call per file (commit-view.mjs:49). Measured with the real commitFileView on 1000 files, 10 under the path: content first, 3 fetch calls on d9df4a36 and 991 on 09ba82bd (1000 blobs both); path first, 1 call on both. 6000 random predicates: answers equal to reading every file on both trees, reads outside the prefetch 0 before and about 18700 per 3000 rules after. The 691 test counts only prefetch calls, not reads, so it is green while every excluded file is still read, now one process each; the changelog line 'reads only the files the path admits' is not true. Fix direction: the final pass takes the probe's settled true/false and evaluates only the files the probe left open, and the test counts view.read. · Minor (record): the changelogs of 662 and 691 are the same joined text, each carrying the other's sentence. · Met: 662, red before (2 fail) and green after (5 pass); headTs and isShallow throw the remembered start failure, an ordinary failure still answers 0 and false. 678, red before (2 fail) and green after (3 pass); against yg check on one no-commit repository the same code files are counted, apart from a tracked file matched by .gitignore, which Grain indexes with a commit too (consistent with the 674 review); outside a repository worktreePaths is null and the walk is kept. 680, red before (1 fail) and green after; tried: a staged link, an unstaged link to an ignored file, an unstaged link to a tracked file, a staged link then a file on disk: each left out of the view. Tried on the guard: a tracked directory swapped for a link gets past it (filed outside). Full suite in a clone at 09ba82bd under the gate's full-gate.sh: 2405 tests, 2399 pass, 0 fail, 6 skipped for the platform; runes 127 files match v1.1.0. The diff touches only engine/ and tests/: nothing tells an agent to call Grain. engine/learn.mjs is 50152 bytes on disk.
  outside the issue, filed as 697: Grain worktree view at the edges of links (plugins/grain/engine/worktree-view.mjs:28-42), both older than 680: (1) a tracked directory replaced on disk by a link to an ignored generated directory, not staged: git ls-files --deleted does not name the files beneath it (git status says D), lstat follows the directory link, so the view keeps src/a/x.ts and reads the ignored gen/a/x.ts through it, while git add -A would delete those paths and add src/a as a link; reproduced on d9df4a36 and 09ba82bd. (2) a tracked link replaced on disk by a regular file, not staged: the index mode 120000 drops it from the view, though git commit -a would commit it as a file.

## Evidence

### Proof

- **ran (line 284a91d9dbe7):** node --import ./tests/git-env.mjs --test tests/content-rule-fetches-only-what-path-admits.test.mjs (red before the fix: 5 fail; green after) · **saw:** 7 pass; and cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test: 2405 tests, 2399 pass, 0 fail
- **ran (line 284a91d9dbe7):** node --import ./tests/git-env.mjs --test tests/content-rule-fetches-only-what-path-admits.test.mjs, on d9df4a36 with the new test and on 09ba82bd; expandWhen over the real commitFileView with 1000 files, 10 under the path; 6000 random when predicates (all_of, any_of, not, lists, nested, path and content in each order) against reading every file · **saw:** d9df4a36: 2 pass, 5 fail; 09ba82bd: 7 pass. But the line is not met in the built code: with content before path, git fetch calls go from 3 (d9df4a36) to 991 (09ba82bd), every file the path leaves out read one call each in the final pass; path first: 1 call on both. Random predicates: 0 wrong answers on both; reads outside the prefetch 0 before, about 18700 per 3000 rules after. The test counts only prefetch, not reads
- **ran (line 284a91d9dbe7):** node --import ./tests/git-env.mjs --test tests/content-rule-fetches-only-what-path-admits.test.mjs (round 2: counts view.read calls and git fetch calls over a real commit view of 1,000 files; red on 09ba82bd with 3 fail, green after); full suite in plugins/grain through full-gate.sh · **saw:** 11 pass in the file; full suite 2409 tests, 2403 pass, 0 fail, 6 skipped for the platform

### Notes

Assumed: a head-less probe answers true, false or unread per part, so any_of and not also fetch only what their other parts leave open; no stamp changes (the answer is the same).

