# 030 · Jarl: jarl-lib.mjs is split along its sections into modules, with no change of behaviour

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** strong
**Tags:** refactor
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** jarl-lib.mjs at release/6.2.1 tip: 6682 lines, about 500 functions, 33 sections marked by // ---- headers
**Branch:** jarl/030-split-jarl-lib
**Worker:** w-jarl-030-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-030
**Since:** 2026-11-03 07:31

## What
Almost all of Jarl lives in one file. Every change touches it, so packages cannot run side by side without merge conflicts, a worker must find its way through 6700 lines to change one thing, and nothing keeps one section from reaching into another.

## Why
Smaller modules with stated boundaries let the rest of 6.2.1 and later work run in parallel, give each change a smaller context, and make a hidden coupling visible as an import.

## Acceptance
- jarl-lib.mjs becomes modules along its existing sections (for example git and the lock, ids, the profile, issues, the journal and decisions, evidence, review and the done gate, repositories, questions, resume, verify, import, the loop's merge drivers), each importing only what it uses, with no import cycle; jarl.mjs, jarl-mcp.mjs and record.mjs keep their exports
- No behaviour changes: the whole suite passes unchanged (no test edited except import paths), and the new Jarl run read-only on copies of the 6.2.0 and 6.2.1 loops (status, resume, verify, list --all, show of ten issues, decisions, report) prints byte for byte what release/6.2.1 before the split prints
- record.mjs, the jarl-record/1 contract Horde vendors, is unchanged, and the plugin's drop-in copy of skills/jarl/ still works (the README's install steps and the MCP server start)
- A test fails when a module imports another that its stated layer may not use

## Evidence

Ruling split-jarl-lib-between-waves: Krzysztof, 2026-11-03 (translated from Polish), choosing option 1 of two (option labels, not his wording): split jarl-lib.mjs now, between waves: after the three packages in flight (028, 002, 015) are merged and before the rest of 6.2.1 starts, as a mechanical move along its sections with no change of behaviour (issue 030), so the remaining issues can run in parallel. No other Jarl package starts while the split is in flight.

Horde vendors Jarl by its pin skills/horde/scripts/vendor/jarl.pin.json with paths skills/jarl/scripts/record.mjs and skills/jarl/scripts/jarl-lib.mjs, and record.mjs imports jarl-lib.mjs. After the split, record.mjs's import closure must be one set Horde can pin (for example a directory under skills/jarl/scripts/ that holds every module record.mjs reaches), and the report names the paths Horde's pin will need; Horde's next vendoring of Jarl (issue 343 of the 6.2.0 loop) takes them

