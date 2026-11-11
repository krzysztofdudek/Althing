# 630 · Althing: the pre-push hook passes a push on any exit 0 of ws names, and no test holds its Althing lookup or its link handling

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261111T1809-vjaj
**Tags:** althing, rails, names, security
**Files:** Althing/workspace/hooks/pre-push Althing/workspace/test
**Repo:** Althing
**Found by:** jarl
**Where:** rev-363g-fable, the final review of 363 (pre-push:40 with ws.mjs:531)
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What


## Why
An empty or cut-off ws.mjs, or an older one behind a linked workspace folder, exits 0 without scanning and the hook takes it for a pass; and with the hook's two last changes reverted every test still passes, so a regression there would go unseen.

## Acceptance
[test] The hook passes a push only when ws names printed its own closing line (a clean range, the unscanned line, or nothing to scan); an empty ws.mjs, one cut off after its imports, and an exit 0 with no closing line are refused, and the Althing lookup (linked root, linked sibling, bare clone beside Althing, a git directory not named .git) has a real-push test each, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line e82e122db763):** node --test --test-name-pattern 'the hook (passes|finds)' workspace/test/names-range.test.mjs (a git archive export of d365558 with the test file of df935e5; the same with the hook of 8c71e7a, and with the hook of c17adf6, in place of today's) · **saw:** today's hook: fail 1 of 3, an empty ws.mjs lets a commit with a test word reach a remote of the family; the hook of 8c71e7a: fail 2 (also the git directory under another name); the hook of c17adf6: fail 3 (also the links, the bare clone and the git directory kept apart)
- **ran (line e82e122db763):** node --test --test-name-pattern 'the hook (passes|finds)' workspace/test/names-range.test.mjs (the tree of 4b08335, the fix) · **saw:** tests 3, pass 3, fail 0: an empty ws.mjs, one cut off after its imports and three other ends with exit code 0 and no closing line are refused by real pushes with nothing arrived; the three closing lines pass; real pushes find Althing through a linked root, a link above it, a linked sibling, beside a bare clone, beside a git directory kept apart and beside one under another name

