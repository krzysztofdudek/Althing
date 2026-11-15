# 746 · Runes CI: a macOS job is cancelled after 15 minutes without ever getting a runner, in two of the first three runs with macOS

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261115T0543-nmvi
**Tags:** ci, macos
**Files:** Runes/.github/workflows/ci.yml
**Repo:** Runes
**Found by:** jarl
**Where:** Runes CI runs 43464346353 (test-macos (24)) and 43483762532 (test-macos (22)): started, then cancelled 15 minutes later with no step and no runner name; a re-run of the first passed

## What
Twice a macOS job of Runes CI stayed queued and was cancelled after exactly 15 minutes, with no step run and no runner assigned; the other jobs of the same runs finished. The cause is not known: a limit on concurrent macOS runners shared with the other family repositories' CI, a setting, or GitHub's side.

## Why
A red run that no code caused hides a real red behind a habit of re-running, and the release rule needs a green run on the exact commit.

## Acceptance
[read] The cause is named from GitHub's documentation or the account's settings, and either the workflow avoids it or the record says why a re-run is the answer

## Evidence

