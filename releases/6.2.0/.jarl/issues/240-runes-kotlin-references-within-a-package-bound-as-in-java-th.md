# 240 · Runes: Kotlin references within a package bound as in Java (the twin of 233, D2 a)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, kotlin, partial
**Files:** 
**Repo:** ../../../Runes, ../../../Yggdrasil, ../../../Grain
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**Branch:** jarl/233-java-same-package
**Worker:** runes-233
**Worktree:** /Users/me/.jarl-wt/Runes-233
**Since:** 2026-10-05 16:22

## What
Kotlin has the same rule of package type visibility without an import and the same silence (kotlin-same-package-cross-node-silence); ruling plan-6-2-0 D2 (a).

## Why



## Acceptance
The Kotlin extractor binds references to types of the same package within a source set, with the same shadowing rules as Java in 233; kotlin rev bumped; the kotlin-same-package-cross-node-silence case rewritten; one 'Before you upgrade' note in Yggdrasil for Java and Kotlin.

## Evidence


