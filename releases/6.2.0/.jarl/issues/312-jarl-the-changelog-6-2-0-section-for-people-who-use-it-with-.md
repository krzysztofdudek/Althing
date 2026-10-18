# 312 · Jarl: the CHANGELOG 6.2.0 section for people who use it, with Before you upgrade, and five manifests at 6.2.0

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** jarl, release
**Files:** JarlSkill/CHANGELOG.md, JarlSkill/plugin.json, JarlSkill/.claude-plugin/plugin.json, JarlSkill/.claude-plugin/marketplace.json, JarlSkill/.codex-plugin/plugin.json, JarlSkill/.cursor-plugin/plugin.json, JarlSkill/.github/plugin/marketplace.json
**Repo:** ../../../JarlSkill
**After:** 311
**Found by:** jarl-architect
**Where:** JarlSkill/CHANGELOG.md (the section after [6.1.1]) and every manifest that carries the version

## What
The release step of Jarl 6.2.0, after every other Jarl issue of the release (ruling jarl-release-alone-with-every-jarl-issue). Jarl 6.2.0 is cut from main at v6.1.1, so its CHANGELOG section follows the [6.1.1] section. The architect's scope review of 2026-10-18 (section 2) lists what changes for someone who upgrades from 6.1.0 or 6.1.1: nothing is migrated and every loop reads as written, but several defaults change, and once a session writes a format-2 element (a repository name, an id of 1000 or more, a retraction) every Jarl that touches that loop must be 6.2.0. SKILL.md promises that the JSON keys it documents are never renamed or removed without a note in the changelog, and 246 and 250 change two of them.

## Why
The CHANGELOG is what a person who installed Jarl reads before upgrading. A default that changes in silence, or a loop that an older copy in another session suddenly refuses, is a broken upgrade even when every test is green.

## Acceptance
- CHANGELOG.md has a [6.2.0] section after [6.1.1], written for people who use Jarl (what changes for them and what to do, no loop issue numbers), assembled from the issues' Changelog entries (changelog over the release's Jarl issues) and edited into one text
- Its Before you upgrade part names each change of behaviour: merged --sha no longer writes CI pending (pass --ci pending for a pushed commit); show prints the gate's window (--full for the file); next lists only the ready issues (--all for the groups); jarl_handoff is gone from the MCP tools (handoff read stays in the CLI); the tiers are light, standard and strong, and new without --tier notes the tier it used; new leases record no worktree path; status.check.landsOn is derived from the merge rows, and the handoff and legacyHandoff keys are retired, per SKILL.md's stability promise
- Before you upgrade states the one real duty: once any session writes a format-2 element (a repository name in Repo, an id of 1000 or more, a retraction), every Jarl touching that loop must be 6.2.0, including MCP plugins in other sessions, committed copies in other clones and vendored copies; an older Jarl then refuses the loop loudly, which is the intended direction
- The section states the Runes it ships: the vendored Runes 1.0.0, unchanged (vendor/runes.pin.json at v1.0.0, runes-vendor.test.mjs green, the three Runes-pinned blocks of SKILL.md byte-identical)
- Every manifest that carries the version says 6.2.0, checked by one --ran/--saw row that prints the version from each
- The SKILL.md main path is measured and is smaller than the 104.6 KB of 6.1.1, recorded as a --ran/--saw row
- cd skills/jarl/scripts && npm test is green on the commit

## Evidence

