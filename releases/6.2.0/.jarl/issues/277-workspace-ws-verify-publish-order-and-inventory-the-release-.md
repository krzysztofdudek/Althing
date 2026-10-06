# 277 · Workspace: ws verify-publish, order and inventory (the release's read-only checks after the tags, before main, and of the family's GitHub surfaces)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** althing, workspace
**Files:** Althing/workspace/ws.mjs, Althing/workspace/README.md, Althing/family/inventory.md
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/workspace/ws.mjs:26-28 (verify-publish and order announced, not built); Althing/family/inventory.md (a hand-made snapshot that the move's step M6 says ws inventory regenerates); the releasing-the-family skill's step "Verify the publish, never trust a green run" is done by hand
**After:** 275

## What
Three read-only commands the workspace design gives to release orchestration. ws verify-publish <version> confirms that every tag of a candidate manifest resolves to its commit and that each npm version and GitHub release exists (npm view dist-tags, the releases, pack/promises@<version>, each add-on's tag), then sets the manifest published. ws order <version> prints the order to main and checks its preconditions (Runes on npm before Yggdrasil pins it; Horde's Jarl pin on Jarl's tag). ws inventory regenerates family/inventory.md from read-only gh calls. None of them pushes, tags or publishes (code/read-only-to-tools).

## Why
The skill's own rule is to verify the publish and never trust a green run, and a check done by hand is the one skipped at the end of a long release; the inventory is a snapshot that drifts from GitHub as soon as it is written.

## Acceptance
- ws verify-publish 6.1.0 against the published 6.1.0 manifest reports every tag, npm version and release present (recorded as --ran/--saw), and on a fixture with a missing tag exits 1 naming it
- ws order 6.2.0 prints the order the releasing-the-family skill gives and refuses a precondition that does not hold, naming it
- ws inventory reproduces family/inventory.md from GitHub with no hand edit, and the file names no private repository
- code/read-only-to-tools passes; yg check && npm test green

## Evidence

