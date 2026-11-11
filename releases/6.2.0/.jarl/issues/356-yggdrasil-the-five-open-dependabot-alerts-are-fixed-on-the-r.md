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
- The tools that build and test the CLI and the docs site are updated to releases with no open security advisory (Security).

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: docs takes vite 6.4.6 through an overrides entry beside the existing esbuild one, because vitepress 1.6.4 asks for vite 5 and the alert is fixed only from 6.4.4; the docs build passes on it.

Assumed: pull requests 104, 105, 109, 110 and 111 are taken on this branch (source-map-js 1.2.2 in both lockfiles; vite, vitest, @vitest/mocker 5.1.0 and the other dev tools of 109; vite above 110's 8.3.5; chalk, ignore, semver and smol-toml of 111). npm resolved the carets to newer releases than the pull requests: vite 8.3.8, @playwright/test 1.65.0 (the pull request asked for 1.64.1).

Refused, with the reason: 106 (tree-sitter-cli 0.27.1) and 107 (web-tree-sitter 0.27.1). The grammar manifest the family shares through Runes pins tree-sitter-cli 0.27.0 and web-tree-sitter 0.27.0 with the sha256 of its runtime wasm. CI on 106 failed in the build step with 'the grammar manifest pins tree-sitter-cli 0.27.0, but 0.27.1 is installed', so no grammar reached the tarball (pack-smoke failed and every later step with it). CI on 107 failed the shipped-grammar pin test (runtime 0.27.0 pinned, 0.27.1 installed, wasm bytes differ) and the golden output corpus, whose hashes include the runtime bytes. Both need a Runes release that moves the pins (and Yggdrasil then adopting it), not a bump here.

Assumed: Playwright 1.65 needs chromium-1254, which the dev container lacked; I installed it for user node with 'npx playwright install chromium' (the step CI runs too), beside the existing 1243.

