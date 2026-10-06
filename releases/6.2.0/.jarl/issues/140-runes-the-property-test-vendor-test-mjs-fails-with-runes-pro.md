# 140 · Runes: the property test vendor.test.mjs fails with RUNES_PROPERTY_SEED=690888235 (case 21, 'outside': more than one RUNES:evidence:START marker)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, vendor
**Files:** Runes/tools/vendor.mjs, Runes/test/vendor.test.mjs
**Repo:** ../../../Runes
**Found by:** runes-018
**Where:**
**Branch:** jarl/140-vendor-seed
**Merged:** fbc0539 in ../../../Runes
**CI:** none

## What
test/vendor.test.mjs with the seed RUNES_PROPERTY_SEED=690888235 fails on case 21 ('outside': more than one RUNES:evidence:START marker). It fails the same way on an unchanged release/1.0.1; an ordinary run with a random seed usually passes, so CI is flaky.

## Why
Either vendor.mjs mishandles data the generator rightly produces (a bug in a tool consumers copy), or the generator produces disallowed input; in both cases CI can fail at random.

## Acceptance
The cause established; seed 690888235 passes; the test with this seed stays as a regression case.

## Evidence

- **ran:** npm run check && npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1493, pass 1493, fail 0, the replay 'property replayed at RUNES_PROPERTY_SEED=690888235' passes, dist/ is fresh; npm run coverage: tests 1493, pass 1493, fail 0, all files 98.69 / 93.55 / 98.49, exit 0; merge fbc0539

