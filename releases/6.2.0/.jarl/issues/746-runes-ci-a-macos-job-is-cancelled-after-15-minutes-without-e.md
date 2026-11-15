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

### Notes

Cause, from GitHub's own annotations on both cancelled jobs (gh api repos/krzysztofdudek/Runes/check-runs/<id>/annotations for job 132019465227, test-macos (24) of run 43464346353 attempt 1, and job 132086812389, test-macos (22) of run 43483762532): failure 'The job was not acquired by Runner of type hosted even after multiple attempts' and notice 'Due to capacity constraints, jobs targeting macOS arm64 runners may experience longer queue times.' Both jobs ask for macos-latest (labels [macos-latest], the arm64 image), carry no runner name and no step, and end cancelled 15 minutes after their start (16:36:19 to 16:51:21, 18:33:35 to 18:48:37). So the cause is the capacity of GitHub's hosted macOS arm64 runners, on GitHub's side: not a setting of the repository and not the account's concurrency limit (a job over that limit waits in the queue, it is not cancelled with this message). The workflow cannot avoid it without leaving macos-latest for another runner image, which would test another platform than the one the macOS job is there for. A re-run of the failed job is the answer: it runs the same commit, so the rule of a green run on the exact commit holds. The re-run of 43464346353 (attempt 2) passed; the three runs of 2026-11-15 (c21ceca 43683632100, 5a7f1ee 43685967185, 16731a2 43688029236) got macOS runners within 15 seconds of their start. The same holds for the release workflow: a verify macOS job cancelled this way stops the publish job, and re-running the failed jobs of that run publishes from the same tag. No change to ci.yml.

