# 356 · Yggdrasil: the open Dependabot alerts and pull requests are settled on the release branch

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261028T1029-caqs
**Tags:** 
**Files:** Yggdrasil/source/cli/package.json, Yggdrasil/source/cli/package-lock.json, Yggdrasil/docs/package.json, Yggdrasil/docs/package-lock.json, Yggdrasil/CHANGELOG.md
**Repo:** Yggdrasil
**Found by:** coordinator
**Where:**
**Branch:** jarl/356-dependency-alerts
**Worker:** w-356-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 13:05

## What
On 2026-11-09 GitHub lists eleven open alerts: vite and @vitest/mocker in source/cli, vite in docs, and source-map-js in both. All of them are development dependencies, so none reaches what a user of the CLI installs. The fixes are vite 8.3.3 or later in source/cli, vite 6.4.4 or later in docs, @vitest/mocker 5.0.3 or later, and source-map-js 1.2.2 or later. Seven Dependabot pull requests are open: 104, 105, 106, 107, 109, 110 and 111. They target main, while the release work lives on release/6.2.0, and CI fails on the two tree-sitter bumps, 106 and 107. Issue 357 was merged into this one.

## Why
Known vulnerabilities in the tools that build and test the CLI and the docs should not stay open, and each open pull request is a decision to take or refuse an update.

## Acceptance
- [read] release/6.2.0 takes vite 8.3.3 or later in source/cli and 6.4.4 or later in docs, @vitest/mocker 5.0.3 or later, and source-map-js 1.2.2 or later in both lockfiles
- [read] Each open Dependabot update is taken on release/6.2.0 with a green check or refused with a recorded reason, and the two tree-sitter bumps say why CI failed
- [read] The CHANGELOG says what was updated under Security
- [owner] Every Dependabot pull request is closed with a comment naming where the update went, and its branch is deleted · material: the list of open pull requests · check: none is left open

## Changelog
- Known security advisories in the libraries Yggdrasil is built with are closed, except one that only the code-style checker reaches (Security).

## Reviews
- **changes** · by rev-356-fable (fresh) · 2026-11-11 · model claude-fable-5-2
  Important: CHANGELOG.md:109 - the entry says the tools that build and test the CLI and the docs site are 'updated to releases with no open security advisory' and that the advisories never reached what npm install @chrisdudek/yg installs. On this commit npm audit still reports 10 findings in source/cli and 2 in docs: brace-expansion 5.0.9 (high, patched in 5.0.12, inside the range minimatch asks for) and minimatch 10.2.6 (moderate, patched only in 11.0.1) reach eslint and typescript-eslint and are also runtime dependencies of the CLI; docs holds vue and @vue/server-renderer 3.5.28 (high, patched in 3.5.42, inside vitepress's range). All were there on release/6.2.0, but the sentence as written is false for a reader of the release notes. Either take the in-range fixes (brace-expansion, vue) and name what stays, or say which advisories were closed instead of 'no open advisory'. Lines 1 to 3 are otherwise met: 'vite 8.3.3 or later in source/cli and 6.4.4 or later in docs, @vitest/mocker 5.0.3 or later, and source-map-js 1.2.2 or later in both lockfiles' holds (8.3.8, 6.4.6, 5.1.0, 1.2.2); 'taken on release/6.2.0 with a green check or refused with a recorded reason' holds (repo-check exit 0, 10487 tests, branches 91.36%; both refusals reproduced; every lockfile move is one of the updates or a package they pull, all from the npm registry); the entry is under Security. Minor: the recorded reason for 106 says the build fails, which is true only from a cold grammar cache; with a warm cache the build passes on tree-sitter-cli 0.27.1 and nothing else in the check names the mismatch. Tried: npm ci and audit of both packages, base against branch; docs build (passes) and dev server on vite 6 and on the base's vite 5; 0.27.1 of each grammar tool.
  outside the issue, filed as 597: Yggdrasil: npm audit on release/6.2.0 reports advisories no issue covers: brace-expansion 5.0.9 (high) and minimatch 10.2.6 (moderate) among the CLI's runtime dependencies, and vue with @vue/server-renderer 3.5.28 (high) in docs
  outside the issue, filed as 598: Yggdrasil docs: 'vitepress dev' crashes at start while optimizing dependencies ('Transforming destructuring to the configured target environment is not supported yet'), on release/6.2.0 with vite 5.4.21 and on vite 6.4.6 alike; the esbuild 0.28 override is the likely cause; 'vitepress build' passes
  outside the issue, filed as 599: Yggdrasil: with a warm grammar cache the build passes on a tree-sitter-cli other than the pinned one; the pin is checked only when a grammar is built from source

## Evidence

### Proof

- **ran (line f0eab30bfbff):** npm ci, npm audit and npm ls in source/cli and docs of a clean extraction of f7288e79f · **saw:** source/cli: vite 8.3.8, @vitest/mocker 5.1.0, source-map-js 1.2.2; docs: vite 6.4.6 (overridden), source-map-js 1.2.2; npm audit no longer lists vite, @vitest/mocker, vitest or source-map-js in either. Still listed, as on release/6.2.0: brace-expansion 5.0.9 (high) and minimatch 10.2.6 (moderate) in source/cli, vue and @vue/server-renderer 3.5.28 (high) in docs
- **ran (line c6c0790a9860):** scripts/repo-check.sh on f7288e79f in the dev container; tree-sitter-cli 0.27.1 and web-tree-sitter 0.27.1 each installed in a scratch copy · **saw:** repo-check: All checks passed, exit 0, 709 test files and 10487 tests passed, branches 91.36%. tree-sitter-cli 0.27.1: the grammar step from a cold cache fails with 'the grammar manifest pins tree-sitter-cli 0.27.0, but 0.27.1 is installed' (with a warm grammar cache the build passes). web-tree-sitter 0.27.1: grammar-pins.test.ts fails, 'pinned 0.27.0, installed 0.27.1' and the runtime wasm hash differs

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: docs takes vite 6.4.6 through an overrides entry beside the existing esbuild one, because vitepress 1.6.4 asks for vite 5 and the alert is fixed only from 6.4.4; the docs build passes on it.

Assumed: pull requests 104, 105, 109, 110 and 111 are taken on this branch (source-map-js 1.2.2 in both lockfiles; vite, vitest, @vitest/mocker 5.1.0 and the other dev tools of 109; vite above 110's 8.3.5; chalk, ignore, semver and smol-toml of 111). npm resolved the carets to newer releases than the pull requests: vite 8.3.8, @playwright/test 1.65.0 (the pull request asked for 1.64.1).

Refused, with the reason: 106 (tree-sitter-cli 0.27.1) and 107 (web-tree-sitter 0.27.1). The grammar manifest the family shares through Runes pins tree-sitter-cli 0.27.0 and web-tree-sitter 0.27.0 with the sha256 of its runtime wasm. CI on 106 failed in the build step with 'the grammar manifest pins tree-sitter-cli 0.27.0, but 0.27.1 is installed', so no grammar reached the tarball (pack-smoke failed and every later step with it). CI on 107 failed the shipped-grammar pin test (runtime 0.27.0 pinned, 0.27.1 installed, wasm bytes differ) and the golden output corpus, whose hashes include the runtime bytes. Both need a Runes release that moves the pins (and Yggdrasil then adopting it), not a bump here.

Assumed: Playwright 1.65 needs chromium-1254, which the dev container lacked; I installed it for user node with 'npx playwright install chromium' (the step CI runs too), beside the existing 1243.

Correction to the earlier refusal note for 106: the grammar-pin failure shows only from a cold grammar cache. With a warm cache the build passes on tree-sitter-cli 0.27.1 (that gap is filed as 599). The refusal stands because the family's grammar manifest pins 0.27.0 and the bytes it builds are the pinned ones only on that version.

