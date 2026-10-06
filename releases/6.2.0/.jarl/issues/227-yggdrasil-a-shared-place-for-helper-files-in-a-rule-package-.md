# 227 · Yggdrasil: a shared place for helper files in a rule package (the second half of 029)

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** yggdrasil, packages, partial
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** jarl
**Source:** decisions#yggdrasil-scope
**Where:**
**After:** 028

## What
In 6.1.1 (029) marketplace check rejects an import from outside the files the installation copies, and the documentation says there is no shared place for helpers yet; the layout deferred to 6.2.0.

## Why
A package with several rules has to copy shared code into every rule today.

## Acceptance
A documented directory for shared files in a package, copied by pack add/update, counted in the support hashes of the rules that import it (a change to a helper invalidates those rules' verdicts), and verified by marketplace check; e2e tests of installation, update and invalidation.

## Evidence


