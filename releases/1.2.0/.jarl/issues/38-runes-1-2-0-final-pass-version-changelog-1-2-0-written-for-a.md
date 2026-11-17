# 38 · Runes 1.2.0 final pass: version, CHANGELOG [1.2.0] written for a user of 1.1.0, README and CLAUDE.md counts and paragraphs, the docs limits the reviews routed here

**Status:** in-progress
**Kind:** process
**Priority:** 1
**Tier:** strong
**Key:** 20261117T1827-sztm
**Tags:** runes, release, docs
**Files:** 
**Repo:** Runes
**After:** 764
**Found by:** jarl
**Where:**
**Branch:** jarl/38-final-pass
**Worker:** w-38-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 20:18

## What
The plan's section 5 and the rulings final-pass-notes-from-700, -752, -762, -16, -755, rust-review-minors-to-the-final-pass and runes-changelog-unreleased-until-the-final-pass: on release/1.2.0 after the last merge, the version moves to 1.2.0 in package.json, package-lock.json and src/version.mts; the [Unreleased] section of CHANGELOG.md becomes [1.2.0] - <date>, rewritten as a user of the published 1.1.0 meets it (no fix of a fault this release introduced and fixed), with Before you upgrade (new edges and answers, edges that go away, the web-tree-sitter 0.27.2 pin, the new error codes EPARSESTOPPED and ERUNTIMEABORTED and refused calls after an abort, rev bumps that make stored extracts stale, the C# extract's new optional field), Added to the API, the language sections, Known limits (188's and 765's sentence, the documented limits) and the 1.1.0 known limits that 737 (not a fault), 739 and 743 settle; README's status line, catalogue count and the paragraphs the workers noted; CLAUDE.md's count; the docs/api.md and case-text corrections the rulings name.

## Why
Runes ships only with a CHANGELOG that tells a user of 1.1.0 what changes for them, counts that match, and docs that state every limit the reviews found (rulings runes-1-1-0-changelog-from-1-0-0 read for 1.2.0, and the final-pass rulings).

## Acceptance
- [read] CHANGELOG.md's top section is [1.2.0] with a date, written for a user of 1.1.0 with Before you upgrade, Added to the API, the language sections and Known limits, holds every merged issue's entry in that register and no fix of a fault introduced inside 1.2.0, and the versions in package.json, package-lock.json and src/version.mts read 1.2.0
- [read] README.md's status line, catalogue count and the paragraphs named in the final-pass rulings, CLAUDE.md's count, and the docs/api.md and case-text corrections those rulings name are done
- [check] npm run check and npm run coverage pass on the final tip, and the Rust build tests run under cargo and rustc 1.99.1 with none skipped · by: npm run check

## Evidence

### Proof

- **ran (line f79142dcecec):** npm run check at 80ff400 under MemoryMax=12G · **saw:** tests 3013, pass 3010, fail 0, skipped 3; dist/ is fresh
- **ran (line f79142dcecec):** npm run coverage at 80ff400 under MemoryMax=12G · **saw:** tests 3013, pass 3010, fail 0, skipped 3; all files 99.33% lines, 96.08% branches, 99.30% functions
- **ran (line f79142dcecec):** node --test test/relations/rust-cases-build.test.mjs at 80ff400 with cargo and rustc 1.99.1 from rust:1.99.1-slim on PATH through the brief's docker wrappers · **saw:** tests 6, pass 6, fail 0, skipped 0
- **ran (line f79142dcecec):** npm run corpus -- --tier routine at 80ff400 with RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared · **saw:** corpus gate: passed; every repository 0 added, 0 removed, 0 disagreements; skipped, not passed: gin go, sh go, CleanArchitecture csharp (no go or dotnet here)

### Notes

Assumed: the Unreleased entries of issues whose fault was introduced inside 1.2.0 are folded into the entry of the change they corrected, written as a 1.1.0 user meets the result: 12 (checkRuntimePins and shipped grammars) into the shipped-grammars entry, 27 (abort cleanup) into the ERUNTIMEABORTED entry, 9 (diagnostic and rust_analyzer attributes) and the paths-outside-a-use half of 7 into the in:: entry, 10 (companion mock calls) into the vi.mock entry; 18 (corpus tooling, not shipped) has no entry. The section is dated 2026-11-17, the day of the final pass; the tag date is the owner's.

Assumed: docs/api.md held the classifyUse reason paragraph twice since the merge 0aef086 (755's branch took release/1.2.0): the older copy said C, C++ and Ruby carry no reason, the newer one lacked 755's two bundler items. The final pass keeps one paragraph, the newer, with the bundler items added; nothing else differed. The ruling rust-review-minors-to-the-final-pass also names the ripgrep lines of corpus/explained.md, rewritten to name the paths each file writes outside a use, read from the corpus clone at 3fce3b5.

