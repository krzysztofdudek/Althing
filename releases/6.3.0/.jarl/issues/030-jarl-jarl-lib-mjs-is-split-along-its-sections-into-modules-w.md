# 030 · Jarl: jarl-lib.mjs is split along its sections into modules, with no change of behaviour

**Status:** done
**Kind:** process
**Priority:** 1
**Tier:** strong
**Key:** 20261103T0608-fyyo
**Tags:** refactor
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/jarl-mcp.mjs
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** jarl-lib.mjs at release/6.2.1 tip: 6682 lines, about 500 functions, 33 sections marked by // ---- headers
**Branch:** jarl/030-split-jarl-lib
**Merged:** 71ebc5b in ../../../JarlSkill
**CI:** none

## What
Almost all of Jarl lives in one file. Every change touches it, so packages cannot run side by side without merge conflicts, a worker must find its way through 6700 lines to change one thing, and nothing keeps one section from reaching into another.

## Why
Smaller modules with stated boundaries let the rest of 6.2.1 and later work run in parallel, give each change a smaller context, and make a hidden coupling visible as an import.

## Acceptance
- jarl-lib.mjs becomes modules along its existing sections (for example git and the lock, ids, the profile, issues, the journal and decisions, evidence, review and the done gate, repositories, questions, resume, verify, import, the loop's merge drivers), each importing only what it uses, with no import cycle; jarl.mjs, jarl-mcp.mjs and record.mjs keep their exports
- No behaviour changes: the whole suite passes unchanged (no test edited except import paths), and the new Jarl run read-only on copies of the 6.2.0 and 6.2.1 loops (status, resume, verify, list --all, show of ten issues, decisions, report) prints byte for byte what release/6.2.1 before the split prints
- record.mjs, the jarl-record/1 contract Horde vendors, is unchanged, and the plugin's drop-in copy of skills/jarl/ still works (the README's install steps and the MCP server start)
- A test fails when a module imports another that its stated layer may not use

## Changelog
- Changed: If you copy Jarl's record library into your own tool, copy the scripts/lib/ folder too. It now sits next to record.mjs and jarl-lib.mjs, and the library does not work without it.

## Evidence

Ruling split-jarl-lib-between-waves: Krzysztof, 2026-11-03 (translated from Polish), choosing option 1 of two (option labels, not his wording): split jarl-lib.mjs now, between waves: after the three packages in flight (028, 002, 015) are merged and before the rest of 6.2.1 starts, as a mechanical move along its sections with no change of behaviour (issue 030), so the remaining issues can run in parallel. No other Jarl package starts while the split is in flight.

Horde vendors Jarl by its pin skills/horde/scripts/vendor/jarl.pin.json with paths skills/jarl/scripts/record.mjs and skills/jarl/scripts/jarl-lib.mjs, and record.mjs imports jarl-lib.mjs. After the split, record.mjs's import closure must be one set Horde can pin (for example a directory under skills/jarl/scripts/ that holds every module record.mjs reaches), and the report names the paths Horde's pin will need; Horde's next vendoring of Jarl (issue 343 of the 6.2.0 loop) takes them
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip faf26b5) · **saw:** tests 822, pass 799, fail 0, skipped 23 (the base release/6.2.1 at 15ca39d: 796 pass, 23 skipped; the 3 more are tests/modules.test.mjs)
- **ran (history):** node tests/modules.test.mjs on the tree before the split, and on a copy of the split tree with git.mjs and ids.mjs importing commands.mjs · **saw:** before the split: fails, lib/ does not exist (ENOENT). Broken copy: all 3 fail: 'git.mjs (ground) imports commands.mjs (commands)', cycles such as 'git.mjs -> commands.mjs -> git.mjs', unused import cmdNew. On the branch: 3 pass
- **ran (history):** a read-only capture on copies of the 6.2.0 and 6.2.1 loops (status, resume, verify, list, list --all, decisions, decisions --live, report, report --json, models, next, queue, sources, the --json forms, show of 10 issues plus --json and --full, --help, set --help, an unknown command) and the MCP tools/list, run with release/6.2.1 and with the branch, then diff -r · **saw:** IDENTICAL: all 53 outputs and the 43-tool MCP list match byte for byte. jarl-lib.mjs exports the same 288 names. record.mjs, jarl.mjs, jarl-mcp.mjs and yg-edge.mjs are byte-unchanged. A drop-in copy of skills/jarl/ starts its MCP server with the same 43 tools, and its status command works
- **ran (history):** node --test tests/modules.test.mjs on a copy of the branch with export * from './commands.mjs' in lib/where.mjs: the reader before 0c? (HEAD~2) and after · **saw:** old reader: pass 3, fail 0 (the re-export unseen). New reader: fails, 'where.mjs (ground) imports commands.mjs (commands)' and the cycle 'where.mjs -> commands.mjs -> where.mjs'. The new test with the old reader swapped in fails on the sample import cmd from './commands.mjs' (actual [])
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (branch tip, after the review fixes) · **saw:** tests 822, pass 799, fail 0, skipped 23

In the modules-test row above, the reader before is the one at faf26b5 and the reader after is the one at 33373dd; the '0c?' in that row's command is a typo.
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 822, pass 799, fail 0, skipped 23 (merge 71ebc5b on release/6.2.1; jarl-lib.mjs 38 lines, 28 modules in lib/)

