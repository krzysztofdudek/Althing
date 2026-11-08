# 087 · Jarl: a session names its loop once, Jarl lists the loops under a project, and a call that names none where the choice is not obvious is refused with the list

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** design
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-routing
**Where:**
**After:** 035
**Branch:** jarl/006-ceiling-artifact-use
**Worker:** w-jarl-006-opus
**Worktree:** /home/me/Worktrees/JarlSkill/006-ceiling-artifact-use
**Since:** 2026-11-08 11:18

## What
The owner: a loop lives in an area (a topic, a repository); the skill should route and the tool should tell the agent what it needs. Built: every call takes root, else JARL_ROOT, else the loop at the project's root, never one below (scripts/jarl-mcp.mjs:176-191).

## Why
Passing root on every call is the agent's burden, and forgetting it reaches the wrong loop or none.

## Acceptance
- use <path> sets the loop a session's calls reach until changed; the CLI honours JARL_ROOT as today
- Jarl lists the loops under a project by a bounded walk (no node_modules, .git, worktree directories or vendored copies; a stated depth)
- Where the project has a root loop it stays the default and a note names the others; where it has none and several below, a call that names none is refused with the list
- Tests for each

## Changelog
- Added: A session can name the loop it works on once, with use, instead of on every call; use alone lists the loops kept in a repository. On the command line use prints the setting to export, and the command line now reads JARL_ROOT. When a repository has no loop at its top but has some further down, a call that names none is refused with their list instead of guessing.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/loop-discovery.test.mjs (on the release branch at 0e17fb9, before the change) · **saw:** tests 1, pass 0, fail 1: the file does not load, jarl-lib.mjs has no loop walk to import; and jarl.mjs use on a copy of this loop's checkout prints: unknown command: use
- **ran:** cd skills/jarl/scripts && node --test tests/loop-discovery.test.mjs tests/words.test.mjs tests/mcp.test.mjs tests/docs-true.test.mjs tests/input-forms.test.mjs (at 2bc8040) · **saw:** tests 81, pass 81, fail 0: the walk lists . releases/6.3.0 topics/a/b and skips hidden, node_modules, vendor, a nested checkout, a link and depth 5; no root loop and two below refuses status with the list and the --root form, writes nothing, init and use still run; a root loop is reached with a note naming the others; the CLI reads an absolute JARL_ROOT after --root and refuses a relative one; use prints export, PowerShell and cmd lines; jarl_use holds the choice per session, below root and above JARL_ROOT
- **ran:** 26 read views (status, resume, next, next --as jarl and owner, list, report, report --metrics, decisions, branches, verify, models, profile, show, brief, with their --json forms) by jarl.mjs at 0e17fb9 and at 2bc8040, each on its own copy of this loop with the tool repositories linked, then diff -r of the outputs · **saw:** only ageMs differs, in resume --json and status --json; every exit code is the same (verify 2 on both); closedGate holds 028 alone on both; the two copies stayed byte-identical after the views
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 2bc8040) · **saw:** tests 1603, pass 1581, fail 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && node --test tests/loop-discovery.test.mjs tests/jarl-root-isolation.test.mjs (the new tests before the fix) · **saw:** tests 9, pass 7, fail 2: with JARL_ROOT exported to a decoy, the calls a test makes without --root filed into the decoy; profile with a file was refused in a checkout with loops below and none at its root
- **ran:** cd skills/jarl/scripts && node --test tests/loop-discovery.test.mjs tests/jarl-root-isolation.test.mjs (at b8b36b4) · **saw:** tests 9, pass 9, fail 0: the helpers take JARL_ROOT out, the spawned, shell and tool calls file into their checkout and the decoy's log is unchanged; profile with a file is checked on the command line and as a tool; the link case runs, or skips with the reason where no link can be made
- **ran:** JARL_ROOT=<a decoy loop> nice -n 15 timeout 1800 node tests/suite.mjs, in skills/jarl/scripts (at 907489c) · **saw:** tests 1621, pass 1599, fail 0, skipped 22, exit 0; the decoy loop's log is byte-identical after the run and it holds no issue

