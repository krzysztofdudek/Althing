# 232 · Grain: certifying absence conventions ('the code never does this') where the evidence justifies it (the second half of 039/040)

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261005T1413-opiw
**Tags:** grain, conventions, partial
**Files:** 
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**After:** 182, 229

## What
In 6.1.1 (039/040) an absence convention does not become an enforced rule (it stays a draft) and is not certified when the same part of the repo has a certified group that does it.

## Why
Real prohibitions (e.g. a layer does not import X) stay drafts; a criterion is needed that does not forbid test idioms.

## Acceptance
A criterion for certifying absence (separation of the test and production partitions, minimum support, no counterexamples in the same partition, robustness to sample size) described in docs/mathematics.md and implemented; on the corpus (javapoet, click, gin, ripgrep) no absence convention forbids a test idiom; tests.

## Evidence


### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Deferred: New capability, not a defect of what ships; moved past this release. Ruling backlog-tidy-for-the-three-tools.

