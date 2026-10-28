# 357 · Yggdrasil: the seven open Dependabot pull requests are merged into the release or closed with a reason

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** coordinator
**Where:**
**After:** 356

## What
Open pull requests #104 to #110 (2026-10-18 to 2026-10-21) bump source-map-js (cli and docs), tree-sitter-cli and web-tree-sitter to 0.27.1, vite to 8.3.5, and two dependency groups. CI fails on the two tree-sitter bumps. They target main, while the release work lives on release/6.2.0.

## Why
Pull requests left open pile up and their branches stay on GitHub; each one is a decision to take or refuse an update.

## Acceptance
- Each update is taken on release/6.2.0 with a green check, or refused with a recorded reason; the two tree-sitter bumps say why CI failed
- Every pull request is closed with a comment naming where the update went, and its branch is deleted, on the owner's word for anything on GitHub

## Evidence

