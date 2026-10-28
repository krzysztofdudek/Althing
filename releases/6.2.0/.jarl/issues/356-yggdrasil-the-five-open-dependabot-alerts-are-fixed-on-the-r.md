# 356 · Yggdrasil: the five open Dependabot alerts are fixed on the release branch (vite, source-map-js)

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** coordinator
**Where:**

## What
GitHub's security tab lists five open alerts: vite in source/cli (two high, one medium: launch-editor command and path handling on Windows; fixed from 8.3.3) and source-map-js in source/cli and in docs (high: event-loop denial of service through indexed source maps; fixed from 1.2.2).

## Why
Known vulnerabilities in what the CLI and the docs build install should not ship in a release.

## Acceptance
- release/6.2.0 takes vite 8.3.3 or later and source-map-js 1.2.2 or later in both lockfiles, the check is green, and the alerts close once the fix reaches main
- The CHANGELOG says what was updated under Security

## Evidence

