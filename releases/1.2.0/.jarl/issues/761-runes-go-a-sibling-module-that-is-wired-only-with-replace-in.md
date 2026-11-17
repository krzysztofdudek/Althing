# 761 · Runes, Go: a sibling module that is wired only with replace in go.mod is answered outside although the repository holds it

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-ihba
**Tags:** api, go, runes
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-go-replace
**Where:** Runes/src/relations/resolve-path.mts:1258
**Branch:** jarl/758-python-go-roots
**Worker:** w-758-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:29

## What
Claim: At v1.1.0 an import path resolves against the module of the nearest go.mod and the use members of the nearest go.work; the replace directive is not read. With ui/go.mod replacing example.com/data with ../data and data/go.mod declaring that module, the import of example.com/data in ui is answered outside; with a go.work that lists both folders it resolves.

repros.sh go_replace: import "example.com/data" in ui/a.go printed {"kind":"absent","reason":"outside"}; go_work, the same tree with a go.work listing ./ui and ./data, printed resolved to data/d.go

Moved from issue 761 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A repository with several Go modules wired by replace and no go.work is not checked at all for the imports between them: they are answered outside, as if the module were downloaded. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Go, an import of a module that another go.mod of the repository declares, reached by a replace directive with a relative directory and no go.work, gives resolved to that module's package file in classifyUse, in a unit test and a catalogue case, red at v1.1.0 (outside) and green after; a replace to a module outside the repository stays outside, and every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Go, an import of a module that the importing file's `go.mod` replaces with a relative directory of the repository (`replace example.com/data => ../data`) whose own `go.mod` declares that module resolves to its package files, with no `go.work` needed, where 1.1.0 answered it `outside`; a replacement by another version, by a directory outside the repository or by one without such a `go.mod` stays `outside`. A consumer can see new edges, and new refusals, between modules a repository wires with `replace`.

## Evidence

### Proof

- **ran (line fef67b1594dd):** node --test test/relations/resolver.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs (tests of 761 over the dist of e2f1347, before the change) · **saw:** red: go-replace-sibling-module-edge 'expected edge ui/app/main.go:4->data not emitted (got none)'; the classifyUse test got absent outside for example.com/data under replace example.com/data => ../data
- **ran (line fef67b1594dd):** npm run build; node --test test/relations/resolver.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/go-resolve.test.mjs test/relations/resolve-path.test.mjs test/exports.test.mjs (at 13b2b61) · **saw:** green: pass 81, 22, 3, 32, 48, 18, fail 0; example.com/data resolved data/d.go, a replace to ../../far, to a version, to an absolute path, to a directory without go.mod or of another module stays absent outside
- **ran (line fef67b1594dd):** systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check (at 95fa115, release/1.2.0 at 65848ce merged); npm run coverage · **saw:** check exit 0: tests 2792, pass 2789, fail 0, skipped 3 (go not installed, Rust toolchain absent); dist/ is fresh; coverage exit 0, all files 99.26% lines, 95.89% branches, 99.12% functions

### Notes

Assumed: only the replace directives of the importing file's nearest go.mod are read (Go applies replace only in the main module, which that go.mod is when the file's package is built), and a directory replacement is taken only when its go.mod declares the replaced module, as the toolchain requires.

Corpus: npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python,Slim,gin with RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared, before (fb89628) and after (95fa115): passed both times with identical edges (airflow 11615, click 341, flask 322, poetry 1514, google-cloud-python 623, Slim 382, gin 31; 0 added, 0 removed). classifyUse answers of the Python, PHP and Go uses, compared with a scratch harness: 480 relative names move from absent unfollowed to resolved (click 191, flask 159, google-cloud-python 130), each binding the file the module use on its line binds; 248 move from absent unfollowed to ambiguous (airflow 218: import airflow over the five airflow/__init__.py of its distributions; poetry 30); Slim and gin answers unchanged.

