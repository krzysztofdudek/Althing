# 318 · Jarl: the skill and every text an installed agent reads speak of the tool only as it is now; no version numbers, no 'new in', no 'since', no 'earlier versions', guarded by a test

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261018T1857-dhal
**Tags:** jarl, docs
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/README.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/SKILL.md and the other texts an installed agent reads
**After:** 250
**Branch:** jarl/318-present-tense
**Merged:** e40852068b8f2858f4a9501dceddb4bbaa1b7914 in ../../../JarlSkill
**CI:** pending

## What
The owner, 2026-10-18 (translated from Polish): the skill does not talk about versions; it always speaks about itself in the absolute, present form. SKILL.md, the tool summaries, the help text and the MCP server instructions describe what Jarl does now; history belongs to CHANGELOG.md alone. Every package of this release writes SKILL.md text under this rule, and 250's rebuild and 311's corrections apply it to the whole.

## Why
An agent reads the skill to act now; a sentence about what an earlier version did, or what a later one will do, is noise at best and wrong at worst, and it ages the moment a release is cut.

## Acceptance
- No sentence of SKILL.md or of any reference file of the skill, of the help text (USAGE, the command summaries), of the MCP server instructions or tool descriptions, or of README.md describes the tool relative to a version, to another Jarl or to a past: no version number except the format value a record carries and the pinned record contract name, and no 'Jarl 6.x', 'new in', 'since', 'no longer', 'used to', 'earlier', 'older', 'legacy', 'backward', 'compatible with', 'migrate', 'upgrading from' or plan for a later release; what Jarl reads and refuses is stated as a rule of the present ('a record carries its format; Jarl reads the formats it knows and refuses a higher one'), never as a comparison with a version. CHANGELOG.md keeps the history and is exempt (the owner, 2026-10-18: the skill speaks only about the current version and says nothing about backward compatibility)
- The same holds for comments and test names in the scripts: they state the property of the record or the code, never a version or another Jarl; the only place a frozen earlier reader appears is the fixture itself (its file name, its path and the helper that loads it)
- A test reads SKILL.md, the references, README.md, the help text, the MCP texts and the comments of the scripts and fails on a version number of the form x.y.z or on those phrases, with the allowed exceptions listed in the test and kept that narrow
- Text and comments added by the packages before this one that break the rule are rewritten here, without losing the fact they state (the two sentences that name Jarl 6.1 in the retraction and the format sections are examples)

## Evidence

- **ran (history):** npm test in skills/jarl/scripts on the branch tip · **saw:** tests 762, pass 740, fail 0, skipped 22 (the live-loop tests), exit 0
- **ran (history):** node --test skills/jarl/scripts/tests/tense.test.mjs before the fixes · **saw:** fails with 43 hits, each named by its surface and its family: a version in CLAUDE.md, 'the user' for the owner in comments, 'next release' in a reference, task numbers and retired wording in test titles
- **ran (history):** node --test skills/jarl/scripts/tests/tense.test.mjs in a scratch copy of the branch tip with about fifty planted phrases on the skill, the references, README.md, CLAUDE.md, a command summary, a tool text, the server instructions, a note, script comments and test comments and titles · **saw:** every planted phrase fails and is named by its family: version (6.2.0, 6.x, v2, 1.0), history (older, no longer, new in, used to, legacy, retired, backward, migrate, upgrade from, previous version, before this release, later release, next release, the old way, earlier Jarl), since, alias of, the user, task (issue 281, ticket 3, round 3, #281, field report, the review found, as asked by, issue 9)
- **ran (history):** grep -rc assert. skills/jarl/scripts/tests on the release base and on the branch tip, sorted and diffed · **saw:** identical for each of the 52 existing test files; the only new count is tense.test.mjs with 3 assertions
- **ran (history):** status, resume, next --all, report, list --all, queue, branches, show 318, 311 and 250 --full, printed by the branch tip's jarl.mjs on a copy of the loop before and after the change, diffed · **saw:** all 11 outputs byte-identical (diff exit 0); the only text changed is the handoff note of the internal handoff command, which none of these prints
- **ran (history):** npm test in skills/jarl/scripts on the branch tip after round two · **saw:** tests 769, pass 747, fail 0, skipped 22 (the live-loop tests), exit 0
- **ran (history):** node --test skills/jarl/scripts/tests/tense.test.mjs on the branch tip before the scanner covered every string, template, comment and name of the scripts · **saw:** the tense test reads the scripts' strings, templates, comments and names: a new scanner reads them for the families and the four mutations of the review each name their family
- **ran (history):** node --test on a scratch copy of the branch tip with planted texts: an error string, the mode log text, the handoff constant, a trailing comment, a block comment, a template, a plain string, a note, a name, a summary, a tool description, the server instructions, SKILL.md, README.md, CLAUDE.md, a reference, a test comment and a test title · **saw:** every planted text fails the test and is named by its family (the words no longer, backward, retired, older, since, the user, a version, an alias of, a task number, a word of history in a name): 13 surfaces, one run
- **ran (history):** grep -rc assert. skills/jarl/scripts/tests, sorted, compared with the release base · **saw:** identical for each of the 52 existing test files; the new files add 10 (printed-texts.test.mjs) and 12 (tense.test.mjs) assertions
- **ran (history):** status, resume, next --all, report, list --all, queue, branches, show 318, 311 and 250 --full, printed by the branch tip's jarl.mjs on a copy of the loop, diffed with the release base output · **saw:** ten of eleven outputs byte-identical; the one difference is the resume heading of the questions, '## Questions to the user (0)' now '## Questions to the owner (0)' (the printed text the reviewer named)
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge e408520 · **saw:** 769 tests, 747 pass, 0 fail, 22 skipped; worker haiku-5.5, two rounds (error strings, a written heading and log lines the first scanner could not see, fixed; scanner now reads every literal and comment), reviewer sonnet-5.5 approved with minors only

