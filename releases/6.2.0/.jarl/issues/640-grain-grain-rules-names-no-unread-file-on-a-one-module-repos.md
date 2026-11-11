# 640 · Grain: grain rules names no unread file on a one-module repository, Vue and Svelte dependency reads swallow their errors, and measure.mjs and commit-tree.mjs start git outside every oracle node

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1922-iqgq
**Tags:** grain
**Files:** 
**Repo:** Grain
**After:** 573
**Found by:** jarl
**Where:** w-573-fable, the Grain large-files package
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What


## Why
The same gaps 587 and 605 closed elsewhere: a user is not told which files were not read, a Vue or Svelte file whose read throws counts as having no dependencies, and two files that start git escape the rule that guards it.

## Acceptance
[test] grain rules names unparsed and unread files on a one-module repository; a Vue or Svelte file whose dependency read throws is named under dependencies not read and read again by grain refresh; the oracle maps measure.mjs and commit-tree.mjs, each red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: grain rules now names the files that were not parsed or whose dependencies were not read, also in a repository with one module. A Vue or Svelte file whose dependency read failed is now named under dependencies not read, and grain refresh reads it again. Can turn a repository red: no; it adds notes.

## Evidence

### Proof

- **ran (line e1dc193472cd):** cd plugins/grain && YG_BIN=<gate build> node --import ./tests/git-env.mjs --test tests/rules-names-unparsed-with-one-module.test.mjs tests/sfc-extractor-error-read-again.test.mjs tests/oracle-maps-git-starting-modules.test.mjs (each red on the commit before its fix: the rules note was missing, the component was not named, measure.mjs and commit-tree.mjs were in no node) · **saw:** all green after the three fixes; with Yggdrasil supplied the oracle test passes, own-graph-enforced-rules passes, and the staged check ends 1674 passed · 1 refused (the advisory rule) · 162 errors in 16 blocks (165 in 17 before)

### Notes

Assumed: the two modules that start git are mapped into the query-surface node (cli-dispatch), whose when now names them beside grain*.mjs, and mining-core leaves them out. This edits the oracle graph's yg-architecture.yaml (a fixture graph under tests/stress/oracles, as issue 631 did for CHANGELOG.md); no rule, threshold or status changed. If the owner wants the architecture edit held back, revert the last commit of 640 and its README entry.

