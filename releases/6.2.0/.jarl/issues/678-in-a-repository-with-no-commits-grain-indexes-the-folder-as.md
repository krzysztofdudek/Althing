# 678 · In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored f…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2330-auci
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-143b-opus
**Where:** the review of 143, 632, 633, 674

## What
In a repository with no commits, Grain indexes the folder as it is ('worktree — no git'), ignored files included: an ignored generated src/Api/Api.csproj with a Using item gives the index an edge src/Api/Controller.cs > src/Lib/Customer.cs that Yggdrasil's view (the files git does not ignore) would not give; check agrees with that index, so 674's view changes nothing there; the same at fcdc6bb1 and a2cd6e3b, so it predates 674.

## Why


## Acceptance


## Evidence

