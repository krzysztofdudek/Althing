# 022 · A committed symlink named in a node's mapping is followed: a file from outside the repository is read into rules and sent to the reviewer, and for a symlink to a directory the gate is green

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0722-okzp
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/hash.ts, Yggdrasil/source/cli/src/core/checks/mapping.ts, Yggdrasil/source/cli/src/io/artifact-reader.ts, Yggdrasil/source/cli/src/io/graph-fs.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/hash.ts:233-247 (expandMappingPaths: isWithinRoot :84/:233 checks only the entry's text; `stat(absPath)` :236 follows the link; collectDirectoryFiles(absPath) :239 with readdir :141; glob expandGlobEntry → collectDirectoryFiles(baseDir) :192; only symlinks inside the scanned directory are skipped, the `entry.isFile()` test :156); core/checks/mapping.ts:48-49, :87 (checkFileMappingGitignored: statPath from graph-fs.ts:61 follows the link)
**Branch:** jarl/004-walk-mapping
**Merged:** a98332363a016bd8ef94627a5ad5aa3855231cfc
**CI:** none

## What
Reproduction (npm @chrisdudek/yg 6.1.0; an openai-compatible reviewer pointed at a local capturing server on 127.0.0.1, with no paid calls and no claude-code): a committed symlink src/config.ts → ../../host-secret.env (mode 120000, target outside the repo, holds a test secret), the node maps src/a.ts and src/config.ts, a reviewer rule. `yg aspect-test --dry-run`: the assembled prompt contains `<file path="src/config.ts">` with the content of the file from outside the repo; a live `yg aspect-test` and `yg check --approve`: the captured HTTP request body contains that secret; check records the verdict '1 passed' in yg-lock.nondeterministic.json, while at the same time blocking on a false error[file-mapping-gitignored] ('excluded by .gitignore', although the repo has no .gitignore), which does not stop the reviewer call; a plain `check --no-approve` makes no calls. Editing only the file outside the repo invalidates the verdict (the approved hash depends on the machine). The verifier's worse variant: a mapping entry that is a symlink to a directory (`shared/` → ../outside-dir): every file of the directory outside the repo is expanded without an error, `check --approve` sends shared/secret.env and shared/lib.ts to the reviewer and ends with `yg check: PASS`, the next `check --no-approve` (the CI gate) exit 0, coverage shows '1/1 file covered'. A glob based in the link (`shared/**`) and a path through the link (`shared/secret.env`) behave the same way, and script rules get those bytes in ctx.files. Issue 201 (6.1.0, M3/m5) closed this class only for rule sources and references (aspect-source-symlink, aspect-reference-symlink). Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-19/logs/repro-run-1.log, dirlink-green-run-4.log, repro-run-1-hash.log, variants-run-2.log; scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-19/scripts/ (repro.sh, dirlink-green.sh, variants.sh, capture.mjs).

## Why
An unintended disclosure path for honest users: a natural monorepo layout (a symlinked shared directory, or a neighbouring one that an agent maps) silently sends files from outside the repository, e.g. with host secrets, to the external reviewer, and the gate records a green verdict over inputs from outside the repo. The comment at hash.ts:78-83 says plainly that a path from outside the repo must not reach the reviewer's prompt assembly; reviewers.md:45 and meta-modeling.md:33 reject links for the same reason. The trust model (the committer is the boundary) means this is not a blocker, but it takes only a committed symlink and a mapping that names it.

## Acceptance
- Every mapping entry goes through the resolver from 6.1.0 (lstat of every segment, e.g. symlinkOnPath from io/artifact-reader.ts, or realpath with a containment check); a symlink or a path leading outside the repo is rejected with a named code (e.g. file-mapping-symlink), which stops `--approve` before any fill, like aspect-reference-symlink.
- No readdir enters a symlinked base directory; the scenarios with a file, a directory, a glob and a path through a link send no content from outside the repo to the prompt or to ctx.files (an e2e test with a capturing server), and the message for a symlink does not talk about .gitignore.

## Changelog
- Fixed: a mapping entry that is, or runs through, a symbolic link is never followed; it maps nothing and is a blocking file-mapping-symlink error naming the link, yg check --approve stops before any fill, and nothing outside the repository reaches the reviewer or script rules.

## Evidence

- **ran (history):** git commit (merge of jarl/004-walk-mapping into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8070 pairs verified; [repo-check] All checks passed; [release/6.1.1 a98332363] Merge jarl/004-walk-mapping

