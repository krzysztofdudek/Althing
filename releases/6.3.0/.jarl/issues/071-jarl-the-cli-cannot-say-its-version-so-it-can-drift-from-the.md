# 071 · Jarl: the CLI cannot say its version, so it can drift from the server unseen

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0838-gibr
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-68fda082
**Where:** JarlSkill/skills/jarl/scripts/jarl-mcp.mjs:51 at a1132a8
**Branch:** jarl/071-cli-version
**Merged:** a90ab01 in ../../../JarlSkill
**CI:** none

## What
Claim: The CLI and the MCP tools could disagree on flags without an agent noticing. Corrected by the sceptic: The claim narrows to drift between installs; the fix is a version on the CLI, and a note when the server's and the script's versions differ.

The server reports the plugin's version; the CLI has no version command. Map row fr-39.

## Why


## Acceptance
- jarl.mjs --version prints the same version the MCP server reports
- resume notes when the server and the script it would run report different versions; tested with two versions

## Changelog
- Added: Jarl's command line prints its version with --version. The number matches the one the Jarl tools in your session report. If the plugin in your session has another version than the copy you run, resume says so in one line.

## Evidence

- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 600 node --test tests/version-report.test.mjs · **saw:** tests 3, pass 0, fail 3; each fails with: unknown flag --version before the command, exit 1 (red, before the change)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 600 node --test tests/version-report.test.mjs · **saw:** tests 3, pass 3, fail 0 (green, after the change)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 1001, pass 978, fail 0, skipped 23 (live-loop checks without JARL_LIVE_LOOP, and platform-only tests), exit code 0

Open: the resume note, the second part of the acceptance. Within one install the command line and the server agree, so a mismatch needs two installs. Options: (1) read the plugin root from CLAUDE_PLUGIN_ROOT; this shell does not set it, so the note fires when the host exports it. (2) read the jarl entry of Claude Code's installed_plugins.json; it fires on this machine, and it depends on a file the host owns. (3) write the version into the loop; that changes the record, so it waits for the one format raise of 6.3.0 and the owner's word.
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 600 node --test tests/version-report.test.mjs · **saw:** tests 7, pass 6, fail 1; the resume note test fails: the resume text carries no plugin note line where one is expected; the three silence tests and the three version tests pass (red for the note, before the change)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 600 node --test tests/version-report.test.mjs · **saw:** tests 7, pass 7, fail 0 (green, after the resume note)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 900 node --test tests/version-report.test.mjs tests/resume.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/seams.test.mjs tests/vocabulary.test.mjs tests/help-workflow.test.mjs tests/printed-texts.test.mjs tests/mcp.test.mjs tests/workflow-texts.test.mjs tests/skill-shape.test.mjs tests/description.test.mjs tests/grammar.test.mjs · **saw:** tests 154, pass 153, fail 0 (the touched test files, after the resume note; the file's counts as printed)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 1005, pass 982, fail 0, skipped 23, exit code 0 (the branch tip, after the resume note)
- **ran (history):** npm test (in skills/jarl/scripts of the release worktree, with 010 and 071 merged and the CHANGELOG note of 071 fixed, TMPDIR under ~/Temp/tmp) · **saw:** 1025 tests, 1002 pass, 0 fail, 23 skipped

