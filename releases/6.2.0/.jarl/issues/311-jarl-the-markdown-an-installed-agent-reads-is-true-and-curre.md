# 311 · Jarl: the Markdown an installed agent reads is true and current

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** jarl, docs
**Files:** JarlSkill/skills/jarl/SKILL.md, JarlSkill/README.md, JarlSkill/CLAUDE.md, JarlSkill/CHANGELOG.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**After:** 318
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/SKILL.md, README.md, CLAUDE.md, CHANGELOG.md, and the help texts in skills/jarl/scripts/jarl.mjs (USAGE, COMMAND_SUMMARY) and jarl-mcp.mjs (INSTRUCTIONS), at 67615e6

## What
A documentation review of 2026-10-18 read Jarl as an installed agent meets it (JarlSkill at 67615e6, version 6.1.1; the installed plugin's SKILL.md is byte-identical). The binding text is SKILL.md, the tool summaries, the MCP server's instructions and the help text; README decides whether the tool reaches the agent at all; CLAUDE.md is read only by maintainers. Two Critical and nine Important findings are true today and no other issue covers them: the one literal CLI command in SKILL.md names a scripts directory under the plugin root that does not exist (the script lives under skills/jarl/scripts; .mcp.json already uses that path), and CLAUDE.md repeats it; README offers a single-file install for Codex and Cursor that leaves out scripts/, so there is no tool and no MCP server; the branches row says that without --repo only the loop's own repository is read, which the code, the table and the changelog contradict; next is described as what can run now while it also prints waiting and held issues (249 changes the behaviour); README credits the jarl with the verification the skill gives to the fresh reviewer and the merger, and overstates the guarantee; the record is called four markdown files although asks.md is a fifth; self is described more narrowly than the code reads it (every holder of the issue's lease, and the workers of other issues on the same Branch); the docs imply a loop is found from a subdirectory, which discovery never does; the command table lacks profile and several flags the code takes, never explains close --force, and shows ask's --kind as required although it defaults to stuck; the model placement sentence lets a reviewer sit below the worker it reviews; the first screen does not get a cold agent started. 250 rebuilds SKILL.md last and its acceptance names none of these, so this issue holds them and runs after it, on the text 250 leaves.

## Why
An agent acts on what these files say. A first command that fails on the recommended install, an install line that delivers no tool, and sentences that contradict the code cost every session that reads them, and they are about a dozen sentences to fix.

## Acceptance
- SKILL.md's literal CLI command names the script by the directory SKILL.md was read from: node <skill dir>/scripts/jarl.mjs <command>, where <skill dir> is the plugin root's skills/jarl in a plugin install and .claude/skills/jarl (or wherever it was copied) in a drop-in; no form that puts scripts/ directly under the plugin root remains in SKILL.md or CLAUDE.md, and a test asserts that the documented plugin path exists in the repository layout, as the .mcp.json path is asserted today
- README's Codex and Cursor install instructions copy the whole skills/jarl/ directory (SKILL.md and scripts/), never the single SKILL.md file, in agreement with README's own sentence that the whole skill is the directory
- The branches row and the boot step say what the code does: without --repo, branches reads the loop's own repository, every repository an unfinished issue names and every one where a non-dropped issue records a Branch, so one call covers them; --repo narrows it to one
- SKILL.md, the help text and the MCP description of next say what next prints as 249 leaves it: the issues ready to start by default, and the groups with --all
- README says who verifies: a fresh reviewer reads the diff and checks that the new test was red before the change, the merger merges and runs the check on the result, and nothing is closed without recorded evidence and a fresh reviewer's approve; it never says the jarl reproduces the work itself, nor that Jarl blocks code from landing
- The files table in SKILL.md has a row for asks.md (and repos.md from 247), a line below it names the other files kept in .jarl/ when used (profile.json, templates/, archive/, the mode markers .gitignore, .permanent and .gitattributes, and the write lock .lock), and README counts the record's markdown files as they are after the release
- Who counts as self matches the code in SKILL.md and the help text: --by self, or anyone who has held this issue's lease, including earlier workers before a takeover, and the workers of any other issue on the same Branch
- SKILL.md and README say that discovery finds a loop only at the root of a checkout (or of its main checkout, from a worktree), and that a loop in a subdirectory is reached only through root or --root, or JARL_ROOT
- The command table matches USAGE: a profile row (read-only: the loop's profile, or a file checked against the schema); each synopsis carries the flags the code takes (init --profile, new and import --field, new and body --section, list --match, status --by <field>, check --base, branches --base, decide --rule, and every command and flag the 6.2.0 packages add); the close row explains --force (closes with issues still open or in progress, after they were listed to the user); ask shows --kind as optional with stuck as its default
- Model placement never puts a reviewer below the worker it reviews: workers run on the tier the issue names, a reviewer on that tier or above and on a different model from the worker where the platform has one, readers and the merger on standard, in agreement with 287's section on which model sits where
- The first screen of SKILL.md gets a cold agent started in a few lines (an existing .jarl/: resume, and ask once whether to continue or archive; none: init) before the modes and the command reference, in agreement with 250's layout
- The text is checked against the documentation review's table of sentences each 6.2.0 issue makes false (the CI default, the Worktree lease, the tier pair, show printing the file verbatim, handoff, three-digit ids, the no-check banner), in SKILL.md, README.md, the help text and the MCP descriptions; each place still false is fixed
- The review's minor findings are fixed where they still hold after 250, the two that name private material first (an issue number of a private loop as an example, and a private hub's directory layout as an example path); any left as they are get one evidence line saying why
- cd skills/jarl/scripts && npm test is green on the commit, and the Runes-pinned blocks in SKILL.md are byte-identical (runes-vendor.test.mjs)

## Evidence

