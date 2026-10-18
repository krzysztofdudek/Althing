# Family release 6.1.0 dry run

Read-only audit, 2026-09-25. It merges three audit angles (core publish, add-ons and canon, procedure) and re-checks their main claims against the remotes at the time of writing. Since the angles ran, issue 231 has merged into Yggdrasil `release/6.1.0` (`7fd6662`). That branch is now 108 commits ahead of `main`, and its CI run `36180277197` was still in progress.

## 1. Verdict

**The release cannot run today.** Two things block it outright, and several more would make the release come out wrong.

**Hard blockers:**
- **Horde CI is red on the tip of `release/6.1.0` (`dc0de48`).** Run `36177878988` fails at `skills/horde/scripts/tests/law-audit.test.mjs:241`, asserting the old Yggdrasil wording (`/Node 'billing' is changing but has no rule covering it/`). Issue 177 changed that wording in Yggdrasil. Horde's `release.yml` fires on `push: main` without waiting for CI, so a fast-forward today would tag and release v6.1.0 from a red `main`.
- **The 073 work for the profile and the website exists only as uncommitted working-tree changes.** `<worktrees>/profile-073` has `M README.md`, and the website's worktree (the website's repository, private) has two modified files. In both, `jarl/073-family-canon` points at the same commit as `origin/main` (`fc09e92` and `c8d6cdb`). The 022 step "branch → main + push" would publish nothing.

**Before any bump or merge, do this first:**
1. Fix Horde's law-audit test and get Horde CI green. Re-run Horde and Grain CI after every Yggdrasil push, including the 231 merge that just landed.
2. Commit the 073 work in both worktrees.
3. Resolve 097 (Grain number and `ENGINE_VERSION`) and get the add-on numbers from Krzysztof, including Jarl's.
4. Add the SemVer note to the Horde and Grain CHANGELOGs, and fix the "adheres to Semantic Versioning" header in all three core CHANGELOGs.
5. Commit the loop's state: 38 uncommitted paths in the 6.1.0 loop's record, including issues 197–231.

## 2. Ordered release checklist per repository

### Phase A: preconditions (all repos, before Krzysztof's go)
1. **Horde:** fix `law-audit.test.mjs` for the post-177 wording. Get green CI on the exact SHA.
2. **Yggdrasil:** confirm run `36180277197` (231 merge, `7fd6662`) is green. Then re-run Horde and Grain CI against that Yggdrasil.
3. **The loop's repository:** commit `issues/197…231`, `decisions.md`, `log.md` and `022`. Set `003` to `deferred`. Rewrite 022's acceptance so that 021, 073, 097 and 100 close together with 022. Add Jarl to 022's bump list.
4. **Krzysztof decides:** the Grain number and the `ENGINE_VERSION` policy (097), and the number for each add-on (Ratatoskr, Urd, Researcher, Jarl).
5. **The website and the profile:** commit the 073 changes on `jarl/073-family-canon` in the website's worktree and in `<worktrees>/profile-073`.
6. **Yggdrasil:** fix the canon drift at `README.md:227` on `release/6.1.0`, which 177 introduced after 073 closed. Re-run `family-sync-check`.

### Phase B: bump commits on `release/6.1.0`, one per repo, with green CI on that exact SHA
7. **Yggdrasil:** run `npm version 6.1.0 --no-git-tag-version` in `source/cli` (it is still `6.0.0`). Rename `## [Unreleased]` (CHANGELOG.md:8) to `## [6.1.0] - <date>`. Change the header at CHANGELOG.md:6. Check the digest labels (`cli=6.0.0`), which needed a follow-up commit at 6.0.0.
8. **Horde:** rename `## [Unreleased]` to `## [6.1.0] - <date>`. Bump all five manifests: `.claude-plugin/plugin.json:3`, `.codex-plugin/plugin.json:3`, `.cursor-plugin/plugin.json:4`, `.github/plugin/marketplace.json:11` and the root `plugin.json:4`, which the CLAUDE.md recipe omits. Satisfy `docs.test.mjs`, which after the rename requires "Yggdrasil 6.0.0 or newer" in that section. Keep promises at 6.1.0 (`yg-package.yaml:14`, `yg-marketplace.yaml:15` already match).
9. **Grain:** apply the 097 outcome to `.github/plugin/marketplace.json:15`, `plugins/grain/.{claude,codex,cursor}-plugin/plugin.json:3` and `plugins/grain/engine/config.mjs:6` (`ENGINE_VERSION`). Update the docs-audit test expectations if `ENGINE_VERSION` moves, and note that changing it invalidates adopter caches. Also rename `## [Unreleased]` to the chosen version and update the prose at `README.md:405-408`.
10. **Ratatoskr, Urd, Researcher, Jarl:** rename the CHANGELOG heading to the decided number, bump all five manifests (Jarl's root `plugin.json` too) and update the compare links. Jarl has 30 commits since v0.1.0, Ratatoskr 6 since v0.7.0, Urd 12 since v0.2.0 and Researcher 11 since v1.7.0.

### Phase C: fast-forward to `main` (no squash; rulesets allow only squash or rebase via PR)
11. **Yggdrasil:** `git push origin <sha>:main` with admin bypass. Do not merge dependabot PRs #96 or #97 until phase D is done.
12. **Horde:** push immediately after Yggdrasil, because Horde's `main` CI builds Yggdrasil from Yggdrasil `main`.
13. **Grain:** push next, for the same reason.
14. **Add-ons:** push the four repos.

### Phase D: post-merge verification
15. **Yggdrasil:** confirm a Tag Release run started. If the paths filter missed it (the fast-forward carries about 1391 files, and GitHub evaluates only the first 300), run `gh workflow run` for Tag Release. Then check that `npm view @chrisdudek/yg dist-tags` shows `latest: 6.1.0`, that GitHub release v6.1.0 exists, and that Docs ran (dispatch it if not).
16. **Horde:** confirm tag v6.1.0 and `pack/promises@6.1.0` exist, both created by the workflow, never by hand. Run `yg pack add …Horde#promises` against npm 6.1.0.
17. **Grain:** confirm tag v6.1.0. Re-run Grain and Horde CI on `main`.
18. **Add-ons:** confirm each tag and GitHub release exists. Do not trust a green run, because the workflow succeeds silently without releasing when the heading was not bumped.
19. **The profile and the website:** push 073 to `main`. Run `gh repo edit` for the description and topics of JarlSkill (it has none) and the profile (its description has no Jarl).

### Phase E: cleanup
20. Delete the remote `release/6.1.0` branches only after every `main` is green.
21. Switch checkouts to `main` and `fetch --prune`. Remove Yggdrasil worktrees only from the container. Delete leftover worker branches and worktrees in `<worktrees>/`.
22. Grain archive refs: decide, then file a GitHub Support request (021).
23. **The loop's repository:** run `family-sync-check`, `yg check` and commit the loop. Run `close` only from JarlSkill at the released version: `close` in plugin 0.1.0 or on JarlSkill `main` deletes the loop directory. Update the plugins and the skill.

## 3. Gaps

| id | severity | repo | title | where | fix |
|---|---|---|---|---|---|
| G1 | blocker | Horde | CI red on the tip of `release/6.1.0`; a test still asserts pre-177 Yggdrasil wording | `skills/horde/scripts/tests/law-audit.test.mjs:217,241`; run `36177878988` (`dc0de48`) | Update the assertion to the new wording, then get green CI on that SHA |
| G2 | blocker | Horde | `release.yml` tags and releases on `push: main` without waiting for CI | `.github/workflows/release.yml:3-6` | Gate on CI (`workflow_run` on success, as Yggdrasil does) or verify green by hand before the fast-forward |
| G3 | blocker | profile, website | 073 work never committed; the branch equals `origin/main` | `<worktrees>/profile-073` (`M README.md`), the website's worktree (two modified files) | Commit on `jarl/073-family-canon` before 022 runs |
| G4 | high | Grain | Version undecided: six places still say 0.4.0; 097 is open | `plugins/grain/engine/config.mjs:6`, three `plugin.json:3` files, `.github/plugin/marketplace.json:15` | Decide 097 (number and `ENGINE_VERSION`), then bump everywhere and fix the docs-audit test |
| G5 | high | Horde, Grain | SemVer note missing; the header still claims SemVer | `Horde/CHANGELOG.md:6`, `Grain/CHANGELOG.md:6` (Yggdrasil has the note at `CHANGELOG.md:12` and `docs/family-contracts.md:55`) | Add the note to both. Horde 6.1.0 also removes features |
| G6 | high | Yggdrasil | The CHANGELOG header contradicts the new note | `CHANGELOG.md:6` ("adheres to Semantic Versioning") vs `:12` | Reword the header to the family-number policy |
| G7 | high | Horde | The bump recipe omits the root manifest | Horde `CLAUDE.md` bump recipe; `plugin.json:4` is still `6.0.0` | Add the root `plugin.json` to the recipe and bump all five |
| G8 | high | Horde | `docs.test.mjs` fails after the `[Unreleased]` → `[6.1.0]` rename | `docs.test.mjs` expects "Yggdrasil 6.0.0 or newer" in that section | Add the phrase (or the correct floor) to the 6.1.0 section before the bump commit |
| G9 | high | procedure | The skill re-runs only Grain CI after a Yggdrasil push, not Horde (the root cause of G1) | `.claude/skills/releasing-the-family/SKILL.md` | Re-run both Horde and Grain CI after every Yggdrasil push |
| G10 | high | Yggdrasil | A fast-forward of about 1391 files may not trigger Tag Release, because the paths filter sees only the first 300 files | Tag Release workflow `paths:` filter | Check `gh run list` after the push; if missing, run `gh workflow run` for Tag Release |
| G11 | medium | Yggdrasil | Canon drift introduced by 177 after 073 closed | `README.md:227` on `release/6.1.0` (was line 192 on `main`, in canon) | Re-sync with the canon and re-run `family-sync-check` |
| G12 | medium | Jarl | Unreleased work under a tagged number, not covered by 100 or 022 | 30 commits after v0.1.0; the `[0.1.0]` CHANGELOG section describes features that are not in the tag | Add Jarl to 100 and 022, and get its number |
| G13 | medium | add-ons | `release.yml` succeeds with no release when the heading is not bumped, and tags without checking manifest lockstep | all four add-on repos; Ratatoskr, Urd and Researcher have no CI | Verify tags and releases exist after the push; add a lockstep check later |
| G14 | medium | loop record | Loop state uncommitted | 38 paths in the 6.1.0 loop's record (issues 197–231, `decisions.md`, `log.md`, `022`) | Commit before the release |
| G15 | medium | loop record, Jarl | `close` from the installed Jarl 0.1.0 or JarlSkill `main` deletes the loop directory, but the loop must stay as the release record | Jarl `close` | Run `close` only from JarlSkill at the release version |
| G16 | medium | Yggdrasil, Horde | `main` rulesets allow only squash or rebase via PR, which breaks fast-forward | branch rulesets | Push the SHA to `main` with admin bypass (`git push origin <sha>:main`) |
| G17 | medium | Yggdrasil, Horde, Grain | Merge order matters: Horde and Grain CI on `main` build Yggdrasil from its `main` | Horde and Grain CI workflows | Merge in order Yggdrasil → Horde → Grain. No dependabot #96 or #97 in between |
| G18 | low | loop | 022's gate blocks itself; 003 is still open | issue 022 (the release issue), issue 003 | Set 003 to deferred; let 021, 073, 097 and 100 close together with 022 |
| G19 | low | Yggdrasil | Digest labels say `cli=6.0.0`; at 6.0.0 this needed a follow-up commit | digest generator output | Regenerate with the bump commit |
| G20 | low | skill, Horde | Out-of-date description of the promises version | `SKILL.md`, Horde `CLAUDE.md` | Say promises = 6.1.0 with tag `pack/promises@6.1.0` |
| G21 | low | Yggdrasil | `release.yml` has no concurrency group; grammars get a cold build after the tag | `.github/workflows/release.yml` | Add concurrency; expect a slow first run |
| G22 | low | JarlSkill, profile | No GitHub description or topics for JarlSkill; the profile description has no Jarl | `gh repo view` | `gh repo edit` in phase D (already planned in 022) |
| G23 | low | add-ons, Jarl | Jarl's CLAUDE.md bump recipe omits the root `plugin.json`; CHANGELOG compare links use old repo names | Jarl `CLAUDE.md`, add-on CHANGELOG link footers | Fix during the bump commits |
| G24 | low | all | Leftover worker branches and worktrees | `<worktrees>/` (Grain-223/229/230, Horde-190/212/221/224, red-052, …) | Clean up in phase E |

## 4. What is ready

- All seven core and add-on repos: `main` is an ancestor of `release/6.1.0`, so a fast-forward is possible. Yggdrasil, Grain and Horde `main` are 0 commits ahead (Yggdrasil +108, Grain +56, Horde +555 on release).
- npm has only `@chrisdudek/yg` 6.0.0, and the remotes have no `pack/*` tag, so nothing collides.
- `@6.1.0` is already pinned in README, getting-started, progressive-mode and the-lock.
- Horde promises is 6.1.0 and consistent in `yg-package.yaml:14` and `yg-marketplace.yaml:15`.
- Yggdrasil has the SemVer note, with the reasoning, at `CHANGELOG.md:12` and `docs/family-contracts.md:55` (231, merged in `7fd6662`).
- CI is green on `release/6.1.0` for Grain (`ee36c9f`, run `36173740157`), Jarl and Yggdrasil up to the 230 merge. The 231 run was still in progress.
- On `release/6.1.0`, the family sections in Ratatoskr, Urd, Researcher, Jarl, Grain and Horde match the canon byte for byte. No retired phrasing remains ("one door", "three add-ons", steward, Agent Teams).
- GitHub descriptions and topics for Yggdrasil, Grain, Horde, Ratatoskr, Urd and Researcher match `family.md`. Each add-on's manifests agree with each other.
- The Yggdrasil Release workflow chains correctly on a successful Tag Release, with `workflow_dispatch` as a fallback.
- All local `jarl/*` branches in the core repos are merged.
