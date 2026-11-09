# 111 · propose makes classifying types out of directories that own no file: javapoet gets a type src-test-java-com with the same set of 21 files as its only child, admitted on '5 of 1145 vs 5 of 1146' imports

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-vpoa
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-types.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/propose-types.mjs (v6.1.0; on release/6.1.1 one line lower, where the only change is slug → typeId): :142-153 (the finer-level loop compares a candidate only with its nearest active ancestor via `mine > theirs` on purity, with no tolerance, and does not check whether an active type below already takes every one of its files), :144 (the claimedFiles guard `if (!parent && [...set].every(f => claimedFiles.has(f))) continue;` works only for a candidate without a parent, although the comment at :133-138 names exactly this bug: 'a node that owns no file of its own once its children take theirs'), :40-43 (`put` deduplicates by the directory string, not by the file set), :95-99 (the directory and module levels are both active), :262 (the alternatives path treats Jaccard >= 0.9 as the host itself).
**Branch:** jarl/110-proposal-counts-and-empty-types
**Merged:** 1098c12
**CI:** none

## What
Reproduction (fresh Grain ae6152f; square/javapoet @b9017a9; @chrisdudek/yg 6.1.0 from npm; `YG_BIN=… node grain.mjs propose`, adoption into a copy of the clone; counting through `yg owner --files - --json`, so the numbers are Yggdrasil's, not the finder's script's): the proposal has 10 classifying types (9 `/**` types and `repo-root-file` with `*`), and four of them own no file: src, src-main, src-test and src-test-java-com.

src-test-java-com (`src/test/java/com/**`) selects the same 21 files as src-test-java-com-squareup; in proposal.json both have the same evidence (21 files, 5 imports inside, 1140 crossing). The admission rationale reads '5 of the 1145 resolved imports ... stay inside it, a tighter boundary than src/test/java's 5 of 1146', i.e. 0.437% versus 0.436%; the only difference is the file lying directly in src/test/java (ClassNameNoPackageTest.java) and its one import com.squareup.javapoet.ClassName. `yg context --node src/test/java/com` shows 'Source files (0)', and all 39 inherited rules of this node say 'Subjects: 0 files — vacuous'.

Counterfactual (log 07): the src-test-java-com type removed and its node replaced with an organizational `module` node without a mapping. 0 of 50 files change owner, and the findings of `yg check --approve --only-deterministic --full` and `--no-approve --full` are identical to the original, including the summary line. Today the type does nothing except classify a future file placed directly in src/test/java/com/.

Narrowing relative to the report: `src` is not a pointless type, because it hosts all 39 aspects that Yggdrasil passes down to every nested node (`yg impact --aspect grain/src/directory-deco-override` shows 10 nodes, and all 20 blocking refusals after adoption come from it). src-main and src-test coincide with their only child and come from the documented level 'directory one level below a partition' (the code deliberately emits both levels), so they are doubtful only because of the identical file set. On jsoup @088614f (log 05) the types without files (src, src-test with 204 files in three children, src-test-java11 with 2 children) are hierarchy levels or rule hosts, with no file set identical to a single child. The defect is narrower than 'types without files': an active type whose file set is identical to that of one deeper active type, and most clearly the finer level admitting a directory on a purity difference of one import.

docs/reference.md:540-546 documents the policy 'strictly more imports inside, no cutoff', justified by oracle recovery ('a finer type can only add a match'); a type whose file set equals that of an existing active type cannot add a match, so it can only lower precision. Related but different: 045.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-2/repro-09-empty-types/01-propose.log and 02-types-owning-nothing.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-48/logs/03-types-owning-nothing.log and 01-propose.log, 02-adopt-check.log, 05-jsoup-types-owning-nothing.log, 06-src-rules-inherit.log, 07-drop-type-counterfactual.log in the same directory.

## Why
There is no wrong enforcement and no red check; the cost is noise. On javapoet 3 of 13 nodes carry 0 files and 39 empty rule pairs each, and the evidence text calls 'tighter' a boundary that 99.6% of imports cross. The maintainer gets a proposal with types that classify nothing.

## Acceptance
- A directory from the finer level becomes a classifying type only when it changes which files the types classify; a type whose file set equals the set of a deeper active type becomes an organizational node or an alternative (the claimedFiles guard also works for a candidate with a parent).
- javapoet @b9017a9: `grain propose` has no type src-test-java-com, and no type is admitted on a purity difference of one import when its file set equals that of another active type.
- The decision on the src-main/src-test pairs and their only children (the same file set, two levels by design) is recorded in the code or in docs/reference.md.

## Changelog
- Fixed: `grain propose` no longer proposes a node type for a folder whose files are exactly the files of a type already proposed inside it; such a type classified nothing and carried no rule.

## Evidence

- **ran (history):** node --test tests/propose-no-type-equal-to-a-deeper-one.test.mjs on release/6.1.1 engine and on d7de27d · **saw:** before 1 of 2 pass (src-test-java-com admitted beside src-test-java-com-squareup); after 2 of 2 (the control, a union of two deeper types, admitted both times)
- **ran (history):** YG_BIN=<frozen yg 6.1.0> grain propose on javapoet b9017a9 and jsoup 088614f, release/6.1.1 vs branch; then real yg adopt and yg owner count · **saw:** javapoet: src-test-java-com gone (10 -> 9 classifying types), yg adopt exit 0, owning-nothing types src src-main src-test only (src-main/src-test kept by decision, comment in propose-types.mjs); jsoup: the same 32 types before and after (src-test-java11 kept), yg adopt exit 0
- **ran (history):** YG_BIN HORDE_DIR GRAIN_CORPUS_CLONES npm test on d7de27d (propose-type-levels with corpus included) · **saw:** tests 2055, pass 2054, fail 0, skipped 1

docs: docs/reference.md: finer-level policy ('strictly more imports inside, no cutoff', ~540-546): add that a directory whose files are exactly the files of one type already cut below it is not admitted, it would classify nothing that type does not; the directory-level wrappers of a single deeper type (src/main, src/test) stay by decision
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2078, pass 2077, fail 0, skipped 1, merge 1098c12

