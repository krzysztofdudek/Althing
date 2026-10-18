# 318 · Jarl: the skill and every text an installed agent reads speak of the tool only as it is now; no version numbers, no 'new in', no 'since', no 'earlier versions', guarded by a test

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** jarl, docs
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/README.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/SKILL.md and the other texts an installed agent reads
**After:** 250

## What
The owner, 2026-10-18 (translated from Polish): the skill does not talk about versions; it always speaks about itself in the absolute, present form. SKILL.md, the tool summaries, the help text and the MCP server instructions describe what Jarl does now; history belongs to CHANGELOG.md alone. Every package of this release writes SKILL.md text under this rule, and 250's rebuild and 311's corrections apply it to the whole.

## Why
An agent reads the skill to act now; a sentence about what an earlier version did, or what a later one will do, is noise at best and wrong at worst, and it ages the moment a release is cut.

## Acceptance
- No sentence of SKILL.md, of the help text (USAGE, the command summaries), of the MCP server instructions or tool descriptions, or of README.md describes the tool relative to a version or to another Jarl: no version number except the format value a record carries and the pinned record contract name, no 'new in', 'since', 'no longer', 'used to', 'earlier versions', 'an older Jarl', 'upgrading from' or a plan for a later release; what matters is stated as how it works. CHANGELOG.md keeps the history and is exempt
- The same holds for comments and test names in the scripts: they state the property of the record or the code, never a version or an older Jarl; the only place a frozen earlier reader appears is the fixture itself (its file name, its path and the helper that loads it)
- A test reads SKILL.md, README.md, the help text, the MCP texts and the comments of the scripts and fails on a version number of the form x.y.z or on those phrases, with the allowed exceptions listed in the test and kept that narrow
- Text and comments added by the packages before this one that break the rule are rewritten here, without losing the fact they state

## Evidence

