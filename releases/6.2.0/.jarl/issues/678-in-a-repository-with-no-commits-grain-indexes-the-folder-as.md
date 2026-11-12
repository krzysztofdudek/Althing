# 678 · In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored f…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2330-auci
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-143b-opus
**Where:** the review of 143, 632, 633, 674
**Branch:** jarl/662-grain-small
**Worker:** w-662-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored files included: an ignored generated src/Api/Api.csproj with a Using item gives the index an edge src/Api/Controller.cs > src/Lib/Customer.cs that Yggdrasil's view (the files git does not ignore) would not give; check agrees with that index, so 674's view changes nothing there; the same at fcdc6bb1 and a2cd6e3b, so it predates 674.

## Why


## Acceptance


[test] In a repository with no commits, Grain's index and check leave out files git ignores, as Yggdrasil does, red before and green after · by: cd plugins/grain && npm test

## Changelog
- In a repository with no commit yet, the index and check leave out the files git ignores, as Yggdrasil does; an index built there may give fewer dependencies than before.

## Evidence

### Proof

- **ran (line 5a6e51d5e1f2):** node --import ./tests/git-env.mjs --test tests/no-commit-index-leaves-out-ignored-files.test.mjs (red before the fix: 2 fail; green after) · **saw:** 3 pass; and cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test: 2405 tests, 2399 pass, 0 fail

### Notes

Assumed: a repository with no commit is indexed from the files git would put in its first commit (tracked, staged, and untracked not ignored; no link), the list check already uses; no stamp changes, as a commit-less index has no HEAD to be stale against and the engine version already differs between releases.

