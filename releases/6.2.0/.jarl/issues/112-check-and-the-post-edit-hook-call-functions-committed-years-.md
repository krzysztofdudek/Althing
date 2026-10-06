# 112 · check and the post-edit hook call functions committed years ago 'new to the index' / 'never indexed' and count untouched functions into the change

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/mine.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/check.mjs, Grain/plugins/grain/engine/grain-check.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** (1) plugins/grain/engine/mine.mjs:174 `if (m1 <= 0) return;` in assignAll: a scope with no feature in common with any medoid does not reach `assign`, not even as ambiguous; learn.mjs:248-254 builds partition.assignments only from `ri.assign`; check.mjs:429 reads the missing key as 'never certified' and reports 'new to the index'; grain-check.mjs:380-382 calls the ones outside the change 'never indexed either'. (2) check.mjs:503-509 merges disclosed scopes of the same kind and neighbor into one hit, from the first one's line to the last one's endLine, and grain-check.mjs:335-336 compares that whole range with the diff. The same code on main ae6152f and on release/6.1.1.
**Branch:** jarl/104-check-change-attribution
**Merged:** 0b629c8
**CI:** none

## What
Reproduction (fresh Grain ae6152f, 6.1.0, npm ci; two fresh clones of express @7ef9844, each indexed by `grain refresh`):

1. The label on a clean tree (git status: only ?? .grain/): `grain check --all lib/response.js` prints '(4 more scope(s) elsewhere in this file were never indexed either …)' and '`sendStatus` (line 325), `sendFile` (line 375), `contentType` (line 508) and 1 more are new to the index — matched no group (best 0.00, floor 0.35)'. sendStatus arrived in 12f92a50 (2014-08-13), sendFile in 2cb029f8 (2014-08-06), clearCookie in 99820e7e (2011-02-03). The file is indexed (model.filesAll and tree.json). The lib partition has 2 medoids and 9 assignments, none in lib/response.js; all 4 scopes that qualify for the role have m1 = 0.00. Across the whole repo, on a clean tree, 94 committed scopes in 51 of the 141 tracked .js files get this label (log 07), e.g. lib/application.js defaultConfiguration, lib/express.js createApplication, lib/request.js defineGetter. Correction relative to the report: learn persists scopes with 0 < m1 < floor as -1 and loses only those with m1 = 0, which is why every such disclosure says 'best 0.00'.
2. Attribution to the change: one line changed at line 329 inside sendStatus gives '0 known deviation(s) in your change, 0 pre-existing, 4 unclassified scope(s)', and the PostToolUse check-hook payload lists sendStatus, sendFile and contentType. A stronger case: an edit of line 584 inside res.format, which is none of the four scopes, gives the same headline, and the hook injects the same line with three functions the edit did not touch. Control: an edit at line 1000, outside the range 325-721, puts the four scopes back under 'not in your change'. The recorded hit range is lines 325-721, count 4 (log 03).

A minor oddity: on a clean tree the line says '4 more … never indexed either', although no first one was disclosed. The merging was introduced by issue 010 (historical) so that several scopes of one new file give one line; nothing says that scattered old scopes should merge into one range that catches unrelated edits. Distinct from 042 (an ordinal shift under the same name; here the names are unique and the cause is m1 = 0) and 047.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-3/f6-committed-scopes-called-new.log; verification <the session scratchpad, since lost>/bughunt/grain/verify-49/logs/06-edit-in-res-format-outside-disclosed-scopes.log and 01-refresh.log, 02-clean-check.log, 03-probe-scopes.log, 04-git-ages.log, 05-edit-inside-sendStatus.log, 07-census-clean-tree.log in the same directory (the probe scripts in verify-49/tools/).

## Why
No false deviation arises and the exit code does not change, but the headline and the agent's context after an edit claim that code committed years ago is new or unindexed, and pin it to the current edit. This happens on about a third of the .js files in express and repeats on every edit of the file after the hook's TTL expires. docs/validation.md:777-780 says this disclosure is for 'a new scope', and the comments in check.mjs:376 and grain-check.mjs speak of scopes 'genuinely new to the index'.

## Acceptance
- A scope present at HEAD that landed in no group (including at m1 = 0) is described as indexed and unclassified, not as 'new to the index' or 'never indexed'.
- Only scopes whose own range intersects the changed lines are counted into the change; a merged hit does not extend the attribution to scopes outside the diff.
- express @7ef9844: `grain check --all lib/response.js` on a clean tree does not call sendStatus, sendFile or contentType 'new to the index', and an edit of line 584 in res.format gives no 'unclassified scope(s)' in the headline or in the check-hook payload.

## Changelog
- Fixed: `check` and the hook no longer call long-committed functions that fit no group new to the index; they are named as indexed but unclassified, and an edit counts only the functions it actually touches.

## Evidence

- **ran:** node --import ./tests/git-env.mjs --test tests/indexed-unclassified-scopes.test.mjs (plugins/grain) at bf654bb · **saw:** red: 0/4 pass ('new to the index' on service.ts's committed Injectable/BaseService; an edit between quuxAlpha and wibbleBravo put both in the headline)
- **ran:** same, at the 112 commit · **saw:** green: 4/4
- **ran:** <the session scratchpad, since lost>/patch-611/grain-104/express112.sh (express @7ef9844, scratch clone) before the fix · **saw:** clean tree: '(4 more scope(s) ... never indexed either' and 'sendStatus (line 325), sendFile (line 375), contentType (line 508) and 1 more are new to the index'; edit at line 584: headline '4 unclassified scope(s)' and the check-hook payload names the three functions
- **ran:** same, after the fix · **saw:** clean tree: '(4 unclassified scope(s) elsewhere in this file' and '... are indexed but unclassified'; edit at line 584: headline '0 deviation(s) in your change, 0 pre-existing' with no unclassified count, hook payload only the co-change line

docs: docs/validation.md (~779, 'such a scope is named in check as new to the index'): add that a committed scope which matched no group is named as indexed but unclassified, and only a scope the index does not list is called new to the index.
- **ran:** round 2: node --import ./tests/git-env.mjs --test tests/indexed-unclassified-scopes.test.mjs at 28c822e's engine · **saw:** red: 4/6; a new quuxAlpha and a third wobbleRun were called indexed
- **ran:** same, at c7b0ae5 · **saw:** green: 6/6
- **ran:** express scratch clone: appended res.sendStatusText = function sendStatus(...), grain check lib/response.js at c7b0ae5 · **saw:** 'sendStatus (line 1051) is new to the index'; the four old scopes stay '4 more unclassified scope(s) elsewhere in this file — not in your change'
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2008, pass 2007, fail 0, skipped 1, merge 0b629c8

