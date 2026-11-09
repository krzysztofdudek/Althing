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
**Branch:** jarl/237-platforms-2
**Worker:** w-jarl-platforms-opus
**Model:** claude-opus-5-5
**Since:** 2026-11-09 13:36
**Merged:** 4faeedf69678e12b7d484dbd44ed65cd6f06d102 in JarlSkill
**CI:** pending

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

## Reviews
- **changes** · by rev-jarl-237-opus-platforms (fresh) · 2026-11-09 · model claude-opus-5-5
  Important: the Windows job will fail 7 tests in tests/merge-holds.test.mjs, the ones at lines 299, 339, 372, 440, 490, 500 and 536. Commit 0033dbb prints the git commands of that note through printCommand, so on Windows a path with a backslash comes out in double quotes, and seeing() at line 285 still expects single quotes. None of the 7 is in the Windows log of 247 failures, so this branch adds them. I reproduced it with process.platform set to win32 and a backslash in the temporary directory's name: git -C "...a\b..." against the expected '...a\b...'. Line 1 cannot hold until seeing() follows the platform.
  Important: maybeGitRepo in lib/repositories.mjs walks the path as written and resolves no symlink. A symlink into a subdirectory of a repository now reads as outside any repository: jarl.mjs new --repo <that link> is refused at 5841bab with "not a git repository", and the same call files the issue at 6efe4c9. Nothing in the issue asks for this product change; it speeds the suite.
  Important: line 4 has no row, as the tool's brief ranks it. I cannot give one: the job durations exist only after a CI run. A full run here took 49.7 s at 5841bab and 434.9 s at 6efe4c9, on this host and not a CI runner.
  Minor: a call that hangs no longer fails a test. With an endless loop in the changelog command the old suite fails 2 tests after 120 s each; the new tests/in-process.test.mjs never ends, and I stopped it at 75 s. runInProcess has no limit, suite.mjs sets no --test-timeout and ci.yml sets no timeout-minutes.
  Minor: the 44 parity calls hold no word with a backslash, no empty word and no call that exits 2. A mutant that turns backslashes into slashes in the words at the entry passes the whole new suite (1772 pass, 0 fail); the old suite fails 3 tests on it.
  Minor: no test can fail on the quoting of the git commands in the changelog entry. With ball.mjs, cleanup.mjs and merged.mjs back at 6efe4c9, merge-cleanup, ways-out and windows pass under the win32 simulation, because the regexes accept either quote.
  Line 5 read: .github/workflows/ci.yml has the job test-macos with runs-on: macos-latest, node 22 and 24, and npm test, so CI runs macOS as well.
  Checked with nothing found: 1794 tests at 5841bab on a clean extraction, 0 fail; again all in one process with --test-isolation=none, 0 fail; no test name is gone against 6efe4c9, one renamed; the histories test is unchanged in the file; a CRLF record keeps its endings through 8 writes; the old reader gives Bad escaped character on valid JSON, and the groups of the Windows log come to 206, 30, 5, 3, 2 and 1.
- **approve** · by rev-jarl-237-opus-platforms (fresh) · 2026-11-09 · model claude-opus-5-5
  Round 1 at fd18d2a. The findings of the first examination are closed; line 4 waits for the job durations of a CI run after the push.
  Line 5 read: .github/workflows/ci.yml has the job test-macos with runs-on: macos-latest, node 22 and 24, and npm test, so CI runs macOS as well.
  merge-holds: none of its tests fails under the win32 simulation with a backslash in the temporary path, and with the old quoting put back in ball.mjs, cleanup.mjs and merged.mjs the 7 fail again.
  Links: new --repo through a symlink into a repository's subdirectory files the issue, and a symlink to a directory outside any repository is still refused.
  The time limit: an endless loop in a command fails its test at 120 s with "jarl changelog 1 did not end within 120000 ms", and the file goes on (73 pass, 1 fail, 137 s). With the limit at 5 s a whole run ended in 68 s with 11 named failures. Atomics.wait and a child whose failure the code swallows also throw at the limit. A 400 ms call under a 2 s limit returns normally, and the longest call of a full run took 1.5 s against 120 s.
  Defects put back at fd18d2a, each failing the suite: entry off 135 tests, argv wrong 140, exit 2 lost at the entry 3, backslashes at the entry 10 (missed before), process.exitCode set 42, hand-built JSON 8, CRLF off 1, bare import 1, warnings on stdout 149, a parse failure exiting 0 46, the --root= fix reverted 1.
  Parity: 74 tests, 0 fail twice, and no parity failure under either simulation. A full run on a clean extraction: 1825 tests, 0 fail, 22 skipped, 37.9 s.
  Minor: the regex in merge-cleanup accepts either quote, so no test reads the Windows quoting of the kept worktree's git commands; only the merge note's command has one.
  outside the issue, filed as 238: A printed command that names no command of the tool passes the suite, at 6efe4c9 and at fd18d2a: with jarlLine('feild', ...) in place of field in lib/field.mjs line 39 every test passes, because a walk pastes the span and takes the refusal for an answer.

## Evidence

### Proof

- **ran (line cf0279945318):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at 5841bab) · **saw:** the JSON and every-json tests pass; at the failing-test commit 2f97cc1 the first failed with SyntaxError: Bad escaped character in JSON at position 53 (line 4 column 34), the same error as the 206 Windows failures; the printed output of a call stays JSON with a backslash in a value
- **ran (line ec181f9773d1):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at 5841bab) · **saw:** 'a tool is imported by a file URL' passes: importSpecifier('D:\\a\\...\\tmp-cleanup.mjs','win32') gives tests/fixtures/tmp-cleanup.mjs; every --import in the test sources names its module through it; failed at 2f97cc1 (ERR_UNSUPPORTED_ESM_URL_SCHEME is the Windows failure it removes)
- **ran (line cf0279945318):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at 5841bab, on a clean git archive extraction) · **saw:** 12 pass, 0 fail, the JSON and every-json tests among them; with the output's backslashes collapsed in the JSON printer, 'every --json output is valid JSON when a value holds a backslash' fails (8 tests fail in the whole suite), and the old reader fed valid JSON gives SyntaxError: Bad escaped character, the failure of the Windows log
- **ran (line ec181f9773d1):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at 5841bab, on a clean git archive extraction) · **saw:** 12 pass, 0 fail; 'a tool is imported by a file URL, never by a drive-letter path' passes; with importSpecifier returning the bare path that one test fails and no other
- **ran (line cf0279945318):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at fd18d2a) · **saw:** 27 pass with tmp-cleanup, 0 fail: every --json output valid with a backslash in a value
- **ran (line ec181f9773d1):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at fd18d2a) · **saw:** 27 pass with tmp-cleanup, 0 fail: importSpecifier gives a file URL for a drive letter, and node starts a child with --import of that URL form
- **ran (line cf0279945318):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at fd18d2a, on a clean git archive extraction) · **saw:** 12 pass, 0 fail; with the JSON printer collapsing backslashes, 'every --json output is valid JSON when a value holds a backslash' fails, 8 tests fail in the whole suite
- **ran (line ec181f9773d1):** cd skills/jarl/scripts && node --test tests/windows.test.mjs (at fd18d2a, on a clean git archive extraction) · **saw:** 12 pass, 0 fail; with importSpecifier returning the bare path, 'a tool is imported by a file URL' fails and no other test does

### Notes

Assumed: the 206 bad-escape failures were the tests' reader, not Jarl: posixForms rewrote the Windows-quoted commands inside a call's raw JSON text. Jarl's own --json output goes through JSON.stringify and was valid; the guard against hand-built JSON is a test that JSON.parses every --json output with backslashes in a value. Nothing in the product hand-assembles JSON.

Assumed: lines 1 and 4 are proved by the CI jobs of the push, not here (no Windows, macOS or CI runner in reach). A full local run at 5841bab: 1794 tests, 0 fail, 53 seconds (nice 15, loaded host), against 507 at the start of this issue; on Windows the tests that spawned node per call now make one in-process call each, the walks one shell per pasted line.

