# 367 · Gard: the repository's skeleton, package and licence

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1424-borc
**Tags:** gard, workplace, foundation
**Files:** Gard/package.json, Gard/LICENSE, Gard/README.md, Gard/CHANGELOG.md, Gard/.gitignore, Gard/.gitattributes
**Repo:** ../../../Gard
**Found by:** jarl
**Where:** the Gard repository is empty; research/2026-10-29-mimir-and-gard/gard-design.md, section Release

## What
The first commit of Gard on main, and release/1.0.0 cut from it: package.json for one npm package @chrisdudek/gard with the command gard (bin), engines node 22.13 or newer, type module, exact versions of every dependency and a lockfile; the MIT licence with the owner's name and year; a README that says what Gard is in two sentences and that it is being built; a CHANGELOG with an empty Unreleased section; .gitignore and .gitattributes (text files with LF). No publish configuration beyond the package's own fields. The name of the command is checked, read only, against programs called gard on the PATH of macOS, Linux and Windows and against the npm registry.

## Why
Every other issue of Gard lands in this repository; a skeleton chosen once keeps them from inventing their own.

## Acceptance
- npm pack in Gard's dev container produces a tarball whose file list is the package's files only, and node bin/gard.mjs --version prints 1.0.0-alpha.0
- The evidence records what npm view @chrisdudek/gard and a PATH lookup of gard printed

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

