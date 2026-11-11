# 565 · Family: the release branches' commit messages lose their AI co-author trailers before the release

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261111T1223-lotc
**Tags:** release, git
**Files:** 
**Repo:** Runes, Yggdrasil, Grain
**Found by:** jarl
**Where:**

## What
About 150 to 200 commits on each of Runes release/1.1.0, Yggdrasil release/6.2.0 and Grain release/6.2.0 carry a Co-Authored-By trailer naming an AI, from earlier work on the Mac; the machine's rule no-ai-attribution forbids it. Rewrite the messages once, after the last merge into each branch and before 224, with the trees unchanged (git filter-branch --msg-filter on the branch and any worker branch still on it); Runes' remote release branch is force-pushed only on the owner's word.

## Why
No commit of the family carries AI attribution, and a release fixes its history for good.

## Acceptance
[check] git log --format=%B origin/main..<release branch> holds no Co-Authored-By trailer naming an AI in any of the three repositories · by: git log --format=%B origin/main..HEAD
[read] Each rewritten branch has the same tree as before the rewrite, shown by git diff of the old and new tips
[owner] Runes' release branch is force-pushed to GitHub · material: the rewritten tip and the diff against the old one · check: the remote tip equals the rewritten tip

## Evidence

### Notes

Ruling release-branches-lose-ai-trailers-at-the-end (by owner): The AI co-author trailers on the three release branches are removed once, after the last merge and before the release, with the trees unchanged (issue 565); the force-push of Runes' remote release branch waits for the owner's word. Options were: clean once at the end, clean now with every agent stopped, or leave them; he picked the first by its number. · the owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "1""

