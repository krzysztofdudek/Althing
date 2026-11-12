# 684 · Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source…

**Status:** in-progress
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
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: a key-shaped value in a node or flow file prints whole: in the YAML parse error's source excerpt, an unknown key, an unresolved alias, and the checks that quote a node's type, aspects, relation target or mapping, a flow's nodes, and a rule's implies or references (same on release/6.2.0) Also: an aspect id holding a key in a node's, port's or flow's own aspects list (yg-node.yaml, yg-flow.yaml) prints whole in aspect-undefined (core/checks/aspects.ts), found by w-641-sonnet.

## Why


## Acceptance


[test] A key-shaped value in a node or flow file is masked in the YAML parse error's excerpt, an unknown key, an unresolved alias, and every check that quotes a node's type, aspects, relation target or mapping, a flow's nodes, a rule's implies or references, and an aspect id in a node's, port's or flow's aspects list, in text and --json, red before and green after · by: cd source/cli && npm test

## Changelog
- A key pasted into a node or flow file is no longer printed whole when yg tree, yg find, yg flows or yg context say the file did not load; it shows by its first four characters, as in yg check.

## Evidence

### Proof

- **ran (line 52da7f994a25):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts -t 'G[0-9]+:' (before the fix) · **saw:** 17 of 17 cases failed: yg context, yg tree, yg find and yg flows printed the pasted key whole
- **ran (line 52da7f994a25):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/core tests/unit/io tests/unit/cli (after the fix) · **saw:** Test Files 252 passed, Tests 4826 passed; F1-F17 (yg check, text and --json) and G1-G17 pass. F1-F17 were already green before: yg check masked these already

### Notes

Assumed: yg check already masked every case of this issue (the mask at the place where it assembles findings landed first); the remaining leaks were the other commands that word the same findings (yg context, yg tree, yg find, yg flows, yg adopt). They are masked where the findings are made: the validator's result and the loader's messages for a node or flow file that did not load. Data listings that print graph content as it is (the type column of yg tree, the Type line of yg find, the participants and rules of yg flows, the body of yg context) are not findings and were left as they are.

