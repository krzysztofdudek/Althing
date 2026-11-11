# 536 · Yggdrasil: a new release re-keys every local script verdict, and nothing says so before the first paid run

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0927-oerc
**Tags:** yggdrasil, upgrade, cost
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** yg check --dry-run; the CHANGELOG Before you upgrade section

## What
After an upgrade every checkout recomputes all its script pairs, because a release keys script verdicts on the grammar and runtime. yg check explains it only after the run. --dry-run prints the same unverified count for a cold and a warm checkout, and gives no sign that several runs on one machine compete (a field report saw five parallel runs crawl where one alone took about a minute).

## Why
An adopter starts a paid run without knowing a free pass would settle most of it first.

## Acceptance
- [read] The CHANGELOG Before you upgrade says that the release re-keys script verdicts and that one free --only-deterministic pass comes before the first paid run
- [test] --dry-run counts the pairs a free pass settles apart from those that need the reviewer · by: cd source/cli && npm test

## Evidence

