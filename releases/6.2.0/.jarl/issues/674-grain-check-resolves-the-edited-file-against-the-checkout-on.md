# 674 · grain check resolves the edited file against the checkout on disk with no file view (plugins/grain/…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2303-xzxg
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-143-opus
**Where:** the review of 143, 632, 633
**Branch:** jarl/143-runes-110
**Worker:** w-143-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 23:04

## What
grain check resolves the edited file against the checkout on disk with no file view (plugins/grain/engine/arch.mjs:134, makeEdgeResolver without view), so an ignored or untracked manifest that is not JSON (a generated .csproj with a Using item, a Directory.Build.props, a go.mod) decides where the edit's references land: in a repository whose src/Api/Api.csproj is ignored and generated on disk with <Using Include="Lib.Models" />, an edit of src/Api/Controller.cs that adds 'Customer c;' gets 'FIRST edge src/Api → src/Lib' from check, while the index after the commit has no edge, and Yggdrasil's view (the files git does not ignore, no links) would give none either; the same on release/6.2.0 at dc31b968, so it predates 143. An ignored JSON config is already kept out by the exclusion Grain passes Runes. Check could resolve through a view of the working tree's tracked and not-ignored files, as yg check does, so that an edit's own manifest counts and a generated one does not.

## Why


## Acceptance


[test] grain check reads no file git ignores when it resolves an edit's imports (an ignored generated .csproj holding a Using gives no FIRST edge the index after the commit does not give), while an edit's own staged or edited manifests still count, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: grain check reads only the files git lists (tracked files, and untracked ones no ignore rule matches) when it resolves an edit's imports, so an ignored generated project file no longer gives a first dependency that the index after the commit does not give.

## Reviews
- **approve** · by rev-143b-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T2330-midd
  Minor, known limitation (674): plugins/grain/engine/worktree-view.mjs:28-31 takes a tracked file's kind from the index and checks only untracked files for a link, so a tracked project file replaced on disk by a symbolic link to an ignored generated one (not yet staged) is read through the link: check gives FIRST edge src/Api → src/Lib and the index after the commit gives none (reproduced on a2cd6e3b); the module's own comment and the 674 changelog say no links. An lstat of the paths git ls-files --modified names would close it. · Minor, known limitation (674, cost): the view is built on every check before any import is resolved: about 230 ms at 100000 tracked files and 450 ms with 100000 untracked files no rule ignores; on the corpus within noise. · Carried from round 1, unchanged and outside this round: the v1.1.0 tag (143 line 1; CI's runes gate red on GitHub until it lands), the .vue/.svelte disk fallback (relations.mjs:156-159), the hydrateTable owner (relations.mjs:435). · Closed from round 1. Important (235, docs): docs/reference.md:225 now says the index reads the commit's own files with nothing written to the disk, a Git LFS file is its pointer, both of two names differing only in case are kept, and an import of a symbolically linked file gives no dependency, as in Yggdrasil; this matches engine/commit-view.mjs (listed paths, blobs read when asked, no link, no submodule). docs/reference.md:884 now says the measure end unpacks the commit only to read the graph that commit had, which matches engine/measure.mjs:75-104. 235's changelog names the link change and what to do about it. Minor (143 changelog): the line now says the index and grain measure read the commit, and grain check the files git lists in the checkout. Minor (233 guard): tests/relations/java-no-own-same-package-rule.test.mjs fails 2 of 2 at 39dd7d6c, where Grain's rule still stands (groups marked sp; a call edge beside the type-ref), and passes 2 of 2 on the tip. · 674: red before, green after (fcdc6bb1 and 007b6067: 1 of 4 fails; a2cd6e3b: 4 of 4 pass). Tried on the built tool before (fcdc6bb1) and after (a2cd6e3b), each with an edit adding 'Customer c;' and then the index after the commit: an ignore rule in .git/info/exclude, in a global excludes file, in a nested .gitignore, an ignored Directory.Build.props, an untracked link to an ignored generated project file, a project in a subfolder of a larger repository with the rule at the top: before, check gave FIRST edge and the index none; after, neither. A project file both tracked and matched by an ignore rule (unchanged or edited), a new Directory.Build.props, a project in a folder with a space: check and the index both give the edge, before and after. A submodule and a deleted manifest: no edge, no error. A repository with no commits: the same before and after (filed outside). Cost of the listing alone: 10-20 ms on express and spring-petclinic, about 30 ms on a 3441-file repository, about 230 ms at 100000 tracked files, about 450 ms with 100000 more untracked files no rule ignores (ignored ones are not walked). grain check end to end, warm index: express lib/application.js median 257 ms before, 263 and 291 ms after in two series of 11; spring-petclinic OwnerController.java median 218 before, 234 after (7 runs): within the noise of a shared machine. · Full suite on the tip in a clone with history: 2318, 2312 pass, 0 fail, 6 platform skips; 632 and 633 tests pass on the tip (4 of 4, 5 of 5). Nothing in the four commits tells an agent to call Grain. · Met: 143 line 1 '[read] release/6.2.0 vendors Runes 1.1.0 with a pin', provisionally as in round 1 (runes:check matches c5124ca offline; the v1.1.0 tag still to come); 143 line 3 '[read] Edge counts match Yggdrasil on one repository of the corpus from 184, named in the evidence', met in round 1 on eShop, and nothing in this round touches how the index resolves.
  outside the issue, filed as 678: In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored files included: an ignored generated src/Api/Api.csproj with a Using item gives the index an edge src/Api/Controller.cs > src/Lib/Customer.cs that Yggdrasil's view (the files git does not ignore) would not give; check agrees with that index, so 674's view changes nothing there; the same at fcdc6bb1 and a2cd6e3b, so it predates 674.

## Evidence

### Proof

- **ran (line c34b3d4e31d6):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/check-reads-no-ignored-files.test.mjs (at the test commit, then at the fix commit); npm test · **saw:** before the fix: 4 tests, 1 fails (an ignored generated src/Api/Api.csproj with a Using item gives a FIRST edge src/Api to src/Lib in check, none in the index after the commit) and 3 pass (an edited, a staged and a new project file count); after the fix: 4 pass; full suite with Yggdrasil supplied: tests 2318, pass 2312, fail 0, skipped 6 (platform skips)
- **ran (line c34b3d4e31d6):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/check-reads-no-ignored-files.test.mjs at fcdc6bb1 (the file copied in), 007b6067 (the test commit) and a2cd6e3b (the fix); then npm test at a2cd6e3b as in 143 line 2 · **saw:** fcdc6bb1 and 007b6067: tests 4, fail 1 ('the ignored file is not read': an ignored generated src/Api/Api.csproj with a Using item gives FIRST edge src/Api → src/Lib in check), the edited, staged and new project file cases pass; a2cd6e3b: 4 of 4 pass; full suite 2318, 2312 pass, 0 fail, 6 platform skips

