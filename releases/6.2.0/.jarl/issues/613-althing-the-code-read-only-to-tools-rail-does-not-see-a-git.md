# 613 · Althing: the code/read-only-to-tools rail does not see a git push written in the call shape the names-range tests use

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1546-oyxz
**Tags:** althing, rails
**Files:** Althing/rails
**Repo:** Althing
**After:** 363
**Found by:** jarl
**Where:** w-363-fable, 363 round 2 (workspace/test/names-range.test.mjs)

## What


## Why
The rail is what keeps workspace/ from ever writing to a tool repository; a call shape it misses is a way a push could slip into workspace code unseen. The tests' pushes to local bare fixtures are legitimate, so the rail must see them and allow them by a stated rule, not miss them.

## Acceptance
[test] The rail flags a git push in every call shape workspace code uses (spawn and execFile with an args array, a shell string, a variable command), and a push to a scratch bare fixture under the system temporary directory is allowed only by a named, tested exception · by: yg check && npm test

## Evidence

