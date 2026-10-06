# 122 · An absolute path to a file that does not exist yet makes the MCP server run docker synchronously, so ping is not answered at once (up to 10 s with a hung daemon)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/bin/grain-mcp.mjs, Grain/plugins/grain/engine/grain-context.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/bin/grain-mcp.mjs:291 (transformInput calls checkFields synchronously), :229 and :242 and :201-204 (inRepo → hostSide for every field holding a path in the repo), :180-191 (hostSide: for an absolute path that does not exist, it calls hostPathCached for every missing level, starting from the leaf, before checking whether the parent exists on the host), :173-179 (hostPathCached with a cache keyed by the full path, so every new file name is a miss); plugins/grain/engine/grain-context.mjs:63-78 (`docker ps -q` and `docker inspect` through execFileSync with a 10 s timeout, :69 and :74). Runes awaits transformInput (engine/vendor/runes/dist/mcp/server.mjs:142), so an asynchronous docker call would work there; its comment (:4, :11) warns that synchronous work blocks ping, tools/list and cancel. Both files unchanged on release/6.1.1.
**Branch:** jarl/061-paths-roots-mcp
**Merged:** 722cad3
**CI:** none

## What
Reproduction (fresh clone of v6.1.0 b70a4e9, node 24.11.1, a fresh JS repo with 7 commits and a warm index; own script tools/ping-during.mjs sends tools/call grain_obligation and, 50 ms later, a ping):

- Real docker (2 running containers, about 50 ms per docker call), 3 runs each: the relative path src/newdir/deeper/x.handler.js — ping 0 ms, call about 130 ms; the same location as an absolute path — ping 130-134 ms, call 294-304 ms. The mechanism is real, but on this host the difference is about 0.13 s, not the 2.4 s from the finder's report; its scale follows docker's latency.
- Docker calls counted through a logging shim: relative path 0; absolute through 2 missing directories 6 (3 rounds of ps + inspect: the leaf, deeper/, newdir/); absolute to a new file in an existing directory (src/orders/new.handler.js, the most common pre-write case) 2; an existing file 0.
- A docker stub that answers after 1 s: deep absolute path — ping waited 6.5 s, the call took 6.7 s; new file in an existing directory — ping waited 2.06 s; relative path — ping 0 ms.
- A stub that never answers: new file in an existing directory, absolute path — ping waited 9.97 s, and the call took 10.1 s, up to the execFileSync timeout; the relative path is unaffected. In this window the server answers neither ping nor tools/list and cannot handle cancel.

Correction: the upper bound 'up to 20 s per level' holds only when `docker ps` succeeds and `docker inspect` hangs; a hung `docker ps` returns [] and skips inspect, so it costs 10 s per level. A machine without the docker CLI fails fast and is not affected. The test 'ping answered during a call' (mcp-server.test.mjs:542) covers only a running CLI child, not the translation step. Distinct from 081, 135 and 136 of release-6.1.0 (those are about what the translation does wrong, not about it blocking the server).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-6/ping-block/ping-block.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-60/ping-block-real-docker.log and <the session scratchpad, since lost>/bughunt/grain/verify-60/ping-block-docker-calls.log (docker calls counted through a shim) and <the session scratchpad, since lost>/bughunt/grain/verify-60/ping-block-slow-and-hung-docker.log (a 1 s stub and a hung one); the stubs in verify-60/shim-count/, shim-slow/, shim-hung/.

## Why
docs/reference.md (How a call runs) promises that 'initialize, ping and tools/list are answered at once, never behind a running call'. The skill says to call grain_obligation { path: "<the path you are about to create>" } before creating a file, the docs allow an absolute path, and agents usually hold absolute paths, so this is normal use. With a healthy local docker it costs only 0.1-0.3 s, but Docker Desktop waking from resource saver mode, or a hung daemon, stops the whole server for seconds.

## Acceptance
- The container path translation does not block the server's event loop (docker is run asynchronously, or once per session).
- Translation is not attempted for a path whose nearest existing ancestor lies on this machine.
- ping-during.mjs with a docker stub that never answers: a ping sent during grain_obligation with the absolute path of a new file in an existing directory gets an answer in less than 100 ms.

## Changelog
- Fixed: the MCP server keeps answering ping and tool listings while Docker is slow or hung, and no longer asks Docker at all about a file you are about to create inside the repository.

## Evidence

- **ran:** node --test tests/mcp-docker-never-blocks.test.mjs (before e7cb79d and after); verify-60 ping-during.mjs with a hung docker shim on a copy of repo3 · **saw:** before: docker asked ['ps -q' x4] for two new files in the repo; ping not answered within 5 s (hung docker), nor within 3 s while a container path waits. after: 3 pass, docker never asked for paths in the repo, ping and tools/list answered while the container path waits. ping-during.mjs patched, hung docker: absolute src/orders/new.handler.js → ping latency 1 ms (was 9.97 s), call 398 ms; src/newdir/deeper/x.handler.js → ping 1 ms; docker calls logged: 0. Logs: <the session scratchpad, since lost>/patch-611/grain-061/122-red.log, 122-green.log, 122-ping-during-patched.log

docs: docs/reference.md: MCP server > Paths: the docker parenthesis — asked without holding the server's other requests, mounts remembered for a minute, a not-yet-existing path whose nearest existing directory is inside the repository on the server's machine is not translated (exact text in commit e7cb79d's Docs: line)

jarl: docker is skipped only for paths whose nearest existing directory lies in the calling repository — the literal 'the nearest existing ancestor exists on this machine' is always true (/), so the worker's narrowing is accepted
- **ran:** round 2: ping bound tightened to 100 ms; node --test tests/mcp-docker-never-blocks.test.mjs x5 under nice -n 15 (load 19-52) · **saw:** 5/5: pass 3 fail 0
- **ran:** nice -n 15 npm test (plugins/grain) at 6c tip after round 2 · **saw:** tests 1949, pass 1920, fail 0, skipped 29, exit 0. Log: <the session scratchpad, since lost>/patch-611/grain-061/r2-full-npm-test.log
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1973, pass 1972, fail 0, skipped 1, merge 722cad3

