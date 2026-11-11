# 587 · Grain: the text of grain report prints the "not parsed" note only inside its architecture section, …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1414-swrg
**Tags:** 
**Files:** Grain/plugins/grain/engine/report.mjs
**Repo:** Grain
**Found by:** rev-169c-fable
**Where:** the review of 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What
Grain: the text of grain report prints the "not parsed" note only inside its architecture section, which exists only when the repository has more than one module (plugins/grain/engine/report.mjs:72-80). On a repository with one module, report names no unparsed file and no unread one, while status does. The release branch behaves the same way.

## Why


## Acceptance


[test] On a repository with one module, the text of grain report names the unparsed and the unread files, as grain status does, red before and green after · by: cd plugins/grain && npm test

## Changelog
- Fixed: grain report names the files that were not parsed, and those whose dependencies were not read, on a repository with one module too, in the words grain status uses.

## Evidence

### Proof

- **ran (line ee5797b3e674):** node --import ./tests/git-env.mjs --test tests/report-names-unparsed-with-one-module.test.mjs before the fix, 8 GB cap · **saw:** 3 tests, 0 pass, 3 fail: on a repository with one module grain report prints no not-parsed line while grain status names data.py and clip.py
- **ran (line ee5797b3e674):** node --import ./tests/git-env.mjs --test tests/report-names-unparsed-with-one-module.test.mjs tests/unparsed-note-agrees-with-edges.test.mjs tests/oversize-source-disclosed.test.mjs after the fix, 8 GB cap · **saw:** 12 tests, 12 pass, 0 fail: grain report prints the same not-parsed line as grain status, in the library and on the command line

