# 688 · Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of y…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0018-rxid
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-561c-opus
**Where:** the review of 561, 610, 672, 673

## What
Yggdrasil: when the parser has no memory for a subject of a reviewer rule, the closing summary of yg check --approve counts the pair among provider and configuration failures: '1 pair failed on provider/config errors — re-running will not help until the connection/config is fixed (ollama / standard). Cause: the parser ran out of memory on src/alpha/f1.ts', with the fix 'Fix the reviewer connection or configuration ... To unblock CI without a reviewer, set the affected rules to status: draft'. core/review-package.ts returns the pair as an infra disposition. The pair's own report and the check's error block name the file and the reason. The reviewer-rule counterpart of issues 655 and 673. Minor.

## Why


## Acceptance


## Evidence

