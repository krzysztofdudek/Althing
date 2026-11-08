# 405 · Gard: an optional gate rule refuses a commit message that names an AI tool as author

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** gard, workplace, git-gate
**Files:** Gard/rules/no-ai-attribution.mjs, Gard/test/rule-no-ai-attribution.test.mjs
**Repo:** ../../../Gard
**After:** 403
**Found by:** owner
**Where:** a company's rule the owner already runs through Mimir's gate: no commit message may carry an AI tool as author or co-author

## What
A rule shipped with Gard and off by default: a commit message is refused when a Co-authored-by line names an AI tool or a vendor's no-reply address, or a generated-with line or a session link of an agent tool stands in it; another person as co-author passes. The rule names the line it found and the fix (remove it and commit again).

## Why
Some companies forbid it in their history; turning it on is one line in a rig or an area.

## Acceptance
Tests refuse each of the forms above and pass a clean message and a human co-author

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

