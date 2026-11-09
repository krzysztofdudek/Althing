# 128 · check --as <path> --content <file> without a positional file silently ignores both flags and says 'clean' (CLI and MCP grain_check)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-tcnt
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/grain-check.mjs, Grain/plugins/grain/engine/grain-commands.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs:584 (`args.length === 0 ? cmdReview(ctx) : cmdCheck(ctx)`, without looking at opts.as and opts.content; :585 on release/6.1.1); cmdReview (grain-check.mjs:535 onwards) reads neither of these flags and builds the file list from git (reviewFileList :503); the flags are declared for `check` (grain-commands.mjs:28-33), and `review` is an alias of `check` (grain-commands.mjs:120), so the CLI parser and the MCP schema accept them on the bare path; cmdCheck's own refusal when the file is missing (grain-check.mjs:207, 'usage: grain check <file> [--as <repo-relative path>]') has been unreachable since the J1.1 routing to review.
**Branch:** jarl/116-review-output-truth
**Merged:** b45af68
**CI:** none

## What
Reproduction (fresh clone of github.com/krzysztofdudek/Grain at ae6152f, v6.1.0 plus a CHANGELOG commit; deterministic fixture from tests/fixtures/build-fixture.mjs in verify-66/fx, clean tree; a handler draft without @Handler() and validate(), with double quotes, written outside the repo at verify-66/draft-lamp.ts; node 24.11.1; own stdio client verify-66/mcpcall.mjs against bin/grain-mcp.mjs):
(A) `grain check --as src/handlers/lamp.handler.ts --content <draft>` prints 'review 0 files · 0 finding(s) across 0 file(s)' and 'clean — nothing to report across 0 files reviewed', exit 0; with --json: files: [], findings: [].
(A3) --content alone gives the same.
(A4) --content pointing at a nonexistent file gives the same clean result with exit 0, which proves the flag is not read at all.
(A5) `review --as ... --content ...` gives the same.
(B) Control with the target path given positionally: '4 known deviation(s) in your change' for the same draft (missing validate call, missing @Handler, double quotes, structure).
(C) MCP grain_check {as, content} without file returns isError: false and the same 'clean' text, also when content is a nonexistent path; grain_check {file, content} gives 4 deviations.

The usage line (grain-usage.mjs:11, `check [<file>] [--as <path>] [--content <file>] ...`) and docs/reference.md:22 present --as and --content without requiring a file, and neither the README, SKILL.md nor the CHANGELOG says they are ignored without a file. The skill tells agents that `as` in grain_check is a repo-relative field, so an agent will easily send {as, content} without `file`. The output says '0 files reviewed', which softens the effect a little. Different from 036 (the --range value passed to git as an option).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-9/f5-as-content/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-66/repro.log.

## Why
An agent that checks a draft before writing it gets a 'clean' verdict for content Grain never read, also for a nonexistent --content path. docs/reference.md says: '`--as` judges content as if it lived at another path; `--content` reads the body from elsewhere'.

## Acceptance
- check/review without a positional file but with --as or --content either judges the content under the --as path (like `check <as> --content <file>`) or refuses with an error: a non-zero exit code in the CLI, isError true in MCP.
- --content pointing at a nonexistent file never gives 'clean'.
- The repro from verify-66: `grain check --as src/handlers/lamp.handler.ts --content ../draft-lamp.ts` and grain_check {as, content} do not say 'clean'.

## Changelog
- Fixed: `grain check` without a file now refuses `--as` and `--content` with an error, instead of ignoring them and calling a draft it never read clean; the same holds for `grain_check` over MCP.

## Evidence

docs: docs/reference.md, the `check [<file>]` row: --as and --content need <file>; without one check refuses them (exit 1, MCP isError). Usage line in engine/grain-usage.mjs already changed in the commit.

red→green: tests/check-as-content-needs-file.test.mjs — before fix 3 pass / 2 fail (CLI exit 0 'clean' for check --as --content without file; MCP grain_check {as,content} isError false); after 5/5 pass. Commit 4afe4a4.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2202, pass 2201, fail 0, skipped 1, merge b45af68

