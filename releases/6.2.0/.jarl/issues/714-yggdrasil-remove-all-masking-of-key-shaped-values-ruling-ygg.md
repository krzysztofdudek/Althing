# 714 · Yggdrasil: remove all masking of key-shaped values (ruling yggdrasil-no-key-masking)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0405-bmxy
**Tags:** yggdrasil, keys
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:05

## What


## Why
The owner does not want Yggdrasil to mask key-shaped values in its output: where a user puts a key is the user's matter. The masking added in 6.2.0 (620, 621, 641 to 682, and the keys-more branch) is taken out, while what those packages did besides masking stays.

## Acceptance
- [test] No output of Yggdrasil masks a key-shaped value: every message, refusal, warning, listing and --json document prints what it read as it is, and no masking helper, test or golden case for it remains · by: cd source/cli && npm test
- [read] What the keys packages did besides masking stays (repository-relative POSIX paths, SIGHUP and reviewer process groups, the architecture parser's structured refusals, the owner note on ignored files, C# read only when mapped), and the CHANGELOG, docs and knowledge pages say nothing about masking keys; the list of what was removed and what was kept is in the evidence

## Evidence

