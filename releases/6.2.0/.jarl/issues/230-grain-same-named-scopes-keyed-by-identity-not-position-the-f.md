# 230 · Grain: same-named scopes keyed by identity, not position — the full solution of 042 and lifting the quarantine

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** grain, history, partial
**Files:** 
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#042-file-quarantine
**Where:**
**After:** 003, 182, 169

## What
In 6.1.1 (042) same-named functions in a file are excluded from trend conclusions (a per-file quarantine, ~5% of scopes); the proper solution — a scope key robust to adding siblings — deferred to 6.2.

## Why
5% of scopes get no trend conclusions; adding a sibling must not glue together the histories of different functions.

## Acceptance
The scope key does not change after adding, removing or reordering same-named siblings (e.g. parent path + name + signature/anonymous index stable against siblings); the 6.1.1 quarantine lifted; on the click repository the false 'fading' does not come back, and the trends of real functions do come back; docs/validation.md and results.md re-measured; HIST_V/MODEL_V bumped in the final pass.

## Evidence


