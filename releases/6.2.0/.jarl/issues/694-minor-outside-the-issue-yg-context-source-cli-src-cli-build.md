# 694 · Minor, outside the issue: yg context (source/cli/src/cli/build-context.ts:715-736) prints the first…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0127-rkzj
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-641c-opus
**Where:** the review of 641, 647, 648, 649, 650, 661, 669, 670, 671, 682

## What
Minor, outside the issue: yg context (source/cli/src/cli/build-context.ts:715-736) prints the first line of the validator's findings without the mask yg check now applies at its assembly, so a key-shaped type name in type-when-mismatch is printed whole by yg context --node and --file (the same on the release build; adopt.ts:172 reads validate() the same way and was not tried).

## Why


## Acceptance


## Evidence

