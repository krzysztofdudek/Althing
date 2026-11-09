# 034 · yg adopt --dry-run says 'would accept' for a proposal that the real yg adopt refuses: no check deferred until the graph is in place runs in the preview

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261002T0737-lmti
**Tags:** bug-hunt, grain, yggdrasil
**Files:** Yggdrasil/source/cli/src/cli/adopt.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/cli/adopt.ts (v6.1.0): DEFERRED_UNTIL_IN_PLACE :62-77, the preflight filter :232-235, the `if (dryRun)` branch :264-281 ends with exit 0 before the in-place `validate(graph, 'all')` :302; in npm 6.1.0 dist/bin.js: 26043 (the set), 26176 (the filter), 26197 (the dryRun branch), 26231 (the in-place validate)
**Branch:** jarl/002-adopt
**Merged:** aa73c10ef2b19f5fe1634c9bd1f5a74841433109
**CI:** none

## What
The preview `yg adopt <proposal> --dry-run` filters out every code in DEFERRED_UNTIL_IN_PLACE (mapping-path-missing, mapping-path-case-mismatch, file-mapping-gitignored, file-mapping-excluded, file-duplicate-mapping, overlapping-mapping, type-when-mismatch, type-strict-* and others), prints 'yg adopt: would accept … Nothing was written. Re-run without --dry-run to accept.' and ends with exit 0. Those codes are checked only by `validate` after the graph is moved into place, that is, only by the real adopt; the comment at :57 says 'DEFERRED, never skipped', and the dry-run skips them. Reproduction without Grain (yg 6.1.0 from npm): a repo without CLAUDE.md, a proposal mapping CLAUDE.md; `yg adopt .yggdrasil-proposal --dry-run` → 'would accept', exit 0; `yg adopt .yggdrasil-proposal` → exit 1, mapping-path-missing. With Grain 6.1.0: (1) a synthetic TS repo with a committed symlink CLAUDE.md -> AGENTS.md: dry-run 'would accept', the real adopt exit 1 with `file-mapping-gitignored repo-root File 'CLAUDE.md' … excluded by .gitignore`; (2) BurntSushi/ripgrep @3fce3b5: dry-run 'would accept', the real adopt exit 1 with `type-when-mismatch repo-root File 'HomebrewFormula/ripgrep-bin.rb' … does not satisfy 'repo-root-file'.when`; (3) a repo in the Next.js layout with an app/[locale]/ directory: dry-run 'would accept', the real adopt refuses with 20× type-when-mismatch. Each time the real adopt rolls back cleanly. Grain prints this preview word for word as its own, and Grain's 6.1.1 fix (propose ends with exit 1 when the preview refuses; grain-export.mjs:151-157 on release/6.1.1) relies on it, so it catches none of these cases. The wrong message 'excluded by .gitignore' for a symlink is covered by issue 022; the causes on Grain's side are issues 035 (symlinks in the mapping) and 060 (unescaped brackets in `when`). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-10/05-mapping-path-missing.log, 02-tsrepo-dryrun-vs-adopt.log, 04-ripgrep-dryrun-vs-adopt.log, 01-tsrepo-propose.log, 03-ripgrep-propose.log; <the session scratchpad, since lost>/bughunt/grain/verify-28/V-bracket-dir-glob.log.

## Why
The help says '--dry-run  Report everything the acceptance would do and change nothing', docs/cli-reference.md: '`--dry-run` answers all of the above' (including problems visible only with the graph in place), and the adopt node (.yggdrasil/model/cli/commands/adopt/yg-node.yaml:27) '--dry-run answers all of it'. A preview that says 'would accept' about a proposal that is refused lies to the user and to every tool built on it: Grain 6.1.1 promises in its CHANGELOG 'every proposal Grain writes is one Yggdrasil can accept' and ends with an error only when the preview refuses.

## Acceptance
- `yg adopt <proposal> --dry-run` runs the checks in DEFERRED_UNTIL_IN_PLACE against the repository root without copying anything and refuses (exit 1, the same codes as the real adopt) in three reproductions: a missing file in the mapping (mapping-path-missing), a CLAUDE.md symlink in the mapping, ripgrep @3fce3b5.
- Test: for every proposal in the adopt tests, the result of `--dry-run` (acceptance or refusal, and the codes) equals the result of the real adopt.

## Changelog
- Fixed: `yg adopt --dry-run` refuses every proposal `yg adopt` would refuse — a mapped file that is missing, ignored or a symbolic link, or a file its type's `when` does not match — with the same problems and exit 1, before anything is moved.

## Evidence

jarl: when packages 004 and 002 are merged, the file-mapping-symlink code from 022 must go into DEFERRED_UNTIL_IN_PLACE, otherwise the symlink parity test from 034 fails — for the merger to check after both merges
- **ran (history):** git commit (merge of jarl/002-adopt into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8035 pairs verified; [repo-check] All checks passed; [release/6.1.1 aa73c10ef] Merge jarl/002-adopt

