# 032 · yg-check/1: violations[] and edges[] are rebuilt from the `what` prose and come out wrong: file-level violations are merged into one and lose their file; a node path with a space is cut off, and allowedRelations are lost

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-ueyv
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/formatters/check-json.ts, Yggdrasil/source/cli/src/core/check-json.ts, Yggdrasil/source/cli/src/core/fill-det.ts, Yggdrasil/source/cli/src/relations/messages.ts, Yggdrasil/source/cli/src/formatters/check-render-groups.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/formatters/check-json.ts:368-386 (violationsOf: regex :376 `/^\s*(.+?):(\d+): (.*)$/`, appending :380, {file:'', line:null} :382), :393-396 (issueViolations, the shared reader); source/cli/src/core/check-json.ts:111-127 (edgesOf: `(\S+)` :121, lookup importRelationsAllowed :123); core/fill-det.ts:220-228 (a violation without a line recorded as `file: msg`); relations/messages.ts:62
**Branch:** jarl/032-check-report
**Merged:** 27d1e12f8f5b3f49d31a66d8c13078164c0c909e
**CI:** none

## What
Both structured fields are parsed by regex from the `what` text instead of being built from the data that produced it. Reproduction (fresh clone of v6.1.0 and npm @chrisdudek/yg@6.1.0, node v24.11.1). Part A: in examples/checkout-flow a script rule returns violations {file, message} without line (allowed by the contract `{ message: string, file?: string, line?: number }`, docs/reviewers.md:300-305, structure/runner.ts:226) for two files of the cart node. `yg aspect-test`: 2 violations, one per file. `yg check --json`: violations = [{file:'', line:null, message:'src/cart-extra.ts: file never calls track()\nsrc/cart-more.ts: file never calls track()'}]; the text report of `yg check --no-approve` shows the same single merged violation (the same reader), and check-render-groups.ts:326 counts 0 violations (it counts only rows with a line). Control A2 with `line: 1`: two correct entries with file and line. Part B: examples/layered-architecture with model/data renamed to 'data store' (`yg tree` shows it; node path validation does not forbid spaces) and an import from web: what = '…src/web/rideHandler.ts:35 → data store', while edges = [{target:'data'}] (a node that does not exist) and no allowedRelations; for domain, next says 'data store: allowed relation type [calls]', and the field is missing (it should be ['calls']; for web []). Control C without the rename: target 'data', allowedRelations []. The same code on upstream main 2493aa16d. Issue 365 (6.1.0) only added edges[].allowedRelations. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-29/repro.log (script repro.sh).

## Why
This is wrong data in a documented machine contract that Horde and agents read from, with no warning at all. cli-reference.md:386 and the schema docs/public/schemas/yg-check-1.schema.json say 'one per reported location, never cut', and the CheckJsonViolation type has line: number|null; a file-level script rule is an ordinary, documented shape.

## Acceptance
- CheckIssue carries the script's array of violations and the data of relation violations (fromFile, line, ownerNode), and violations[] and edges[] are projected from them without a regex on `what`; part A gives two entries with a file and line null, and the text report counts 2 violations.
- Part B gives target 'data store' with allowedRelations [] for web and ['calls'] for domain.

## Changelog
- Fixed: yg check --json lists every violation and every edge as reported — file-level script violations are one entry each with their file and line null (and counted in the text report), and an edge to a component whose path holds a space names the whole path with its allowedRelations.

## Evidence

- **ran (history):** git commit (merge of jarl/032-check-report into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.19%; [repo-check] All checks passed; [release/6.1.1 27d1e12f8] Merge jarl/032-check-report

