# 051 · Grain loses imports of stylesheets, images and .vue components without <script>, while yg check counts them, so an adopted proposal fails yg check right away

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-nwoy
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/relations.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/arch.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/relations.mjs:327 dirOwner and :361 modOwner return undefined for a path outside fileSet, and vendor/runes/dist/relations/resolver.mjs:353-355 (`if (!owner) return undefined; // UNMAPPED target`) silences it; learn.mjs:644-646 (fileSet = CODE_RE files and sfc.files; base.mjs:23 CODE_RE without .css, .scss, .svg, .png and .vue); relations.mjs:225 `if (!f) continue;` in sfcRelations for a component without <script>; arch.mjs:133-136 (`fileSet = model.filesAll`) for check at edit time
**Branch:** jarl/051-relation-targets
**Merged:** bf2a1d4
**CI:** none

## What
Reproduction (Grain ae6152f = 6.1.0, @chrisdudek/yg 6.1.0). TS fixture: src/app/main.ts imports ../styles/theme.css, ../data/config.json and ../assets/logo.svg; `grain export` has one edge (→ src/data/config.json), relStages seen 3, resolved 1; yg check on a one-node-per-directory graph reports relation-undeclared-dependency for main.ts:1 → src_styles, :2 → src_data and :3 → src_assets. Vue fixture: App.vue imports ../ui/Button.vue (with <script setup>) and ../widgets/Spinner.vue (template only); Grain has an edge only to Button.vue, yg flags both. Control: the same imports to .ts files, Grain resolves 3 of 3 like yg. vitepress @56fa6c9d: `grain propose` exit 0, '0 dependency cycle(s)', preview 'would accept', `yg adopt` 'accepted', `yg check --full` exit 1 with `relation-undeclared-dependency: src/client/theme-default/components/VPAlgoliaSearchBox.vue:16 → src/client/theme-default/styles` (line 16: `import '../styles/docsearch.css'`); Grain itself proposes the styles node with the comment 'grain parsed none of them … 0 outgoing dependencies'. vitepress also fails for another reason (the rule grain/tests/partition-lex-quote, 22 violations); here this bug adds one error. koel @65fe57fc: 24 of 352 .vue files have no <script>; yg sees 24 file→directory dependencies that Grain does not see, each to an image, a stylesheet or a component without <script>, e.g. TwoFactorAuthSettings.vue:36 `import SettingGroup from '@/components/screens/settings/SettingGroup.vue'`. Yggdrasil counts such edges on purpose (issue 216 of 6.1.0); Grain vendors the same Runes resolver, and the mismatch comes only from Grain's owner index. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-18/fixtures.log, vitepress.log, koel.log (scripts fixtures.sh, vitepress.sh, koel.sh next to them).

## Why
The propose → adopt → check path from the README ends in a red yg check on a very common shape of frontend code (an import of CSS, an image or a script-less component across directories), with no warning in propose; the README (~306) says 'anything tracked is code'. The same blinds `grain check` at edit time on the first edge to such a directory. The error is loud and the user can add the relations by hand.

## Acceptance
- Every tracked file an import resolves to is a dependency target (has an owner in the relation index), even when Grain extracts nothing from it; a .vue component without <script> remains a target.
- The fixtures from the reproduction: Grain's edges equal the dependencies yg check reports (3 of 3 in TS, 2 of 2 in Vue); vitepress @56fa6c9d: after propose and adopt, yg check reports no relation-undeclared-dependency to src/client/theme-default/styles.

## Changelog
- Fixed: an import of a stylesheet, an image, a JSON file or a Vue component with no script now counts as a dependency, so a proposal you adopt no longer fails yg check on it, and grain check notices it while you edit.

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2189, pass 2188, fail 0, skipped 1, merge bf2a1d4

