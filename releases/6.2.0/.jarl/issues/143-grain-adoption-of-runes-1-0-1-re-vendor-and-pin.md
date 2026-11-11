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

Edge parity with Yggdrasil (line 3). Method: on a copy of each repository, one node per directory and no relations, yg check --full --json lists each dependency as relation-undeclared-dependency (file:line to node); grain export of the same commit gives the file edges; both compared as file-to-directory pairs and as directory-to-directory pairs. Yggdrasil was a frozen copy of the jarl/530-runes-110 build (Runes 1.1.0, commit 455f757f0), run from a scratch folder; Grain at the tip of jarl/143-runes-110. C#: CleanArchitecture @5353a9e: 175 file-to-directory pairs in each tool (Grain has 263 file edges), 130 directory pairs in each, 0 in one tool only. JavaScript: express @023767f: 139 and 139, 55 and 55, 0 in one tool only. Java: spring-petclinic @818c413: 29 and 29, 14 and 14, 0 in one tool only. Not done: the third set, the Runes corpus golden.

Assumed: the pin names the Runes release/1.1.0 commit c5124ca0525e as v1.1.0 and keeps the GitHub source. The copy came from runes:update --tag v1.1.0 against a scratch clone of that commit, tagged there only (a git url insteadOf variable), so the real Runes repository has no new tag. check --ci passes with that variable and fails on GitHub until v1.1.0 points at that commit; if the tag lands elsewhere, the copy is redone.

Assumed: EXTR_V g38 to g39 and MODEL_V m40 to m41 are bumped in my commit of the C# inputs, because the lease message asked for it; HIST_V stays h16, no replay-state field changed. Needs lines for the final pass: none beyond these two.

Assumed: grain check keeps resolving against the checkout on disk, with the edited file's records read from its text (632); only the index and grain measure resolve through the commit's file view. A built dist/ on disk can still reach check, not the index. Filing it separately is the jarl's call.

Assumed: engine/commit-tree.mjs and tests/commit-tree-untrusted.test.mjs are removed with the file view (235): nothing writes a copy of the commit to the disk any more, so the crafted-tree writer and its test have no subject. The view lists no symbolic link and no submodule, and a test holds the link case. grain measure still unpacks the commit with tar for the one reader that needs it on disk, the architecture graph the commit had.

Assumed: four fixtures changed to what Runes 1.1.0 reads, none weakened: a Cargo manifest names its edition (none means 2015, where the use names a module of the crate), a C# project references the project whose types it uses (twice, plus a new case that holds the silence for a name two referenced projects declare), and the over-limit deadline test uses a 30-million-character Go literal with a 3.5 s deadline (Runes 1.1.0 walks the old 5-million literal in about 0.8 s, so it no longer outlasted 1.5 s). The Java same-package test now expects test-to-main edges.

Found, not changed: (1) an edge for a Java same-package name is typed type-ref by Runes, where Grain's old rule marked extends, construct and call: spring-petclinic @818c413 has the same 91 file pairs before and after, 97 edges before and 91 after (six pairs held two kinds). (2) The commit message of the 233 commit says 97 edges, the same with and without Grain's rule: that run reused a cache written before the removal; the fresh numbers are the ones in this note. (3) Grain's seam test needs Yggdrasil on the same Runes: the gate build of release/6.2.0 still carries 1.0.0, so it only warns here.

