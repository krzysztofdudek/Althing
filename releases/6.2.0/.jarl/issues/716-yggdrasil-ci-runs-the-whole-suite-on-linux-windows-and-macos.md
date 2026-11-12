# 716 · Yggdrasil: CI runs the whole suite on Linux, Windows and macOS in parallel, as Jarl's ci.yml does (ruling ci-everywhere-like-jarl)

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0406-ywtr
**Tags:** ci, windows, macos
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12
**Branch:** jarl/716-ci-everywhere
**Worker:** w-716-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:06

## What


## Why
Paths, links, signals and git behave differently on Windows and macOS; a suite run on Linux alone lets those faults through to users.

## Acceptance
- [read] .github/workflows/ci.yml runs the repository's whole test suite on ubuntu-latest, windows-latest (sharded where the suite is long) and macos-latest, Node 22 and 24, fail-fast off, as Jarl's does, and every step that ran on Linux alone now runs on all three or says in the workflow why it cannot
- [read] Every test that cannot run on a platform is skipped there with a stated reason, and the suite was run once locally on Linux with the platform guards in place; the first CI run on GitHub on all three platforms is green, recorded after the push

## Reviews
- **changes** · by rev-716-opus (fresh) · 2026-11-12 · model claude-opus-5-5
  Examined tip 44354da6f against base d2cc7b6af in clones inside the dev container. Ran: scripts/repo-check.sh on the tip (all steps green except pack-smoke, which passed its rewritten pack and extract steps and stopped at installing Runes at the pinned commit, issue 679; test step 739 files, 10906 passed, 1 skipped, 1 todo; coverage 96.46/91.25/96.84/97.46); the base's full suite with a JSON reporter (738 files, 10895 passed, 1 skipped, 1 todo); the 15 touched test files on the tip with a JSON reporter (309 tests, 0 changed status against the base, 11 new, the one skip is the base's own case-insensitive-disk skip): nothing that ran on Linux is skipped now. scripts/repo-check.sh with run_step stubbed to print label, cwd and command: no variable and REPO_CHECK_PART=all print byte-identically to the base script; tests plus rest together hold every step; the Windows branch (uname MINGW, cygpath stubbed) drops GIT_CONFIG_NOSYSTEM and adds core.symlinks=true. The workflow parses with no errors; each job runs what its comment says. Attacks on the shard guard: matrix 1..3 with /4, env /5, a renamed job each turn tests/unit/repo/ci-shards.test.ts red; a consistent 3-shard change stays green, as it should. Its every-file-once assertion cannot fail by itself (vitest cuts by sorting on a hash and slicing), so the real guard is the job/env/script consistency, which holds.

  Line 1 ([read] the workflow runs the whole suite on ubuntu, windows sharded, macos, Node 22 and 24, fail-fast off, every Linux-only step on all three or says why): met. Line 2 ([read] every skip has a stated reason, the suite was run once locally on Linux, the first GitHub run green and recorded after the push): the skips and the local run are met; the GitHub run is open and cannot be green on any platform before issue 679, since npm ci itself gets a 404 for the pinned Runes commit.

  Important: source/cli/tests/unit/cli/merge-driver.test.ts:185 now runs the merge-driver command through bash instead of sh on Linux and macOS. Git runs a driver through sh, which is dash on Debian and Ubuntu, so a bash-only construct in the command src/cli/init-scaffold.ts:159 writes now passes this test and breaks every merge of a log or lock for those users. Shown: with the command's test changed to [[ -f ... ]], the tip's test passes 15 of 15 and the base's sh form fails 1. Fix: run what git or a user runs through sh with sh (Git for Windows' sh.exe beside its bash on Windows), and keep bash for scripts that are bash.
  Minor: source/cli/tests/e2e/cli-log-integrity.test.ts:496 moved from sh to bash too; its commands come from bash blocks, so this is defensible, but the same sh helper would keep the POSIX proof the base had.
  Minor: source/cli/tests/support/platform.ts:247 NO_PERMISSION_BITS is true of chmod, not of Windows: an ACL deny (icacls) makes a file unreadable or a directory unlistable there, so a portable form exists for the 10 tests it skips, and the Windows path of an unreadable file (EPERM, not EACCES) stays untested. The other skips are real: no catchable signal reaches a child process on Windows, a .cmd stub is not found by a spawn without a shell, and mkfifo has no counterpart in a directory.
  Minor: scripts/repo-check.sh:33 the shard pattern accepts 5/4 or 1x/4y; vitest then fails loudly, so no false green.
  Minor: AGENTS.md says a test skips with a named condition from platform.ts, while about twenty existing files skip with inline win32 checks or permission probes.

  Only a GitHub run can prove: Git for Windows' autocrlf on fixture repositories the tests create; whether git init on the runner writes core.symlinks=false into a new repository's own config, which beats the global one; the grammar build on Windows and macOS; macOS's bash 3.2 if it runs the gate script; Git for Windows' bash found by tests/support/shell.ts; the shards' run time within 120 minutes; every chmod, signal or path test not yet guarded.

## Evidence

### Notes

Assumed: Windows test shards are 4 per Node version (the suite has 739 files and is long); macOS runs the whole gate unsharded like Linux; Windows tests keep Git for Windows' system git config (core.autocrlf on) and the run's own global config sets core.symlinks on; the lock-history audit runs on all three platforms; every job gets a 120-minute timeout; no CHANGELOG entry because nothing an adopter sees changes.

