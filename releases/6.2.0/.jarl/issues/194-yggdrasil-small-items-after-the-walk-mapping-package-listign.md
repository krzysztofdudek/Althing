# 194 · Yggdrasil: small items after the walk/mapping package (listIgnoredUntrackedPaths trims the trailing /; markdownlint lints Playwright error files; architecture.ts checks the raw mapping entry; unmapped ordered before case-mismatch in next:; rules.ts talks about skipping everything .gitignore excludes)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** yggdrasil
**Files:** Yggdrasil/source/cli/src
**Repo:** ../../../Yggdrasil
**After:** 004, 078
**Found by:** ygg-004
**Where:**
**Branch:** jarl/166-ignores-and-leftovers
**Merged:** d63857afc4f7750c2502c67c314d60f4bcc7385d
**CI:** none

## What
Found by the worker of package 004: listIgnoredUntrackedPaths trims the trailing '/', so the marketplace check test for an ignored directory never hits; markdownlint lints Playwright error files, so a portal test timeout also topples the Markdown step; architecture.ts checks the raw mapping entry when it resolves to nothing (the second half of 078's acceptance); next: gives unmapped before the letter-case error; rules.ts claims that the walk skips 'anything .gitignore excludes'.

## Why
Small inconsistencies and one false red step in the gate.

## Acceptance
Each point fixed with a test or described.

## Changelog
- Fixed: a mapping entry spelled differently from its file (letter case, NFC/NFD) leads the report, so next: points at its fix rather than at the file it left unmapped.

## Evidence

- **ran:** git commit (merge of jarl/166-ignores-and-leftovers into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8186 pairs verified; coverage branches 91.25%; [repo-check] All checks passed; [release/6.1.1 d63857afc] Merge jarl/166-ignores-and-leftovers

