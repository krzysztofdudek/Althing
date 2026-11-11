# 629 · The rails' own entry points do nothing and exit 0 when run by an absolute path that holds a symboli…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1807-icfn
**Tags:** althing, names, rails
**Files:** 
**Repo:** Althing
**Found by:** rev-363g-fable
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
The rails' own entry points do nothing and exit 0 when run by an absolute path that holds a symbolic link: rails/run.mjs:219, rails/names.mjs:266, rails/english.mjs:252 and workspace/blind-starts.mjs:256 keep the run-directly check that 8c71e7a replaced in workspace/ws.mjs (import.meta.url, which node resolves through links, against process.argv[1] as given). Reproduced on a scratch copy: node <linked path>/rails/run.mjs range <base> <head> --require-key prints nothing and exits 0, where the real path refuses with exit 1; rails/names.mjs the same; the other two by reading. Althing's own hooks call rails/run.mjs by a relative path, which node resolves to the real folder, so they are not affected (checked from inside a linked folder); a scan by hand or a script that names the file by a linked absolute path sees a silent success (found in the review of 363 at 8c71e7a, beside 626)

## Why


## Acceptance


[test] rails/run.mjs, rails/names.mjs, rails/english.mjs and workspace/blind-starts.mjs run their command when invoked by an absolute path through a symbolic link, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line a8556c9d4f90):** node --test rails/test/direct.test.mjs (in the worktree at 66a7b2b, the tests alone, before the fix) · **saw:** tests 5, pass 0, fail 5: rails/run.mjs (two commands), rails/names.mjs, rails/english.mjs and workspace/blind-starts.mjs each print nothing and exit 0 through a link to Althing and through a link above it
- **ran (line a8556c9d4f90):** node --test rails/test/direct.test.mjs (at 5700eab) · **saw:** tests 5, pass 4, fail 0, todo 1: rails/run.mjs, rails/names.mjs and workspace/blind-starts.mjs run through both links with the exit code and output of the real path; rails/english.mjs is the todo, it waits for the owner (a-35)

