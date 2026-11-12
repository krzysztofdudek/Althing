# 690 · Yggdrasil: its own yg check shows a standing relation-package-entry-missing warning for source/cli/package.json (entry dist/ast.js, imported as @chrisdudek/yg/ast); clearing it moves the entries and needs yg-architecture.yaml to allow rule scripts and test fixtures to use the ast adapter

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261112T0038-byfn
**Tags:** yggdrasil, relations, architecture
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** rev-530-opus and w-530-sonnet, Runes 1.1.0 adoption (patch kept in the large-file area as '530 package entry layout.patch')
**Branch:** jarl/690-small-rest
**Worker:** w-690-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:29

## What


## Why
A standing warning on the tool's own repository teaches its users to ignore warnings; the fix that builds the entries where the exports point turns about fifty rule scripts and a fixture into undeclared dependencies on cli/ast/report, which the architecture forbids today.

## Acceptance
- [owner] The owner decides whether yg-architecture.yaml allows uses from rule-script and test-fixture to ast-adapter · material: the patch '530 package entry layout.patch' in the large-file area and the list of affected rule scripts · check: that the allowed relation matches what those scripts really import
- [test] With his word, Yggdrasil's own yg check shows no relation-package-entry-missing warning and the graph check stays green · by: cd source/cli && npm test

## Reviews
- **changes** · by rev-690-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0536-badz
  Important: four nodes whose files 690 changed still end their log with the 530 entry that says the opposite of the code. cli/config/build (source/cli/package.json), cli/config/linters (source/cli/tsup.config.ts), docs/guides (docs/reviewers.md) and scripts (scripts/metamorphic.mjs) each end with 'The package entries ... are back at the flat files dist/ast.js and dist/structure.js ... until then the check keeps its standing warning' (e.g. .yggdrasil/model/cli/config/build/log.md, last entry), while the branch moves the entries to dist/ast/index.js and dist/structure/index.js and clears the warning; only cli/ast/runtime got a new entry. A reader or a reviewer given these logs learns the reverse of what the code does; each needs a yg log add saying the entries moved under the owner's architecture answer. Minor: source/cli/src/ast/loader-hook.ts:14 still says 'In production: dist/ast/loader-hook.js → dist/ast/loader-hook-impl.js', and dist/structure/index.js (which bundles the loader hook) now reaches loader-hook-impl.js only through the branch labelled a dev/test fallback (v8 ignore), via the package root; it works (checked by path and by a packed install), but the comment and label are now wrong; det-worker-pool.ts:45 says the same of the flat layout. Minor: 690 has no CHANGELOG line although docs/reviewers.md now points types at dist/ast/index.d.ts; an adopter who named dist/ast.d.ts directly (tsconfig paths) would notice; the worker's reasoning that package exports resolve the same holds for every supported import. Checked and fine: architecture diff is exactly uses: [ast-adapter] under test-fixture and rule-script; graph-rules and cli/tests/fixtures declare uses cli/ast/report; packed package with a local Runes 1.1.0 pack installs into a scratch consumer and imports @chrisdudek/yg/ast and /structure in Node and under tsc nodenext; yg check on the tip passes with no relation-package-entry-missing; repo-check green except pack-smoke (679) and docs steps that lacked docs/node_modules in the scratch copy, docs build green when rerun; package-entry test red before ('./dist/ast.js should map to the source src/ast.ts') and green after; 699 dry-run test red before, green after, CHANGELOG under Fixed says the run now exits 1 so a script can tell a partial preview; tried to get past the new exit on the built tool with a reasonless yg-suppress marker in one of two units: named, the other unit printed, exit 1; the 5 type-covered pins pass (pins, not red before, as 560 fixed that half); the 704 revert leaves no trace (2492495d0^..cd803b5a5 nets only 699's own doc commit, no 704 lock, event or log rows remain).
  outside the issue, filed as 726: Yggdrasil aspect-test: assembleTestPrompt (source/cli/src/cli/aspect-test.ts:1052-1058) replaces a subject file it cannot read with empty text and goes on, so a dry run or a live run previews or judges an empty file and ends clean instead of naming the unit as not assembled; the new incomplete stamp does not cover it.

## Evidence

### Proof

- **ran (line 08c94c6fd3b9):** cd source/cli && npx vitest run tests/unit/relations/package-entry-source.test.ts (red before: ./dist/ast.js should map to the source src/ast.ts); node source/cli/dist/bin.js check --approve --only-deterministic · **saw:** green after: 2 tests pass; the check no longer prints relation-package-entry-missing nor relation-undeclared-dependency; the only remaining errors are reviewer pairs left open for the jarl
- **ran (line 08c94c6fd3b9):** cd source/cli && npx vitest run tests/unit/relations/package-entry-source.test.ts on tip 9e939f93a, and with package.json and tsup.config.ts from release/6.2.0; node source/cli/dist/bin.js check --approve --only-deterministic on a scratch copy of the tip; scripts/repo-check.sh on the tip; npm pack, installed with a local pack of Runes 1.1.0 into a scratch consumer that imports @chrisdudek/yg/ast and /structure in Node and tsc (nodenext) · **saw:** red before: ./dist/ast.js should map to the source src/ast.ts; green after: 2 tests pass; yg check: PASS 520 nodes, 8405 pairs verified, no relation-package-entry-missing and no relation-undeclared-dependency; repo-check: 746 test files passed, coverage, lint, typecheck, markdown lint and graph check green, failed only on pack-smoke (Runes tarball 404, issue 679) and on docs steps missing docs/node_modules in the scratch copy, docs build green when rerun with them; the consumer resolves both entries and tsc passes; the architecture diff is exactly two lines, uses: [ast-adapter] under test-fixture and rule-script

### Notes

Assumed: no CHANGELOG entry, because an adopter on the previous version sees nothing: the package exports resolve to the same entries, and the warning removed is only on this repository's own check. The architecture change is exactly two uses relations (rule-script to ast-adapter, test-fixture to ast-adapter); the graph also needed the two nodes graph-rules and cli/tests/fixtures to declare a uses relation to cli/ast/report, which the check named.

