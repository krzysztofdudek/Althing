# 071 · Progressive mode: a reviewer rule reference written as './docs/style.md' (accepted and hashed correctly) does not come into scope when that file changes, so stale verdicts pass without a reviewer call

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-aalc
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/core/progressive-scope.ts, Yggdrasil/source/cli/src/io/aspect-parser.ts, Yggdrasil/source/cli/src/utils/mapping-path.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/core/progressive-scope.ts:531 (computeBurnSet: `pushInto(aspectIdsByReferencePath, reference.path, aspect.id)` keys by the raw path), the lookup :589 `aspectIdsByReferencePath.get(file)` with the canonical path from git; io/aspect-parser.ts:258 does only `toPosixPath(rawPath.trim())` (utils/posix.ts:25), escapesRepo (utils/repo-path-escape.ts:24) accepts './', '//' and 'x/..'; the duplicate guard aspect-parser.ts:288 `seenPaths.has(normalized)`; the hash reads through `path.resolve(projectRoot, ref.path)` in core/verify-lock.ts:309, so it normalizes
**Branch:** jarl/005-progressive-scope
**Merged:** 7b3cdde70646e95de91d8e3687e373938bfd9627
**CI:** none

## What
Reproduction (a fresh clone at tag v6.1.0 e5441101 built with npm ci and tsup, a custom script and a custom fake Ollama that refuses when the prompt contains XFAILX): rule llm-rule on nodes alpha (src/a.ts) and beta (src/b.ts) with `references: [<spelling>]` and `progressive: { reference: main }`; on main `yg check --full --approve` (2 calls, both pass), fill committed; on branch feat one commit changes only docs/style.md (adds XFAILX; `git diff --name-only main...HEAD` shows only that file). With './docs/style.md': `yg check --approve` → 'fill 2 reviewer pairs outside this change left alone', 0 reviewer calls, PASS, exit 0, `warning[unverified-outside] 2 pairs whose inputs changed since the verdict — outside your changes` and '2 obligations outside your changes vs main (1 changed input)'; `yg check --no-approve` PASS; `yg check --full --no-approve` FAIL with error[unverified], so the hash tracks the reference and only the scope is wrong. Control with 'docs/style.md': 2 calls, both refuse ('found XFAILX'), FAIL with error[refused] on alpha and beta, exit 1, '0 obligations outside your changes'. 'docs//style.md' and 'docs/x/../style.md' behave like './docs/style.md'. Side probe: a list with 'docs/style.md' and './docs/style.md' does not give aspect-reference-duplicate (the same cause). Related: 019 (the same './' family, but in `mapping:`); utils/mapping-path.ts already has a normalizer to reuse. 007 mentions the reference index only as one of the routes a helper module does not go through. progressive-scope.ts and aspect-parser.ts unchanged v6.1.0 → main 2493aa16. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-40/logs/dot-slash.log, control <the session scratchpad, since lost>/bughunt/yggdrasil/verify-40/logs/canonical-control.log, variants <the session scratchpad, since lost>/bughunt/yggdrasil/verify-40/logs/variant-docs__style_md_.log and variant-docs_x____style_md_.log, duplicates <the session scratchpad, since lost>/bughunt/yggdrasil/verify-40/logs/dup-probe.log; script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-40/repro.sh <id> <spelling>; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-1/repro/prog-reference-spelling.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-1/repro/prog-reference-spelling.sh.

## Why
progressive-mode.md:174 (repeated at :83 and :210): 'Every use of a rule that lists a changed file in its `references:` is yours, everywhere in the repository'. The PR gate in progressive mode lets through a branch whose only change invalidates reviewer verdicts, and the metered fill re-checks nothing. The docs call a reference a repo-relative path, and './docs/style.md' is one. Stale pairs are visible as warnings, and `--full` and the full run after the merge catch them, so minor.

## Acceptance
Reference paths are normalized at parse time the way the hash resolves them (posix normalize, no leading './', no '//', inner '..' resolved), or a non-canonical spelling is refused with a named code; in the repro with './docs/style.md', 'docs//style.md' and 'docs/x/../style.md', `yg check --approve` on feat calls the reviewer for both pairs (FAIL with error[refused]), and a list with 'docs/style.md' and './docs/style.md' gives aspect-reference-duplicate.

## Changelog
- Fixed: A references: entry spelled ./docs/style.md, docs//style.md or docs/x/../style.md is read as docs/style.md, so in progressive mode a change to that file puts the rule's uses in scope, and two spellings of one file are reported as aspect-reference-duplicate. Verdicts of rules using such a spelling are filled again once.

## Evidence

- **ran (history):** git commit (merge of jarl/005-progressive-scope into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8102 pairs verified; [repo-check] All checks passed; [release/6.1.1 7b3cdde70] Merge jarl/005-progressive-scope

