# 028 · The identity guard on yg pack update compares only the last two segments of the URL path: moving the recorded source to another host (or another GitLab group) with the same <owner>/<repo> tail fetches and installs someone else's code without objection

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/pack-source.ts, Yggdrasil/source/cli/src/cli/pack-update.ts, Yggdrasil/source/cli/src/model/packages.ts, Yggdrasil/docs/packages.md
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/pack-update.ts:324-338 (compares only ownerRepoOf(entry.package) with deriveIdentity(resolved)); cli/pack-source.ts:150-162 (identityFromUrl strips the scheme, userinfo and host, and keeps the last two segments), :170 (validIdentity: exactly two segments), :627-636 (deriveIdentity); model/packages.ts:76-99 (the lock records neither the host nor the full repo path)
**Branch:** jarl/028-packages
**Worker:** ygg-028-packages
**Worktree:** /home/node/wt/028-packages
**Since:** 2026-10-05 13:00

## What
Reproduction (npm @chrisdudek/yg@6.1.0, no network): (A) install house-style from (file URL) …/trusted-host/acme/law, commit, change only `source:` in .yggdrasil/yg-packages.yaml to (file URL) …/other-host/acme/law, `yg pack update`: 'Updated 'house-style' 0.1.0 → 0.2.0 ... example: changed check.mjs' (exit 0), and the installed check.mjs ends with the second repo's marker line ('// not the trusted publisher's code'). Control: a change of owner (evil/law) is refused. (B) Realistic URLs (url.insteadOf in an isolated GIT_CONFIG_GLOBAL routes traffic to local repos, ~/.gitconfig untouched): install from `https://github.com/acme/law#house-style`, commit, change one line to `source: "https://gitlab.example/acme/law"`, `yg pack update` installs the other host's code (exit 0); then `yg pack verify house-style` says 'the copy is exactly pack/house-style@0.2.0' (exit 0), because it asks the new source, and `yg pack list` warns about nothing; a change to `https://github.com/evil/law` is refused. (C) GitLab subgroups: moving from .../teamA/shared/rules to .../teamB/shared/rules passes the guard and installs teamB's code; a third repo teamC/shared/rules installs into the same directory packages/shared/rules/, and `yg pack list` shows them under one publisher. The guard's only test (tests/e2e/cli-pack-versions.test.ts:581-588, R2) covers a change of owner. This is the remainder of item m4 from the packages audit (issue 168 in 6.1.0, done). Forcing the host into the identity itself would rename packages/<owner>/<repo>/ and every rule name (a breaking change). Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-25/logs/v25-identity-host.log (script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-25/repro/v25-identity-host.sh).

## Why
docs/packages.md:104-107 promises a refusal when the recorded source 'now says it belongs to someone else'; a change of owner and a change of host are equally visible in the diff, and only the first is refused, so a typo in the host (e.g. githab.com/acme/law) passes. After the swap, `yg pack verify` even vouches for the new code, and the payload is check.mjs, run in-process on every fill. The attack needs a committed change to yg-packages.yaml, which the docs (packages.md:630-636) say to review like code anyway, hence minor.

## Acceptance
- Installation records a normalised publisher (host plus the full repo path, with the ssh, https and scp forms of the same host equal); update compares it and refuses on a change of host or parent group; an e2e test next to R2 for both cases.
- Two different repositories with the same <owner>/<repo> tail do not land in one directory packages/<owner>/<repo>/ without a refusal, and docs/packages.md:91-93 describes the real reach of 'a fork cannot claim the original's rule names'.

## Changelog
- Fixed: yg pack update refuses a source moved to another host or another group with the same <owner>/<repo>; the record keeps the whole address a package was installed from (publisher:), and yg pack add refuses a second repository whose address ends in the same <owner>/<repo> as an installed one's.

## Evidence


follow-up: yg pack add taking an enclosing checkout's origin as identity for a plain nested directory is issue 296.

