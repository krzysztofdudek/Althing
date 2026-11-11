# 235 · Runes: an optional view of files from the commit tree instead of the disk for import resolution (D1 b, for Grain 099/106 and 010)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-hlzv
**Tags:** runes, grain, yggdrasil, partial
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Source:** decisions#patch-scope
**Where:**
**Branch:** jarl/550-typescript
**Merged:** b40a0253114f36a68e53143cf09ab98c446e2802 in ../../../Runes
**CI:** pending
**Worker:** w-550-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:37

## What
The Runes plan D1 (b) deferred to 1.1.0 an injected file view of the commit tree; today the resolver looks at the disk, and Grain (099/106) and Yggdrasil (004/010) work around it on their side.

## Why
The same commit can give different edges depending on files built locally.

## Acceptance
The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.

## Changelog
- Added: makeResolvePathToFile and buildCsharpProjectScopes take an optional file view (listedFileView over the paths and contents of one commit), so an untracked or ignored file on disk (a built dist/, a generated .svelte-kit/tsconfig.json, an installed package, a .csproj or pyproject.toml the commit does not hold) can no longer decide where an import lands; without a view the disk is read as before.

## Evidence


- **ran (history):** node --test test/relations/file-view.test.mjs on the release branch's tree, with the view stubbed (the option is ignored there) · **saw:** pass 0, fail 8 of the 8 resolver cases (dist/ followed, .svelte-kit/tsconfig.json read, unlisted pyproject.toml and .csproj read, symlink followed, absent root unresolved); on the branch tip: pass 14, fail 0. The reference runner now resolves all 522 cases on disk and through listedFileView over a project root that does not exist: identical edges. npm run check exit 0 (1765 tests, check:dist clean), npm run coverage exit 0 (all files 98.98 lines, 94.66 branches, 99.05 functions). No corpus run (C1 is not in this branch). No rev change, catalogue delta 0 (522).

docs: README.md: the behaviour paragraph on resolution reading the disk: say the files can come from a caller's view (FileView, listedFileView) and that unreadable configuration is reported through onDiagnostic

round 2 (commits 0b15083, 9a6fe51 on the branch): readJson no longer swallows a view's read exception (red: the new throwing-read test failed with 'expected the function to throw'; green: file-view tests 16 pass); real node:fs spy test added (mock.method on existsSync, readdirSync, readFileSync, statSync and others plus syncBuiltinESMExports; a control run without a view shows the spy sees the disk; zero calls with a view); docs/api.md says Python manifests are only listed, and names Y5 (Yggdrasil) and G9 (Grain) as the packages landing each consumer half after RF. 235 stays in progress until Y5 and G9 import the view. npm run check exit 0 (1769 tests, dist fresh), npm run coverage exit 0 (98.99 lines, 94.75 branches, 99.05 functions). docs: README.md paragraph on resolution now names FileView, listedFileView and onDiagnostic (done in the commit)
- **ran (history):** npm run check · **saw:** tests 1784, pass 1784, fail 0; dist/ is fresh, merge b40a025

2026-10-28 tidy-up: the worktree directory is gone; the Runes part of this issue is merged into release/1.1.0 (its branch has no commit beyond it); what remains is the part in Yggdrasil and Grain named in the acceptance; the lease ends and the issue returns to the queue

Checked on release/1.1.0 at a94d31b, nothing redone: the Runes half is already there (commit a358656 is an ancestor of the release branch). makeResolvePathToFile and buildCsharpProjectScopes take { files }, FileView and listedFileView are in docs/api.md, and test/relations/file-view.test.mjs holds 'gives the same edges whether dist/ is present on disk or not' and the disk-spy case; the three files printed tests 56, pass 56, fail 0. What the line still needs is outside Runes: Yggdrasil (Y5) and Grain (G9) passing a view.

Checked again on release/1.1.0 at e9509e1, nothing redone: commit a358656 is an ancestor of the release branch, docs/api.md lists FileView and listedFileView (The file view), and node --test test/relations/diagnostics.test.mjs test/relations/diagnostics-position.test.mjs test/relations/file-view.test.mjs printed tests 56, pass 56, fail 0 at 904913f. The Runes half is met; Yggdrasil (Y5) and Grain (G9) passing a view are outside Runes and remain.

