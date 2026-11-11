# 612 · Grain: starting the over-limit relation worker can end the whole process under an address-space limit of about 1.6 to 1.9 GB, and grain measure's log tells the user grain refresh reads a version it never reads

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1545-tuwk
**Tags:** grain, relations
**Files:** 
**Repo:** Grain
**After:** 169
**Found by:** jarl
**Where:** rev-169d-opus, 169 after the takeover (oversize-relations.mjs:76 and :73; partition.mjs:253)
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
Under that limit grain status exits 1 with 'Failed to reserve virtual memory for CodeRange' and no index, where release/6.2.0 indexes and names the file; and a log line that names the wrong command sends the user to a step that does nothing.

## Acceptance
- [test] Under ulimit -v 1600000 to 1900000 grain status on a repository with an over-limit file answers with the file named as unfinished, never a fatal exit, red before and green after · by: cd plugins/grain && npm test
- [read] When grain measure reads an earlier commit's file itself and the read stops, its log line names the next grain measure, as its note does

## Changelog
- Fixed: where a process's address space is limited (ulimit -v, some containers), grain status and grain refresh answer on a repository with a source over the parse limit; when there is no room to read that file's dependencies it is named as unfinished and grain refresh reads it again. grain measure's log names the next grain measure as the command that reads an earlier commit's file again.

## Evidence

### Proof

- **ran (line 41f27605962a):** grain status on scratch copies of a repository with a 1.6-million-character Python file under ulimit -v 1600000, 1700000, 1800000 and 1900000, eight runs each, on the release code (git archive of release/6.2.0) and on the branch · **saw:** release: 32 of 32 runs end with 'Fatal process out of memory: Failed to reserve virtual memory for CodeRange', exit 1, no index. Branch: 0 fatal, 30 read the file, 2 name it as unfinished (no 128 MB of address space left), all exit 0
- **ran (line 41f27605962a):** node --import ./tests/git-env.mjs --test tests/address-space-limit-never-ends-the-run.test.mjs before the fix, 8 GB cap · **saw:** 3 tests, 0 pass, 3 fail: under ulimit -v 1600000 the process was ended, exit 1; the measure log line named grain refresh
- **ran (line 41f27605962a):** node --import ./tests/git-env.mjs --test tests/address-space-limit-never-ends-the-run.test.mjs tests/oversize-relations-counted.test.mjs tests/measure-names-unread-files.test.mjs tests/extractor-error-read-again.test.mjs after the fix, 8 GB cap, no YG_BIN · **saw:** tests 33, pass 32, fail 0, skipped 1: twelve runs under ulimit -v 1.6 to 1.9 GB all exit 0, each with the unlimited answer or the file named as unfinished; the measure log reads 'the next grain measure reads it again'
- **ran (line 41f27605962a):** cd plugins/grain && npm test through full-gate.sh (YG_BIN and the corpus set), 12 GB cap, on cd0c0fcf · **saw:** tests 2256, pass 2250, fail 0, skipped 6, exit 0, 275 s

### Notes

Assumed: the guard is a measured threshold, not a proof. The worker asks for a 32 MB code range and is started only when the process can still get 128 MB in one piece; in 32 runs under the named limits none ended fatally. Under limits below about 1.5 GB the process ends before any read, in the launcher's own watcher thread or in the main heap, on the release code as well; that is outside this line and is in my report.

The first full run, on e661b462, had one failure: tests 2256, pass 2249, fail 1, skipped 6. It was my own new test: under ulimit -v 1700000 the read started and was then refused its parser memory, the file was named as unfinished with that reason and the exit was 0, but the test accepted only the no-room wording. cd0c0fcf widens the test to either reason; the product did not change.

