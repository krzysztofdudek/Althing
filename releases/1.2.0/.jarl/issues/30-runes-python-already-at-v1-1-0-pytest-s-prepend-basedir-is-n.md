# 30 · Runes Python, already at v1.1.0: pytest's prepend basedir is not read as a root below a flat projec…

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1533-crox
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-13-opus
**Where:** the review of 13, 14, 15, 16, 17, 18
**Branch:** jarl/13-python-go-roots-2
**Merged:** 2569da2 in Runes
**Merge check:** npm run check · saw tests 2856, pass 2853, fail 0, skipped 3; dist/ is fresh.

## What
Runes Python, already at v1.1.0: pytest's prepend basedir is not read as a root below a flat project's root: a workspace member's tests/ with no __init__.py whose subdirectories are packages (m/tests/unit/test_a.py with m/tests/unit/__init__.py: from helpers import make, m/tests/helpers.py) answers absent outside at v1.1.0 and on the 1.2.0 branch of 13 to 18, though pytest inserts m/tests; a gap v1.1.0 had, so the next Runes version under runes-1-2-0-cut-for-new-findings, unless the fix of the basedir regression found in the review of 16 covers it

## Why


## Acceptance


[test] In a flat project (no src/ or configured root), a test module or conftest.py below a directory without __init__.py has pytest's basedir as a root (m/tests/unit/test_a.py: from helpers import make resolves to m/tests/helpers.py), in a unit test, red at v1.1.0 and green after · by: npm run check

## Reviews
- **approve** · by rev-13-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1615-xynt
  Round 2 at 699a7fa: both Important findings of round 1 are met. Every line re-run on fresh clones: each test commit red for the right reason (2ad13f8, c567079, 860aca3, 09a565c, 51c4867, 0307966, 9a7e593, 70270a0, b6d3076), the tip's tests over 62092b8's dist fail exactly the 8 new ones, npm run check green (2856 tests, 2853 pass, 0 fail, 3 skipped), corpus:edges passes on nine repositories with flask back at 322 and corpus/ identical to 3e125cb, the oracles report 0 disagreements, and my classifyUse diff matches the worker's (62092b8 to tip: flask's 4 blueprintapp uses resolve again, nothing else). Hatch now follows hatchling: the wheel target's sources alone whenever it sets them, refused or empty included, in the reader and in the oracle; the false edge src/pkg/x.py to lib/yaml.py is gone. 30's line holds: red at v1.1.0, 3e125cb and 62092b8, green at the tip. The self-import root: it is taken only where the directory above the package lies below no source root, the very condition under which 1.1.0 (and 3e125cb) took every ancestor as a root, and never for a standard-library name, so it binds a subset of what 1.1.0 bound and adds no edge 1.1.0 did not give: a package named like an installed one (tests/yaml/) and one below a namespace prefix (tools/ns/requests/) answer exactly as at 3e125cb, and the S5 tree (myext in docs/_ext and in src/) is split again where 62092b8 bound src/myext/util.py falsely. Its one false edge in theory, a package reached under a namespace prefix whose absolute self-imports mean an installed distribution of its name, is 1.1.0's own answer and code that works only by accident; no finding. Minor (16, with 15): the basedir is taken only for pytest's default names, so where the basedir holds no conftest.py, beside src/ or a configured root, three shapes 1.1.0 bound answer outside: a module of the test package that is not a test module (tests/unit/factories.py: from helpers import make; its from unit.common import c is kept by the self-import root), a module beside a test module in a namespace directory below src/ (src/app_tests/helpers.py: import util2), and a test module under a configured python_files name (tests/unit/check_a.py); none occurs in the corpus, a tests/conftest.py (the common layout) makes each resolve, and docs/api.md does not name the limit. A regression against v1.1.0 that narrow I rank Minor rather than hold the lease: the final pass should state it in docs/api.md, or take the basedir for every module of a package or namespace directory that holds a pytest test module or conftest.py. Minor (30): issue 30 holds no row by the lease's holder, and no commit names it (its test and fix ride in 9a7e593 and b195afe, whose subjects name 16 only); its changelog is 16's sentence on the flat project. Conventions hold: a test commit then a fix commit per issue, dist rebuilt with src, catalogue 1020, the corrected Hatch assertions assert hatchling's reading (not a weakening), no trailer naming an agent.

## Evidence

### Proof

- **ran (line 7c0fe57c4abe):** on fresh scratch clones: at 9a7e593 node --test test/relations/resolve-path.test.mjs (with the matrix and catalogue suites); at 699a7fa npm run check; makeResolvePathToFile of v1.1.0, 3e125cb, 62092b8 and 699a7fa over the unit test's tree (m/pyproject.toml flat, m/tests/helpers.py, m/tests/unit/__init__.py, m/tests/unit/test_a.py: from helpers import make) and over a flat root project and a root workspace with a src member · **saw:** red at 9a7e593: the unit test 'a pytest basedir is a root below a flat project too' expected undefined to be m/tests/helpers.py; v1.1.0, 3e125cb and 62092b8 answer absent outside, 699a7fa resolves m/tests/helpers.py, also from a conftest.py and in the two other flat layouts; green at 699a7fa: npm run check tests 2856, pass 2853, fail 0, skipped 3 (go list, the two Rust build tests), dist fresh, the unit test passes
- **ran (line 7c0fe57c4abe):** node --test --test-name-pattern='a pytest basedir is a root below a flat project too' test/relations/resolve-path.test.mjs (the tests of 699a7fa over the dist of 62092b8, in a scratch copy) · **saw:** red: tests 1, pass 0, fail 1; 'expected undefined to be m/tests/helpers.py' for from helpers import make in m/tests/unit/test_a.py
- **ran (line 7c0fe57c4abe):** node --test --test-name-pattern='a pytest basedir is a root below a flat project too' test/relations/resolve-path.test.mjs (at 699a7fa, its own dist) · **saw:** green: tests 1, pass 1, fail 0; helpers from m/tests/unit/test_a.py resolves to m/tests/helpers.py through pytest's basedir m/tests

### Notes

Deferred: To the next Runes version: a gap v1.1.0 already had (ruling runes-1-2-0-cut-for-new-findings); the pytest rule 16's round adds may cover it, and its worker says so if it does

The test and the fix of 30 ride in the commits of 16: the unit test 'a pytest basedir is a root below a flat project too' in 9a7e593 (red), the basedir rule in b195afe (green).

