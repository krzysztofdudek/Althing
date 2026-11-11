# 143 · Grain: adoption of Runes 1.1.0 (re-vendor and pin)

**Status:** in-progress
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0949-basf
**Tags:** grain, runes
**Files:** Grain/plugins/grain/engine/vendor/runes
**Repo:** Grain
**After:** 009, 073, 013, 074, 010, 012, 011, 017, 015, 016, 075, 018, 566
**Found by:** jarl
**Where:**
**Branch:** jarl/143-runes-110
**Worker:** w-143-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
Grain copies Runes (engine/vendor/runes, checked byte for byte). After the v1.1.0 tag is pushed: npm run runes:update -- --tag v1.1.0, a commit of the copy together with the pin, check --ci. A test requires the Runes version to match Yggdrasil's, so this goes together with 142. Runes 1.0.1 was never published, and release/6.2.0 vendors 1.0.0 today. The Grain halves of 233 and 234 land with this adoption. For 235, Grain already reads the commit tree from a temporary directory, so its answer does not depend on files built locally.

When re-vendoring, pass Runes 1.1.0's new optional C# inputs where Grain builds the C# relation pass: globalStatics and projectGlobalStatics (issue 500) and the Reachability internalsVisible member (issue 489).

## Why
Without this the extractor fixes do not reach Grain, and Grain and Yggdrasil diverge in edge counts.

## Acceptance
- [read] release/6.2.0 vendors Runes 1.1.0 with a pin
- [test] Grain's suite passes with YG_BIN set · by: cd plugins/grain && npm test
- [read] Edge counts match Yggdrasil on one repository of the corpus from 184, named in the evidence

## Changelog
- Changed: Grain takes its dependencies from Runes 1.1.0, the relation code Yggdrasil 6.2.0 runs, so both tools give the same dependencies: Java and Kotlin names of the file's own package, C# using aliases, using static and project references, and the other additions in the Runes 1.1.0 notes. A graph that keeps tests apart from production code may need a test-to-main relation. The first query after the upgrade reads the repository again.
- Changed: a Java or Kotlin file that names a class of its own package without an import now depends on it, within its source set: a test depends on the code it tests. Grain's earlier rule for these names is gone; Runes gives the dependency, and the dependency is typed as a type reference.
- Added: a configuration file the resolvers cannot read (a tsconfig.json, package.json, composer.json or compile_commands.json that does not parse) is named with its line in grain export (relStages.diagnostics) and in the proposal, so the dependencies behind its aliases and packages are explained.
- Changed: imports are resolved against the files of the commit, not the disk, so a generated or ignored file (a built dist/, a generated config) no longer decides where an import lands.

## Evidence


2026-10-28 tidy-up: Runes 1.0.1 was never published (Runes' last tag is v1.0.0); the release this issue adopts is Runes 1.1.0 from release/1.1.0, and the title says so

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""
- **ran (line 532a73fb29b8):** cd plugins/grain && YG_BIN=<the gate build of Yggdrasil release/6.2.0> GRAIN_CORPUS_CLONES=<express and spring-petclinic at the pinned commits> nice -n 15 timeout 3000 npm test · **saw:** runes:check: 127 vendored files, 1 skill fragments and the tool match v1.1.0 (c5124ca0525e), offline; node --test: tests 2312, pass 2306, fail 0, skipped 6 (all six are platform skips: a Windows drive-letter path, a case-insensitive file system); the tests that need Yggdrasil ran

