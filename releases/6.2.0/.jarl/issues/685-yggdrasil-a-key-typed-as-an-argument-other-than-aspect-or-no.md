# 685 · Yggdrasil: a key typed as an argument other than --aspect or --node is echoed whole: impact --flow …

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-qbyk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more

## What
Yggdrasil: a key typed as an argument other than --aspect or --node is echoed whole: impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, find --json, and an unknown command or option (same on release/6.2.0)

## Why


## Acceptance


[test] A key-shaped value typed as any argument (impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, find --json, an unknown command or option) is masked in every answer, red before and green after · by: cd source/cli && npm test

## Changelog
- A key typed as any argument is no longer echoed in full: impact --flow and --type, knowledge read, schemas read, --file of context, owner, aspect-test and type-suggest, owner --files, the query of find --json, and an unknown command or option show it by its first four characters.

## Reviews
- **changes** · by rev-683-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0354-vmnr
  Important (685): a key typed after --file of yg context or yg impact still prints whole when a node owns the path, existing or not: the text answer opens with the typed path (source/cli/src/cli/build-context.ts:697 and the context body below it; source/cli/src/cli/impact.ts:273 and its 'Editing <file> invalidates:' line), and yg context --file --json gives it whole in its path field, while yg owner masks the same path in text and in yg-owner/1. cli-key-arguments.test.ts tries context --file only with a path no node owns, so the case is untested; the line and the changelog ('A key typed as any argument is no longer echoed in full', '--file of yg context') claim it. Repro: a node mapping src/svc/, then yg context --file src/svc/sk-ant-api03-<20+ key chars>.ts. Minor (685): yg owner masks its whole answer (source/cli/src/cli/owner.ts:254, :240, :244), so a node whose own path is key-shaped shows as app/sk-a[REDACTED] in node and next of yg-owner/1 and in the text's next step, which names no node, while yg tree --json, yg find --json, yg context --node and yg check --json give that node path whole; decide with 704. Minor (676, wording): the note says the relation check reads 'only the files git lists', but a force-added file matched by .gitignore is listed by git and still left out (consistent with the check, which says so itself), and without git the .gitignore files decide. Tried and held: 59 argument forms (impact --flow/--type/--file/--node/--aspect, knowledge and schemas read, owner --file/--files, type-suggest, aspect-test, find, flows, tree, drill, simulate, log, incident, check --aspect/--node/--scope/--format, an unknown command, option and subcommand option, help), text and --json; 19 graph files holding a key, masked in every finding of check, tree, find, flows, context, owner and impact; machine fields of check --json unchanged; no absolute path in any not-found answer from the root, a subdirectory, outside the root or given absolute; the ignored note matches the relation check in seven repositories; 692 parses no .cs file with none mapped and still reads the unmapped ones with one mapped. Every new test fails on d2cc7b6af (44 of 169) and passes on ad91d0bf5 (267 of 267 in the touched files; tests/unit and tests/integration 8803 passed, the 10 failures reproduced as my own run's git and single-core timing and pass on a re-run, 48 of 48); yg check --approve --only-deterministic on the tip: warnings only.

## Evidence

### Proof

- **ran (line e816fbf77280):** cd source/cli && npx vitest run tests/e2e/cli-key-arguments.test.ts (before the fix) · **saw:** 17 of 21 cases failed: impact --flow/--type, knowledge read, schemas read, --file of context/owner/aspect-test/type-suggest, owner --files, find --json, unknown command and option printed the key whole
- **ran (line e816fbf77280):** cd source/cli && npx vitest run tests/e2e/cli-key-arguments.test.ts (after the fix) · **saw:** all cases pass (16 passed on the first set; the final set of 18 passes in the full vitest run); the answers show sk-a[REDACTED], text and JSON
- **ran (line e816fbf77280):** cd source/cli && npx vitest run tests/e2e/cli-key-arguments.test.ts (base with the branch's test files; then tip) · **saw:** base: 17 failed; tip: passes. Probe of 59 argument forms on the built tip: masked everywhere except yg context --file and yg impact --file on a path a node owns, whose text answer opens with the typed path whole (and context --json gives it whole in path)

### Notes

Assumed: errors, warnings and notes are masked once in the output layer (fail, warn, notice), which covers impact --flow/--type, knowledge read, schemas read, aspect-test --file, the unknown command and option; yg owner, yg type-suggest, yg find --json and the no-owner document of yg context --file mask the path or query they echo themselves. yg-error/1 carries the masked text.

Dropped: Ruling yggdrasil-no-key-masking: Yggdrasil does not mask key-shaped values.

