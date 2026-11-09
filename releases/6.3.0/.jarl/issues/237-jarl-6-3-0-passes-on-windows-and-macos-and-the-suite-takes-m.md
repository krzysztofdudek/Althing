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

## Changelog
- On Windows, the form a refused call prints carries an empty --root= as given, the git commands printed for a kept worktree and a merge past its review are quoted for PowerShell and cmd, and a record file that came back with CRLF keeps its line endings when Jarl writes to it.

## Evidence

### Proof

- **ran (line cf0279945318):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at 5841bab) · **saw:** the JSON and every-json tests pass; at the failing-test commit 2f97cc1 the first failed with SyntaxError: Bad escaped character in JSON at position 53 (line 4 column 34), the same error as the 206 Windows failures; the printed output of a call stays JSON with a backslash in a value
- **ran (line ec181f9773d1):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at 5841bab) · **saw:** 'a tool is imported by a file URL' passes: importSpecifier('D:\\a\\...\\tmp-cleanup.mjs','win32') gives tests/fixtures/tmp-cleanup.mjs; every --import in the test sources names its module through it; failed at 2f97cc1 (ERR_UNSUPPORTED_ESM_URL_SCHEME is the Windows failure it removes)

### Notes

Assumed: the 206 bad-escape failures were the tests' reader, not Jarl: posixForms rewrote the Windows-quoted commands inside a call's raw JSON text. Jarl's own --json output goes through JSON.stringify and was valid; the guard against hand-built JSON is a test that JSON.parses every --json output with backslashes in a value. Nothing in the product hand-assembles JSON.

Assumed: lines 1 and 4 are proved by the CI jobs of the push, not here (no Windows, macOS or CI runner in reach). A full local run at 5841bab: 1794 tests, 0 fail, 53 seconds (nice 15, loaded host), against 507 at the start of this issue; on Windows the tests that spawned node per call now make one in-process call each, the walks one shell per pasted line.

