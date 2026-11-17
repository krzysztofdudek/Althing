# 739 · Runes, Python and PHP: a use that several roots or projects could answer is reported as absent, not as ambiguous with its candidates

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-qkhc
**Tags:** runes, python, php, api
**Files:** 
**Repo:** Runes
**Found by:** w-732-opus
**Where:** jarl/732-readers-for-a-new-tool at 899faf0: classifyUse on a Python module under two project roots, and a PHP class under two PSR-4 roots
**Branch:** jarl/758-python-go-roots
**Worker:** w-758-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 12:29

## What
After 732, an ambiguous answer names its candidate files in Java, Kotlin, C#, Go and for a symbol declared in several files. In Python a module found under more than one project root, and in PHP a class two PSR-4 prefixes could map, are still answered as absent, with no candidates.

Moved from issue 739 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A consumer cannot tell such a use from one that names no file, so it can neither judge the candidates nor stay quiet.

## Acceptance
[test] In Python and PHP, a use that two roots answer gives ambiguous with both files, sorted, in classifyUse, with one case each, and classify and every edge unchanged · by: npm run check

## Changelog
- in Python and PHP, a use that several roots answer, a module two source roots of the repository hold or a class two PSR-4 directories (or two composer.json files) map to files, is answered by `classifyUse` as `ambiguous` with those files, sorted, as Java, Kotlin, C# and Go already were; in 1.1.0 it was absent, unfollowed, with no candidates. `classify` and the edges do not change. This fixes the known limit of 1.1.0; on the corpus it names the five `airflow/__init__.py` files of airflow's distributions for `import airflow`.

## Evidence

### Proof

- **ran (line 3cd5b161c033):** node --test test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/extractors/php-name-resolution-matrix.test.mjs (tests of 739 over the dist of 9865bf0, before the change) · **saw:** red: python-module-under-two-roots-ambiguous-silence and php-psr4-two-roots-both-hit-ambiguous-silence answered ['absent unfollowed'] where ['ambiguous a/src/shared/util.py, b/src/shared/util.py'] and ['ambiguous lib/Pay/G.php, src/Pay/G.php'] were expected; the Python and PHP classifyUse unit tests got absent unfollowed
- **ran (line 3cd5b161c033):** npm run build; node --test test/relations/resolver.test.mjs test/relations/extractors/python-name-resolution-matrix.test.mjs test/relations/extractors/php-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/python-resolve.test.mjs test/relations/extractors/php-resolve.test.mjs test/relations/resolve-path.test.mjs test/exports.test.mjs (at e2f1347) · **saw:** green: pass 78, 35, 67, 3, 61, 37, 47, 18, fail 0; both languages ambiguous with both files sorted, classify absent and no edge as before
- **ran (line 3cd5b161c033):** systemd-run --user --scope -q -p MemoryMax=12G nice -n 15 timeout 1800 npm run check (at 95fa115, release/1.2.0 at 65848ce merged); npm run coverage · **saw:** check exit 0: tests 2792, pass 2789, fail 0, skipped 3 (go not installed, Rust toolchain absent); dist/ is fresh; coverage exit 0, all files 99.26% lines, 95.89% branches, 99.12% functions

### Notes

Corpus: npm run corpus:edges -- --only airflow,click,flask,poetry,google-cloud-python,Slim,gin with RUNES_CORPUS_DIR=~/Temp/runes-corpus-shared, before (fb89628) and after (95fa115): passed both times with identical edges (airflow 11615, click 341, flask 322, poetry 1514, google-cloud-python 623, Slim 382, gin 31; 0 added, 0 removed). classifyUse answers of the Python, PHP and Go uses, compared with a scratch harness: 480 relative names move from absent unfollowed to resolved (click 191, flask 159, google-cloud-python 130), each binding the file the module use on its line binds; 248 move from absent unfollowed to ambiguous (airflow 218: import airflow over the five airflow/__init__.py of its distributions; poetry 30); Slim and gin answers unchanged.

