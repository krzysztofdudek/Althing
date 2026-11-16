# 751 · Runes 1.1.0 is not on npm: the release workflow's publish at v1.1.0 is refused with E404, because @chrisdudek/runes has no trusted publisher on npmjs.com

**Status:** done
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

## Reviews
- **approve** · by rev-751-sonnet (fresh) · 2026-11-16 · model claude-sonnet-5-5@high
  Ran npm view @chrisdudek/runes dist-tags: latest 1.1.0; dist.attestations for 1.1.0 carries provenance predicateType https://slsa.dev/provenance/v1 (only a trusted publish gives it); gitHead 1f3476b0e49f982a0d7615acfdd29d279fe3c53a. gh run list on release.yml: run 43694364773 on v1.1.0 completed success (the earlier run 43689864020 failed, as the issue says). Runes origin/main is 1f3476b0e49f982a0d7615acfdd29d279fe3c53a and v1.1.0^{commit} is the same commit. gh release view v1.1.0: exists, not draft, not prerelease. The issue shows line 1 [owner] ticked (2026-11-16 01:03) and line 2 [check] proved with three proof rows. Line 2 named a re-run of the failed run on the same tag; the proof records that the tag was moved to 1f3476b and the workflow ran fresh, which reaches the same outcome (published with provenance under latest, GitHub release created).

## Evidence

### Proof

- **ran (line c14c29ab7462):** gh run view 43694364773 --repo krzysztofdudek/Runes --log (the release workflow on the tag v1.1.0, moved to 1f3476b after the CHANGELOG audit, instead of a re-run of 43689864020 at 16731a2) · **saw:** verify green in all 12 jobs; Publish to npm: Signed provenance statement, transparency log index 3898192878, + @chrisdudek/runes@1.1.0; publish job success
- **ran (line c14c29ab7462):** npm view @chrisdudek/runes@1.1.0 version; npm view @chrisdudek/runes dist-tags; npm view @chrisdudek/runes@1.1.0 dist.attestations.provenance.predicateType gitHead (fresh cache, after a few minutes of registry lag) · **saw:** 1.1.0; { latest: '1.1.0' }; https://slsa.dev/provenance/v1; gitHead 1f3476b0e49f982a0d7615acfdd29d279fe3c53a
- **ran (line c14c29ab7462):** gh release view v1.1.0 --repo krzysztofdudek/Runes · **saw:** release v1.1.0 exists, not a draft, not a prerelease; its body replaced with the owner-approved text (gh release edit --notes-file)

### Notes

Ruling ask-44 (stuck, by owner): Done: the owner added the trusted publisher on npmjs.com (user krzysztofdudek, repository Runes, workflow release.yml), and Runes 1.1.0 was published.

Owner, 2026-11-16 (translated from Polish): "Ok", to confirming the trusted publisher of @chrisdudek/runes on npm, which the publish of 1.1.0 from v1.1.0 already used. Runes main fast-forwarded to release/1.1.0 at 1f3476b on his word.

