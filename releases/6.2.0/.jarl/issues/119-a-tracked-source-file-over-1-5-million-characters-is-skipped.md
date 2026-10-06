# 119 · A tracked source file over 1.5 million characters is skipped by the relation pass, so C#/Kotlin references to the types it declares (e.g. a generated API client) vanish in Grain, while yg check resolves and rejects them

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/partition.mjs, Grain/plugins/grain/engine/report-facts.mjs, Grain/plugins/grain/engine/check.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/partition.mjs:186 in extractTree: `if (src == null || src.length > 1.5e6) continue;` stands before the only parse that yields both the scopes and the relation facts (`relOut[rel] = relFactsFor(...)` at :191); nothing records the skip, and relCoverageData (engine/report-facts.mjs:136) does not count it; checkFile (engine/check.mjs:40) has no cap, so `grain check <large file>` gives relation facts that disagree with the model. history.mjs:369 is a separate gate on history blobs, with no effect on these edges.
**Branch:** jarl/100-binary-and-oversize-sources
**Merged:** 438d8f5
**CI:** none

## What
Reproduction (fresh Grain ae6152f, v6.1.0; yg 6.1.0 from npm; own fixture generator and graph in verify-55/tools/, not the finder's scripts): Grain loses edges exactly at the threshold of 1.5e6 characters, while yg check rejects the same dependencies at every size.
- C#: at 1 465 925 characters Grain has both edges (App->Generated and Generated->Models); at 1 527 925 and 1 540 325 it has neither.
- Kotlin: at 1 490 398 both; at 1 502 498 neither, including a plain `import acme.generated.ApiClient`, because Kotlin imports resolve through declarations.
- TypeScript: the incoming edge (a path import) survives, but what disappears is the large file's outgoing edge to models/order.ts.
So the gap is wider than in the report: every language loses the large file's outgoing edges, and the languages resolved by symbols (C#, Kotlin) lose the incoming ones too.

- Cause (repro-capraised.log): a second clone with only this line changed to 1.5e9; all edges come back at every size.
- Silence (repro-real.log): a realistic C# repo with 12 ordinary files and one generated client of 1 540 325 characters. Grain loses the 5 edges touching the client (13 → 8) and still reports relCoverage {n:0}, i.e. discloses nothing. In the finder's 3-file fixture relCoverage reported c_sharp as uncovered only by accident: the zero-edge floor from issue 086 kicked in and blamed the language, not the file size.
- Parity (repro-yg-6mb.log): yg 6.1.0 resolves and rejects the dependency also for a file of 6.18 million characters; yg's 5 MB FileContentCache limit does not apply to its dependency pass.

The gate is a deliberate guard on parsing cost (Grain's engine research, kept private, sections 1.10 and 5.5: 'oversize ⇒ file-level row only'), but the code skips the file entirely, and the relation pass inherited the gate without weighing the consequences; neither README.md nor docs/reference.md mentions it. Corrections relative to the report: the cap counts UTF-16 characters after CR normalization, not bytes; the function is extractTree, not extractScopes; history.mjs:369 plays no part in this edge loss. The same line affects the binary `*.ts` files from issue 100 (a different class of files, a different effect). Distinct from 052 (the cut at 30 000 edges).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-4/F8-big-file/repro.log (script repro.sh); verification <the session scratchpad, since lost>/bughunt/grain/verify-55/repro.log and repro-capraised.log, repro-real.log, repro-yg-6mb.log in the same directory.

## Why
Generated OpenAPI, gRPC and protobuf clients are often this large. Grain silently loses the edges to and from them, so propose does not declare a relation that yg check then rejects, and the coverage report discloses nothing. The bug is safe in the sense that it ends in a visible red check after adoption, not in a false green, hence minor.

## Acceptance
- A file over the parse cap still yields declarations and imports for the relation pass (e.g. through a relations-only extraction), or the skip is disclosed as a coverage gap in relStages/relCoverage and in the propose output.
- The realistic C# repo from repro-real.log: Grain has 13 edges, or discloses explicitly that the edges of src/Generated/ApiClient.cs were not resolved because of the size.
- The size cap and its effect on relations are described in docs/reference.md.

## Changelog
- Fixed: a source file over 1.5 million characters, such as a large generated API client, is no longer skipped in silence: status, report, rules, export and propose name it and say that its dependencies are not resolved.

## Evidence

docs: docs/reference.md: say that a source file over 1.5 million characters is not parsed — it adds no conventions and its dependencies are not resolved (yg check resolves them) — and that status, report, rules, propose and relCoverage.unparsed.size name it; engine/export.mjs relCoverage schema note: the optional unparsed {size, binary, failed} field
- **ran:** nice -n 15 node --import ./tests/git-env.mjs --test tests/oversize-source-disclosed.test.mjs (release/6.1.1 base, then 9ec7e67) · **saw:** base: 4 fail (relCoverage.unparsed undefined; status lacks the note), 1 pass (control); 9ec7e67: 5 pass, 0 fail
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1951, pass 1950, fail 0, skipped 1, merge 438d8f5

