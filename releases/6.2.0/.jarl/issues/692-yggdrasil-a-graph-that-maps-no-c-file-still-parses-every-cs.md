# 692 · Yggdrasil: a graph that maps no C# file still parses every .cs file cold, for project-wide facts nothing uses

**Status:** in-progress
**Kind:** cleanup
**Priority:** 3
**Tier:** light
**Key:** 20261112T0058-pepj
**Tags:** yggdrasil, performance
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** rev-530b-opus, round 2 (source/cli/src/relations/pass.ts:432, :986)
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
Reading every C# file of a project for its friend grants and global usings is needed only when some C# file is mapped; otherwise it is a cold parse of a whole tree for nothing.

## Acceptance
[test] With no C# file mapped, the relation pass parses no .cs file, red before and green after · by: cd source/cli && npm test

## Changelog
- yg check no longer parses the C# files of a repository that maps none; they are read only when a mapped C# file can see their project-wide facts.

## Reviews
- **changes** · by rev-683-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0354-vmnr
  Important (685): a key typed after --file of yg context or yg impact still prints whole when a node owns the path, existing or not: the text answer opens with the typed path (source/cli/src/cli/build-context.ts:697 and the context body below it; source/cli/src/cli/impact.ts:273 and its 'Editing <file> invalidates:' line), and yg context --file --json gives it whole in its path field, while yg owner masks the same path in text and in yg-owner/1. cli-key-arguments.test.ts tries context --file only with a path no node owns, so the case is untested; the line and the changelog ('A key typed as any argument is no longer echoed in full', '--file of yg context') claim it. Repro: a node mapping src/svc/, then yg context --file src/svc/sk-ant-api03-<20+ key chars>.ts. Minor (685): yg owner masks its whole answer (source/cli/src/cli/owner.ts:254, :240, :244), so a node whose own path is key-shaped shows as app/sk-a[REDACTED] in node and next of yg-owner/1 and in the text's next step, which names no node, while yg tree --json, yg find --json, yg context --node and yg check --json give that node path whole; decide with 704. Minor (676, wording): the note says the relation check reads 'only the files git lists', but a force-added file matched by .gitignore is listed by git and still left out (consistent with the check, which says so itself), and without git the .gitignore files decide. Tried and held: 59 argument forms (impact --flow/--type/--file/--node/--aspect, knowledge and schemas read, owner --file/--files, type-suggest, aspect-test, find, flows, tree, drill, simulate, log, incident, check --aspect/--node/--scope/--format, an unknown command, option and subcommand option, help), text and --json; 19 graph files holding a key, masked in every finding of check, tree, find, flows, context, owner and impact; machine fields of check --json unchanged; no absolute path in any not-found answer from the root, a subdirectory, outside the root or given absolute; the ignored note matches the relation check in seven repositories; 692 parses no .cs file with none mapped and still reads the unmapped ones with one mapped. Every new test fails on d2cc7b6af (44 of 169) and passes on ad91d0bf5 (267 of 267 in the touched files; tests/unit and tests/integration 8803 passed, the 10 failures reproduced as my own run's git and single-core timing and pass on a re-run, 48 of 48); yg check --approve --only-deterministic on the tip: warnings only.

## Evidence

### Proof

- **ran (line cc0bff4be22e):** cd source/cli && npx vitest run tests/unit/relations/csharp-unmapped-parse.test.ts (before the fix) · **saw:** 1 failed, 1 passed: with no C# file mapped the pass parsed 2 .cs files; the control with a mapped C# file passed
- **ran (line cc0bff4be22e):** cd source/cli && npx vitest run tests/unit/relations tests/e2e/relation-csharp-projects.test.ts tests/integration/relation-pass.test.ts (after the fix) · **saw:** Tests 146 passed: no .cs file is parsed when none is mapped; with one mapped the unmapped ones are still read
- **ran (line cc0bff4be22e):** cd source/cli && npx vitest run tests/unit/relations/csharp-unmapped-parse.test.ts tests/e2e/relation-csharp-projects.test.ts tests/integration/relation-pass.test.ts (base with the branch's test file; then tip) · **saw:** base: 1 failed (2 .cs files parsed with none mapped); tip: all pass, the control with a mapped C# file still parses the unmapped ones

### Notes

Assumed: with no C# file mapped, the unmapped C# files are skipped whole, including for the C# project reachability, which was already skipped in that case.

