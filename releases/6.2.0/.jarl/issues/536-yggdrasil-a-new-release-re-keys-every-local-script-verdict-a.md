# 536 · Yggdrasil: if 6.2.0 re-keys the script verdicts of 6.1.0, an adopter learns before the first paid run that one free pass re-records them

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0927-oerc
**Tags:** yggdrasil, upgrade, cost
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** yg check --dry-run; the CHANGELOG Before you upgrade section
**Branch:** jarl/530-runes-110
**Worker:** w-530-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:56

## What
After an upgrade every checkout recomputes all its script pairs, because a release keys script verdicts on the grammar and runtime. yg check explains it only after the run. --dry-run prints the same unverified count for a cold and a warm checkout, and gives no sign that several runs on one machine compete (a field report saw five parallel runs crawl where one alone took about a minute).

## Why
An adopter starts a paid run without knowing a free pass would settle most of it first.

## Acceptance
- [read] Whether an upgrade from 6.1.0 to 6.2.0 re-keys script verdicts is measured on a fixture with a warm 6.1.0 cache, and the result is in the issue
- [read] Only if it does: the Before you upgrade section says, in a sentence that describes what to run, that one free yg check --approve --only-deterministic re-records the script verdicts before the first paid run

## Evidence

### Notes

Ruling changelog-speaks-well-of-the-product (by owner): A CHANGELOG entry says what changed and what to do, in plain words, and never runs the product down: no wording that calls it costly, slow, broken or a trap. The owner gave this as a standing rule when the jarl proposed a note about re-keyed verdicts. · the owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "Only if it really happens on 6.1.0 to 6.2.0. In the changelog we do not write badly about our own product.""

Measured on 2026-11-11, release/6.2.0 with the Runes 1.1.0 work of this lease (Yggdrasil package version still 6.1.0). Fixtures: six example projects (checkout-flow, failing, no-secrets-in-logs, passing, pure-transforms, type-level) plus one project whose script rule reads the syntax tree of Python files (its verdict records the python grammar digest). Each was warmed with the published @chrisdudek/yg@6.1.0 (check --approve --only-deterministic), then checked with the built 6.2.0 tree: yg check --no-approve printed the same PASS or FAIL line with the same number of verified pairs and no 'script check has not run' line, so no script verdict was re-keyed. Result: the upgrade from 6.1.0 does not re-key script verdicts today, so no sentence is added to Before you upgrade (ruling changelog-speaks-well-of-the-product). Re-measure if issue 586 (tree-sitter 0.27.1 pins) lands: the runtime hash is part of the grammar digest a syntax-tree verdict records.

Assumed: no change to --dry-run or to the cost message was made; the issue asks only for the measurement and, if it re-keys, a sentence in the CHANGELOG.

