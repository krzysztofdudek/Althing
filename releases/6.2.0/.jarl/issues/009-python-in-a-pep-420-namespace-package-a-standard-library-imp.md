# 009 · Python: in a PEP 420 namespace package, a standard library import (`import logging`, `import json`) binds to a repo sub-package of the same name; the false edge often cannot be declared, because it creates a structural cycle

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0722-cbtj
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/python-resolve.mts, Runes/test/relations/extractors/python-resolve.test.mjs, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes src/relations/extractors/python-resolve.mts: resolveAbsolute (~l.112-170), roots at l.143-145 = ancestorDirs(the importer's directory) filtered only by insideRegularPackage (l.224); the PYTHON_STDLIB_TOP_LEVEL filter (l.146) applies only to discovered project roots; Yggdrasil pins @chrisdudek/runes 1.0.0 (source/cli/package.json:86)
**Branch:** jarl/009-python-roots
**Merged:** 2a5f1e2 in ../../../Runes
**CI:** none

## What
A namespace directory (no __init__.py, and its parent has none either) stays on the list of sys.path roots, so `import logging` hits <ns>/logging/__init__.py as the only, "unambiguous" match. Synthetic reproduction (yg 6.1.0 from npm with runes 1.0.0, Python 3.14.4): pyproject.toml; acme/ with no __init__.py; acme/core/service.py does `import logging` and `import logging.handlers`; acme/logging/__init__.py imports acme.core; nodes acme/core/ and acme/logging/. yg check reports acme/core/service.py:1 and :2 → acme-logging, although Python (the repo on sys.path, also runpy -m) loads the stdlib logging/__init__.py and logging/handlers.py. Declaring both directions gives `error[structural-cycle] acme-core -> acme-logging -> acme-core`, exit 1; neither check can be suppressed. Control: with acme/__init__.py (a regular package, the path of issue 217) PASS with only the real edge. A real repo: googleapis/google-cloud-python @053dbc98 packages/google-cloud-logging: exactly 21 edges google/cloud/logging_v2 → google/cloud/logging, all from `import logging`, `import logging.handlers` or `import logging as std_logging`, while the real dependency (15 edges) goes the other way, so it is the same cycle trap. python-poetry/poetry @d4fd21e4 (src/poetry with no __init__.py): 12 false edges to src/poetry/json from `import json` and `from json import JSONDecodeError` (no cycle, but false relations). A probe of the resolver: an external name (`yaml`) also binds to acme/yaml/__init__.py, although Python would take site-packages. The verifier's correction: a workaround is also nesting acme-logging under acme-core (the hierarchy is exempt), excluding the subtree, or progressive mode; all of them skew the graph. The file is unchanged on Runes main c72d1af since v1.0.0; the test test/relations/extractors/python-resolve.test.mjs:228-237 covers only a regular package. Repro and logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-6/synthetic/repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-6/real-gcl/repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-6/real-poetry/repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-6/unit/probe.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-6/workaround/nest.log.

## Why
docs/relations-flows-ports.md:47 promises that `import logging` never binds to an ancestor's in-repo `logging.py`. This is a blocking false alarm that cannot be suppressed, in popular layouts (every google-cloud-* library with a sub-package named after a stdlib module), and every workaround skews the graph. It is a remnant of issue 217, which fixed only regular packages. Grain ships the same Runes code.

## Acceptance
- An ancestor directory lying strictly below a discovered project root is not a sys.path root (except the directory of the importing script itself, the `python acme/tool.py` style); the synthetic case, google-cloud-logging and poetry give no edges from the stdlib or from external names.
- A test in Runes for a top-level namespace; a Runes release and a bumped pin in Yggdrasil.

## Changelog
- Fixed: Python: in a PEP 420 namespace package (a directory with no __init__.py, as in google-cloud-* libraries or poetry's src/poetry), `import logging`, `import json` or an external library import from a sub-package no longer binds to a same-named sibling sub-package such as google/cloud/logging/, so those false, often cycle-forcing dependencies are gone. A directory inside a project is no longer searched as an import root, except the importing file's own directory, a directory holding conftest.py and no __init__.py (pytest), and one holding manage.py (Django); a standard-library name binds only at the importing file's own directory or the repository root. The same change can add real dependencies that a stray match used to silence (poetry gains 53, such as `from poetry.locations import …`), so a graph that passed may turn red. A folder put on sys.path only by configuration, such as an Airflow dags folder or a PYTHONPATH entry, is no longer searched, so imports between its modules give no edge.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1613, pass 1613, fail 0, catalogue 487 cases, dist/ is fresh; npm run coverage: tests 1613, pass 1613, fail 0, all files 98.76 / 94.02 / 98.62, exit 0; merge 2a5f1e2 (catalogue count conflict resolved to 485 + 2 = 487; resolve-path.mts and its dist merged independently of the Cargo reader, a rebuild changed nothing)

Rerun 2026-11-11 on the built Yggdrasil (release/6.2.0 plus this lease, Runes build of commit c5124ca0525e stamped 1.1.0) beside the published @chrisdudek/yg@6.1.0, on a synthetic project rebuilt from the issue text (one node per directory, no relations, yg check --no-approve --json). 009: acme/ with no __init__.py, acme/core/service.py has import logging, import logging.handlers and import yaml, acme/logging/__init__.py imports acme.core. 6.1.0: service.py:1 and :2 -> acme-logging. Built: only the real edges acme-logging -> acme-core, no edge from the stdlib or yaml imports. Control with acme/__init__.py: same edges on both. The real repositories (google-cloud-python, poetry) were not rerun.

