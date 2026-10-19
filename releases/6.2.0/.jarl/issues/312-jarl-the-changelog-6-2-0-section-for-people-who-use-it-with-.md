# 312 · Jarl: the CHANGELOG 6.2.0 section for people who use it, with Before you upgrade, and five manifests at 6.2.0

**Status:** in-progress
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** jarl, release
**Files:** JarlSkill/CHANGELOG.md, JarlSkill/plugin.json, JarlSkill/.claude-plugin/plugin.json, JarlSkill/.claude-plugin/marketplace.json, JarlSkill/.codex-plugin/plugin.json, JarlSkill/.cursor-plugin/plugin.json, JarlSkill/.github/plugin/marketplace.json
**Repo:** ../../../JarlSkill
**After:** 311
**Found by:** jarl-architect
**Where:** JarlSkill/CHANGELOG.md (the section after [6.1.1]) and every manifest that carries the version
**Branch:** jarl/312-release-notes
**Worker:** w-notes-sonnet
**Since:** 2026-10-19 18:41

## What
The release step of Jarl 6.2.0, after every other Jarl issue of the release (ruling jarl-release-alone-with-every-jarl-issue). Jarl 6.2.0 is cut from main at v6.1.1, so its CHANGELOG section follows the [6.1.1] section. The architect's scope review of 2026-10-18 (section 2) lists what changes for someone who upgrades from 6.1.0 or 6.1.1: nothing is migrated and every loop reads as written, but several defaults change, and once a session writes a format-2 element (a repository name, an id of 1000 or more, a retraction) every Jarl that touches that loop must be 6.2.0. SKILL.md promises that the JSON keys it documents are never renamed or removed without a note in the changelog, and 246 and 250 change two of them.

## Why
The CHANGELOG is what a person who installed Jarl reads before upgrading. A default that changes in silence, or a loop that an older copy in another session suddenly refuses, is a broken upgrade even when every test is green.

## Acceptance
- CHANGELOG.md has a [6.2.0] section after [6.1.1], written for the people who use Jarl and not for its maintainers (the owner, 2026-10-18): it describes what is different from the previous released version, 6.1.1, and nothing that happened on the way to 6.2.0 (a defect introduced and fixed inside the release is not mentioned); plain language a non-technical reader understands, with no internal mechanics, file names, function names, flag-parsing detail or loop issue numbers; low information density: a few short items, each one sentence about what the person gets or must do, grouped under Added, Changed and Fixed, and the upgrade notes; it is written once, by hand, as one text, from the issues' Changelog entries, which are raw material and are not copied in one by one
- Its Before you upgrade part names each change a person will notice, in the same plain words and with what to do: recording a merge no longer marks the result as pending unless asked; viewing an issue shows the part that matters and a flag shows everything; the list of what to work on next shows only what can start now, with a flag for the rest; the handoff tool is gone from the assistant tools; the tiers are light, standard and strong; new leases no longer record where a worktree is; and the keys of the status output that are retired
- Before you upgrade states the one real duty in one or two plain sentences: once any session writes a record with a repository name, an issue numbered 1000 or more, or a retraction, every copy of Jarl that touches that loop must be this release, including plugins in other sessions and copies in other clones; an older copy then refuses the loop with a clear message
- The section says in one sentence that the shared Runes code it ships is unchanged (the vendored copy of Runes 1.0.0; vendor/runes.pin.json at v1.0.0, runes-vendor.test.mjs green, the three Runes-pinned blocks of SKILL.md byte-identical, checked and recorded as a --ran/--saw row, not written into the CHANGELOG)
- Every manifest that carries the version says 6.2.0, checked by one --ran/--saw row that prints the version from each
- The SKILL.md main path is measured and is smaller than the 104.6 KB of 6.1.1, recorded as a --ran/--saw row
- cd skills/jarl/scripts && npm test is green on the commit

## Evidence

