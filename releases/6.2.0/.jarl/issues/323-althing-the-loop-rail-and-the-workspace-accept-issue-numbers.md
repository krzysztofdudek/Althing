# 323 · Althing: the loop rail and the workspace accept issue numbers without padding

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261018T1926-mlwj
**Tags:** althing, ids
**Files:** rails/loop.mjs, rails/test/regions.test.mjs
**Repo:** ../..
**After:** 322
**Found by:** coordinator
**Where:** rails/loop.mjs:8 (the issue file name pattern requires three or more digits)

## What
Jarl writes issue numbers as plain numbers (issue 322): a new loop starts at 1-<slug>.md. The loop/shape rail's file name pattern requires three or more digits, so a loop with an issue 1 to 99 written unpadded is refused, and any workspace code that pads or matches a width has the same problem.

## Why
The next release's loop is opened under the new Jarl; the rail must not refuse the record that Jarl writes.

## Acceptance
loop/shape accepts issue files named with one or more digits, padded or not, and still refuses a name that is not a number; ws and the rails read ids numerically; tests cover 1-<slug>.md, 007-<slug>.md and 1000-<slug>.md

## Evidence

- **ran (history):** node --test over rails/test and workspace/test in Althing, at fbfcbda · **saw:** 90 pass, 0 fail; the change committed in Althing as fbfcbda; the rule that changed (loop/shape) admitted by the owner on 2026-10-19

