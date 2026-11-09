# 063 · A committed symlink .yggdrasil/.debug.log together with `debug: true` in yg-config.yaml makes a plain `yg check` and `yg check --no-approve` create or append to a file outside the repository

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0754-mlgg
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/utils/debug-log.ts, Yggdrasil/source/cli/src/io/debug-log-writer.ts, Yggdrasil/source/cli/src/cli/preamble.ts, Yggdrasil/source/cli/src/io/type-class-cache.ts, Yggdrasil/docs/configuration.md, Yggdrasil/docs/the-lock.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/utils/debug-log.ts:21-31 (initDebugLog builds `<yggRoot>/.debug.log` through path.join and writes the header right away), :34-59 (a tee of every stdout and stderr write); source/cli/src/io/debug-log-writer.ts:7-9 appendToDebugLog is a bare `appendFileSync`, which follows the symlink and creates a nonexistent target; the flag comes from the committed yg-config.yaml (`graph.config.debug`), the call is in cli/preamble.ts:62 (loadGraphOrAbort, that is, every command that reads the graph) and cli/check.ts:181
**Branch:** jarl/063-local-writes
**Merged:** 786a2847333c0ea01ee390b47922ffa8efdd75ec
**CI:** none

## What
A branch commits `debug: true` in yg-config.yaml and, through `git add -f` (yg init gitignores .debug.log), a symlink .yggdrasil/.debug.log pointing outside the repo. Reproduction (npm @chrisdudek/yg@6.1.0, Node v24.11.1, fresh clones of the branch): (1) an absolute symlink, `CI=true yg check --no-approve`: exit 0, no warning, a previously nonexistent file outside the repo is created with 3188 bytes of yg output; (2) a relative symlink `../../outside/rel-existing.txt` to an existing file, a plain `yg check` without CI: the file grows from 16 to 3200 bytes, and its first line stays (an append, not an overwrite); (3) `yg tree` and `yg owner --file src/a.js`, read-only commands that agent hooks run automatically, keep appending (9950 bytes); control: the same clone with `debug: false` writes nothing. The content is partly under the attacker's control: the branch commits a file with a newline in its name, `yg check` prints uncovered paths verbatim, so a whole line from column 0 reaches the target: `echo INJECTED-LINE-FROM-BRANCH #.js`. Code execution was not shown (yg's post-merge hook ends with `exit 0`, the GitHub runner is short-lived and runs steps with `--norc`); the real victims are developers who fetch the branch and self-hosted runners. A broader variant, without `debug: true`: a committed directory symlink `.yggdrasil/.type-class-cache -> ../../outside-dir` makes `CI=true yg check --no-approve` create `v3/.architecture` and `v3/<hash>.json` in a directory outside the repo (fixed names, yg content, so a weaker impact), that is, gitignored local artifacts under .yggdrasil (caches, sidecars) do not check for a symlinked parent at all. This is not covered by 201 of 6.1.0 (reading rule sources only), 318 of 6.1.0 (moving initDebugLog into loadGraphOrAbort, which widened the trigger to every command that reads the graph) or 022 here (a symlink in the mapping, reading). Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-31/repro.sh and repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-31/repro-content.sh and repro-content.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-31/repro-cachedir.sh and repro-cachedir.log; issue as filed: <the session scratchpad, since lost>/bughunt/yggdrasil/find-8/F-debuglog-symlink-write.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-8/repros/debuglog-symlink.sh.

## Why
docs/the-lock.md:109 calls `yg check --no-approve` the safe choice for an untrusted branch from a fork, because it 'executes no repository code'; that is literally true, but the branch still gets an unprotected write (create or append) at a path it chooses itself, on the maintainer's CI runner or on the machine of anyone who fetches it, also through the first command of the agent protocol (`yg check`). The tool already rejects symlinked rule sources (aspect-source-symlink) and checks realpath in ctx.fs; writes to .debug.log and to the caches lack that protection.

## Acceptance
- A committed symlink .yggdrasil/.debug.log (absolute and relative, to an existing and to a nonexistent target) with `debug: true`: `yg check`, `yg check --no-approve`, `yg tree` and `yg owner` write nothing outside the repository (lstat or realpath with a containment check), and the debug log is then skipped with a visible note; an e2e test with a target outside the project directory.
- The same protection covers every write of gitignored artifacts under .yggdrasil (at least .type-class-cache, .ast-cache, .feature-field.json): a committed symlink of a cache directory causes no write outside the repo (the scenario from verify-31/repro-cachedir.sh).

## Changelog
- Security: yg no longer writes its local state through a symbolic link — a link committed in place of .yggdrasil/.debug.log or a cache directory stays unwritten, the debug log is skipped with a note, and a linked .type-class-cache/ target is no longer emptied.

## Evidence

- **ran (history):** git commit (merge of jarl/063-local-writes into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8100 pairs verified; [repo-check] All checks passed; [release/6.1.1 786a28473] Merge jarl/063-local-writes

