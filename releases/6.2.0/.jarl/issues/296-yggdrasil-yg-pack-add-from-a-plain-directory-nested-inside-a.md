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

