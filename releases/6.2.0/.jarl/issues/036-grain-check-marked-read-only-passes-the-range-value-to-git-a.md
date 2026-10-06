# 036 · grain_check (marked read-only) passes the range value to git as an option: a single call can truncate or overwrite any file the user can write to

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain, security
**Files:** Grain/plugins/grain/engine/grain-check.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/bin/grain-mcp.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-check.mjs (v6.1.0, unchanged on release/6.1.1): cmdReview :545-546 calls reviewFileList (:503-506, gitNameOnly :491: `git -C root diff --name-only <opts.range> -z`) BEFORE reviewRefs (:516-519), which is the first to check the `<a>..<b>` shape; diffArgs with the range go to `git diff` again in grain-context.mjs:320 (fileDirty) and :354 (changedRanges); grain-mcp.mjs:117-128 and :143 mark check as {readOnlyHint:true}
**Branch:** jarl/036-range-not-an-option
**Merged:** 11f761d
**CI:** none

## What
Reproduction (fresh clone of Grain v6.1.0 b70a4e9, git 2.50.1, node 24.11.1): a small repo and, outside it, a victim file of 28 bytes. CLI: `node plugins/grain/bin/grain.mjs review --range=--output=<abs>/victim.txt --repo <repo>` → exit 1 with '--range must be <a>..<b>', and victim.txt has 0 bytes. MCP: tools/list shows grain_check with the annotations {"readOnlyHint":true,"openWorldHint":false}; grain_check without a file, with range `--output=<abs>/victim-mcp.txt` → isError: true with the same message, and the victim file drops from 28 to 0 bytes. Git has already run with the value as its own option (`git diff --output=<path>` writes the diff text, and with an empty diff truncates the file to zero), and an absolute path escapes `-C root`. There is no `--end-of-options` anywhere and no refusal of a value starting with '-'. Control over the content is partial (what gets written is git's diff text), but truncating any writable file with one call is enough. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-3/mcp-range.log, <the session scratchpad, since lost>/bughunt/grain/verify-3/cli-range.log, <the session scratchpad, since lost>/bughunt/grain/find-6/range-inject-2/range-inject.log.

## Why
An MCP host may run a tool announced as read-only without asking the user. A confused or prompt-injected agent destroys with one call any file the process can write to, also outside the repository. README:236 and docs/reference.md:22-23 describe `--range <a>..<b>` as a revision range, and a shape validator exists, it just runs too late.

## Acceptance
- The `<a>..<b>` shape is checked before any git call; a revision starting with '-' is refused, and revisions go to git after `--end-of-options` (reviewFileList, fileDirty, changedRanges).
- A CLI and MCP regression test: `review --range=--output=<plik>` and grain_check with such a range end in an error, and the file has the same content and size after the call as before.

## Changelog
- Security: **A `--range` can no longer write a file.** When either side of a `--range` started with `-`, as in `--range=HEAD..--output=<file>`, `grain check`, `grain review` and the `grain_check` tool, which MCP hosts may run without asking, could empty, overwrite or create any file you can write, also outside the repository. Grain now refuses such a range with an error and writes nothing.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/review-range-not-an-option.test.mjs (plugins/grain, Grain-036 worktree, before the fix, on release/6.1.1 code) · **saw:** 31 tests, 5 pass, 26 fail; git wrote outside the repository in 14 cases: the victim file emptied (review/check --range=--output=<f>, grain_check range --output=<f>, check a.ts --range=--output=<f>..HEAD / HEAD..--output=<f> / <a>...--output=<f>, the same three through grain_check with file, fileDirty, changedRanges) or a new file written beside it (review/check/grain_check --range=--output=<f>..HEAD); measure --from/--to=--output=<f> wrote nothing (rev-parse --verify already died) and was red only on the refusal message
- **ran:** same test file at 8da0223 · **saw:** 31 tests, 31 pass; with the '-' refusal disabled (--end-of-options alone) no case wrote a file (13 failures, all on the exit code/message only), so each layer holds on its own
- **ran:** npm test (plugins/grain, Grain-036 at 8da0223, no YG_BIN: acceptance needs no Yggdrasil) · **saw:** exit 0; tests 1884, pass 1858, fail 0, skipped 26

docs: docs/validation.md: suite count +31 (1884 on this branch)
- **ran:** round 2: new test (every check/review mode under a stand-in git that fails on --end-of-options, as git < 2.24 does) against 8da0223's engine · **saw:** 42 tests, 35 pass, 7 fail: check a.ts --staged 'no such file: a.ts (not present at that ref)', check a.ts --range 'not present at HEAD', review --range "fatal: bad revision '--end-of-options'", review --staged passed --end-of-options; fileDirty did not refuse an option-shaped revision
- **ran:** same test at 9dbea71; then the CLI in node:22 with a real git 2.23.4 (reviewer's build) · **saw:** 42/42 pass; on 2.23.4 check a.ts --staged/default/--range and review --staged/default/--range all exit 0 (review lists a.ts), five exploit shapes (incl. HEAD~1..--output=V and measure --from=--output=V) exit 1 with the victim at 29 B and alone in its directory
- **ran:** npm test (plugins/grain, Grain-036 at 9dbea71, no YG_BIN) · **saw:** exit 0; tests 1895, pass 1869, fail 0, skipped 26

docs: docs/validation.md: suite count +42 for issue 036 (1895 on this branch; supersedes the +31 note). No minimum git documented (README: 'Node 22 or newer and git'), so the fix uses no --end-of-options and needs no doc line about git versions.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1899, pass 1898, fail 0, skipped 1, merge 11f761d

