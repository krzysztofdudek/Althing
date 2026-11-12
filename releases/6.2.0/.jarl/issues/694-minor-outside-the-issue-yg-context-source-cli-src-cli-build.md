# 694 · Minor, outside the issue: yg context (source/cli/src/cli/build-context.ts:715-736) prints the first…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0127-rkzj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641c-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more

## What
Minor, outside the issue: yg context (source/cli/src/cli/build-context.ts:715-736) prints the first line of the validator's findings without the mask yg check now applies at its assembly, so a key-shaped type name in type-when-mismatch is printed whole by yg context --node and --file (the same on the release build; adopt.ts:172 reads validate() the same way and was not tried).

## Why


## Acceptance


[test] yg context --node and --file, and adopt, mask a key-shaped type name in the validator's findings as yg check does, red before and green after · by: cd source/cli && npm test

## Changelog
- yg context and yg adopt show a key from the graph by its first four characters in the errors and problems they list, as yg check does.

## Reviews
- **changes** · by rev-683-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0354-vmnr
  Important (685): a key typed after --file of yg context or yg impact still prints whole when a node owns the path, existing or not: the text answer opens with the typed path (source/cli/src/cli/build-context.ts:697 and the context body below it; source/cli/src/cli/impact.ts:273 and its 'Editing <file> invalidates:' line), and yg context --file --json gives it whole in its path field, while yg owner masks the same path in text and in yg-owner/1. cli-key-arguments.test.ts tries context --file only with a path no node owns, so the case is untested; the line and the changelog ('A key typed as any argument is no longer echoed in full', '--file of yg context') claim it. Repro: a node mapping src/svc/, then yg context --file src/svc/sk-ant-api03-<20+ key chars>.ts. Minor (685): yg owner masks its whole answer (source/cli/src/cli/owner.ts:254, :240, :244), so a node whose own path is key-shaped shows as app/sk-a[REDACTED] in node and next of yg-owner/1 and in the text's next step, which names no node, while yg tree --json, yg find --json, yg context --node and yg check --json give that node path whole; decide with 704. Minor (676, wording): the note says the relation check reads 'only the files git lists', but a force-added file matched by .gitignore is listed by git and still left out (consistent with the check, which says so itself), and without git the .gitignore files decide. Tried and held: 59 argument forms (impact --flow/--type/--file/--node/--aspect, knowledge and schemas read, owner --file/--files, type-suggest, aspect-test, find, flows, tree, drill, simulate, log, incident, check --aspect/--node/--scope/--format, an unknown command, option and subcommand option, help), text and --json; 19 graph files holding a key, masked in every finding of check, tree, find, flows, context, owner and impact; machine fields of check --json unchanged; no absolute path in any not-found answer from the root, a subdirectory, outside the root or given absolute; the ignored note matches the relation check in seven repositories; 692 parses no .cs file with none mapped and still reads the unmapped ones with one mapped. Every new test fails on d2cc7b6af (44 of 169) and passes on ad91d0bf5 (267 of 267 in the touched files; tests/unit and tests/integration 8803 passed, the 10 failures reproduced as my own run's git and single-core timing and pass on a re-run, 48 of 48); yg check --approve --only-deterministic on the tip: warnings only.

## Evidence

### Proof

- **ran (line a6bd482a09d5):** cd source/cli && npx vitest run tests/e2e/cli-adopt.test.ts tests/e2e/cli-validation-codes.test.ts -t 'adopt shows a key|G17:' (before the fix) · **saw:** 3 failed: yg adopt (previewed and accepted) and yg context --file printed a key-shaped type name whole
- **ran (line a6bd482a09d5):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/e2e/cli-adopt.test.ts tests/unit/core (after the fix) · **saw:** Test Files 123 passed; the adopt cases and G17 pass: the key shows as sk-a[REDACTED]
- **ran (line a6bd482a09d5):** cd source/cli && npx vitest run tests/e2e/cli-adopt.test.ts tests/e2e/cli-validation-codes.test.ts (base with the branch's test files; then tip) · **saw:** base: the two adopt cases and G17 fail, the type name printed whole; tip: pass. check --json keeps node and file fields whole, before and after

### Notes

Assumed: masking sits in validate() itself, so yg check, yg context, yg adopt and the fill gate read the same masked findings; the mask at the place yg check assembles its report stays, as it covers findings that do not come from validate().

Dropped: Ruling yggdrasil-no-key-masking: Yggdrasil does not mask key-shaped values.

