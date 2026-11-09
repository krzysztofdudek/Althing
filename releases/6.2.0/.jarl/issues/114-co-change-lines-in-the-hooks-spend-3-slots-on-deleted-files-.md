# 114 · Co-change lines in the hooks spend 3 slots on deleted files, and sometimes list only files that no longer exist

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-rwaw
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/completeness.mjs, Grain/plugins/grain/engine/grain.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/completeness.mjs:46-70: cochangeData sets `dead: !live.has(file)` (:58, :60), but neither filters out nor demotes dead partners; it sorts only by the edited file's ratio (:70); both hooks take `.slice(0, 3)` without a filter: check-hook in grain.mjs:193-212 (slice :207) and edit-hook :276-290 (slice :287). Other lists for the agent already skip dead files: how.mjs:148-156 (with a comment on why marking is not enough), obligations.mjs:33 ('gate 4: liveness'), selftest-null.mjs:151 (`!h.dead`). Unchanged on release/6.1.1.
**Branch:** jarl/058-hooks-own-repo-and-new-files
**Merged:** 657e95d
**CI:** none

## What
Reproduction (fresh Grain main ae6152f, engine 6.1.0; fresh clones of honojs/hono @f23b146 and expressjs/express @7ef9844; own scripts, not the finder's):

- PreToolUse `grain edit-hook` gives byte for byte what the report says. package.json: 'before you edit package.json, note: edits like this also touch: yarn.lock (deleted) 61/694 · bun.lock (deleted) 29/694 · bun.lockb (deleted) 15/694'. src/helper/css/index.ts: only 'deno_dist/helper/css/index.ts (deleted) 9/12'. src/context.ts: deno_dist/context.ts (deleted) 106/225 in first place, and the live src/request.ts 29/225 (4th position in `grain completeness`) falls beyond the limit of 3.
- PostToolUse `check-hook` prints the same line, e.g. 'edits like this also touch: deno_dist/utils/html.ts (deleted) (co-changed in 13/23 commits)' for src/utils/html.ts.
- A sweep of hono (cochangeData + slice(0,3) for every file from git ls-files): 583 tracked, 108 speak, 64 list a deleted file, 7 list only deleted ones, 17 cut a live partner; deleted files take 70 of 214 slots. Grain's dead flag agrees with git ls-files in every case.
- express (control): 29 speak, 9 list a deleted file, 4 only deleted ones, 3 cut a live partner; e.g. test/Router.js gets only 'lib/router/index.js (deleted)', and lib/express.js shows bin/express (deleted) and cuts the live test/exports.js.
- `git log -M` shows every listed partner as a plain D, not a rename: yarn.lock and bun.lockb in 0aa8acc6, bun.lock in 535ae553 (the move to pnpm), deno_dist/* in 1b2a4c08 (JSR), src/helper/ssg/index.test.tsx in 8ef9b7bb. This is neither issue 048 (renamed files shown as deleted; its fix through currentPathOf will not change any of these lines) nor 050 (the `where` cards).

The `(deleted)` marker is intentional and satisfies the liveness rule from tests/cross-check-liveness.test.mjs ('mark it OR omit it'), so for `grain completeness` it is fine. The same cause affects the 'missing from your change' block in review and the change shapes (a separate issue). No test pins the current behavior of the hooks (edit-hook.test.mjs and completeness-hook.test.mjs do not check a deleted partner).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-5/logs/03-cochange-hook-names-deleted-files.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-58/logs/02-edit-hook-hono.log (the main one) and 04-sweep-hono.log, 05-posttooluse-and-completeness.log, 03-partner-fate.log, 06-sweep-express.log, 01-refresh.log in the same directory; scripts verify-58/edit-hook.sh, verify-58/sweep.mjs, verify-58/post-and-completeness.sh.

## Why
docs/reference.md:141-151 says what the hooks are for: 'files this repo's own history shows reliably co-changing with the one you just touched', and the pre-edit line exists so that 'touching both halves of an established pair in one pass is still cheap'. A deleted file cannot be touched. Grain has already decided for `how` (how.mjs:148-155) that marking a dead file 'still hands it to the reader' as a place to edit, and skips it; the hooks speak unasked, yet did not get the same treatment. The agent is sent to files it cannot edit, and a live partner gets lost beyond the limit. Nothing false is said and nothing is blocked, hence minor.

## Acceptance
- In the renderers of both hooks (check-hook and edit-hook) dead partners are filtered out before `slice(0, 3)`, and the hook stays silent when no live partner remains; the ccSig suppression key is built from the same filtered list in both hooks.
- `grain completeness` may still show dead partners with the `(deleted)` marker.
- hono @f23b146: the edit-hook for package.json and src/helper/css/index.ts lists no '(deleted)' file, and for src/context.ts it lists src/request.ts.

## Changelog
- Fixed: The hooks' "edits like this also touch" note names only files that still exist, so a deleted file no longer takes the place of a real partner, and a file whose partners are all gone gets no note. `grain completeness` still lists deleted partners, marked.

## Evidence

- **ran (history):** node --test tests/hook-cochange-live-partners.test.mjs on release/6.1.1 (archive copy) and on jarl/058 439e108 · **saw:** before: 1/5 pass — edit-hook 'lib/router/d1.js (deleted) · d2 (deleted) · d3 (deleted)', live test/use.js cut; lib/solo.js got 'lib/gone.js (deleted)'. after: 5/5 pass — both hooks name test/use.js (11/11) only, lib/solo.js silent, edit-hook's line silences check-hook's copy (shared sig), completeness still lists the five dead partners marked
- **ran (history):** hono @f23b146 (verify-58 copy, indexed by 6.1.1), PreToolUse Edit payload to edit-hook for package.json, src/helper/css/index.ts, src/context.ts · **saw:** release/6.1.1: package.json 'yarn.lock (deleted) · bun.lock (deleted) · bun.lockb (deleted)'; css/index.ts 'deno_dist/helper/css/index.ts (deleted)'; context.ts 'deno_dist/context.ts (deleted) · src/context.test.ts · src/hono.ts'. jarl/058: package.json and css/index.ts silent (completeness: only deleted partners), context.ts 'src/context.test.ts (73/225) · src/hono.ts (58/225) · src/request.ts (29/225)'

docs: docs/reference.md: Hooks paragraph — the co-change line names partners that still exist at HEAD (a deleted one is left out; `completeness` names it, marked '(deleted)')
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2056, pass 2055, fail 0, skipped 1, merge 657e95d

