# 296 · Yggdrasil: yg pack add from a plain directory nested inside another git checkout takes that checkout's origin as the package identity without --as

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/pack-source.ts, Yggdrasil/docs/packages.md, Yggdrasil/CHANGELOG.md
**Repo:** ../../../Yggdrasil
**After:** 028
**Found by:** fresh-reviewer
**Where:**

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

## Evidence

From the third review of 028 (rev-ygg-028-opus3), to fold into this issue or the next 028 follow-up: (1) advise still suggests an update that the command refuses, and says the versions were read from the moved source, after a refused update with no list run since, and for an unreachable moved source even after list: in pack.ts:652-654 list checks for a move only after the source answered (check first, which also stops list from contacting the moved source), and gatherPackageUpdates (advise.ts:839) could skip a record whose URL source names a different address than publisher; (2) readOriginUrl (git-pack-fetch.ts:156) uses git config --get which returns the LAST of several remote.origin.url values while git fetches from the first: use --get-all and take the first line; (3) for a local checkout whose origin changed the step says in the same change as source but a path in source does not change (pack-source.ts:741); (4) Bitbucket Server's https form (host/scm/proj/repo) and ssh form (host/proj/repo) give different addresses in publisherFromUrl (pack-source.ts:179), so switching between them is refused though owner/repo is the same, contradicting the changelog's same for https, ssh and scp-like forms; (5) a record written before 6.2.0 whose source is moved before its first 6.2.0 update is still swapped by that update, which then records the moved address: the Before-you-upgrade line (CHANGELOG.md:11) should say plainly that the comparison starts once publisher is written, and how to write it (an update, or the line by hand); (6) CHANGELOG.md:28 says pack list explains how to keep a moved package but list only says the source differs and update refuses it (pack.ts:622); R2d's title says adaptations are kept but the test never writes one; docs/packages.md:133 has a stray short line; for a move to a plain directory deleting the publisher line together with source is accepted and keeps the rule and the adaptation: the step text at pack-source.ts:743 could offer that edit.

