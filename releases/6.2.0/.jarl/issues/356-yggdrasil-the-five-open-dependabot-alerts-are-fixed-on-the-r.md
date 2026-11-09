# 356 · Yggdrasil: the open Dependabot alerts and pull requests are settled on the release branch

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261028T1029-caqs
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** coordinator
**Where:**

## What
On 2026-11-09 GitHub lists eleven open alerts: vite and @vitest/mocker in source/cli, vite in docs, and source-map-js in both. All of them are development dependencies, so none reaches what a user of the CLI installs. The fixes are vite 8.3.3 or later in source/cli, vite 6.4.4 or later in docs, @vitest/mocker 5.0.3 or later, and source-map-js 1.2.2 or later. Seven Dependabot pull requests are open: 104, 105, 106, 107, 109, 110 and 111. They target main, while the release work lives on release/6.2.0, and CI fails on the two tree-sitter bumps, 106 and 107. Issue 357 was merged into this one.

## Why
Known vulnerabilities in the tools that build and test the CLI and the docs should not stay open, and each open pull request is a decision to take or refuse an update.

## Acceptance
- [read] release/6.2.0 takes vite 8.3.3 or later in source/cli and 6.4.4 or later in docs, @vitest/mocker 5.0.3 or later, and source-map-js 1.2.2 or later in both lockfiles
- [read] Each open Dependabot update is taken on release/6.2.0 with a green check or refused with a recorded reason, and the two tree-sitter bumps say why CI failed
- [read] The CHANGELOG says what was updated under Security
- [owner] Every Dependabot pull request is closed with a comment naming where the update went, and its branch is deleted · material: the list of open pull requests · check: none is left open

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

