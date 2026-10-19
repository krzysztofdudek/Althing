# 334 · Jarl: one command grammar: one retract verb, set for statuses, a field verb, one clearing idiom, lists everywhere, --help exits 0

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/grammar.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl.mjs (COMMAND_ARGS, COMMAND_FLAGS, COMMAND_SUMMARY, process.exit(cmd ? 0 : 1) after the usage); probes: evidence <id> --retract <n> beside review <id> retract; set <ids> resources "..." and set <ids> <profile field> "..." through the status argument; after --clear and repo --clear beside set resources ""; files, repo, after, body, round and source take one id; jarl.mjs --help exits 1
**After:** 321
**Branch:** jarl/334-grammar
**Merged:** ef1ae14bd90bbb98524bffb81d940407303c6a91 in ../../../JarlSkill
**CI:** pending

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
- Changed: set changes statuses, and a new field verb writes the other fields, the fields a loop's profile declares and Resources; field <ids> <name> --clear empties a field, Files, Source, Where, Tags, After and Repo included. files, repo, after, body, round and source take several issue numbers at once, and the call changes all of them or none. jarl --help exits 0. Writing a field with set <ids> <field> "<value>" and emptying one with an empty value still work, and print the field form to use instead.

## Evidence

- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip) · **saw:** tests 719, pass 697, fail 0 (the rest skipped)
- **ran:** node --test tests/grammar.test.mjs on the release tip's scripts (red), then on the branch (green) · **saw:** red: 10 of 10 fail on the release tip (--help exits 1, no retract or field verb, no lists); green: 10 of 10 pass on the branch
- **ran:** status, resume, next --all, report, list --all, tips, queue, branches, check, show --full (321, 334, 100) run on a copy of the loop with the release tip's jarl.mjs and the branch's, outputs compared with cmp · **saw:** all 12 outputs byte-identical (check prints a refusal in both)
- **ran:** tests/mcp.test.mjs and tests/mcp-runes.test.mjs parity tests; callTool jarl_evidence with retract and jarl_review with verdict retract, jarl_set with status resources · **saw:** parity green; every existing tool name and field (id, ids, retract, by, status, why) still works; the tool replies carry no alias note; two tools added (jarl_retract, jarl_field)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip, second commit) · **saw:** tests 720, pass 698, fail 0
- **ran:** the 12 views (status, resume, next --all, report, list --all, tips, queue, branches, check, show --full x3) on the loop copy, release tip vs branch tip, cmp · **saw:** all 12 byte-identical again
- **ran:** node --test tests/grammar.test.mjs: blank-value set aliases (command line and jarl_set), jarl_set and jarl_field with a profile field, field --clear on Files, Source, Where, Tags, After, Repo, verb refusal wording · **saw:** 10 of 10 pass
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge ef1ae14 · **saw:** 720 tests, 698 pass, 0 fail, 22 skipped

