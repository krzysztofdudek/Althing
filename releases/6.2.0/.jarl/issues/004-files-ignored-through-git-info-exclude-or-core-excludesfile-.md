# 004 · Files ignored through .git/info/exclude or core.excludesFile (the global gitignore) are treated as repository content: they go to the reviewer and into the verdict hashes and log fingerprints

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0722-yend
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/repo-scanner.ts, Yggdrasil/source/cli/src/io/hash.ts, Yggdrasil/source/cli/src/io/artifact-reader.ts, Yggdrasil/source/cli/src/utils/git-introspect.ts, Yggdrasil/docs/nodes.md, Yggdrasil/docs/the-lock.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/repo-scanner.ts:22-32 readGitignoreIn reads only join(dir, '.gitignore'); the stack built from it: loadRootGitignoreStack :52-55, isFileGitignored :62-78, withLocalGitignore :108-111, gitignoreStackFor :122; consumers: hash.ts walkDirectoryFiles :139/:154 (mapping and the source fingerprint), artifact-reader.ts :242/:251/:264 (the rule directory fold), repo-scanner.ts :164/:173 (coverage)
**Branch:** jarl/004-walk-mapping
**Merged:** a98332363a016bd8ef94627a5ad5aa3855231cfc
**CI:** none

## What
The ignore stack is built only from .gitignore files; git's two other ignore sources, $GIT_COMMON_DIR/info/exclude and core.excludesFile (by default $XDG_CONFIG_HOME/git/ignore), are not read. `git check-ignore` reports the file as ignored, while yg treats it as an ordinary file. Reproduction (yg 6.1.0 from npm, a free fake Ollama reviewer, isolated GIT_CONFIG_GLOBAL, XDG_CONFIG_HOME and GIT_CONFIG_NOSYSTEM=1): (1) a node maps src/alpha/, the global core.excludesFile contains .env, src/alpha/.env holds a test token; `yg context --node alpha` lists src/alpha/.env, and the prompt sent to the reviewer contains that file's content; control: the same file ignored through the repo's .gitignore reaches neither the context nor any prompt. (2) A working file ignored through .git/info/exclude: fill on the developer's machine PASS, a fresh clone of the same commit `yg check --no-approve` gives `error[unverified] 1 pair whose inputs changed since the verdict / at: llm-rule @ alpha`, exit 1; the same for src/alpha/.DS_Store ignored only globally, whose bytes also go to the reviewer as a source file. (3) content.md~ next to a reviewer rule, ignored by the global `*~`: a backup autosave, with nothing tracked changed, invalidates both reviewer pairs of that rule; the fresh clone is red (control with `*~` in the repo's .gitignore: PASS on the developer's machine and in the clone). (4) A log_required node mapping a directory with notes.txt from info/exclude: the approved source fingerprint includes that file; in a fresh clone the free CI step ends with `yg check: ABORTED nothing recorded — 1 node needs a log entry first`, error[log-entry-missing] at alpha, with the instruction 'ask the user for the reason' for a change nobody made. (5) The suggested fix `yg check --approve` does not converge: a teammate's clone and the developer's flip the approved lock back and forth (M yg-lock.logs.json, M yg-lock.nondeterministic.json). The code already has a correct probe: utils/git-introspect.ts:761-771 listIgnoredUntrackedPaths (`git ls-files -z --others --ignored --exclude-standard --directory`), but only marketplace-check.ts:188 uses it. The problem is not covered by issues 179 and 490 from 6.1.0 (those fixed only the cases with .gitignore files). Repro and logs (session scratchpad): <the session scratchpad, since lost>/bughunt/yggdrasil/verify-1/logs/ (r0-baseline.log, r1-global-excludes-secret.log, r2-clone-lock-info.log, r2-clone-lock-dsstore.log, r3-rule-dir-global.log, r4-fingerprint.log, r5-coverage.log, r6-pingpong.log); the finder's scripts: <the session scratchpad, since lost>/bughunt/yggdrasil/find-1/repro/ (mapping-excludesfile.sh, mapping-local-exclude.sh, rule-dir-local-exclude.sh, fingerprint-local-exclude.sh).

## Why
A secret from a locally ignored file (e.g. .env) reaches the external reviewer (and the local .refused/ on a refusal). CI on an unchanged commit is red with a misleading cause, and the paid fix does not work. The goal stated in CHANGELOG 6.1.0 and in the comment at artifact-reader.ts:248-251 (ignored files do not change the verdict, because no clone or CI runner will reproduce them) is not met for two of git's three ignore sources. A global gitignore for .DS_Store, *~ and .env is the practice git and GitHub recommend, and .git/info/exclude is a documented per-clone ignore; `git status` shows nothing.

## Acceptance
- A file ignored through .git/info/exclude or core.excludesFile (resolved through `git rev-parse --git-common-dir` and `git config --path core.excludesFile`, or filtered through git's probe) does not appear in `yg context`, in the reviewer's prompt, in the rule directory fold or in the node's source fingerprint; an e2e test for both sources with an isolated GIT_CONFIG_GLOBAL.
- A fresh clone of a commit approved on a machine with such files gives `yg check --no-approve` PASS (scenarios 2, 3 and 4).
- docs/nodes.md:67/71 and docs/the-lock.md:52 say "what git ignores", not ".gitignore".

## Changelog
- Fixed: a file git ignores through .git/info/exclude or the global excludes file (core.excludesFile) is left out like one a .gitignore names — no longer listed by yg context, sent to the reviewer or folded into a verdict or log fingerprint, so a fresh clone passes yg check; only untracked files are left out this way, a tracked file a global ignore matches stays reviewed.

## Evidence

- **ran (history):** git commit (merge of jarl/004-walk-mapping into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8070 pairs verified; [repo-check] All checks passed; [release/6.1.1 a98332363] Merge jarl/004-walk-mapping

