# 334 · Jarl: one command grammar: one retract verb, set for statuses, a field verb, one clearing idiom, lists everywhere, --help exits 0

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/grammar.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs (COMMAND_ARGS, COMMAND_FLAGS, COMMAND_SUMMARY, process.exit(cmd ? 0 : 1) after the usage); probes: evidence <id> --retract <n> beside review <id> retract; set <ids> resources "..." and set <ids> <profile field> "..." through the status argument; after --clear and repo --clear beside set resources ""; files, repo, after, body, round and source take one id; jarl.mjs --help exits 1
**After:** 321

## What
The commands break their own patterns. Retraction has two grammars: a flag on evidence (--retract <n>) and a verdict word on review (retract). The second argument of set is a status, a profile field or the built-in resources. Clearing is --clear on after and repo and an empty value on set resources and on profile fields. files, repo, after, body, round and source take one id while set, tag, prio, evidence, review and merged take a list. jarl.mjs --help prints the usage and exits 1, so the first command a newcomer runs fails. The change: one retract verb for a review and for an evidence row; set takes statuses only, and a field verb writes fields, Resources and the profile fields included; one clearing idiom for every field; every command that takes an id accepts the list grammar (comma lists and ranges, all or none); --help exits 0. Every form that works today keeps working as an alias that prints a one-line stderr note naming the new form, and the MCP tools follow from the one table.

## Why
A grammar a reader can predict is learned once; each exception is a refusal a worker meets in the field and a paragraph the skill has to carry. Aliases keep every existing script and MCP caller working.

## Acceptance
- A test runs jarl.mjs --help and asserts exit 0; the test fails on the base
- A test: the retract verb retracts a review verdict and an evidence row with the same results the two current forms give; the current forms still work and print the alias note
- A test: set <id> resources "x" and set <id> <profile field> "v" work as aliases of the field verb with the note; the field verb writes both; set refuses a word that is not a status of the profile once the aliases are excluded
- A test: the one clearing idiom clears After, Repo, Resources and a profile field
- A test per command (files, repo, after, body, round, source): a comma list with a range lands on every id or on none
- The MCP parity test is green and every existing MCP tool name and field keeps working, recorded as a row
- The changelog entry names each old form that stays as an alias, in plain language for people who use Jarl

## Changelog
- Changed: the commands follow one grammar. One retract verb retracts a review or an evidence row; set changes statuses and a field verb writes fields, Resources included; every field clears the same way; every command that takes an issue number takes a list; jarl --help exits 0. The forms you use today keep working as aliases and print the form to use instead.

## Evidence

