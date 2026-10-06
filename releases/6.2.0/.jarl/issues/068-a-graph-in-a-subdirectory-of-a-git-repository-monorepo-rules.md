# 068 · A graph in a subdirectory of a git repository (monorepo): rules from a .gitignore above the graph root are not read, so ignored files (dist/, node_modules/, .env) are mapped, hashed and sent to the reviewer, and the verdict in CI comes out unverified

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/repo-scanner.ts, Yggdrasil/source/cli/src/io/hash.ts, Yggdrasil/source/cli/src/io/artifact-reader.ts, Yggdrasil/source/cli/src/utils/git-introspect.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/repo-scanner.ts:52-55 (loadRootGitignoreStack starts the stack at projectRoot, that is the graph root, not at `git rev-parse --show-toplevel`), :121-133 (gitignoreStackFor walks down from projectRoot); consumers: io/hash.ts:139/:154/:194/:240, io/artifact-reader.ts:242/:252/:264, repo-scanner.ts:142/:164/:173, core/check-coverage-scan.ts:140; a correct probe already exists: utils/git-introspect.ts:760-771 listIgnoredUntrackedPaths (`git ls-files -z --others --ignored --exclude-standard --directory` from the git root), used only in marketplace-check.ts:188
**Branch:** jarl/004-walk-mapping
**Merged:** a98332363a016bd8ef94627a5ad5aa3855231cfc
**CI:** none

## What
This is part C of a finding whose parts A (core.excludesFile) and B (.git/info/exclude) are already in issue 004. Reproduction (a fresh Yggdrasil clone at v6.1.0 e544110, npm ci and build, git 2.50.1, an isolated git config, `yg init --no-reviewer`, a local openai-compatible reviewer mock on 127.0.0.1, no paid calls): a graph in packages/app, `dist/` and `node_modules/` only in the .gitignore at the git root. The reviewer receives src/m0/dist/bundle.ts, and node_modules/left-pad/index.js is reported as uncovered; on the developer's machine PASS, a fresh clone `error[unverified]`, exit 1. Control: the same lines in packages/app/.gitignore → clean, and PASS in the clone. Additionally: a `.env` ignored only by the .gitignore at the git root is listed by `yg context`, and its token goes into the reviewer prompt; the suggested fix `yg check --approve` does not converge (a teammate approves and gets PASS, the developer pulls and gets unverified again, exit 1). Issue 004 says the cases with .gitignore files were fixed by 179 and 490 from 6.1.0, but those fixes build the stack from the graph root, not from the git root. A graph in a monorepo subdirectory is a supported layout (progressive-mode.md:339, issue 180 from 6.1.0). The `graph-missing` from the post-merge hook in the C-extra log is a separate 026. The io/ code is unchanged between v6.1.0 and main. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-37/logs/repro-2.log (scenarios A, B, C with controls; script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-37/scripts/repro.sh), <the session scratchpad, since lost>/bughunt/yggdrasil/verify-37/logs/repro-c-extra-2.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-37/scripts/repro-c-extra.sh); report <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/02-git-excludes-not-honored.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/02-git-excludes-not-honored.sh.

## Why
A secret from a file git ignores (.env at the monorepo root) reaches an external reviewer, build artefacts go into verdict hashes, and CI on an unchanged commit is red, with a paid fix that does not converge. docs/nodes.md:67 promises that the walk 'skips anything `.gitignore` excludes', and the 6.1.0 CHANGELOG that ignored files do not change a verdict. The git probe from git-introspect.ts would fix this part together with 004.

## Acceptance
- A graph in packages/app with `dist/`, `node_modules/` and `.env` only in the .gitignore at the git root: none of these files appears in `yg context`, in the reviewer prompt or in coverage, and a fresh clone of a commit approved on the developer's machine gives `yg check --no-approve` PASS (e2e test).
- The ignore stack (or the probe `git ls-files --others --ignored --exclude-standard`) starts at the git root, not at the graph root; if 004 is fixed by the same mechanism, this scenario goes into its tests.

## Changelog
- Fixed: a graph in a subdirectory of a git repository leaves out untracked files the repository's .gitignore above it ignores (dist/, node_modules/, .env) — they are no longer mapped, listed by yg context, sent to the reviewer or folded into verdicts, so a fresh clone passes yg check; a tracked file under such a rule stays reviewed.

## Evidence

jarl: in the patch, 068 is limited to untracked files — a tracked file under a .gitignore rule above the graph root does not get a new tracked-file-gitignored error (that would be new red for users; possibly 6.2)
- **ran:** git commit (merge of jarl/004-walk-mapping into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8070 pairs verified; [repo-check] All checks passed; [release/6.1.1 a98332363] Merge jarl/004-walk-mapping

