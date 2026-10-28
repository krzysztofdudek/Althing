# 025 · Jarl: a repository given as a path says once why it is stored as a path

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
With the code in a git repository inside the loop's own directory, every new --repo ./repo printed that the repository is stored as a path because the checkout is not beside the loop's main checkout. Correct, but repeated on every filing.

## Why
A note repeated on every call is read as noise.

## Acceptance
- The note is printed the first time a repository is stored as a path in a loop, and not again for the same repository
- A test

## Evidence

