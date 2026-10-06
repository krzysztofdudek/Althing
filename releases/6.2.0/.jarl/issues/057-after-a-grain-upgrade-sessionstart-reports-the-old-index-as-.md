# 057 · After a Grain upgrade, SessionStart reports the old index as 'ready', while every edit-time hook silently says nothing (this also affects the 6.1.1 release itself)

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/grain-session.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/grain-session.mjs:15-27 (v6.1.0) sessionContext reads meta.json and model.json (:16-17) and tells apart only a missing model, a moved HEAD and 'ready'; it does not compare meta.engine, meta.extractor and meta.model with ENGINE_VERSION, EXTR_V and MODEL_V (config.mjs:6-9); the five hooks in grain.mjs do, and then stay silent: check-hook :133-138, edit-hook :269-274, read-hook :321-326, how-hook :393-398, commit-hook :501-506
**Branch:** jarl/057-session-and-placement-truth
**Merged:** 6500847
**CI:** none

## What
Reproduction (fresh clones of Grain v6.0.0 and v6.1.0, sindresorhus/ky @0d59458, 549 non-merge commits; each hook through the exact command from hooks/hooks.json with CLAUDE_PLUGIN_ROOT and a JSON payload on stdin). Grain 6.0.0's `status` on ky writes meta engine 0.4.0, extractor g34, model m27. Grain 6.1.0's SessionStart on this index: 'Index: ready: 93 files, 44 groups, 17 conventions in source code (a moderate model).', the architecture lines (12 dependencies, 4 layers), concepts and changes from the old model, and 'Runs automatically after every edit in this session — … silence means nothing certified to say, NOT approval.' Control (ky indexed by 6.1.0): also 'ready', but 13 conventions, 20 dependencies and 2 layers. A PreToolUse Edit payload for source/core/Ky.ts on the old index: edit-hook and check-hook print nothing, exit 0, also with GRAIN_DEBUG=1; on the control, edit-hook says '[grain] before you edit source/core/Ky.ts, note: edits like this also touch: test/hooks.ts (co-changed in 40/137 commits)'. The first real query (`grain status`) on the old index: 'walking full history … 549 commits … 23.8s', index ready in 28.8 s, and only then does edit-hook speak. Hooks never build, and the MCP server does not warm up the index, so the hooks can stay silent for a whole session. This is not only 6.0.0 → 6.1.0: the 6.1.1 candidate (the release/6.1.1 work applied on a fresh clone of ae6152f) changes ENGINE_VERSION from 6.1.0 to 6.1.1; on a copy of an index built by 6.1.0, with GRAIN_HOOK_TTL_MS=1, 6.1.0 says 'ready' and edit-hook speaks, while the 6.1.1 candidate says 'ready' and edit-hook is silent. Hook silence on an old schema is documented (docs/reference.md, Hooks), and so is the full history walk after an upgrade (CHANGELOG 6.1.0, 'Upgrading from 6.0.0'), but the status in SessionStart is not: README and docs/reference.md promise 'the live state of this repository's index', and the code handles the analogous case of a moved HEAD separately. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-24/logs/03-sessionstart-ky-600.log, 04-edit-hooks-ky-600.log, 06-same-defect-on-6.1.0-to-6.1.1-upgrade.log and 01, 02, 03-sessionstart-ky-610.log, 04-edit-hooks-ky-610.log and 05 in that directory.

## Why
Hooks are the channel through which Grain speaks to the agent on its own (test 1 in the README: 'the agent never asked'). After every release that bumps ENGINE_VERSION, including the 6.1.1 release, all five hooks go silent in every existing repository, while the session note claims that the index is ready and that the hooks run after every edit. Also missing is the warning, given in the 'not built yet' state, that the first query can take minutes. It fixes itself on the first real query.

## Acceptance
- sessionContext checks meta.engine, meta.extractor and meta.model the way the hooks do; on a mismatch it says that an older Grain version built the index and it has to be rebuilt (the first query will walk the history, or grain_refresh), that edit-time notes stay silent until then, and it does not present the architecture lines, conventions or 'Runs automatically after every edit' from the old model as current.
- Test: an index with meta.engine different from ENGINE_VERSION → the SessionStart output does not contain 'Index: ready' and does contain the information about the rebuild.

## Changelog
- Fixed: after an upgrade, the note at the start of a session called the existing index ready while every automatic note stayed silent; it now says the index has to be rebuilt first, that the first question rebuilds it, and that this can take minutes on a large repository.

## Evidence

- **ran:** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/session-hook.test.mjs (engine/grain-session.mjs from release/6.1.1, then from b3a581e) · **saw:** before: pass 8, fail 3 (the three stale-index tests); after: pass 11, fail 0
- **ran:** node <the session scratchpad, since lost>/patch-611/grain-057/repro-057.mjs <worktree>/plugins/grain <ky copy> source/core/Ky.ts — the exact hooks.json SessionStart and PreToolUse Edit commands on ky indexed by Grain 6.1.0 (meta engine 6.1.0) and by 6.0.0 (engine 0.4.0), running engine 6.1.1 (logs <the session scratchpad, since lost>/patch-611/grain-057/before-057.log, after-057.log) · **saw:** before: 'Index: ready: 93 files, 44 groups, 13 conventions …', the Architecture and changes lines, 'Runs automatically after every edit …', edit-hook silent; after: 'Index: built by an older Grain, so it has to be rebuilt before grain answers from it — the first query rebuilds it, walking the full git history again; … call grain_refresh ahead of time. Until it is rebuilt every automatic grain note stays silent, so silence after an edit is the old index, not approval.', no Architecture/changes/Runs-automatically lines, edit-hook silent
- **ran:** grain status on the 6.1.0-built ky copy, then repro-057.mjs again (after-rebuild-057.log) · **saw:** status 2.2 s; 'Index: ready: 93 files, 44 groups, 13 conventions', 'Runs automatically …' back, edit-hook: '[grain] before you edit source/core/Ky.ts, note: edits like this also touch: test/hooks.ts (co-changed in 40/137 commits)'
- **ran:** cd plugins/grain && npm test (branch tip 312e808, no YG_BIN) · **saw:** tests 1857, pass 1831, fail 0, skipped 26

docs: docs/reference.md: Hooks, the SessionStart bullet — add: on an index another Grain version built (the per-edit hooks refuse it) it says the index must be rebuilt and that the first query rebuilds it, and prints none of the old model's lines

docs: docs/validation.md: test count — this branch adds 4 tests (1853 → 1857 at its tip)
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1857, pass 1856, fail 0, skipped 1, merge 6500847

