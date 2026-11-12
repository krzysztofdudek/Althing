# 699 · Yggdrasil: a dry run exits 0 when it reports and skips a unit, and pairs on type-covered files still take the check-failed-to-run cause

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261112T0250-vtrl
**Tags:** yggdrasil, reports
**Files:** 
**Repo:** Yggdrasil
**After:** 560
**Found by:** jarl
**Where:** w-560-sonnet, memory rest package report
**Branch:** jarl/690-small-rest
**Worker:** w-690-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:29

## What


## Why
A dry run that skipped work should not look like a clean one to a script, and a type-covered file left unverified by the parser-memory or text-limit case should carry the same cause as a mapped file (639, 655).

## Acceptance
[test] A dry run that reports and skips a unit exits non-zero with the unit named, and a type-covered file's pair left unverified by the parser-memory or text-limit case carries that cause, red before and green after · by: cd source/cli && npm test

## Changelog
- **`yg aspect-test --dry-run` no longer ends like a clean run when it left a unit out.** A unit whose prompt cannot be assembled (a companion that fails, a suppress marker without a reason) is still reported and skipped while the other units print, and the run now ends with `yg aspect-test: incomplete` naming each skipped unit and exits 1, so a script can tell a partial preview from a complete one.

## Reviews
- **changes** · by rev-690-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0536-badz
  Important: four nodes whose files 690 changed still end their log with the 530 entry that says the opposite of the code. cli/config/build (source/cli/package.json), cli/config/linters (source/cli/tsup.config.ts), docs/guides (docs/reviewers.md) and scripts (scripts/metamorphic.mjs) each end with 'The package entries ... are back at the flat files dist/ast.js and dist/structure.js ... until then the check keeps its standing warning' (e.g. .yggdrasil/model/cli/config/build/log.md, last entry), while the branch moves the entries to dist/ast/index.js and dist/structure/index.js and clears the warning; only cli/ast/runtime got a new entry. A reader or a reviewer given these logs learns the reverse of what the code does; each needs a yg log add saying the entries moved under the owner's architecture answer. Minor: source/cli/src/ast/loader-hook.ts:14 still says 'In production: dist/ast/loader-hook.js → dist/ast/loader-hook-impl.js', and dist/structure/index.js (which bundles the loader hook) now reaches loader-hook-impl.js only through the branch labelled a dev/test fallback (v8 ignore), via the package root; it works (checked by path and by a packed install), but the comment and label are now wrong; det-worker-pool.ts:45 says the same of the flat layout. Minor: 690 has no CHANGELOG line although docs/reviewers.md now points types at dist/ast/index.d.ts; an adopter who named dist/ast.d.ts directly (tsconfig paths) would notice; the worker's reasoning that package exports resolve the same holds for every supported import. Checked and fine: architecture diff is exactly uses: [ast-adapter] under test-fixture and rule-script; graph-rules and cli/tests/fixtures declare uses cli/ast/report; packed package with a local Runes 1.1.0 pack installs into a scratch consumer and imports @chrisdudek/yg/ast and /structure in Node and under tsc nodenext; yg check on the tip passes with no relation-package-entry-missing; repo-check green except pack-smoke (679) and docs steps that lacked docs/node_modules in the scratch copy, docs build green when rerun; package-entry test red before ('./dist/ast.js should map to the source src/ast.ts') and green after; 699 dry-run test red before, green after, CHANGELOG under Fixed says the run now exits 1 so a script can tell a partial preview; tried to get past the new exit on the built tool with a reasonless yg-suppress marker in one of two units: named, the other unit printed, exit 1; the 5 type-covered pins pass (pins, not red before, as 560 fixed that half); the 704 revert leaves no trace (2492495d0^..cd803b5a5 nets only 699's own doc commit, no 704 lock, event or log rows remain).
  outside the issue, filed as 726: Yggdrasil aspect-test: assembleTestPrompt (source/cli/src/cli/aspect-test.ts:1052-1058) replaces a subject file it cannot read with empty text and goes on, so a dry run or a live run previews or judges an empty file and ends clean instead of naming the unit as not assembled; the new incomplete stamp does not cover it.

## Evidence

### Proof

- **ran (line 484bf4becc3f):** cd source/cli && npx vitest run tests/unit/cli/aspect-test.test.ts (red before: no incomplete stamp, exit undefined) · **saw:** green after: a dry run that skips a unit prints 'yg aspect-test: incomplete — 1 of 1 unit could not be previewed: node:N' and exits 1; this is the dry-run half of the line only, the type-covered-cause half is not done (depends on 560)
- **ran (line 484bf4becc3f):** cd source/cli && npx vitest run tests/e2e/unverified-by-input-limits.test.ts (5 new type-covered cases: text limit, parser memory in json and text report, worker-pool path, a real crash) · **saw:** all green on release/6.2.0 merged in (b56d54188): a type-covered file's pair carries file-over-text-limit or parser-out-of-memory, headed 'left unjudged'; a real crash keeps check-failed-to-run. The fault no longer holds after the 560 merge, so these cases are pins, not red-before
- **ran (line 484bf4becc3f):** cd source/cli && npx vitest run tests/unit/cli/aspect-test.test.ts tests/e2e/unverified-by-input-limits.test.ts on tip, and aspect-test.test.ts with src/cli/aspect-test.ts from release/6.2.0; built yg aspect-test --aspect cli-command-contract --node cli/commands/drill --dry-run with a reasonless yg-suppress marker in drill-add.ts · **saw:** red before: no incomplete stamp; green after: 52 aspect-test tests and the 5 type-covered pins pass (pins, not red before, since 560 already fixed that half); the built tool prints the prompt of drill.ts, ends 'yg aspect-test: incomplete — 1 of 2 units could not be previewed: file:source/cli/src/cli/drill-add.ts' and exits 1

### Notes

Assumed: the 'dry run that reports and skips a unit' is yg aspect-test --dry-run (a unit whose prompt cannot be assembled is reported and skipped, then the run exited 0); yg check --approve --dry-run is documented to exit 0 always and stays so. The stamp reads 'yg aspect-test: incomplete — N of M units could not be previewed: <unit keys>', the live path's incomplete stamp. The second half of the line (a type-covered file's pair carrying the parser-memory or text-limit cause) cannot be built or proved on release/6.2.0: those causes (parser-out-of-memory, file-over-text-limit) exist only on jarl/560-memory-rest, not yet merged, so it is NOT done and needs this issue re-sent after 560 lands.

