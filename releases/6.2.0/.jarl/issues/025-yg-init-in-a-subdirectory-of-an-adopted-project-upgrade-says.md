# 025 · yg init in a subdirectory of an adopted project: --upgrade says there is no graph and refers to yg init; yg init and yg init --provider silently create a second, nested graph that breaks the real one

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/init.ts, Yggdrasil/source/cli/src/cli/preamble.ts, Yggdrasil/docs/cli-reference.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/init.ts:1015 (`const projectRoot = process.cwd(); const yggRoot = path.join(projectRoot, '.yggdrasil')`), :1121-1135 (stat `exists` → freshInitNonInteractive instead of existingInitNonInteractive); cli/preamble.ts:81-90 (abortUnlessYggdrasilExists); the other commands search upwards through io/paths.ts:20 findYggRoot
**Branch:** jarl/021-navigation
**Merged:** 8fa91f90df4e39f20017688f433ca620969f359f in ../../../Yggdrasil
**CI:** pending

## What
Reproduction (npm @chrisdudek/yg@6.1.0; an adopted repo with the graph at the root, node app maps src/; everything run from src/): (1) `yg check` (PASS) and `yg tree` (lists app) find the graph above the working directory. (2) `yg init --upgrade`: `error[graph-missing]: No .yggdrasil/ directory found in the current project`, next: 'Run 'yg init' to bootstrap a fresh graph, then re-run --upgrade', exit 1. (3) `yg init --provider claude-code` (help: 'fresh or existing repo'): exit 0, 'Yggdrasil initialized (provider: claude-code, model: sonnet)', creates untracked src/.yggdrasil/*, src/AGENTS.md, src/CLAUDE.md, src/.clinerules/yggdrasil.md and src/.gitattributes. (4) The real graph did not get a reviewer (`grep -c provider` on its yg-config.yaml: 0). (5) `yg check` at the root: FAIL error[mapping-path-missing] (src) 'resolves only to excluded files', exit 1, because src/ is now a nested project. After literally following the next: from (2) in src/ (`yg init`, then `yg init --upgrade`), the upgrade ends with exit 0 'Agent rules already up to date' on the nested graph just created, and the real one is not upgraded. Limitations: creating a graph in the cwd with a bare `yg init` is documented (docs/cli-reference.md:2355: 'run it from the repository root, not from a subdirectory'), nested graphs are a supported layout (configuration.md:323, :751), nothing in the real graph is modified, and the damage is visible at the next check at the root. The defect is therefore --upgrade, --provider and the error's next:. Issue 166 fixed the same process.cwd() class for pack in 6.1.0, but not init. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-22/logs/init-subdir.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-22/scripts/init-subdir.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-22/logs/follow-next.log (follow-next.sh).

## Why
The forms for an existing repo (--upgrade, --provider) behave differently from every other command, and the error message leads straight to creating a nested graph, against the documented advice to run from the root; --provider ends in success and says a reviewer is configured, although the real graph has none.

## Acceptance
- The --upgrade and --provider paths and the existing-repo menu determine the root through findYggRoot; run from src/, they upgrade and configure the graph at the root, without creating src/.yggdrasil.
- next: on graph-missing says to run from the repository root; a fresh `yg init` under an existing .yggdrasil/ warns or asks, naming the parent graph.

## Changelog
- Fixed: yg init --upgrade and yg init --provider run from a subdirectory act on the graph the directory belongs to, naming it, instead of reporting no graph or starting a nested one; a bare yg init there asks (terminal) or warns naming that graph before starting a separate one; missing-graph errors say to run yg init from the repository root.

## Evidence


- **ran:** release branch source + this branch's tests: npx vitest run tests/e2e/cli-init-subdirectory.test.ts tests/unit/cli/init-enclosing-graph.test.ts; live: yg init --upgrade and yg init --provider claude-code from src/ of the checkout-flow example · **saw:** red: 5 e2e failures and the 3 new terminal-driven cases fail; green on the branch. Live: both commands print 'This directory belongs to the graph at <root>; this run acts on that graph', act on it, and no src/.yggdrasil is created. New unit test (scripted terminal) covers the ask: names the graph above, 'enclosing' opens its menu and starts nothing, 'new' goes on to bootstrap without the warning. Uncommitted, see report
- **ran:** devcontainer: cd source/cli && npm test · **saw:** Test Files 707 passed (707); Tests 10392 passed | 1 skipped | 1 todo (10394); coverage lines 97.41%, statements 96.35%, functions 96.77%, branches 91.27%; repo-check: All checks passed (yg check: PASS, 8245 pairs verified), merge 8fa91f90d

