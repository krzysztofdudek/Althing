# 107 · Edit-time hooks answer from an index built for a different HEAD, without a STALE marker, and give false advice (placement into a directory that no longer exists)

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/engine/grain-context.mjs, Grain/docs/reference.md
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs (v6.1.0 ae6152f): the guards in check-hook :133-138, edit-hook :269-274, read-hook :321-326 and commit-hook :501-506 compare only meta.engine, meta.extractor and meta.model with ENGINE_VERSION, EXTR_V and MODEL_V, never meta.headSha with headSha(f.root). For comparison, how-hook gates on `state.lastSha !== head` (:414), sessionContext reports a HEAD move (grain-session.mjs:26), and the direct command prints `(STALE)` (:563) and a banner (grain-context.mjs:250-252). check-hook always calls stamp2(true) (:225), stamp2 (:140, :514) cannot print STALE, and read-hook and edit-hook have no 'as of' stamp. The guards are unchanged on release/6.1.1 (:138/274/326/506 still 'stale schema: silence').
**Branch:** jarl/107-hooks-moved-head
**Merged:** 3cd290a
**CI:** none

## What
Reproduction (fresh clone of Grain v6.1.0 ae6152f, `grain 6.1.0 · extractor g36`; fixture from tests/fixtures/build-fixture.mjs, HEAD 47da000; each scenario in its own fixture clone, so that the hook-seen gate does not interfere):

A. check-hook --pre. Control at the indexed HEAD: the hook stays silent for src/handlers/loyalty.handler.ts. Then a commit `git mv src/handlers src/commands` (clean worktree, 0 porcelain lines, HEAD a11f54f, meta.headSha stays 47da000) and a PreToolUse Write payload for src/commands/loyalty.handler.ts: '[grain] placement: 30 of 30 `*.handler.ts` files live under `src/handlers/`; this one is outside it (`src/commands/`). Deliberate is fine — if you guessed, look there first.', with the stamp 'as of 47da000+dirty'. That directory no longer exists. `grain status --no-refresh` on the same index prints 'STALE: indexed at 47da000, HEAD is a11f54f' and 'as of 47da000 (STALE)'. After one real query the same hook stays silent.
B. commit-hook: after the move, a staged new src/commands/loyalty.handler.ts. The hook injects 3 notes and none of them is true: the same placement note; 'FIRST edge src/commands → src/core (0 existing)', although 29 committed files in src/commands import src/core; a note about the return type. A real `grain review --staged` gives 0 findings.
C. read-hook: the control (index and HEAD at 47da000) correctly flags the planned deviation src/handlers/dispute.handler.ts. In a second clone a fix is committed (@Handler() and validate added), and read-hook still says 'this file departs from its group on ... `@Handler` (line 6) — don't copy that part', with no stamp at all. After `grain check`, which refreshes the index, it stays silent.
D. check-hook after an edit: a comment appended to the committed src/commands/address.handler.ts gives a false placement note, while `grain check` on that file reports 0 deviations.

edit-hook goes through an identical guard, but it could not be shown speaking, because the fixture has no co-change pairs above the threshold (`grain completeness` reports none). The tests (check-hook.test.mjs:4, commit-hook.test.mjs:4) cover only an outdated schema; none covers a moved HEAD. Different from 057 (schema version: SessionStart says 'ready' while the hooks stay silent); here HEAD moved and the hooks speak. Different from 047, 055, 056 and 058.

Design note for the maintainer: silencing the hooks whenever headSha ≠ HEAD will mute them after every agent commit. The alternative is marking the note STALE (with a correct dirty flag) or a cheap refresh. The choice belongs to the maintainer.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-10/f2-hook-stale/repro.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-44/repro.log (scenarios A-C; script repro.sh alongside) and <the session scratchpad, since lost>/bughunt/grain/verify-44/repro2.log (scenario D; script repro2.sh).

## Why
docs/reference.md:125-127 (Hooks) promises: 'none of them build or refresh an index — a stale or missing model/history cache is silence, not an error, resolved by the next real query', and everywhere else in the documentation 'stale' means indexed HEAD ≠ HEAD (reference.md:10 and :301, README:286). The hooks are Grain's only answers from an old index without a STALE marker, and the skill (SKILL.md:109) tells the agent to consider the placement note before writing. HEAD moves on every commit, pull and branch switch, and nothing but a real query refreshes the index (the hooks do not build it, and according to 057 the MCP server does not warm it), so the window can last the whole session. The false notes land with confidence on Grain's main unsolicited channel.

## Acceptance
- check-hook, edit-hook, read-hook and commit-hook, when meta.headSha ≠ HEAD, either stay silent or mark the note STALE; the maintainer chooses the variant, and it is described in docs/reference.md.
- Scenarios A–D from repro.sh and repro2.sh: after a committed `git mv src/handlers src/commands`, without a query, no hook injects a note about `src/handlers/` or 'FIRST edge src/commands → src/core' without a STALE marker.
- There is a test of the hooks with a moved HEAD.

## Changelog
- Fixed: after a commit, pull or branch switch, the automatic notes during edits, reads and commits no longer give advice from the out-of-date index (for example, pointing at a folder that was just renamed); they stay quiet until the next grain question brings the index up to date, and the session-start message says so.

## Evidence

docs: docs/reference.md: Hooks paragraph, after 'resolved by the next real query' add: 'An index built for an earlier HEAD (after a commit, pull or branch switch) counts as stale here: every per-edit hook stays silent until the next real query refreshes it, and SessionStart says so.'

60adf3f: tests/hooks-moved-head.test.mjs red before (2 fail: placement note 'live under src/handlers/' after the move; read-hook flags the fixed dispute.handler.ts), green after (4/4). Repros repro.sh/repro2.sh rerun on release/6.1.1 code vs branch: scenarios A-D spoke before, all silent after; control at indexed HEAD still speaks. npm test: 2091 pass, 0 fail, 32 skipped. Logs: scratchpad/patch-611/grain-107/{red,green,full}.log, before/ and after/ repro logs.

docs: plugins/grain/skills SKILL.md — add that after an agent commit the hooks stay silent until the next grain_* query (grain_where / grain_check refresh the index) — for the final pass
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2132, pass 2131, fail 0, skipped 1, merge 3cd290a

