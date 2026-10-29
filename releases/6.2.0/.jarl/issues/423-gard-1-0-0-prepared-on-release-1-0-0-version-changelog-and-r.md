# 423 · Gard 1.0.0 prepared on release/1.0.0: version, changelog and release workflow

**Status:** open
**Kind:** process
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace
**Files:** Gard/package.json, Gard/CHANGELOG.md, Gard/.github/workflows
**Repo:** ../../../Gard
**After:** 416, 417, 418, 419, 422
**Found by:** owner
**Where:** method/releases.md: bump commits on the release branch, each green, and a publishing workflow that pins its npm

## What
On release/1.0.0: the version 1.0.0 in every manifest, the CHANGELOG section for 1.0.0, a release workflow that publishes to npm and makes the GitHub release from a tag, with npm pinned and the publish verified after the run. Nothing is tagged, pushed or published here; that is the release issue's, on the owner's word.

## Why
The release issue walks every repository in order; Gard must be ready to ship when it is started.

## Acceptance
npm pack of the tip gives 1.0.0 and the expected file list; the workflow passes a YAML parse test and pins npm; the CHANGELOG section lists the user-visible additions

## Evidence

