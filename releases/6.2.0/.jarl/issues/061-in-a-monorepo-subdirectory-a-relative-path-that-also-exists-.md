# 061 · In a monorepo subdirectory, a relative path that also exists from the repository root resolves to the file at the root: check judges the wrong file, and decide records the decision on the wrong file

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-context.mjs, Grain/plugins/grain/bin/grain-mcp.mjs, Grain/plugins/grain/tests/relpath-resolution.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-context.mjs:395-411 relPath: `abs = existsSync(underRoot) ? underRoot : existsSync(underCwd) && inside ? underCwd : underRoot` (order from b693d54, 0.2.1); callers: grain-check.mjs:208 (check <file>), grain-seed.mjs:21,136,220 (decide steer and waive), grain-what.mjs:105 (explain, spectrum), grain.mjs:627 (completeness), grain-where.mjs:29 (where <path>); grain-mcp.mjs:291-299 (the cwd of the CLI process that MCP starts)
**Branch:** jarl/061-paths-roots-mcp
**Merged:** 722cad3
**CI:** none

## What
Reproduction (fresh clone of Grain v6.1.0; release/6.1.1 has no changes in relPath): a fixture with src/core/handler.ts at the root and a committed packages/api/src/core/handler.ts with a different function apiOnlyHandler; from packages/api a line appended to src/core/handler.ts (`git status` from there: ` M src/core/handler.ts`; `git ls-files --full-name src/core/handler.ts` → packages/api/src/core/handler.ts). `grain check src/core/handler.ts` → 'check src/core/handler.ts — repo-wide … 0 deviation(s) in your change, 2 pre-existing', 'in: src/core/ (layer 0) · used by 4 modules', '3 scopes' (the package file has 1) and 'as of c93036a' without +dirty: it judged the root's file, and the header repeats what the user typed, so nothing gives it away; with an absolute path it judges packages/api/src/core/handler.ts with +dirty. `grain decide waive 'src/core/handler.ts#apiOnlyHandler' --on x --note t` → 'no scope named apiOnlyHandler in src/core/handler.ts' (with exit 0). When both files declare a scope of the same name (validate), `decide waive 'src/core/handler.ts#validate'` from packages/api writes `{"waiver":{"path":"src/core/handler.ts","name":"validate"}}` to .grain/seeds.jsonl, that is, on validate from the root's file. obligation and completeness also answer about src/core/ at the root. The collision is common: a Rust workspace with a crate at the root (src/lib.rs), Go with main.go at the root next to cmd/x/main.go, a JS monorepo with src/index.ts at the root. Hooks (absolute paths) and bare check and review (paths from git) are not affected. A patch in a separate clone (underCwd first when cwd is inside the root and the path exists) fixes check and both waivers, and cases (a), (b) and (d) from tests/relpath-resolution.test.mjs behave as before (checked by hand). A note for the fix: the MCP server does not always start the CLI at the root (grain-mcp.mjs:291-299: the `repo` directory or the server's cwd), so with cwd-first the MCP adapter has to start the CLI at the found root or turn the fields into absolute paths. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-29/repro.log, repro-decide.log, repro-patched.log, repro-decide-patched.log, repro-repo-flag-patched.log, repro-repo-flag-patched-bd.log.

## Why
SKILL.md:156 promises 'A path on the command line may be relative to where the CLI runs', as in git. The wrong file is judged with no visible signal, and a maintainer's decision recorded on the wrong file goes into a commit. An absolute path is a workaround.

## Acceptance
- A path from the command line resolves first against cwd (when cwd is inside the root and the path exists), and from the root only when the path does not exist relative to cwd; when both candidates exist and are different files, the CLI names the other candidate or refuses as ambiguous; MCP fields stay relative to the root.
- The fixture from the reproduction: from packages/api, `grain check src/core/handler.ts` evaluates packages/api/src/core/handler.ts with +dirty, and `decide waive 'src/core/handler.ts#validate'` writes a waiver with the path packages/api/src/core/handler.ts; test in tests/relpath-resolution.test.mjs.

## Changelog
- Fixed: run from a directory inside the repository, such as a package of a monorepo, a relative path names the file there, as git reads it, rather than a file with the same relative path at the repository root; when both exist, Grain says which one it read and how to name the other. `check` judged the root's file and `decide waive` and `decide steer` recorded the decision on it.

## Evidence

- **ran:** node --test tests/relpath-resolution.test.mjs (plugins/grain, before afae542 and after) · **saw:** before: (e) actual 'src/core/handler.ts' expected 'packages/api/src/core/handler.ts'; (f) waiver path 'src/core/handler.ts'; 6 pass 2 fail. after: 8 pass 0 fail; (h) with the cwd-first relPath and the 6.1.1 grain-mcp.mjs: actual 'packages/api/src/core/handler.ts' (so the MCP half, a36dff2, is needed). Repro on the issue's fixture: check prints 'check packages/api/src/core/handler.ts … as of 61c6170+dirty' with '[grain] src/core/handler.ts: reading packages/api/src/core/handler.ts, from the working directory; the repository root's src/core/handler.ts is another file — pass <abs> to mean that one'; waive writes {"path":"packages/api/src/core/handler.ts","name":"validate"}. Logs: <the session scratchpad, since lost>/patch-611/grain-061/061-red.log, 061-green.log, 061-h-without-mcp-half.log, 061-cli-patched.log

docs: docs/reference.md: one sentence near the command table — a relative CLI path is read from the working directory when that is inside the repository and the path exists there, from the root otherwise; both existing → the first is read, the other named on stderr; from outside the repository (--repo) the root comes first; over MCP, paths inside the repository are relative to the root (exact text in commit afae542's Docs: line)
- **ran:** round 2: node --test tests/mcp-partition-root.test.mjs tests/relpath-resolution.test.mjs, before 6fd6215 and after · **saw:** before: repo through a symlink into src/ read 'dto,guards' (the shadow); (h) with repo = a symlink to packages/api gave 'packages/api/src/core/handler.ts'. after (workTreeTop starts from canonicalize(resolve(dir))): 11/11 pass, incl. a symlink inside another repository into src/ and grain_decide_waive through the link writing path 'src/core/handler.ts'. Logs: <the session scratchpad, since lost>/patch-611/grain-061/r2-red.log, r2-green.log
- **ran:** round 2: (g2) where src/core from packages/api, on 6fd6215 and on c33ba71 · **saw:** before: fail (note said 'is another file'); after: pass, 'the repository root's src/core is another directory'. Docs line reworded (not 'as git reads it' for the root fallback): see commit c33ba71's Docs: line, which replaces afae542's. Log: <the session scratchpad, since lost>/patch-611/grain-061/r2-g2-red.log
- **ran:** nice -n 15 npm test (plugins/grain) at 6c tip after round 2 · **saw:** tests 1949, pass 1920, fail 0, skipped 29, exit 0. Log: <the session scratchpad, since lost>/patch-611/grain-061/r2-full-npm-test.log
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1973, pass 1972, fail 0, skipped 1, merge 722cad3

