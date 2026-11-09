# 232 · Grain: certifying absence conventions ('the code never does this') where the evidence justifies it (the second half of 039/040)

**Status:** open
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


