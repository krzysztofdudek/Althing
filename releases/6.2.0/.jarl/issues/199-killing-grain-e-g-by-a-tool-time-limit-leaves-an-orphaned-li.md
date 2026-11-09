# 199 · Killing grain (e.g. by a tool time limit) leaves an orphaned --liftoff-only child process, which keeps building the model and eats a core for hours

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261002T1920-gomu
**Tags:** grain, observed
**Files:** Grain/plugins/grain/bin/grain.mjs
**Repo:** ../../../Grain
**Found by:** orchestrator
**Where:** plugins/grain/bin/grain.mjs:10-14: spawnSync(process.execPath, ['--liftoff-only', …]) without passing the signal on to the child
**Branch:** jarl/199-orphan-child
**Merged:** 15e1601
**CI:** none

## What
2026-10-02 21:18: 46 processes 'node --liftoff-only …/grain.mjs status' were hanging on the owner's laptop with launchd as their parent, the oldest 2 h 51 min old, each at ~45-55% CPU (worktrees Grain-044, -051, -099, -145, the main Grain checkout, a reviewer's scratch copy). Agents ran 'grain status' with a tool time limit; the limit kills the parent process (the re-exec wrapper), the child gets no signal, becomes an orphan and goes on building the model indefinitely. Machine load ~97; after pkill it dropped.

## Why
Every interruption of grain other than Ctrl-C in a terminal (a timeout, killing the parent, closing the MCP host or a hook) leaves a process burning CPU without end and without a visible owner. Grain's hooks also go through this wrapper with a timeout.

## Acceptance
- When the grain parent process gets SIGTERM/SIGINT/SIGHUP or dies, the --liftoff-only child exits within a second (signal forwarding and parent-death detection).
- Test: run grain status on a repository that builds the model, kill the parent with SIGTERM, after 2 s there is no live child.

## Changelog
- Fixed: stopping grain, for example when a tool's time limit kills it, no longer leaves a background process building the model for hours.

## Evidence

red→green: tests/orphan-child.test.mjs on the old launcher 6 fail/1 pass (child alive after 2 s for SIGTERM/SIGINT/SIGHUP/SIGKILL to grain and SIGTERM/SIGKILL to the hook guard); new launcher 7/7, child gone in 0.2-0.55 s. Flask clone: old SIGTERM child alive after 5 s, new 0.54 s; SIGKILL 0.66 s. npm test 2160 pass, 0 fail, 36 skip.

docs: docs/reference.md (GRAIN_V8 row / --liftoff-only paragraph): a query's re-run child stops with grain — signals pass on, a killed launcher or a gone starter (hook guard, MCP server) stops it within about a second

starter watch only under GRAIN_SUPERVISED=1 (guard in every hook/command/mcp.json + grain-mcp.mjs). orphan-child.test.mjs 9 tests: release launcher 7 fail (signals, SIGKILL, guard, MCP); unconditional-watch commit fails nohup; final 9/9. Full gate (YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES): 2198 tests, 2197 pass, 0 fail, 1 skip. docs: reference.md env table could list GRAIN_SUPERVISED as internal.

review fixes: unraisable signal (SIGHUP on Windows, mocked via preload) red code 1 -> green 129, no throw; stale lock after the 500 ms kill is taken over by the next run (test, already green on the prior launcher). Full gate 2200 tests, 2199 pass, 0 fail, 1 skip.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2213, pass 2212, fail 0, skipped 1, merge 15e1601

