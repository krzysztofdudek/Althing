# 101 · advise counts the files of child nodes as the parent's files and says to split out directories that are already child nodes (17 of 17 candidates right after adopting Grain's own proposal for express)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0853-vlty
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-advise.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-advise.mjs:80 (readNodeGraph: `n.files` is the expansion of the node's own `mapping:`), :89-91 (ownerOf is built, but `n.files` is not narrowed; the comment :68-69 says 'never its children's'), :262-305 splitItems (size gate :266, the parent's evidence :268, the text 'owns N files'), :333/407 (the line 'N of M places own files'), :424 ('of which N grain could not read'). The file is identical on v6.1.0 and release/6.1.1.
**Branch:** jarl/054-measure-advise-like-yg
**Merged:** 944e8fd
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 b70a4e9, yg 6.1.0 from npm, node 24.11.1): a clone of expressjs/express @023767fe, `grain propose`, `yg adopt`, commit, `grain advise`. Result: '8 places a finer cut beats on its own evidence, of which 8 grain could not read'. All 17 of the 17 candidates (examples/mvc, examples/auth/views, examples/route-separation/views, test/fixtures, test/support, …) are exact mappings of nodes of the adopted graph (compared with the yg-node.yaml files, not by id). 'owns N' according to advise against `yg owner`: examples 80 against 12, test 112 against 70, examples/route-separation 12 against 5, examples/error-pages 6 against 1, examples/auth 4 against 1, examples/downloads 4 against 1, examples/ejs 5 against 2, examples/mvc 15 against 12.

Synthetically, with a control: the parent `svc` maps `core`, the children `svc/alpha` and `svc/beta` map core/alpha and core/beta; `yg check` passes, `yg owner` gives svc only core/main.ts. advise says 'Svc owns 8 files' and advises splitting out `core/alpha`, which is already the node svc/alpha. In the control the parent maps only `core/main.ts`; ownership according to `yg owner` is identical, and advise says 'No place here is beaten by a finer cut'. Two graphs with the same ownership get different advice. The bug shows only when a candidate can beat the parent (the first synthetic attempt, without imports from outside, gave no split).

Test of the cause: one line after ownerOf is built, leaving in `n.files` only the files the node owns. Both repositories then say 'No place here is beaten by a finer cut', and tests/advise-command.test.mjs passes (11 pass, 2 corpus tests skipped). The corpus test that guards the designed split (GRAIN_CORPUS_CLONES with a fresh express clone) passes before and after the fix with the same advice (`examples` has 80 files and 9 candidates), because in that hand-written oracle `examples` has no children.

Related, but not the same: issue 520 (release-6.1.0) fixed the same inflation only for `cochange --partition --level node`, and issue 054 is about measure. 'of which 8 grain could not read' counts places with at least one unread candidate (misleading; it will go away with the main fix). The line 'N of M places own files' reads the same inflated set, but in both repositories the number does not change after the fix.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-8/repro/f5b-advise-after-adopt.log and f5-advise-split-child-files.log (.sh scripts alongside); verification <the session scratchpad, since lost>/bughunt/grain/verify-34/v34-express.log, v34-synthetic2.log, v34-patched-cause.log, v34-oracle-test.log.

## Why
On every nested graph, including every adopted `grain propose` proposal with nested nodes, advise's advice consists entirely of directories that are already child nodes, and every 'owns N files' number is inflated. The maintainer is told to make a split they already have. docs/reference.md says 'a node a finer cut of its own files beats', the README 'places a finer cut of their own files beats', and a comment in the code 'never its children's'.

## Acceptance
- A node's files in readNodeGraph are the files it owns (the deepest node mapping the file, like g.ownerOf and `yg owner`), and a candidate that is already a node of the graph is not advice.
- express @023767fe after `grain propose` and `yg adopt`: `grain advise` lists no directory that is the mapping of an existing node, and 'owns N files' for examples and test matches `yg owner` (12 and 70).
- The synthetic graph svc / svc/alpha / svc/beta gets the same advice as the control graph with the same ownership.

## Changelog
- Fixed: `grain advise` counts only the files a place in the architecture owns, not the files of the places nested inside it, and no longer suggests splitting out a directory that is already a place of its own.

## Evidence

- **ran (history):** node --test tests/advise-split-owned-files.test.mjs on release/6.1.1 code (722cad3) vs 35a70b8 · **saw:** before: 3 of 3 fail (svc's files are all 8 of core/**; svc/core gets split core/alpha, owns 8; app/core advised to split `src`, app's mapping); after: 3 of 3 pass (<the session scratchpad, since lost>/patch-611/grain-054/101-red.log, 101-green.log)
- **ran (history):** express @023767fe, adopted proposal (verify-34 clone): grain advise --json + yg owner --files <every tracked file>, release/6.1.1 vs 35a70b8 (<the session scratchpad, since lost>/patch-611/grain-054/express-101.sh) · **saw:** before: 8 split items, 17 candidates, 17 of them an existing node's mapping, examples owns 80 / test 112 vs yg owner 12 / 70, 9 of 31 nodes' counts differ from yg owner; after: 'No place here is beaten by a finer cut of its own files.', 0 candidates, examples 12, test 70, 0 of 31 nodes differ (<the session scratchpad, since lost>/patch-611/grain-054/101-express-before.log, 101-express-after.log)
- **ran (history):** GRAIN_CORPUS_CLONES=…/grain-611/corpus node --test tests/advise-command.test.mjs; YG_BIN=… node --test tests/propose-glob-escape.test.mjs · **saw:** 13/13 pass (the express oracle still gets its examples split: 80 files, the oracle has no child nodes there); 8/8 pass
- **ran (history):** YG_BIN=…/grain-611/ci/yggdrasil (6.1.0) HORDE_DIR=… GRAIN_CORPUS_CLONES=… npm test at 591a6a3 (branch jarl/054-measure-advise-like-yg) · **saw:** 1985 tests, 1984 pass, 0 fail, 1 skipped (the Windows-only GNU tar test), exit 0
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2041, pass 2040, fail 0, skipped 1, merge 944e8fd

