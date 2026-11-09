# 123 · The grain_cochange partition file is resolved against the server's directory or the given subdirectory, not against the repository root that the documentation promises

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-trfx
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/cochange.mjs, Grain/plugins/grain/bin/grain-mcp.mjs, Grain/docs/reference.md
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs:612 (v6.1.0; :614 on release/6.1.1, whose grain.mjs diff concerns only the propose exit code) passes cmdCochange `readFile: p => readFileSync(p, 'utf8')`; parsePartition (cochange.mjs:313-317, called at :453) passes a relative path on unchanged, so the file is read relative to process.cwd(), not to the `root` found by findRoot; prepare in bin/grain-mcp.mjs:292-299 runs the CLI with cwd equal to the `repo` field exactly as given (it may be a subdirectory), and without repo it does not set cwd at all. `partition` is a plain value field that does not go through inRepo/relPath and has no description in tools/list.
**Branch:** jarl/061-paths-roots-mcp
**Merged:** 722cad3
**CI:** none

## What
Reproduction (fresh clone of v6.1.0 b70a4e9; a synthetic repo with 13 commits, src/ and lib/, part.json committed at the root; grain-mcp.mjs driven over stdio by a Node script, server cwd <repo>/src):
- grain_cochange {partition:'part.json', runs:1} without repo: isError true, "ENOENT … open 'part.json'"; the same answer says "repo: <root> (no repo given — found from the server's working directory <root>/src)".
- With repo:'<root>/src': isError true, the same ENOENT.
- With repo:'<root>': success.

Controls from the same server (repro-controls.log): grain_check file:'lib/c.js' without repo resolves against the root, so the other fields holding a path in the repo follow the root; repo:'<root>/src' is accepted by cochange without a partition; the partition '../part.json' works, which proves the file is read relative to cwd; an absolute partition path works.

A worse variant (repro-shadow.log): if another part.json lies in the server's cwd (<root>/src), a call without repo silently scores that file (a cut into 2 parts, src/a.js and src/b.js), with no error, and the answer still names <root> as the repository it reached.

Closest: issue 061 (relPath resolved against cwd, not the root, for check/decide in the CLI), which mentions in passing that the MCP server does not always run the CLI at the root (grain-mcp.mjs:291-299). partition never goes through relPath, so this is a separate bug; a fix for 061 that always ran the CLI at the found root would also fix the cases without repo and with a subdirectory as repo.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-6/partition-cwd/partition-cwd.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-61/repro.log (the main one), controls <the session scratchpad, since lost>/bughunt/grain/verify-61/repro-controls.log, the silent wrong file <the session scratchpad, since lost>/bughunt/grain/verify-61/repro-shadow.log, the stdio driver <the session scratchpad, since lost>/bughunt/grain/verify-61/drive.mjs. The first line of each log is the exact command.

## Why
docs/reference.md:232 (MCP server, Paths) says: 'cochange's partition is inline JSON, or a file path resolved against the working directory, which for the server is the repository root', which is not true when the server's cwd or the given `repo` is a subdirectory; the description of the `repo` field ('The repository. Defaults to this MCP server's own working directory') does not require the root, and a subdirectory is accepted for every other field. With a file of the same name in the subdirectory, the result is silently computed from a different file. The typical configuration (the server at the root, without repo or with repo = root) works, inline JSON and absolute paths avoid the bug, and the call writes nothing, hence minor.

## Acceptance
- A relative partition file path is resolved against the root found by findRoot (e.g. `readFile(resolve(root, text))`), and docs/reference.md says in one sentence how this works in the CLI and in the server.
- The repro from verify-61: all three calls (without repo, repo:'<root>/src', repo:'<root>') read <root>/part.json, and the repro-shadow.log variant does not read <root>/src/part.json.

## Changelog
- Fixed: over MCP, `grain_cochange` reads a relative partition file from the repository root, as documented, even when `repo` names a subdirectory or the server runs in one; before, the call failed or silently scored a file of the same name in that subdirectory.

## Evidence

- **ran (history):** node --test tests/mcp-partition-root.test.mjs (before a36dff2 and after); verify-61 drive.mjs on a copy of target2 (shadow src/part.json) · **saw:** before: no repo → ENOENT open 'part.json'; shadow → parts 'dto,guards' (the src/ file). after: 2 pass — no repo, repo:<root>/src and repo:<root> all read the root's part.json, shadow not read. drive.mjs patched: all three calls '12 of 12 commits … stayed inside one part' (root's front/back; the unpatched shadow run scored src/part.json, '0 of 6'). Logs: <the session scratchpad, since lost>/patch-611/grain-061/123-red.log, 123-green.log, 123-drive-shadow-patched.log

docs: docs/reference.md: MCP server > Paths: the partition sentence — read from the working directory: in the CLI the directory it runs in, in the server the repository root, whether repo names the root, a directory inside it, or nothing (exact text in commit a36dff2's Docs: line)

jarl: 123 changes only the MCP server; in the CLI the partition file is still read relative to the working directory, as docs/reference.md says — accepted, with no CLI change in the patch
- **ran (history):** round 2: node --test tests/mcp-partition-root.test.mjs tests/relpath-resolution.test.mjs, before 6fd6215 and after · **saw:** before: repo through a symlink into src/ read 'dto,guards' (the shadow); (h) with repo = a symlink to packages/api gave 'packages/api/src/core/handler.ts'. after (workTreeTop starts from canonicalize(resolve(dir))): 11/11 pass, incl. a symlink inside another repository into src/ and grain_decide_waive through the link writing path 'src/core/handler.ts'. Logs: <the session scratchpad, since lost>/patch-611/grain-061/r2-red.log, r2-green.log
- **ran (history):** nice -n 15 npm test (plugins/grain) at 6c tip after round 2 · **saw:** tests 1949, pass 1920, fail 0, skipped 29, exit 0. Log: <the session scratchpad, since lost>/patch-611/grain-061/r2-full-npm-test.log
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1973, pass 1972, fail 0, skipped 1, merge 722cad3

