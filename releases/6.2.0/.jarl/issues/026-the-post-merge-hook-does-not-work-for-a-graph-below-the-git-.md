# 026 · The post-merge hook does not work for a graph below the git root (a package in a monorepo): it runs from the top and fails with graph-missing on every merge; with an overlay graph it falsely says there was nothing to record

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/init-scaffold.ts, Yggdrasil/docs/cli-reference.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/init-scaffold.ts:153-166 (postMergeHook: `node <cli> log merge-resolve` :162 without `cd`), :205-256 (ensureMergeDrivers: `git rev-parse --git-path hooks/post-merge` :227, no comparison of projectRoot with `git rev-parse --show-toplevel` and no note, `existing === hook` :250 leaves an identical hook for a second graph); io/paths.ts:20-45 (findYggRoot searches only upward)
**Branch:** jarl/023-merge-hooks-lock
**Merged:** 387472893ddf9a332a7fbcf60fa9f762ab92c46b
**CI:** none

## What
Git runs hooks from the root of the working tree (githooks(5)), and findYggRoot searches only upward from cwd, so a graph below the root is never found; the hook's text does not depend on projectRoot. Reproduction (npm @chrisdudek/yg@6.1.0, git 2.50.1, node 24.11.1): one git repo, graph only in packages/app, `yg init --no-reviewer` there: exit 0, no note, installs <top>/.git/hooks/post-merge without `cd`. Two branches add a log entry, merge: the yg-log/yg-lock drivers merge log.md and the lock cleanly, then the hook prints `error[graph-missing]: No .yggdrasil/ directory found ... next: Run 'yg init' to bootstrap the graph, then re-run this command.` and 'yg: some merged logs are not reconciled - run yg log merge-resolve'; the lock in the merge commit has `"app": {}`, git status clean, nothing recorded. A manual `yg log merge-resolve` from the root: the same error, exit 1; from packages/app: 'Verified ...; baseline recorded.' Control with the graph at the root: the hook records the baseline. Variant (graph at the root plus an overlay in packages/app, a layout supported since 5.0.0-alpha.2): the second init leaves an identical hook; after a merge that changes only the overlay's log, the hook runs the root graph and prints 'The merge changed no node or type log — no baseline to record.' (false for the overlay), the overlay's lock in the merge commit has `"app": {}`, with no warning. Following next: from the root (where the hook runs) creates a second, unneeded graph. After the merge, `yg check --no-approve` from the package passes with warning[log-cycle-open], and `yg check --approve` rebuilds the baseline, but without the verification of both sides that merge-resolve does (the safeguard from issue 473). Issue 180 fixed merge-resolve and drill add below the git root, issue 531 only core.hooksPath. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-23/logs/subdir-hook-verify.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-23/logs/subdir-hook-variants.log (scripts subdir-hook-verify.sh, subdir-hook-variants.sh).

## Why
A 6.1.0 feature never works in the documented layout (graph below the git root: issue 180, CHANGELOG 6.1.0, progressive-mode.md, configuration.md); on every merge it prints a next: that, from where the hook runs, creates an unneeded second graph, and in the overlay layout it falsely claims there was nothing to record. cli-reference.md:2524 and the CHANGELOG promise the hook without reservations; the sentence at cli-reference.md:2355 about running init from the root is also worth rephrasing.

## Acceptance
- The hook changes (`cd "<projectRoot relative to toplevel>" || exit 0`) into the directory of each graph that `yg init` configured (one line per graph, a list with a marker when the repo has several), or init prints a note that the hook will not handle a graph in a subdirectory, with the command to run by hand.
- The scenario with the graph in packages/app and the overlay variant: after a merge, the baseline of the graph in the subdirectory is recorded by the hook and graph-missing does not occur.

## Changelog
- Fixed: The post-merge hook works for a graph below the root of the repository (a package of a monorepo, or an overlay beside a root graph): it has one line per graph, each run from that graph's directory, so a merge no longer ends in graph-missing or leaves the overlay's log baseline unrecorded. Run yg init --upgrade once in each such graph to rewrite an existing hook.

## Evidence

merged into release/6.1.1 at 387472893, gate green
- **ran:** git commit (merge of jarl/023-merge-hooks-lock into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 387472893] Merge jarl/023-merge-hooks-lock

