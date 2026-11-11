# 630 · Althing: the pre-push hook passes a push on any exit 0 of ws names, and no test holds its Althing lookup or its link handling

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261111T1809-vjaj
**Tags:** althing, rails, names, security
**Files:** Althing/workspace/hooks/pre-push Althing/workspace/test
**Repo:** Althing
**Found by:** jarl
**Where:** rev-363g-fable, the final review of 363 (pre-push:40 with ws.mjs:531)

## What


## Why
An empty or cut-off ws.mjs, or an older one behind a linked workspace folder, exits 0 without scanning and the hook takes it for a pass; and with the hook's two last changes reverted every test still passes, so a regression there would go unseen.

## Acceptance
[test] The hook passes a push only when ws names printed its own closing line (a clean range, the unscanned line, or nothing to scan); an empty ws.mjs, one cut off after its imports, and an exit 0 with no closing line are refused, and the Althing lookup (linked root, linked sibling, bare clone beside Althing, a git directory not named .git) has a real-push test each, red before and green after · by: yg check && npm test

## Evidence

