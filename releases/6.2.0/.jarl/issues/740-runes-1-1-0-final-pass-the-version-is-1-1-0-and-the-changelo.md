# 740 · Runes 1.1.0 final pass: the version is 1.1.0 and the CHANGELOG's [1.1.0] section tells a consumer upgrading from 1.0.0 everything that changed, with 1.0.1 folded in (the Runes part of 342)

**Status:** in-progress
**Kind:** docs
**Priority:** 1
**Tier:** strong
**Key:** 20261113T1752-ndrp
**Tags:** runes, release
**Files:** Runes/CHANGELOG.md, Runes/package.json, Runes/package-lock.json, Runes/src/version.mts, Runes/README.md, Runes/CLAUDE.md
**Repo:** Runes
**Found by:** jarl
**Where:** Runes release/1.1.0 at 8b0173d: package.json says 1.0.1, the CHANGELOG's top section is [1.0.1] - 2026-10-02 and no section names the changes made since
**Branch:** jarl/740-runes-1-1-0-final
**Worker:** w-740-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 17:52

## What
Runes 1.0.1 was never published (the last tag is v1.0.0), and the changes of this loop's Runes issues are recorded only in each issue's Changelog field. Before the tag, the release branch must carry the version 1.1.0 and one CHANGELOG section for it. This is the Runes half of 342 and the final pass the Runes worker brief reserves for the version, the CHANGELOG and the prose counts of README.md and CLAUDE.md.

## Why
The release workflow publishes the version package.json names and takes the GitHub release text from the CHANGELOG section of that version; a consumer reads that section to learn what upgrading from 1.0.0 changes for them (342: a section for a version nobody could install tells them something false).

## Acceptance
- [check] package.json, package-lock.json and src/version.mts say 1.1.0, and the version and CHANGELOG tests are green · by: npm run check
- [read] CHANGELOG.md's top section is [1.1.0] with the release date, written for someone upgrading from 1.0.0: what the relation pass now finds or stops finding by language, the additions to the API (docs/api.md), a Before you upgrade note on new findings a graph may show and on the modelled TypeScript version, the known limits the loop's rulings name; every Changelog entry of a Runes issue done in this loop is either in it or folded into a broader line, and the 1.0.1 entries are part of it with no header for 1.0.1; [1.0.0] and older are unchanged
- [read] README.md and CLAUDE.md say what 1.1.0 is where they state a version, a count or a status, and match the catalogue and test counts of the tip

## Evidence

### Proof

- **ran (line fa57aaa78ad5):** npm run check (at 9ceb2a7, the version commit a053b40 included) · **saw:** package.json, package-lock.json, src/version.mts and dist/version.mjs say 1.1.0; tests 2682, pass 2679, fail 0, skipped 3 (the two Rust build tests and the Go oracle: no rustc, cargo or go on this host); 'the top released CHANGELOG section is the package version' passes; dist/ is fresh; exit 0
- **ran (line fa57aaa78ad5):** npm run check (at 6ade796, after merging release/1.1.0 at 34b7e2b) · **saw:** version 1.1.0 throughout; tests 2738, pass 2735, fail 0, skipped 3 (no Rust or Go on this host); the top CHANGELOG section is the package version; dist/ is fresh; exit 0
- **ran (line fa57aaa78ad5):** npm run check (at 72d243a, after merging release/1.1.0 at c21ceca) · **saw:** version 1.1.0 throughout; tests 2751, pass 2748, fail 0, skipped 3 (no Rust or Go on this host); the top CHANGELOG section is the package version; dist/ is fresh; exit 0

### Notes

Assumed: the [1.1.0] section takes the merged issues and the entries already recorded for package T (732, 707, 711, 738: classifyUse, the trailing slash, imports targets as written, types@ read as TypeScript 7.0.2, the Java and Kotlin default names); the entries of package C# (696, 701, 708) wait until it is merged. The extractor revs are named without numbers, because T moves Java and Kotlin again.

Assumed: left out as not Runes: the 'yg check warns' entry of 234 and the two Changed entries of 235 (the relation check resolving against the checkout, Grain's symbolic links); Runes' side of both is the file view and onDiagnostic under Added to the API. 686's entry is written against 1.0.0 with the numbers of 686's own harness (jellyfin 5.1 s against 24.2 s); 706 goes under Other. The 1.0.1 sentences on parse time and on the ILogger<Program> exception are dropped: the first runs the product down (ruling changelog-speaks-well-of-the-product), and 164 fixed the second.

Assumed: the README behaviour notes of 010, 237 and 509 point at per-language paragraphs the Runes README does not have, and the paragraph 234 and 235 asked for already names FileView, listedFileView and onDiagnostic, so README.md changes only in its status line and catalogue counts (962 at 8b0173d). Known limits named by rulings: outside-base-members-stay-a-known-limit, the [patch] limits of 512, 737 and 739 (runes-1-1-0-review-findings-after, runes-kotlin-defaults-in-1-1-0); the modelled TypeScript version (runes-models-typescript-7) sits under Before you upgrade.

