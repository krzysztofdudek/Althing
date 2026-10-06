# 045 · grain propose --shape types makes enforced rules dead: the host type's directory becomes an organisational `module` node, so yg check says 'effective on zero nodes' and passes, while propose reports 'enforced' and 'Already broken N'

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-write.mjs, Grain/plugins/grain/engine/propose-nodes.mjs, Grain/plugins/grain/engine/propose-aspects.mjs, Grain/plugins/grain/tests/propose.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/propose-write.mjs:37 typesNeedingNodes (used at :295 with shape types) gives a node only to a type nested in another, never to the host; propose-nodes.mjs:117-127 (buildNodes inserts into model/src a `type: 'module'` node without a mapping, :125); rules attached to the host: propose-aspects.mjs:483 (`a.aspectIds = out.filter(o => o.host === a.id)`) and propose-write.mjs:179
**Branch:** jarl/045-types-shape
**Merged:** f1c29c3
**CI:** none

## What
Reproduction (Grain v6.1.0 b70a4e9, yg 6.1.0): square/javapoet @b9017a9, `YG_BIN=<yg> node grain.mjs propose --shape types`, `yg adopt .yggdrasil-proposal`, `yg check --no-approve --full`, `yg impact --aspect grain/src/directory-deco-override`. propose: 'enforced: 1 of 39 … grain/src/directory-deco-override … 20 break it today', advisory grain/src/candidate-auto-nameshape (249 sites), the adopt preview 'Already broken 269 sites'. All 39 aspects are attached to the `src` type, and model/src/yg-node.yaml is `type: module` ('Organizational node — it owns no file of its own'). After adopt 'Baseline 0 verdicts recorded'; `yg check --no-approve --full` and a plain `yg check --no-approve` PASS with warning[aspect-effective-nowhere] for both rules ('effective on zero nodes'); `yg impact --aspect` 'Directly affected (0)'. A new src/test/java/com/squareup/javapoet/PlantedTest.java with two @Override: check still PASS. Contrast: the nodes shape on the same commit → 'Baseline 61 verdicts, 35 of them refusals', `check --full` FAIL with 20 violations, impact 10 nodes. jsoup @088614f in the types shape: 3 enforced rules (114 + 9 + 3) and an advisory one (1550), after adopt all 4 aspect-effective-nowhere; serilog @bebc771 (from the survey): both enforced ones dead. Experiment: model/src/yg-node.yaml with `type: src`, `mapping: [src/]` and `root` in the parents of src → the rule refuses 22 sites (20 existing and 2 seeded). The dirFiles change from issue 504 makes every nested node take all the files of its directory, so the `src` type covers no file and no node has the src type. The only adopt test in the types shape (tests/propose.test.mjs, '--shape types writes the same types and rules...') checks only the exit 0 of adopt and check, and a dead rule satisfies both; the evidence of issues 494 and 504 checked only adopt's acceptance and the absence of ambiguous-node-type. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-12/logs/ (01-07 types, 12-13 the nodes contrast, 22 jsoup, 31 experiment).

## Why
docs/reference.md (the propose row) says that `--shape types` writes 'the same node types, `when`s, relations and rules as the default `--shape nodes`'. The report and the preview call the rule enforced and count broken sites, and after adopt a new violation passes: the user thinks they are protected, and they are not. The shape is optional (the default is nodes), and yg check prints a warning.

## Acceptance
- In the types shape, a rule called enforced works after adopt: the host type gets its own node instead of a `module` node, or the rule is attached to the nested types it covers, or it stays a draft with an explanation.
- javapoet @b9017a9 `--shape types`: after adopt `yg check --no-approve --full` FAILs with 20 grain/src/directory-deco-override violations and without aspect-effective-nowhere; a test in tests/propose.test.mjs checks that every enforced rule has at least one node it works on.

## Changelog
- Fixed: with `--shape types`, a rule whose type no longer reaches any of the files it was measured on after adoption is no longer called enforced or advisory; it stays a draft and the report says why.

## Evidence

red->green: tests/propose.test.mjs 'a rule the drill proved correct stays draft (type-covers-none-of-its-sites)…' fails on release/6.1.1's propose-status.mjs (actual 'enforced'), passes on the branch. javapoet @b9017a9 --shape types with YG_BIN (frozen 6.1.0): before = 'candidates: 1 advisory grain/src/candidate-auto-nameshape', adopt 'Already broken 19', check --full PASS with warning[aspect-effective-nowhere]; after = same rule 'yg status draft (type-covers-none-of-its-sites)', adopt '0 enforced, 0 advisory, 39 draft', check PASS, no aspect-effective-nowhere. Guard test (YG_BIN): build-fixture + 2 deviants, types shape, stand-in drills -> 2 enforced, real adopt + check --full refuses both, no aspect-effective-nowhere. (The @Override rule from the issue is already draft via 039.)

docs: docs/reference.md: provenance draftReason list — add "type-covers-none-of-its-sites" (a --shape types rule whose type covers none of its measured files once adopted)

jarl: the new draft reason type-covers-none-of-its-sites and the two --json fields and two counts fields are additions inside existing /1 documents (the family's contract rule allows adding a field) — accepted in the patch
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2082, pass 2081, fail 0, skipped 1, merge f1c29c3

