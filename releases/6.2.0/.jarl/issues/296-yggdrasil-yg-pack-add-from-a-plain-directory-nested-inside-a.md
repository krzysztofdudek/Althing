# 296 · Yggdrasil: yg pack add from a plain directory nested inside another git checkout takes that checkout's origin as the package identity without --as

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2056-hply
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/pack-source.ts, Yggdrasil/docs/packages.md
**Repo:** Yggdrasil
**After:** 028
**Found by:** fresh-reviewer
**Where:**
**Branch:** jarl/220-cli-messages
**Worker:** w-220-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 12:51

## What
deriveIdentity in cli/pack-source.ts reads git remote get-url origin with the source directory as the working directory, and git walks up to an enclosing checkout. Probe: a repository whose origin is https://github.com/evil/law.git, a plain marketplace copy at outer/sub, then yg pack add outer/sub#demo without --as exits 0 and installs into packages/evil/law/demo/. docs/packages.md says a directory with no origin of its own makes the command ask for --as, and derivePublisher is already consistent with that. Fix: read the origin only when the directory is a git root, or treat a plain directory as having no identity so --as is required. The CHANGELOG needs a Before you upgrade note: some installs that work today become refusals asking for --as.

## Why
The package identity decides the install directory and the rule names, so a copy silently adopting an unrelated checkout's origin installs under a name nobody chose; the same command in a different parent directory gives a different result.

## Acceptance
- Test: yg pack add on a plain directory nested inside a checkout whose origin is set, without --as, is refused and asks for --as, and installs under the --as identity when given; red before (exit 0, packages/evil/law/demo/), green after.
- Test: a directory that is itself a git root with an origin still derives its identity from that origin.
- docs/packages.md and the CHANGELOG Before you upgrade note describe the refusal and the --as route.

## Changelog
- Fixed: yg pack add from a plain directory inside another git checkout no longer takes that checkout's origin as the package identity; it asks for --as like any directory without an origin of its own.
- Before you upgrade: yg pack add from a plain directory inside another git checkout now asks for --as. The directory used to take the origin of the enclosing checkout as the package's publisher; only a directory that is itself the root of a git checkout gives its origin now. A script that relied on the borrowed identity fails once: add --as <owner>/<repo> with the identity it installed under. Packages already installed are not affected.

## Evidence

From the third review of 028 (rev-ygg-028-opus3), to fold into this issue or the next 028 follow-up: (1) advise still suggests an update that the command refuses, and says the versions were read from the moved source, after a refused update with no list run since, and for an unreachable moved source even after list: in pack.ts:652-654 list checks for a move only after the source answered (check first, which also stops list from contacting the moved source), and gatherPackageUpdates (advise.ts:839) could skip a record whose URL source names a different address than publisher; (2) readOriginUrl (git-pack-fetch.ts:156) uses git config --get which returns the LAST of several remote.origin.url values while git fetches from the first: use --get-all and take the first line; (3) for a local checkout whose origin changed the step says in the same change as source but a path in source does not change (pack-source.ts:741); (4) Bitbucket Server's https form (host/scm/proj/repo) and ssh form (host/proj/repo) give different addresses in publisherFromUrl (pack-source.ts:179), so switching between them is refused though owner/repo is the same, contradicting the changelog's same for https, ssh and scp-like forms; (5) a record written before 6.2.0 whose source is moved before its first 6.2.0 update is still swapped by that update, which then records the moved address: the Before-you-upgrade line (CHANGELOG.md:11) should say plainly that the comparison starts once publisher is written, and how to write it (an update, or the line by hand); (6) CHANGELOG.md:28 says pack list explains how to keep a moved package but list only says the source differs and update refuses it (pack.ts:622); R2d's title says adaptations are kept but the test never writes one; docs/packages.md:133 has a stray short line; for a move to a plain directory deleting the publisher line together with source is accepted and keeps the rule and the adaptation: the step text at pack-source.ts:743 could offer that edit.
- **ran (line 9f71924d3ffe):** npx vitest run tests/e2e/cli-pack-lifecycle.test.ts -t '23|24' on the unfixed source · **saw:** 23b failed: expected +0 to be 1 (yg pack add of a plain directory nested in a checkout with origin evil/law exited 0 without --as); 23c and 24 passed
- **ran (line 9f71924d3ffe):** npx vitest run tests/e2e/cli-pack-lifecycle.test.ts tests/e2e/cli-pack-versions.test.ts tests/e2e/cli-reference-truth.test.ts tests/unit/repo after the fix · **saw:** Test Files 25 passed, Tests 243 passed; 23b refuses with 'who published' and '--as <owner>/<repo>' and installs under acme/law with --as; nothing under packages/evil
- **ran (line d22d57e192e4):** same run, scenario 23c: pack add of a git root with origin https://example.test/acme/law.git without --as · **saw:** exit 0, installed under packages/acme/law/demo (passed before and after the fix)
- **ran (line 0f1edf650832):** git diff HEAD~1 -- docs/packages.md CHANGELOG.md docs/cli-reference.md; docs build and markdownlint-cli2 **/*.md · **saw:** docs/packages.md says a plain copy inside another checkout never borrows that origin and the command asks for --as; CHANGELOG has the Before you upgrade bullet naming --as; docs build complete, markdownlint 0 issues in 53 files

