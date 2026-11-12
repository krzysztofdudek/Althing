# 688 · Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of y…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0018-rxid
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561c-opus
**Where:** the review of 561, 610, 672, 673
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of yg check --approve counts the pair among provider and configuration failures: '1 pair failed on provider/config errors — re-running will not help until the connection/config is fixed (ollama / standard). Cause: the parser ran out of memory on src/alpha/f1.ts', with the fix 'Fix the reviewer connection or configuration ... To unblock CI without a reviewer, set the affected rules to status: draft'. core/review-package.ts returns the pair as an infra disposition. The pair's own report and the check's error block name the file and the reason. The reviewer-rule counterpart of issues 655 and 673. Minor.

## Why


## Acceptance


[test] When the parser has no memory for a reviewer rule's subject, yg check --approve's closing summary counts the pair apart from provider and configuration failures and names the file and the way out, red before and green after · by: cd source/cli && npm test

## Changelog
- The closing summary of `yg check --approve` counts a reviewer pair the parser had no memory for apart from the provider and configuration failures. It names the file and the way out (leave the file out of what the rule judges) instead of telling the reader to fix the reviewer connection or set the rule to `status: draft`, and `--json` gives the pair the cause `parser-out-of-memory`.

## Evidence

### Proof

- **ran (line 6553b31b550a):** cd source/cli && npx vitest run tests/e2e/parser-memory.test.ts -t 'counts that pair apart' tests/unit/core/fill-infra-grouping.test.ts (e2e red on the base: summary 'failed on provider/config errors') · **saw:** green after: 1 + 15 tests passed; summary '1 reviewer pair left unverified because the parser ran out of memory building the syntax tree of a file the rule judges (src/alpha/f1.ts)', next says to leave the file out, no provider/config words, --json cause parser-out-of-memory

