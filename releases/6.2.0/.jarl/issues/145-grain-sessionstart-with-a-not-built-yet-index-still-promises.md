# 145 · Grain: SessionStart with a 'not built yet' index still promises 'Runs automatically after every edit'

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, hooks
**Files:** Grain/plugins/grain/hooks/session-context.mjs
**Repo:** ../../../Grain
**After:** 057
**Found by:** grain-057
**Where:**
**Branch:** jarl/145-cli-followups
**Merged:** f1f919b
**CI:** none

## What
After 057 an index from another Grain version is no longer 'ready', but the 'not built yet' branch still says the notes run automatically after every edit, though the hooks stay silent until the index is first built.

## Why
The same false promise as in 057, in another index state.

## Acceptance
With an unbuilt index, SessionStart does not promise notes after an edit until the index exists; a test for this state.

## Changelog
- Fixed: in a repository whose index is not built yet, the session note no longer promises a grain note after every edit; it says those notes stay silent until the first build.

## Evidence

red: new test in tests/session-hook.test.mjs failed on 'not built yet' (the note carried 'Runs automatically after every edit'); green after 0d0aa15: session-hook 12/12, grain.test.mjs 20/20
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2128, pass 2127, fail 0, skipped 1, merge f1f919b

