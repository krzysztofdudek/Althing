# 228 · Grain: hooks refresh the index under a lock when HEAD has moved since indexing, instead of going silent (the second half of 107)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** grain, hooks, partial
**Files:** plugins/grain/engine/hook-context.mjs, plugins/grain/engine/store-lock.mjs, plugins/grain/engine/grain-session.mjs, plugins/grain/tests/hooks-refresh-under-lock.test.mjs, plugins/grain/tests/hooks-moved-head.test.mjs, plugins/grain/skills/grain/SKILL.md, docs/reference.md
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**Branch:** jarl/228-hooks-refresh
**Worker:** grain-228
**Worktree:** /Users/me/.jarl-wt/Grain-228
**Since:** 2026-10-05 16:22

## What
In 6.1.1 (107) hooks stay silent when HEAD has moved since indexing; refreshing under a lock deferred to 6.2 (grain-scope).

## Why
After every commit the agent loses hints until a manual refresh.

## Acceptance
A hook with a moved HEAD starts an incremental refresh under a lock (one builder, the rest wait a bounded time or answer with a clear marker that the index is being refreshed), and answers from the index for the current HEAD; no advice comes from the index of another HEAD; tests: a commit with git mv, parallel hooks, an interrupted refresh.

## Changelog
- Changed: after a commit, pull or branch switch, the edit-time notes start one background refresh of the index and speak again as soon as it lands, instead of staying silent until the next grain query; a grain query that arrives while that refresh runs waits for it (up to GRAIN_REFRESH_WAIT_MS, two minutes) and answers for the current commit; a refresh that fails is not started again for ten minutes while the index has not moved (GRAIN_REFRESH_RETRY_MS).

## Evidence


- **ran:** node --import ./tests/git-env.mjs --test tests/hooks-refresh-under-lock.test.mjs (run in plugins/grain, before the fix) · **saw:** 4 of 4 fail on the refresh count: actual 0, expected 1
- **ran:** node --import ./tests/git-env.mjs --test tests/hooks-refresh-under-lock.test.mjs tests/hooks-moved-head.test.mjs tests/session-hook.test.mjs tests/grain.test.mjs (run in plugins/grain, after the fix) · **saw:** tests 40, pass 40, fail 0

docs: docs/reference.md (the paragraph on hooks that never build or refresh an index, and the moved-HEAD sentence): say the hooks start one background refresh under the store lock when HEAD has moved, and answer again once it lands; plugins/grain/skills/grain/SKILL.md (the sentence 'the hooks never refresh it themselves'): same change

Ruling hooks-silent-while-refreshing: While a hook-started refresh runs, the edit-time hooks answer nothing; they emit no status marker. The acceptance allows the rest to wait or answer with a marker, and the release plan's defaults allow a marker or silence while refreshing, never the old index. A marker on every edit would put a line into the agent's context on each tool call for the seconds or minutes a refresh takes, and SessionStart already says that the hooks are silent while the index is behind. Waiting would stall the edit. Silence is therefore the answer, and the documentation says so.
- **ran:** node --import ./tests/git-env.mjs --test tests/hooks-refresh-under-lock.test.mjs (plugins/grain, new tests against the old hook-context.mjs, or GRAIN_REFRESH_WAIT_MS=0 for the query wait) · **saw:** red: the GRAIN_SUPERVISED=1 hook leaves the index at the old HEAD (refresh stopped, 60 s timeout); the query answers STALE after 3 s; an attempt that built another commit blocks the retry; a new commit restarts a failed refresh. Green at f3c7cf1: the same tests pass, with the five suites 56 of 56

