# 676 · Yggdrasil: yg owner on a build file git ignores still names its node by path, while the relation pass now reads only the files git lists

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2328-icrc
**Tags:** yggdrasil, relations
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** w-530-sonnet, Runes 1.1.0 adoption report
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
After 235 an ignored build file takes no part in relations, so yg owner naming its node by path tells the user a file counts when it does not.

## Acceptance
[test] yg owner on a file git ignores says it takes no part in relations (or names no node for it), consistent with the relation pass, red before and green after · by: cd source/cli && npm test

## Changelog
- yg owner --file says when git ignores the file: for a file a component owns that git ignores, the answer adds that it takes no part in relations, as the relation check reads only the files git lists.

## Reviews
- **changes** · by rev-683-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0354-vmnr
  Important (685): a key typed after --file of yg context or yg impact still prints whole when a node owns the path, existing or not: the text answer opens with the typed path (source/cli/src/cli/build-context.ts:697 and the context body below it; source/cli/src/cli/impact.ts:273 and its 'Editing <file> invalidates:' line), and yg context --file --json gives it whole in its path field, while yg owner masks the same path in text and in yg-owner/1. cli-key-arguments.test.ts tries context --file only with a path no node owns, so the case is untested; the line and the changelog ('A key typed as any argument is no longer echoed in full', '--file of yg context') claim it. Repro: a node mapping src/svc/, then yg context --file src/svc/sk-ant-api03-<20+ key chars>.ts. Minor (685): yg owner masks its whole answer (source/cli/src/cli/owner.ts:254, :240, :244), so a node whose own path is key-shaped shows as app/sk-a[REDACTED] in node and next of yg-owner/1 and in the text's next step, which names no node, while yg tree --json, yg find --json, yg context --node and yg check --json give that node path whole; decide with 704. Minor (676, wording): the note says the relation check reads 'only the files git lists', but a force-added file matched by .gitignore is listed by git and still left out (consistent with the check, which says so itself), and without git the .gitignore files decide. Tried and held: 59 argument forms (impact --flow/--type/--file/--node/--aspect, knowledge and schemas read, owner --file/--files, type-suggest, aspect-test, find, flows, tree, drill, simulate, log, incident, check --aspect/--node/--scope/--format, an unknown command, option and subcommand option, help), text and --json; 19 graph files holding a key, masked in every finding of check, tree, find, flows, context, owner and impact; machine fields of check --json unchanged; no absolute path in any not-found answer from the root, a subdirectory, outside the root or given absolute; the ignored note matches the relation check in seven repositories; 692 parses no .cs file with none mapped and still reads the unmapped ones with one mapped. Every new test fails on d2cc7b6af (44 of 169) and passes on ad91d0bf5 (267 of 267 in the touched files; tests/unit and tests/integration 8803 passed, the 10 failures reproduced as my own run's git and single-core timing and pass on a re-run, 48 of 48); yg check --approve --only-deterministic on the tip: warnings only.

## Evidence

### Proof

- **ran (line 74802ddf8fe8):** cd source/cli && npx vitest run tests/e2e/relation-checkout-files.test.ts (before the fix) · **saw:** 1 failed, 3 passed: yg owner on an ignored file under a mapped directory named the node and said nothing of relations
- **ran (line 74802ddf8fe8):** cd source/cli && npx vitest run tests/e2e/relation-checkout-files.test.ts tests/unit/cli/owner.test.ts tests/e2e/cli-read-json.test.ts (after the fix) · **saw:** Tests 42 passed: the answer adds that the file is ignored by git and takes no part in relations; a listed file gets no such note
- **ran (line 74802ddf8fe8):** cd source/cli && npx vitest run tests/e2e/relation-checkout-files.test.ts (base d2cc7b6af with the branch's test files; then tip ad91d0bf5) · **saw:** base: 1 failed (yg owner on an ignored file named the node and said nothing of relations); tip: passes. Probe on the built tip, seven repositories (listed, untracked ignored, force-added but ignored, .git/info/exclude, nested .gitignore, negated pattern, ignored directory, and one without git): the note shows exactly when yg check reports no undeclared dependency from that file

### Notes

Assumed: the note is added to the text answer of yg owner --file for any file a component owns and git ignores, not only build files, because the relation pass leaves out every ignored file. The yg-owner/1 and yg-owner-batch/1 documents keep their fields, since a new field changes a published contract; the --files text is unchanged.

