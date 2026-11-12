# 683 · Yggdrasil: yg context --file with a path that does not exist prints the repository root's absolute …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-etkf
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: yg context --file with a path that does not exist prints the repository root's absolute path in its error, next step and --json explanation (same on release/6.2.0)

## Why


## Acceptance


[test] yg context --file with a path that does not exist names it by its repository-relative POSIX path in the error, the next step and --json, red before and green after · by: cd source/cli && npm test

## Changelog
- yg context --file and yg impact --file no longer print the repository's absolute path when the file does not exist; the error, its next step and the explanation of the --json document name the path from the repository root.

## Reviews
- **changes** · by rev-683-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0354-vmnr
  Important (685): a key typed after --file of yg context or yg impact still prints whole when a node owns the path, existing or not: the text answer opens with the typed path (source/cli/src/cli/build-context.ts:697 and the context body below it; source/cli/src/cli/impact.ts:273 and its 'Editing <file> invalidates:' line), and yg context --file --json gives it whole in its path field, while yg owner masks the same path in text and in yg-owner/1. cli-key-arguments.test.ts tries context --file only with a path no node owns, so the case is untested; the line and the changelog ('A key typed as any argument is no longer echoed in full', '--file of yg context') claim it. Repro: a node mapping src/svc/, then yg context --file src/svc/sk-ant-api03-<20+ key chars>.ts. Minor (685): yg owner masks its whole answer (source/cli/src/cli/owner.ts:254, :240, :244), so a node whose own path is key-shaped shows as app/sk-a[REDACTED] in node and next of yg-owner/1 and in the text's next step, which names no node, while yg tree --json, yg find --json, yg context --node and yg check --json give that node path whole; decide with 704. Minor (676, wording): the note says the relation check reads 'only the files git lists', but a force-added file matched by .gitignore is listed by git and still left out (consistent with the check, which says so itself), and without git the .gitignore files decide. Tried and held: 59 argument forms (impact --flow/--type/--file/--node/--aspect, knowledge and schemas read, owner --file/--files, type-suggest, aspect-test, find, flows, tree, drill, simulate, log, incident, check --aspect/--node/--scope/--format, an unknown command, option and subcommand option, help), text and --json; 19 graph files holding a key, masked in every finding of check, tree, find, flows, context, owner and impact; machine fields of check --json unchanged; no absolute path in any not-found answer from the root, a subdirectory, outside the root or given absolute; the ignored note matches the relation check in seven repositories; 692 parses no .cs file with none mapped and still reads the unmapped ones with one mapped. Every new test fails on d2cc7b6af (44 of 169) and passes on ad91d0bf5 (267 of 267 in the touched files; tests/unit and tests/integration 8803 passed, the 10 failures reproduced as my own run's git and single-core timing and pass on a re-run, 48 of 48); yg check --approve --only-deterministic on the tip: warnings only.

## Evidence

### Proof

- **ran (line c76dc8422231):** cd source/cli && npx vitest run tests/e2e/cli-file-arg-missing.test.ts (before the fix) · **saw:** 1 failed, 6 passed: context --file with a missing path printed the repository root's absolute path
- **ran (line c76dc8422231):** cd source/cli && npx vitest run tests/e2e/cli-file-arg-missing.test.ts tests/e2e/cli-impact.test.ts tests/unit/cli (after the fix) · **saw:** Test Files 71 passed, Tests 1333 passed: the error, the next step and the --json explanation name the path from the repository root, with no absolute path
- **ran (line c76dc8422231):** cd source/cli && npx vitest run tests/e2e/cli-file-arg-missing.test.ts (base with the branch's test files; then tip) · **saw:** base: 2 failed (the root's absolute path in the error and next step); tip: passes. Probe: context, impact, owner, owner --files, type-suggest, aspect-test --file with a missing path, from the root and from a subdirectory, a path outside the root and an absolute path, text and --json: no absolute path printed

### Notes

Assumed: the answer says 'relative to the repository root' without naming the root; the old test that required the root's path in the answer now requires its absence.

