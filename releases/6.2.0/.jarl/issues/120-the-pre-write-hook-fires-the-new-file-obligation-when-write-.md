# 120 · The pre-write hook fires the 'new file' obligation when Write overwrites an existing committed file, and stamps +dirty on a clean tree

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-cgcg
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain.mjs, Grain/plugins/grain/tests/obligation-hook.test.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain.mjs:159-176 (v6.1.0 b70a4e9; the check-hook --pre block is byte for byte the same on release/6.1.1): in the `if (opts.pre)` branch, `obligationFor(model2, rel)` is gated only by `obl.rules.length`, with no check of whether `rel` exists in the worktree or in model2.filesAll/pathsAll; placementHit in the same branch does check it (placement.mjs:165 `files.includes(rel)` → null). grain.mjs:225 `stamp2(true)` for both the Pre and the Post branch. The comment at :144 ('the file does not exist yet') and tests/obligation-hook.test.mjs:1 ('fires on every `Write` of a NEW path') assume that PreToolUse Write concerns only new paths, which is not true.
**Branch:** jarl/058-hooks-own-repo-and-new-files
**Merged:** 657e95d
**CI:** none

## What
Reproduction (fresh Grain v6.1.0 b70a4e9; sindresorhus/ky @0d59458, `grain refresh`: 93 files, 549 commits; PreToolUse Write payloads in Claude Code's shape, sent through the exact command registered in plugins/grain/hooks/hooks.json, with CLAUDE_PLUGIN_ROOT pointing at the fresh clone):
(1) The existing, committed source/errors/HTTPError.ts: '[grain] obligation: a new *.ts under source/errors/ has come with: source/core/Ky.ts (7 of 7) — `grain obligation source/errors/HTTPError.ts` for the full table.', with the stamp 'as of 0d59458+dirty'.
(2) The existing source/utils/merge.ts: the same note with Ky.ts (6 of 6) and +dirty.
(3) After .grain/ is added to .git/info/exclude, when `git status --porcelain` is completely empty, the existing source/errors/TimeoutError.ts still gets the obligation note with '+dirty'. +dirty is unconditional and does not come from the untracked .grain/.
(4) Control: a truly new source/errors/BrandNewError.ts gets the same note. That is the intended case, and it shows that the hook does not tell a new file from an overwrite.
(5) On the same clean tree, `grain obligation source/errors/HTTPError.ts` and `grain status` stamp 'as of 0d59458' without +dirty, so the hook's stamp contradicts the CLI.

Claude Code fires PreToolUse for every Write, including a full rewrite of an existing file, which agents do routinely. The false +dirty also affects Pre notes for new files and appears in issue 107 (hooks with a moved HEAD). Distinct from 055 (JSON quotes) and 056 (placement under .yggdrasil/).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-5/logs/05-prewrite-obligation-fires-on-existing-file.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-56/logs/02-prewrite-existing-files.log and 01-refresh.log, 03-controls-clean-tree.log, 04-unfixed-on-release-6.1.1.log in the same directory.

## Why
docs/reference.md:138 describes PreToolUse on Write as 'placement from the intended path alone, before the file exists', README:251 says 'before a new file exists', and the note itself says 'a new *.ts'. An unasked, false obligation note on the hot path pushes the agent to touch a companion (Ky.ts) during an ordinary rewrite of a file, and inflates the hook's speaking rate, which tickets 081/088 tried to keep at single-digit percentages (they measured only creation events). The grain.mjs header says that +dirty means 'this answer incorporates your uncommitted edits' and belongs only to check/review/spectrum/explain, while the Pre branch reads no content from the worktree.

## Acceptance
- The pre-write obligation speaks only for a path that is neither in the worktree nor in model2.filesAll.
- The --pre branch stamps without +dirty (`stamp2(false)` or `stamp2(!pre)`).
- ky @0d59458: a PreToolUse Write payload for the existing source/errors/HTTPError.ts gives no obligation note, and for the new source/errors/BrandNewError.ts it gives the note with the stamp 'as of 0d59458'.

## Changelog
- Fixed: Rewriting an existing file no longer brings the "a new file here has come with" note, which now appears only for a file that does not exist yet. The note's stamp no longer says +dirty.

## Evidence

- **ran (history):** node --test tests/obligation-hook.test.mjs (two new tests), before and after a933b0c · **saw:** before: 3/5 pass — Write of committed d/new1.x got 'obligation: a new *.x under d/ has come with: reg.txt (6 of 6) … as of 1575c3c+dirty'; new path stamped +dirty. after: 5/5 pass — committed and untracked-on-disk files get no note; new d/new8.x note ends 'as of <head>'
- **ran (history):** ky @0d59458 (verify-56 copy, clean tree, indexed by 6.1.1), PreToolUse Write payload to check-hook --pre · **saw:** release/6.1.1: existing source/errors/HTTPError.ts and new BrandNewError.ts both got 'obligation: a new *.ts under source/errors/ has come with: source/core/Ky.ts (7 of 7)' with 'as of 0d59458+dirty'. jarl/058: HTTPError.ts silent; BrandNewError.ts gets the note with 'as of 0d59458'

docs: docs/reference.md Hooks paragraph (PreToolUse on Write) — the obligation note speaks only for a path that does not exist yet; a rewrite of an existing file gets placement silence and no obligation note
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2056, pass 2055, fail 0, skipped 1, merge 657e95d

