# 070 · The `yg check` gate fails with error[internal] in a read-only checkout because it cannot create or write the local .ast-cache

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/relations/facts-cache.ts, Yggdrasil/source/cli/src/relations/pass.ts, Yggdrasil/source/cli/src/io/atomic-write.ts, Yggdrasil/source/cli/src/io/type-class-cache.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/check.ts:304 calls runProjectRelationPass without a catch; relations/pass.ts:603 `await writeFacts(...)` without try/catch; relations/facts-cache.ts:237-257 (writeFacts → atomicWriteFile); io/atomic-write.ts:64 mkdir(dir, {recursive:true}) and the temporary file write throw EACCES (only TRANSIENT_WRITE_CODES are retried, the rest propagates); cli/preamble.ts:33 turns that into 'Unexpected error while running check' with code `internal`
**Branch:** jarl/063-local-writes
**Merged:** 786a2847333c0ea01ee390b47922ffa8efdd75ec
**CI:** none

## What
Reproduction (a fresh `npm install @chrisdudek/yg@6.1.0`, node v24.11.1, a non-root user, a project from `yg init --no-reviewer`): a committed origin, `git clone`, `chmod -R a-w .`, `yg check --no-approve` → `error[internal]: ... EACCES ... mkdir '.../ci/.yggdrasil/.ast-cache'` with 'This is a bug — please file an issue', exit 1; `--json` gives yg-error/1 with code `internal`; `CI=true yg check` and `yg check --summary` fail the same way. The same clone with write access restored: PASS, exit 0. `yg tree`, `yg aspects`, `yg context`, `yg impact` and `yg structure` work on the same read-only tree. Broader than in the report: with an existing .ast-cache but a read-only .yggdrasil, every cache miss (one new source file) fails too: `EACCES ... open '.ast-cache/v2/typescript/<key>.json.<pid>-...tmp'`. The siblings are best-effort by design: feature-index-write.ts:367 swallows write errors, type-class-cache.ts set() wraps atomicWriteFile in a try/catch with a comment that it 'mirrors the AST cache' (though ensureRevisionMarker is called outside that try), dependency-boundary.ts:136-140 swallows the whole relation pass. Limits: the documented CI recipe (getting-started.md, section 5: first a writable `yg check --approve --only-deterministic`) passes; a repo with script rules is red on a fresh clone anyway (error[unverified]), so the crash hides the classified diagnosis but does not change the exit code; the real false red is a repo without script rules in a read-only environment (a `:ro` mount, a Bazel-style sandbox, the sandbox of an agent that AGENTS.md tells to start with `yg check`). The claim of a contradiction with concurrency.md is overstated (:83 lists .ast-cache as local state that yg writes). GitHub main and the owner's local branches have the same pass.ts:603. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-39/logs/readonly-gate.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-39/logs/readonly-gate-scriptrule.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-39/logs/readonly-readers.log; scripts <the session scratchpad, since lost>/bughunt/yggdrasil/verify-39/repro-readonly.sh, repro-readonly-scriptrule.sh, repro-readonly-readers.sh; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/logs/04-readonly-checkout-gate-crash.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-10/repro/04-readonly-checkout-gate-crash.sh.

## Why
An environment error is reported as a CLI bug ('This is a bug — please file an issue') instead of a classified refusal with a fix, and the AST cache is described as 'SPEED-only' (pass.ts:197-202), so writing it should not decide the gate's result. The workaround is simple (a writable .yggdrasil or one writable run), so minor.

## Acceptance
On a fresh clone after `chmod -R a-w .`, a repo without script rules gives `yg check --no-approve` PASS, exit 0 (the .ast-cache write skipped, at most a note or a line in the debug log), also with an existing .ast-cache and a new source file; no path returns code `internal` because of a write to a gitignored cache (e2e test).

## Changelog
- Fixed: yg check passes in a checkout it cannot write to — the parse cache is skipped instead of failing the gate with error[internal].

## Evidence

- **ran:** git commit (merge of jarl/063-local-writes into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8100 pairs verified; [repo-check] All checks passed; [release/6.1.1 786a28473] Merge jarl/063-local-writes

