# 684 · Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0004-fbcl
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682
**Branch:** jarl/683-keys-more

## What
Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source excerpt, an unknown key, an unresolved alias, and the checks that quote a node's type, aspects, relation target or mapping, a flow's nodes, and a rule's implies or references (same on release/6.2.0) Also: an aspect id holding a key in a node's, port's or flow's own aspects list (yg-node.yaml, yg-flow.yaml) prints whole in aspect-undefined (core/checks/aspects.ts), found by w-641-sonnet.

## Why


## Acceptance


[test] A key-shaped value in a node or flow file is masked in the YAML parse error's excerpt, an unknown key, an unresolved alias, and every check that quotes a node's type, aspects, relation target or mapping, a flow's nodes, a rule's implies or references, and an aspect id in a node's, port's or flow's aspects list, in text and --json, red before and green after · by: cd source/cli && npm test

## Changelog
- A key pasted into a node or flow file is no longer printed whole when yg tree, yg find, yg flows or yg context say the file did not load; it shows by its first four characters, as in yg check.

## Reviews
- **changes** · by rev-683-opus (fresh) · 2026-11-12 · model claude-opus-5-5 · batch 20261112T0354-vmnr
  Important (685): a key typed after --file of yg context or yg impact still prints whole when a node owns the path, existing or not: the text answer opens with the typed path (source/cli/src/cli/build-context.ts:697 and the context body below it; source/cli/src/cli/impact.ts:273 and its 'Editing <file> invalidates:' line), and yg context --file --json gives it whole in its path field, while yg owner masks the same path in text and in yg-owner/1. cli-key-arguments.test.ts tries context --file only with a path no node owns, so the case is untested; the line and the changelog ('A key typed as any argument is no longer echoed in full', '--file of yg context') claim it. Repro: a node mapping src/svc/, then yg context --file src/svc/sk-ant-api03-<20+ key chars>.ts. Minor (685): yg owner masks its whole answer (source/cli/src/cli/owner.ts:254, :240, :244), so a node whose own path is key-shaped shows as app/sk-a[REDACTED] in node and next of yg-owner/1 and in the text's next step, which names no node, while yg tree --json, yg find --json, yg context --node and yg check --json give that node path whole; decide with 704. Minor (676, wording): the note says the relation check reads 'only the files git lists', but a force-added file matched by .gitignore is listed by git and still left out (consistent with the check, which says so itself), and without git the .gitignore files decide. Tried and held: 59 argument forms (impact --flow/--type/--file/--node/--aspect, knowledge and schemas read, owner --file/--files, type-suggest, aspect-test, find, flows, tree, drill, simulate, log, incident, check --aspect/--node/--scope/--format, an unknown command, option and subcommand option, help), text and --json; 19 graph files holding a key, masked in every finding of check, tree, find, flows, context, owner and impact; machine fields of check --json unchanged; no absolute path in any not-found answer from the root, a subdirectory, outside the root or given absolute; the ignored note matches the relation check in seven repositories; 692 parses no .cs file with none mapped and still reads the unmapped ones with one mapped. Every new test fails on d2cc7b6af (44 of 169) and passes on ad91d0bf5 (267 of 267 in the touched files; tests/unit and tests/integration 8803 passed, the 10 failures reproduced as my own run's git and single-core timing and pass on a re-run, 48 of 48); yg check --approve --only-deterministic on the tip: warnings only.

## Evidence

### Proof

- **ran (line 52da7f994a25):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts -t 'G[0-9]+:' (before the fix) · **saw:** 17 of 17 cases failed: yg context, yg tree, yg find and yg flows printed the pasted key whole
- **ran (line 52da7f994a25):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/core tests/unit/io tests/unit/cli (after the fix) · **saw:** Test Files 252 passed, Tests 4826 passed; F1-F17 (yg check, text and --json) and G1-G17 pass. F1-F17 were already green before: yg check masked these already
- **ran (line 52da7f994a25):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts (base with the branch's test files; then tip, and tests/unit tests/integration on the tip) · **saw:** base: G1-G17 fail; tip: all pass. Probe on the built tip, 19 node, flow and architecture files holding a key (relation type, status, mapping outside, duplicate key, tab, wrong types, relation target, aspect, flow aspect, alias, tag, parents, consumes, mapping file, flow nodes) across check, check --json, tree, find, flows, context, owner, impact: masked in every finding; only the flows listing prints a flow's aspect whole (issue 704)

### Notes

Assumed: yg check already masked every case of this issue (the mask at the place where it assembles findings landed first); the remaining leaks were the other commands that word the same findings (yg context, yg tree, yg find, yg flows, yg adopt). They are masked where the findings are made: the validator's result and the loader's messages for a node or flow file that did not load. Data listings that print graph content as it is (the type column of yg tree, the Type line of yg find, the participants and rules of yg flows, the body of yg context) are not findings and were left as they are.

Dropped: Ruling yggdrasil-no-key-masking: Yggdrasil does not mask key-shaped values.

