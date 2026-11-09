# 037 · The propose guard against overwriting the repository's own graph loses to a letter-case difference on macOS: a hand-written .yggdrasil/ is deleted, exit 0

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0737-jdbo
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-export.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/engine/propose-write.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-export.mjs:79-80 (string comparison `outReal === rootReal || outReal === yggReal || outReal.startsWith(yggReal + sep)`); grain-context.mjs:372 (canonicalize uses realpathSync.native only on win32); propose-write.mjs:323 (v6.1.0; :325 on release/6.1.1) `rmSync(<out-dir>/.yggdrasil, {recursive, force})`
**Branch:** jarl/037-propose-outdir-guard
**Merged:** ed22555
**CI:** none

## What
Reproduction (Grain v6.1.0, node 24.11.1, yg 6.1.0, default case-insensitive APFS): a small JS repo, `yg init --no-reviewer`, a `module` type, a hand-written node .yggdrasil/model/handwritten/yg-node.yaml, commit. Through MCP grain_propose {repo:<repo>, out-dir:<repo>} → isError:true 'refusing to write a proposal …'; grain_propose {repo:<repo>, out-dir:<the same path with the last component in capitals, e.g. …/REPO>} → isError:false, 'proposed a graph … — …/REPO/.yggdrasil/'. Afterwards model/handwritten/yg-node.yaml does not exist, `git status` shows ` D .yggdrasil/model/handwritten/yg-node.yaml`, .gitkeep and .gitignore are deleted, and yg-config.yaml and yg-architecture.yaml are changed. CLI: `grain propose <…/Repo>` run from the repo ends with exit 0 and destroys an uncommitted new node and an uncommitted edit, which git will not give back. A real trigger: after `cd …/REPO` in a shell, `grain propose .` is refused, while `grain propose "$PWD"` deletes the graph, because $PWD holds the mistyped letter case. Incidentally, grain-export.mjs:132-134 writes `*` to <out-dir>/.gitignore, which here is the repo root, and hides new files from `git status`. Cause: JS's realpathSync keeps the letter case the caller gave (measured: realpathSync(…/LOWER) = …/LOWER, realpathSync.native = …/lower, the same dev and ino), and the root comes from `git rev-parse --show-toplevel` in the true letter case. Related: issue 038 (an out-dir inside a repository with a nested project). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-4/mcp-case-guard.log, cli-case-guard-uncommitted.log, cli-pwd-variant.log.

## Why
The MCP tool's description (grain-mcp.mjs:61) promises 'your own .yggdrasil/ is refused', and the guard's comment (grain-export.mjs:73-77) says it exists because a bypass through a symlink deleted a hand-written graph with exit 0. Here the same class of failure happens through letter case, on macOS's default file system: silent data loss with exit 0 and isError:false, and uncommitted work on the graph is lost for good. Linux (case-sensitive) and Windows (handled) are not affected.

## Acceptance
- The guard compares paths normalised for letter case on every platform (realpathSync.native also on darwin, or a comparison of dev and ino of the deepest existing ancestor with the root and root/.yggdrasil); an out-dir pointing at the repository or its .yggdrasil/ is refused regardless of spelling.
- A regression test (on darwin, or wherever the file system is case-insensitive): an out-dir equal to the root and one equal to the root's .yggdrasil, both with inverted letter case, are refused, and .yggdrasil/ stays untouched.

## Changelog
- Fixed: `grain propose` refuses your repository and its own graph however the path's letter case is typed; on macOS a differently cased path used to get past the check and replace a hand-written graph.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/propose-out-dir-letter-case.test.mjs (plugins/grain, worktree Grain-037; engine at release/6.1.1, then at bbe0e23) · **saw:** before the fix: tests 4, pass 1, fail 3 — 'expected a refusal for the repository spelled REPO, got exit 0' (also for repo/.YGGDRASIL and for .YGGDRASIL in a repository without a graph); after bbe0e23: tests 4, pass 4, fail 0, skipped 0 (APFS, case-insensitive)
- **ran (history):** YG_BIN=<scratchpad>/grain-611/ci/yggdrasil/source/cli/dist/bin.js HORDE_DIR=<scratchpad>/grain-611/ci/horde GRAIN_CORPUS_CLONES=<scratchpad>/grain-611/corpus npm test (plugins/grain, branch jarl/037-propose-outdir-guard at 485ebbe) · **saw:** exit 0 · tests 1863, pass 1862, fail 0, skipped 1
- **ran (history):** node --import ./tests/git-env.mjs --test tests/propose-out-dir-letter-case.test.mjs (round 2: engine at 485ebbe, then at 294f521) · **saw:** at 485ebbe: tests 6, pass 4, fail 2 — 'expected a refusal for <tmp>/REPO/missing/../.YGGDRASIL, got exit 0' and 'expected a refusal for .yggdraſil, got exit 0'; at 294f521: tests 6, pass 6, fail 0, skipped 0
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1929, pass 1928, fail 0, skipped 1, merge ed22555

