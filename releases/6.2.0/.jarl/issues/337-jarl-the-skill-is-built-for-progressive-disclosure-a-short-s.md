# 337 · Jarl: the skill is built for progressive disclosure: a short SKILL.md that gets an agent started, and references that each role loads when it needs them

**Status:** in-progress
**Kind:** docs
**Priority:** 1
**Tier:** standard
**Tags:** jarl, docs, skill
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/references/, JarlSkill/README.md, JarlSkill/skills/jarl/scripts/tests/skill-shape.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/SKILL.md (about 730 lines, about 105 KB in one file)
**After:** 336
**Branch:** jarl/337-skill-split
**Worker:** w-split-sonnet
**Since:** 2026-10-19 16:02

## What
The owner, 2026-10-18 (translated from Polish): the Jarl skill is badly built; too much text in one file; it should be split, following the best practices for writing skills. Today everything an agent could ever need sits in one SKILL.md of about 730 lines and 105 KB, with table cells of hundreds of words, so every session that loads the skill pays for the manual of every role, every command and every special case, and the core rule is restated in drifting versions. The skill becomes a short entry file plus references, loaded when needed. SKILL.md: frontmatter with a lower-case hyphenated name and a description of at most 1024 characters in the third person that says what the skill does and when to use it; then the mental model in a few sentences, the first moves (an existing loop: resume; none: init), a table of the roles (the jarl, the worker, the reviewer, the merger, a composer) with a link to each role's reference, a short table of the commands an agent uses daily with a pointer to the full table, and the rules that never bend, each stated once; a target of at most 250 lines and 25 KB, measured. references/ (one level below SKILL.md, no reference links to another reference as a requirement for understanding, descriptive lower-case file names, a table of contents at the top of every file over 100 lines): one file per role (jarl.md, worker.md, reviewer.md, merger.md), commands.md (every command with its flags, kept in agreement with the help text), profile.md (fields, sections, statuses, the done gate), record.md (the files in .jarl/, their formats, the format marker, the ids), models.md (tiers and calibration), repositories.md (a loop over several repositories, worktrees and leases), composers.md (the record library contract for tools that build on it), glossary.md (each concept defined once). Scripts stay in scripts/ and are run, not read: the skill says to run the tool's help for the exact options rather than copying them. The three Runes-pinned blocks stay in SKILL.md, byte-identical, because Runes owns their text.

## Why
A skill is loaded into the context of every session that uses it; the best practice for skills is progressive disclosure: the entry file carries only what every session needs, and the rest is read when a role or a task asks for it. A 105 KB entry file spends the agent's attention on what it will not use, and it is where the contradictions and drift came from.

## Acceptance
- SKILL.md is at most 250 lines and 25 KB, measured and recorded as a --ran/--saw row; its frontmatter has a valid name and a description of at most 1024 characters in the third person with what and when; it links every reference file, and every reference is reached from SKILL.md in one step
- The references named above exist, each over 100 lines opens with a table of contents, file names are descriptive, paths use forward slashes, and nothing in a reference depends on reading another reference first; every concept is defined once, in glossary.md, and the rest link to it
- No fact of the old SKILL.md is lost: a table in the issue's evidence maps each old section to its new home (checked by reading), and the Runes-pinned blocks are byte-identical (runes-vendor.test.mjs is green)
- A test (skill-shape.test.mjs) fails on: a SKILL.md over its budget, a missing or broken link, a reference not linked from SKILL.md, a reference over 100 lines without a table of contents, a frontmatter description over 1024 characters or in the first person, a version number or a word of history in any of these files; the other tests that read SKILL.md for a sentence or a flag now read the reference that holds it
- The plugin manifests and the README install steps deliver the references directory with SKILL.md (a drop-in copy of the whole skills/jarl/ directory works), checked in a scratch install; the MCP server's instructions and the help text point to the references by name where they pointed to a section of SKILL.md

## Evidence

Ruling skill-split-before-skill-rebuild: The owner, 2026-10-18 (translated from Polish): the Jarl skill is badly built, too much text in one file, and must be split following the best practices for writing skills. Issue 337 does the split (a short SKILL.md and references loaded by role), before 250. 250 then rebuilds the content inside that structure: its acceptance line about the size of the main path (smaller than the old 104.6 KB) is replaced by 337's budget (SKILL.md at most 250 lines and 25 KB), its other lines apply to the file that now holds that content, and 318 and 311 read every file of the skill, references included.

