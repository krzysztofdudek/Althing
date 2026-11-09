# 125 · export reads anchor lines (focus) from a dirty worktree, but sites, line numbers and asOf from the HEAD index; an uncommitted edit silently shifts the anchors, and nothing says the tree was dirty

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-pmup
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/export.mjs, Grain/plugins/grain/engine/grain-export.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/export.mjs:193-203 (linesOf: `readFileSync(join(root, rel))`, with the comment 'worktree at HEAD for a clean checkout'), focusLines :93-155 scans those lines between s.line and s.endLine from the HEAD index (:475-476), contrary to the header :21 ('The dump is a pure function of the index (HEAD tree + history); uncommitted edits never enter it'); grain-export.mjs:11-44 (cmdExport does not read ctx.treeDirty from grain.mjs:564-565, stamp() without the dirty argument at :41 and :44, a dump with no dirtyTree field and no disclosure). release/6.1.1 does not touch export.mjs, and in grain-export.mjs it changes only cmdPropose.
**Branch:** jarl/125-export-anchors-from-head
**Merged:** 87fe50e
**CI:** none

## What
Reproduction (fresh Grain ae6152f, v6.1.0, `grain version` 6.1.0; fresh clone of express @023767fe; own script):
- Clean tree versus an uncommitted insertion of three lines at the top of test/app.router.js: asOf 023767fe in both exports, stamp 'as of 023767f' in both, no top-level key contains 'dirty'. All 17 sites in the file keep the same keys, including line and endLine from HEAD. Five `auto.call:res.end` sites change `focus` from the `res.end(` line to the declaration line: 621→620, 634→633, 650→649, 682→680, 695→693. In the HEAD blob those new lines are `app.get(...)` lines, so the anchor a fine-tuning pipeline would mask is wrong.
- The same dirty tree in another command: `grain status` says 'the worktree has uncommitted changes — this answer is computed from the indexed commit…'; export stays silent.
- An edit without a line shift (`res.end(` changed to `res.send(` on HEAD line 621): one focus drops from [621] to [620], so uncommitted content enters the dump even without shifts.
- A file moved out of the worktree (an uncommitted deletion): all 17 sites keep the line ranges from HEAD, and `focus` for each of them is null; the stamp is still without +dirty.

Different from 044 (held-since/firstConforming dates in the export).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-8/repro/f4-export-dirty-anchors.log (script f4-export-dirty-anchors.sh beside it); verification <the session scratchpad, since lost>/bughunt/grain/verify-63/repro/export-dirty-anchors.log (script export-dirty-anchors.sh; dumps out-clean.json, out-shifted.json, out-inplace.json and out-deleted.json in verify-63/).

## Why
README.md:244 and docs/reference.md:327-332 make anchor lines part of the published schema, which the downstream fine-tuning pipeline uses as masks, and docs/reference.md:12-13 promises `+dirty` whenever a file is read from an uncommitted worktree. Export usually runs from a clean checkout, but when it does not, the result in a public interface is silently wrong and discloses nothing.

## Acceptance
- Anchor text is read from the HEAD blob that the sites' line numbers come from (e.g. `git cat-file --batch` or a blob the index already holds).
- If export reads anything from the worktree, the stamp carries +dirty, and the dump carries dirtyTree or a disclosure.
- export-dirty-anchors.sh: the `focus` of each of the 17 sites in test/app.router.js is identical on a clean tree and after an uncommitted insertion of three lines.

## Changelog
- Fixed: `grain export` read anchor lines from uncommitted files on disk while every line number came from the last commit, so an uncommitted edit silently moved the anchors; anchors now come from the commit, and a dirty worktree is said beside the stamp.

## Evidence

docs: docs/reference.md (export section): anchor lines are read from the indexed commit; on a dirty worktree export prints the usual uncommitted-changes note on stderr (after the summary line with --out), never inside the dump. Red->green: tests/export-anchors-from-head.test.mjs 3 of 4 red before (focus [13]->[10], [6]->[9]/[7]; no note), 4/4 green after; export-dirty-anchors.sh on express@023767f: focusChanged shifted 0, inplace 0, deleted 0 of 21 sites; full npm test 2021 pass 0 fail 31 skip. Commit 6cb903a.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2071, pass 2070, fail 0, skipped 1, merge 87fe50e

