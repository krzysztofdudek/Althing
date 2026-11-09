# 053 · Grain adds Java references within a package that Yggdrasil 6.1.0 does not see, so on Maven/Gradle repositories yg advise, right after adoption, calls the proposal's test→main relations stale

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-iluo
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/relations.mjs, Grain/README.md
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/relations.mjs:84-149 javaSamePackageRefs, called only for Java on :163 (`if (language === 'java') u.push(...javaSamePackageRefs(tree, d));`), since faae6f2 (Grain issue 113, 2026-09-05); README.md:313-320 and the relations.mjs:1-2 header promise the same relation code as Yggdrasil; Runes src/relations/extractors/java.mts:7-19 emits only imports and fully qualified names
**Branch:** jarl/053-java-same-package
**Merged:** bdb9de4
**CI:** none

## What
Reproduction (Grain v6.1.0 plus a CHANGELOG-only commit, yg 6.1.0, spring-petclinic @500158f). OwnerTests.java in the package org.springframework.samples.petclinic.owner has no import of Owner or Pet and does `new Owner()`. `grain propose` exit 0 with 12 relations, among them `src/test/.../owner -> src/main/.../owner`; `grain export` shows OwnerTests.java -> main/owner/Owner.java and Pet.java, type-ref. After `yg adopt` yg check passes, and `yg advise --all` gives three relation-declared-unused ('declares 1 relation no code backs … either it is stale …') with the advice to remove them: test/petclinic -> main/model, test/owner -> main/owner, test/vet -> main/vet. After removing the test/owner relation, `yg check --full --no-approve` still passes; as a control, removing the import-based relation main/owner -> main/model gives relation-undeclared-dependency. With no relations at all yg sees 7 node dependencies, Grain declares 12, and the 5 Grain-only ones are test -> main pairs in the same package. A Grain copy with line 163 disabled: 7 relations, identical to yg, file edges 98 → 24. Corpus survey: petclinic 29 Grain edges against 15 for yg, square/moshi 144 against 119 (Java tests → main in Kotlin); on express, flask, nest, chi, cobra, otel-go, two CleanArchitecture, eShop, sinatra, maybe, ripgrep, axum, Slim, flysystem, fmt and nowinandroid the two tools agree exactly. Cause: the Runes Java extractor assumes that a reference within a package only refines the type of an already imported binding, which does not hold when the package is split between src/main/java and src/test/java mapped to different nodes. The references are real compile dependencies: here Grain is right and Yggdrasil has a blind spot. Moving the binding into Runes will tighten yg check on existing Java graphs (these dependencies will require relations), so the direction of the fix is the owner's ruling. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-20/repro.log, repro2.log, repro3.log; comparisons <the session scratchpad, since lost>/bughunt/grain/find-4/ (petclinic-compare.txt, square_moshi-compare.txt).

## Why
On the default path (propose, adopt, advise) on a standard Maven/Gradle layout, two tools of the family contradict each other: advise says to remove relations the miner has just proven, and a real test -> main dependency can lose its relation under a green yg check. The README promises 'the same relation code Yggdrasil runs: both take it from Runes'. The advise text hedges itself, and nothing turns CI red.

## Acceptance
- Grain and yg check see the same set of dependencies for Java: either binding within a package moves to Runes (a Runes release and bumped pins), or Grain declares no relations Yggdrasil cannot verify; README.md and the relations.mjs header tell the truth about the chosen variant.
- spring-petclinic @500158f: after `grain propose` and `yg adopt`, `yg advise --all` reports no relation-declared-unused for any relation from the proposal.

## Changelog
- Fixed: on Maven and Gradle projects, Grain no longer proposes test-to-main relations that Yggdrasil cannot check, so `yg advise` stops calling them stale right after adoption.

## Evidence

docs: README.md (around lines 318-320, 'the same relation code Yggdrasil runs'): add that Grain's one addition, Java names of the file's own package without an import, binds only inside the file's own directory, so it never yields a relation Yggdrasil cannot check.

grain-053 @651787c: new test tests/relations/e2e/java-same-package-split-source-roots.test.mjs red before (forbidden edge OwnerTests.java -> main/Owner.java) and green after; the two issue-113 same-package tests stay green. spring-petclinic @500158f, Yggdrasil 6.1.0 (YG_BIN ci build): before 12 relations proposed, yg advise --all 3 relation-declared-unused (test/petclinic->main/model, test/owner->main/owner, test/vet->main/vet); after 9 relations, yg check PASS, 0 relation-declared-unused; grain measure HEAD~40..HEAD: 9 node pairs with imports, 0 undeclared. Full gate with YG_BIN/HORDE_DIR/GRAIN_CORPUS_CLONES: 2079 tests, 2078 pass, 1 skip. Logs: scratchpad/patch-611/grain-053/{after,before}/, run.sh, full.log.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2083, pass 2082, fail 0, skipped 1, merge bdb9de4

