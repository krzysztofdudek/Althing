# 235 · Runes: an optional view of files from the commit tree instead of the disk for import resolution (D1 b, for Grain 099/106 and 010)

**Status:** open
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
**Branch:** jarl/530-runes-110
**Merged:** b40a0253114f36a68e53143cf09ab98c446e2802 in ../../../Runes
**CI:** pending
**After:** 530, 143

## What
The Runes plan D1 (b) deferred to 1.1.0 an injected file view of the commit tree; today the resolver looks at the disk, and Grain (099/106) and Yggdrasil (004/010) work around it on their side.

## Why
The same commit can give different edges depending on files built locally.

## Acceptance
The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.

## Changelog
- Added: makeResolvePathToFile and buildCsharpProjectScopes take an optional file view (listedFileView over the paths and contents of one commit), so an untracked or ignored file on disk (a built dist/, a generated .svelte-kit/tsconfig.json, an installed package, a .csproj or pyproject.toml the commit does not hold) can no longer decide where an import lands; without a view the disk is read as before.

## Reviews
- **approve** · by rev-550-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2010-flzy
  Minor (551): a type-only import whose with clause starts on the line after the specifier (import type { T } from 'lib' then with { 'resolution-mode': 'import' } on the next line) gives two readings of the line, one with the mode and one without, so the edge of the file's own format stays beside the right one; the compiler reads only the mode the attribute names · Minor (551): an attribute list of two entries (resolution-mode beside another key, or resolution-mode twice) is read by Runes as the mode, while the compiler 6.0.3 reports the list and resolves by the file (239 of 7648 rows of my own comparison); such a file does not compile, so a known limitation · Minor (570): under pnpm a package's import of its own name without exports is now silent too, which is right as Node reads it, and the changelog entry does not name it · Note (234, 235): this branch changes nothing for them; line 1 of each, quoted: 'makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.' and 'The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.' are met for the Runes half on release/1.1.0 at e9509e1 (diagnostics and file-view test files 36 of 36, docs/api.md names both), and the Yggdrasil and Grain halves are not in Runes and stay open, so neither issue closes on this approve · Verified: every new test red before its fix and green at 904913f (607: 6062 against 300 ms; 551: 2 fail; 570: 1 fail; 576: 3 fail; 550: 3 disagreements); npm run check tests 2544, pass 2543, fail 0, skipped 1, dist/ is fresh; the merge 1c9c23e: 900 case files, 900 runCase, the count 900, Rust rev 18, TypeScript rev 5, no conflict marker; 551 against the compiler in 34 more spellings over 13 module kinds and 27 defaulted settings: one-line, broken import list, broken attribute braces, trailing comma, mixed quotes, a comment before with, export type * as, an invalid value and the recovery path all agree; 570: of 47 layouts of my own only the undeclared ones changed against the release (a member declared in any of the four fields by workspace:, link: or a path, by a root declaration, under a nested package.json, through an alias, a subpath or tsconfig paths keeps its edge; a commented shamefully-hoist no longer counts as hoisting); 576: 36 rows of a built copy against the compiler (exports and main/module/types, .ts and .tsx sources, nodenext and two bundler settings, .ts, .mts and .cts importers): the compiler binds dist/<name>.d.mts or .d.cts where Runes binds src/<name>, and a .mts source, a committed dist file and noEmit read as described; 607: 135 malformed inputs read the same before and after; corpus over the shared cache: 33 repositories ok, 0 added, 0 removed, react 554 of 554 explained with honest reasons, koa 0 disagreements, strict fails only on the 5 Go and .NET oracles this machine lacks; no test, threshold or guard weakened; one test commit and one fix commit per issue · Tried against the pnpm rule: a commented setting, shamefully-hoist=false, pnpm named only in packageManager, a declaration in a package.json no workspace lists; none got an undeclared member bound or a declared one dropped

## Evidence


- **ran (history):** node --test test/relations/file-view.test.mjs on the release branch's tree, with the view stubbed (the option is ignored there) · **saw:** pass 0, fail 8 of the 8 resolver cases (dist/ followed, .svelte-kit/tsconfig.json read, unlisted pyproject.toml and .csproj read, symlink followed, absent root unresolved); on the branch tip: pass 14, fail 0. The reference runner now resolves all 522 cases on disk and through listedFileView over a project root that does not exist: identical edges. npm run check exit 0 (1765 tests, check:dist clean), npm run coverage exit 0 (all files 98.98 lines, 94.66 branches, 99.05 functions). No corpus run (C1 is not in this branch). No rev change, catalogue delta 0 (522).

docs: README.md: the behaviour paragraph on resolution reading the disk: say the files can come from a caller's view (FileView, listedFileView) and that unreadable configuration is reported through onDiagnostic

round 2 (commits 0b15083, 9a6fe51 on the branch): readJson no longer swallows a view's read exception (red: the new throwing-read test failed with 'expected the function to throw'; green: file-view tests 16 pass); real node:fs spy test added (mock.method on existsSync, readdirSync, readFileSync, statSync and others plus syncBuiltinESMExports; a control run without a view shows the spy sees the disk; zero calls with a view); docs/api.md says Python manifests are only listed, and names Y5 (Yggdrasil) and G9 (Grain) as the packages landing each consumer half after RF. 235 stays in progress until Y5 and G9 import the view. npm run check exit 0 (1769 tests, dist fresh), npm run coverage exit 0 (98.99 lines, 94.75 branches, 99.05 functions). docs: README.md paragraph on resolution now names FileView, listedFileView and onDiagnostic (done in the commit)
- **ran (history):** npm run check · **saw:** tests 1784, pass 1784, fail 0; dist/ is fresh, merge b40a025

2026-10-28 tidy-up: the worktree directory is gone; the Runes part of this issue is merged into release/1.1.0 (its branch has no commit beyond it); what remains is the part in Yggdrasil and Grain named in the acceptance; the lease ends and the issue returns to the queue

Checked on release/1.1.0 at a94d31b, nothing redone: the Runes half is already there (commit a358656 is an ancestor of the release branch). makeResolvePathToFile and buildCsharpProjectScopes take { files }, FileView and listedFileView are in docs/api.md, and test/relations/file-view.test.mjs holds 'gives the same edges whether dist/ is present on disk or not' and the disk-spy case; the three files printed tests 56, pass 56, fail 0. What the line still needs is outside Runes: Yggdrasil (Y5) and Grain (G9) passing a view.

Checked again on release/1.1.0 at e9509e1, nothing redone: commit a358656 is an ancestor of the release branch, docs/api.md lists FileView and listedFileView (The file view), and node --test test/relations/diagnostics.test.mjs test/relations/diagnostics-position.test.mjs test/relations/file-view.test.mjs printed tests 56, pass 56, fail 0 at 904913f. The Runes half is met; Yggdrasil (Y5) and Grain (G9) passing a view are outside Runes and remain.

