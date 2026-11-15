# 751 · Runes 1.1.0 is not on npm: the release workflow's publish at v1.1.0 is refused with E404, because @chrisdudek/runes has no trusted publisher on npmjs.com

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261115T0735-iikx
**Tags:** ci, release, needs-owner
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** Runes release workflow run 43689864020 on the tag v1.1.0 (16731a2): verify green in all 12 jobs; the publish job's step 'Publish to npm' signed the provenance statement (sigstore log index 3897110432), then the registry answered 'npm error 404 Not Found - PUT https://registry.npmjs.org/@chrisdudek%2frunes'; npm view @chrisdudek/runes@1.1.0 answers E404 and dist-tags is still latest 1.0.0; the GitHub release step did not run

## What
release.yml publishes through npm trusted publishing (OIDC, no token). A registry PUT that carries no OIDC exchange the package accepts is answered 404. Runes 1.0.0 was the manual first publish (the workflow skipped it as published=first), and @chrisdudek/runes 1.0.0 carries no provenance, while @chrisdudek/yg 6.1.0 does: the account publishes yg through a trusted publisher, and no trusted publisher was ever set up for runes. Nothing was published; the tag v1.1.0 stands on 16731a2.

## Why
Runes 1.1.0 is the version Lawcheck and the family pin; until it is on npm a consumer cannot install it, and a re-run without the setting fails the same way.

## Acceptance
- [owner] On npmjs.com, @chrisdudek/runes has a trusted publisher for GitHub Actions: user krzysztofdudek, repository Runes, workflow file release.yml, no environment · material: the package's settings page on npmjs.com · check: the setting is saved
- [check] The failed publish job of run 43689864020 re-run on the same tag publishes 1.1.0 with provenance under latest and creates the GitHub release v1.1.0 from the CHANGELOG section · by: gh run rerun 43689864020 --failed, then npm view @chrisdudek/runes@1.1.0 version and npm view @chrisdudek/runes dist-tags

## Evidence

