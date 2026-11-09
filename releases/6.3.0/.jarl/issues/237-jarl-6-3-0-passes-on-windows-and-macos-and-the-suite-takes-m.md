# 237 · Jarl 6.3.0 passes on Windows and macOS, and the suite takes minutes on a CI runner

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261109T1134-mdzr
**Tags:** 
**Files:** 
**Repo:** JarlSkill
**Found by:** owner
**Where:**
**Branch:** jarl/237-platforms
**Worker:** w-jarl-platforms-opus
**Model:** claude-opus-5-5
**Since:** 2026-11-09 11:34

## What
CI on the release branch: 247 of 1743 tests fail on Windows, 206 of them with a bad escape in JSON output, 5 with a path passed to import as a drive letter, and several where a printed command differs by its path. A full run on Linux takes 19 to 26 minutes and on Windows about 55, against 3 and 10 on 2026-11-04. macOS is in no CI job.

## Why
The owner rules that Jarl runs on macOS, Windows and Linux, and asked why the tests take an hour.

## Acceptance
- [check] the full suite passes on Linux, Windows and macOS in CI on the release tip
- [test] every --json output is valid JSON when a value holds a backslash
- [test] a tool is imported by a file URL, never by a drive-letter path
- [check] a full CI run takes no more than 10 minutes on Linux and 20 on Windows, with no exhaustive test weakened beyond sampling that still covers each case class · by: the job durations of the CI run
- [read] CI runs macOS as well

## Evidence

