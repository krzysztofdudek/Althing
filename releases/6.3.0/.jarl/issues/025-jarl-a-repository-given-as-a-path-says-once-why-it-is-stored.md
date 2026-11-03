# 025 · Jarl: a repository given as a path says once why it is stored as a path

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/025-path-note-and-review-docs
**Merged:** 9503db5 in ../../../JarlSkill
**CI:** none

## What
With the code in a git repository inside the loop's own directory, every new --repo ./repo printed that the repository is stored as a path because the checkout is not beside the loop's main checkout. Correct, but repeated on every filing.

## Why
A note repeated on every call is read as noise.

## Acceptance
- The note is printed the first time a repository is stored as a path in a loop, and not again for the same repository
- A test

## Changelog
- Fixed: When a repository is kept by its path, Jarl explains why the first time in a loop. It no longer repeats that explanation on every new issue that names the same repository.

## Evidence

- **ran:** node --test tests/repositories.test.mjs, before the change · **saw:** AssertionError: the same repository is noted once per loop; actual 'note: ./inner is stored as the path ./inner: the checkout is not at ...' (red)
- **ran:** node --test tests/repositories.test.mjs, after the change · **saw:** run completed with exit code 0 (all tests in the file pass)
- **ran:** npm test in skills/jarl/scripts, after the fix (TMPDIR under the scratch directory) · **saw:** tests 823, pass 800, fail 0 (the rest skipped)
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 834 ℹ pass 811 ℹ fail 0 (on 9503db5, release/6.2.1: 032 merged at 2399fe2, 025 and 026 at 9503db5)

