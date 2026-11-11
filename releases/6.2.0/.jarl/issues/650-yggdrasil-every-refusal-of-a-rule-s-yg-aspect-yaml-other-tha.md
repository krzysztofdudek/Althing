# 650 · Yggdrasil: every refusal of a rule's yg-aspect.yaml other than aspect-unknown-key names the file by…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1959-ecxh
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-620-opus
**Where:** the review of 615, 620, 621, 625, 627
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:38

## What
Yggdrasil: every refusal of a rule's yg-aspect.yaml other than aspect-unknown-key names the file by its absolute path (yaml-invalid, references, name, implies, when; source/cli/src/io/aspect-parser.ts:153-916), in text and --json.

## Why


## Acceptance


[test] Every refusal of a rule's yg-aspect.yaml names the file by its repository-relative POSIX path, in text and --json, red before and green after · by: cd source/cli && npm test

## Changelog
- A rule file is named from the repository root in every message about it, and a key written as a YAML tag in any graph file is masked: each refusal yg check prints about a rule's yg-aspect.yaml names .yggdrasil/aspects/<rule>/yg-aspect.yaml instead of an absolute path, in text and with --json, and a key written as a YAML tag, or sitting on a line the YAML reader warns about, in a rule, node, flow, architecture or package file is shown by its first four characters in the warning every command prints.

## Evidence

### Proof

- **ran (line c2c275c2630d):** cd source/cli && npx vitest run tests/e2e/cli-validation-codes.test.ts tests/unit/io/aspect-adapt-merge.test.ts tests/e2e/cli-reviewer-fill-runtime.test.ts tests/unit/repo/e2e-prose-ratchet.test.ts · **saw:** 108 passed; P1-P12 (every refusal of yg-aspect.yaml names the repository-relative POSIX path, text and --json) failed 12 of 12 on the release build, pass on this branch

### Notes

Assumed: the rule's adaptation file (yg-aspect.adapt.yaml) is named from the repository root too in the messages of a yg-aspect.yaml refusal that quote it, and the two tests that pinned its absolute path now pin the relative one; the adaptation file's own refusals (aspect-adapt-invalid and its siblings) still print an absolute path and were left out as another file's refusals.

