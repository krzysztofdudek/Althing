# 13 · Runes Go, already at v1.1.0: a go.work use ./ (the repository root written with a trailing slash) k…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1317-edwx
**Tags:** go, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-758-opus
**Where:** the review of 739, 757, 758, 761
**Branch:** jarl/13-python-go-roots-2
**Worker:** w-13-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes Go, already at v1.1.0: a go.work use ./ (the repository root written with a trailing slash) keys the root module as ./ beside the empty directory the ancestor walk holds, so an import of the root module from a member nested below it is answered absent unfollowed with no edge, where use . resolves it.

## Why


A lost true edge, or a false one, misleads every consumer that checks dependencies with the readers.

## Acceptance


[test] A go.work use ./ (and ./ written in any equivalent spelling) keys the root module as use . does, so an import of the root module from a member nested below it resolves as with use .; a case and a unit test, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Go, a `go.work` that writes the repository root with a trailing slash (`use ./`, or `./tools/` for a member) names the same module as `use .`, so an import of the root module from a member nested below it resolves to its package files, where 1.1.0 answered it `unfollowed` with no edge. A consumer can see new edges, and new refusals, between such a member and the root module.

## Reviews
- **changes** · by rev-13-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1533-thfl
  Important (16, with 15): beyond the two answers line 16 names, true edges v1.1.0 bound now answer absent outside, against 'every other answer stays as it is' and under runes-1-2-0-cut-for-new-findings (a regression against v1.1.0, and a false answer): (a) a package importing itself by its absolute name from a directory beside src/ or a configured root, flask tests/test_apps/blueprintapp/__init__.py:5 and :6 and, in an invented tree, docs/_ext/myext/__init__.py importing myext.util; inside package P an import of P.x binds through P's own __path__ whenever the file runs as P at all, so outside is false, not only a lost edge; (b) pytest's prepend basedir of a test module inside packages where that directory is neither a project's directory nor holds conftest.py: beside src/ or lib/, tests/unit/test_a.py with tests/unit/__init__.py and no tests/__init__.py resolves from helpers import make and from unit.common import c at 3e125cb and answers outside at the tip, though pytest inserts tests/, the very rule the change cites for tests.helpers; (c) the same for a test module in a namespace directory below src/ (src/app_tests/test_x.py: import helpers), through 15's own-directory rule. So the flask cost is not acceptable as documented: keep the 322-edge golden and drop the explained entry. The worker's suggested inference (a package that imports itself by absolute name makes the parent of its top-most regular package a root for that import) is sound and narrow and covers (a); (b) and (c) need pytest's own basedir for a test module or conftest.py (the first directory upward without __init__.py), with a case each, red before and green after. Important (17 and 18): Hatch sources is read from [tool.hatch.build] and [tool.hatch.build.targets.wheel] together and the roots are joined, while hatchling's BuilderConfig.sources reads the wheel target's sources alone whenever the target sets them; with build sources [lib] and wheel sources [src], lib/ becomes a root and import yaml in src/pkg/x.py binds lib/yaml.py at the tip (outside at 3e125cb), a false edge from code this release adds, and a refused wheel mapping or wheel sources = [] still lets the build-level root count; the unit test asserts that misread (expects [a] for build [a] with wheel {b = '', c = x}), and the Python oracle of 18 joins the two keys the same way, so it would not report the false edge; read the wheel table's sources alone when it sets them, refusing when it refuses, in the reader and in the oracle, with a case. Minor (16): the changelog and docs/api.md name the lost flask edges but not the classifyUse moves of other answers: a top-level name only a directory inside a project holds now answers outside (flask import celery in examples/celery/src, 10 uses, from unfollowed), and one a member's directory holds answers unfollowed (airflow docs.* in */docs/conf.py, 38 uses, from outside). Minor (14): the rule by directory name takes a real project of the repository under a directory named tests, test or fixtures for a fixture (a uv workspace member at test/: import testkit from app/ bound test/src/testkit/__init__.py at 3e125cb and answers outside at the tip); it is the line's own definition, so state it as a limit in docs/api.md or exempt a project the root workspace lists as a member. What holds: every line re-run on scratch clones of the tip 62092b8 and of each test commit (2ad13f8, c567079, 860aca3, 09a565c, 51c4867, 0307966), each red for the right reason; npm run check green at the tip (2834 tests, 2831 pass, 0 fail, 3 skipped: go list and the two Rust build tests); corpus:edges and corpus:oracles over click, flask, poetry, airflow, google-cloud-python as the worker saw, gin, sh, shaka-player and vitepress unchanged; my own classifyUse tally 3e125cb against the tip matches the worker's moves (poetry 31, flask 14, airflow 38, others 0). 13 and 14 hold as written. 15: the worker's narrow reading of a discovered root (one that is not its project's own directory) is right, since reading every root would take the importing directory from every flat-layout script folder against 'every other answer stays as it is'. Conventions hold: a test commit and a fix commit per issue, dist rebuilt with src, catalogue 1016 in its three places, no extractor rev needed (no uses() output moved), no trailer naming an agent, no test weakened but the flask golden named above.
  outside the issue, filed as 30: Runes Python, already at v1.1.0: pytest's prepend basedir is not read as a root below a flat project's root: a workspace member's tests/ with no __init__.py whose subdirectories are packages (m/tests/unit/test_a.py with m/tests/unit/__init__.py: from helpers import make, m/tests/helpers.py) answers absent outside at v1.1.0 and on the 1.2.0 branch of 13 to 18, though pytest inserts m/tests; a gap v1.1.0 had, so the next Runes version under runes-1-2-0-cut-for-new-findings, unless the fix of the basedir regression found in the review of 16 covers it

## Evidence

### Proof

- **ran (line 40671d4c3e51):** npm run build; node --test test/relations/extractors/go-resolve.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at 2ad13f8, the tests before the fix) · **saw:** red: go-work-use-root-trailing-slash-edge 'expected edge tools/gen/gen.go:3->lib not emitted (got none)'; the unit test 'a use ./ member, in every spelling of the repository root' expected undefined to be lib/l.go
- **ran (line 40671d4c3e51):** npm run build; node --test test/relations/extractors/go-resolve.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/resolve-path.test.mjs (at 83d11ce) · **saw:** green: tests 109, pass 109, fail 0; use ., ./, .//, "./", ././, tools/../ and ./tools/.. all resolve example.com/root/lib from tools/gen to lib/l.go
- **ran (line 40671d4c3e51):** on scratch clones of Runes (git clone, not archive): at 2ad13f8 npm ci; npm run build; npm run grammars; node --test test/relations/extractors/go-resolve.test.mjs test/relations/extractors/go-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs; at the tip 62092b8 npm run check; RUNES_CORPUS_DIR=<shared corpus> npm run corpus:edges -- --only gin,sh,shaka-player,vitepress · **saw:** red at 2ad13f8: tests 60, pass 58, fail 2: go-work-use-root-trailing-slash-edge 'expected edge tools/gen/gen.go:3->lib not emitted (got none)' and the unit test 'a use ./ member, in every spelling of the repository root' 'expected undefined to be lib/l.go'; green at 62092b8: npm run check tests 2834, pass 2831, fail 0, skipped 3 (the go list oracle and the two Rust build tests, no Rust case touched), dist fresh, both tests pass; corpus gin 31, sh 69, shaka-player 10, vitepress 554 edges, 0 added, 0 removed

