# 089 · `yg portal` reports ordinary environment errors (port in use, --out pointing at a directory) as 'error[internal] … This is a bug — please file an issue'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-iyie
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/portal.ts, Yggdrasil/source/cli/src/cli/preamble.ts, Yggdrasil/source/cli/src/portal/server/server.ts, Yggdrasil/source/cli/src/portal/serializer.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/portal.ts:54-58 (one catch around the whole of runPortal → abortOnUnexpectedError(error, 'opening the portal')), :93-99 (servePortal does not check err.code), :74-75 (--out resolved and passed to emitStatic without checking whether it is a directory); cli/preamble.ts:15-37 classifies only LockInvalidError and LockEnvironmentError, everything else is 'internal'; portal/server/server.ts:55 `server.on('error', reject)` passes on the raw EADDRINUSE; portal/serializer.ts:182 atomicWriteFile → EISDIR on rename
**Branch:** jarl/031-portal
**Merged:** 4fdb0779fba283544076fa447532c9abb13a1c62
**CI:** none

## What
Reproduction (fresh clone 2493aa16; portal.ts, preamble.ts and server.ts unchanged since v6.1.0; npm @chrisdudek/yg@6.1.0, Node v24.11.1, macOS; copies of examples/checkout-flow and examples/layered-architecture after git init): (1) a second `yg portal --port 47459` while another repo's portal holds that port: exit 1, 'error[internal]: Unexpected error while opening the portal: listen EADDRINUSE: address already in use 127.0.0.1:47459', 'why: The CLI encountered an error it does not classify.', 'next: This is a bug — please file an issue …'. (2) The port held by a plain node net server: the same, so this is the ordinary port-in-use case, not two portals (everything on stderr, stdout empty). (3) `yg portal --static --out src` when src is an existing directory: exit 1, error[internal] with EISDIR on the rename of the atomic write; no .tmp left behind. (4) For comparison, `--out no/such/dir/x.html` works (parent directories are created), and `--port 99999` gets a correct error[usage], so the command classifies some user errors, just not these two. tests/integration/portal-server.test.ts:516-527 only checks that startServer rejects (does not hang) on EADDRINUSE, and tests/e2e/cli-reference-truth.test.ts:282 tolerates EADDRINUSE in the test environment. The same class as 020 here (a broken yg-config.yaml as internal in the navigation commands) and related to 031 (Approve results in the portal), but with different triggers and code paths. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-59/repro/repro-portal-internal.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-59/repro/repro-portal-internal.sh); issue <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-6-portal-port-in-use.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-7/repro/repro-6-portal-port-in-use.sh.

## Why
docs/cli-reference.md:3033 defines `internal` as a CLI error to be reported, and docs/portal.md:68-70 documents the fixed default port 4317 and `--port <n>`, exactly the advice the error does not give; two portals on 4317 are an everyday case, and an agent following next: escalates instead of trying another port. aspect-test.ts:610-620 and the rule cli-command-contract (rewritten in issue 243 of 6.1.0) already call such a funnel a defect. The exit code is right and the raw message names the cause, so minor.

## Acceptance
EADDRINUSE gives a classified command error 'port N is in use' with `next: yg portal --port <n>`, and --out pointing at an existing directory gives a usage error naming the path; neither of them contains 'This is a bug' or the code `internal` (an e2e test for both).

## Changelog
- Fixed: yg portal says when its port is taken (command-error naming the port, next: yg portal --port <n>) or --out names a directory (usage error naming the path), instead of error[internal] asking for a bug report.

## Evidence

- **ran (history):** git commit (merge of jarl/031-portal into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8113 pairs verified; [repo-check] All checks passed; [release/6.1.1 4fdb0779f] Merge jarl/031-portal

