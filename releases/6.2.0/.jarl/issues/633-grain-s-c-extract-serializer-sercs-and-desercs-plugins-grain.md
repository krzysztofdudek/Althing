# 633 · Grain's C# extract serializer, serCs and deserCs (plugins/grain/engine/relations.mjs:64-71), turns …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1834-yjpt
**Tags:** adoption, grain
**Files:** 
**Repo:** Grain
**Found by:** rev-604-opus
**Where:** the review of 604
**After:** 143
**Branch:** jarl/143-runes-110
**Worker:** w-143-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
Grain's C# extract serializer, serCs and deserCs (plugins/grain/engine/relations.mjs:64-71), turns the using scope's aliases and globalAliases Maps into arrays and back, but not the aliasDecls Map that Runes 1.1.0 adds to the scope. With the Runes 1.1.0 build in place of the vendored one, every re-index that reads a cached C# extract fails its relation pass ('relation pass failed: scope.aliasDecls is not iterable'): the model holds no edges and no check-time table until the cache is emptied. Reproduced on a four-file C# repository: export, commit an edit, export again. Issue 475 notes this for Yggdrasil only; it belongs with Grain's adoption of Runes 1.1.0 (143), with a test that indexes a C# repository twice.

## Why


## Acceptance


[test] A C# extract of Runes 1.1.0 written to Grain's cache and read back carries every part of the using scope (aliasDecls among them) and gives the same edges as a cold run; a re-index from a warm cache made by the previous Runes rebuilds instead of failing, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: an index kept from an earlier run no longer leaves a C# repository without dependencies; a cached entry that cannot be read is read again from its file.

## Reviews
- **changes** · by rev-143-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T2303-mhnd
  Important (235, docs): docs/reference.md:225 still says the index resolves imports against the commit's tree written to a temporary directory and removed after the build, that a symbolic link there is a plain file holding its target, and that a case-insensitive disk keeps the first of two names that differ in case; since b951d97e nothing is written, a link is in no view and both names are kept. docs/reference.md:884 says the measure end writes the commit's tree for the files the resolvers read from disk; it is written only for the graph that commit had. What breaks for a user: an import of a symbolically linked file gave a dependency at dc31b968 (src/c/x.ts > src/b/link.ts in a repository of my own) and gives none at fcdc6bb1, as in Yggdrasil 530, and neither the reference nor the changelog says so; commit c6f052cd's message says the docs were covered, and no doc file changed on the branch. · Minor (143 changelog, 235): 'imports are resolved against the files of the commit, not the disk' holds for the index and grain measure, not for grain check (filed outside); the line should say where it holds, and name the linked-file change above. · Minor (233): no test fails if Grain's own same-package rule came back: the rewritten Java cases and the new Kotlin case fail on dc31b968 and pass already at 39dd7d6c, where the rule is still in place, because Runes' edges satisfy them; a case that each same-package pair carries one edge, typed as Runes types it, would hold the removal. · Minor (143 line 1): Runes c5124ca names itself 1.0.1 (package.json, dist/version.mjs), so the v1.1.0 tag will be a later bump commit and the copy will be redone in any case, not only if the tag lands elsewhere; until then the runes gate of Grain's CI (.github/workflows/ci.yml:31, check --ci) fails on GitHub. · Minor (233): the message of 8e1880c9 says 97 edges, the same with and without Grain's rule; fresh runs give 97 before and 91 after, as the worker's note says; history stays. · Minor, known limitation (235): plugins/grain/engine/relations.mjs:156-159 reads a .vue or .svelte file from the disk under root when its blob reads as null (a binary component); root is now the worktree, not the commit's copy, so that file's worktree text can reach the index. · Minor, known limitation (632): hydrateTable (relations.mjs:435) keeps the edited file as an owner of a name it no longer declares once the name has two directory owners, so check stays silent where the full pass may bind the other owner; the code says so. · Met: 143 line 1 '[read] release/6.2.0 vendors Runes 1.1.0 with a pin', provisionally: the 127 files equal Runes c5124ca byte for byte and c5124ca's dist equals a fresh build; line 2 re-run (2312, 2306 pass, 0 fail, 6 platform skips, the two self-history tests in a clone); line 3 '[read] Edge counts match Yggdrasil on one repository of the corpus from 184, named in the evidence': eShop @913acea against the 530 build at c04d31a0c, 698 and 698 file-to-directory pairs, 417 and 417 directory pairs, 0 in one tool only. 632 and 633: red before, green after, as recorded. The 97 to 91 on spring-petclinic is six second edges of pairs already held, now one type-ref edge each; the 91 pairs are the same set. A cache of the release build is read again, not failed on. Tried on the guards: cache entries with aliasDecls as an object or with no refs are dropped and read again, a TypeScript entry and a scope-only entry kept; a generated JSON config ignored on disk no longer reaches check; a new global using static in an edit gives check the edge the index gives and reaches no other project. Nothing tells an agent to call Grain.
  outside the issue, filed as 674: grain check resolves the edited file against the checkout on disk with no file view (plugins/grain/engine/arch.mjs:134, makeEdgeResolver without view), so an ignored or untracked manifest that is not JSON (a generated .csproj with a Using item, a Directory.Build.props, a go.mod) decides where the edit's references land: in a repository whose src/Api/Api.csproj is ignored and generated on disk with <Using Include="Lib.Models" />, an edit of src/Api/Controller.cs that adds 'Customer c;' gets 'FIRST edge src/Api → src/Lib' from check, while the index after the commit has no edge, and Yggdrasil's view (the files git does not ignore, no links) would give none either; the same on release/6.2.0 at dc31b968, so it predates 143. An ignored JSON config is already kept out by the exclusion Grain passes Runes. Check could resolve through a view of the working tree's tracked and not-ignored files, as yg check does, so that an edit's own manifest counts and a generated one does not.

## Evidence

### Proof

- **ran (line 37dc040107f2):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/csharp-extract-cache-round-trip.test.mjs (at the test commit, then at the fix commit) · **saw:** before the fix: 5 tests, 4 fail ('relation pass failed: scope.aliasDecls is not iterable' on the re-index from the warm cache; aliasDecls not a Map after the round trip) and 1 passes (a cache stamped by the previous Runes is rebuilt); after the fix: 5 tests, 5 pass, the edges equal a cold run
- **ran (line 37dc040107f2):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/csharp-extract-cache-round-trip.test.mjs at e849f338 (the test commit), 7e20adc5 (the fix) and fcdc6bb1; then a C# repository of three projects (a using alias, a global using alias, a global using static, an alias inside a namespace block) indexed by the release build dc31b968, indexed again by fcdc6bb1 over that cache, once more after a commit, and compared with a cold fcdc6bb1 run · **saw:** e849f338: tests 5, fail 4 ('relation pass failed: scope.aliasDecls is not iterable' on the warm re-index; aliasDecls comes back as {}), 1 passes (a cache stamped by the previous Runes is rebuilt); 7e20adc5 and fcdc6bb1: 5 of 5 pass; the repository: over the release build's cache '0 from cache, 6 parsed' and no relation pass failure, after the commit '5 from cache, 1 parsed', 6 edges, equal to the cold run

