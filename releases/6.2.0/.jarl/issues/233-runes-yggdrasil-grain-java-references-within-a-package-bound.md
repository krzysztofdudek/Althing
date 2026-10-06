# 233 · Runes + Yggdrasil + Grain: Java references within a package bound in Runes (D8 a), Yggdrasil checks them, Grain declares them again

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, yggdrasil, grain, java, partial
**Files:** 
**Repo:** ../../../Runes, ../../../Yggdrasil, ../../../Grain
**Found by:** jarl
**Source:** decisions#patch-scope
**Where:**
**Branch:** jarl/233-java-same-package
**Worker:** runes-233
**Worktree:** /Users/me/.jarl-wt/Runes-233
**Since:** 2026-10-05 16:22

## What
In 6.1.1 (053, D8 b) Grain stopped declaring Java relations within a package, which Yggdrasil does not check; moving the binding to Runes (D8 a) deferred to a minor release with a warning in Yggdrasil's CHANGELOG.

## Why
A test in the package of a production class uses it without an import; today this dependency is invisible to both tools.

## Acceptance
The Java extractor in Runes binds references to types from the same package (without an import) within a source set; Yggdrasil checks them (a 'Before you upgrade' note: Maven/Gradle graphs may need a test→main relation); Grain uses Runes instead of its own binding; spring-petclinic: propose declares relations that yg check confirms.

## Evidence


