# 073 · Python: when several distributions share a pkgutil-style namespace package, `from pkg import module` and `import pkg.module` are ambiguous, so real dependencies between distributions give no edge (Airflow: task-sdk → airflow.settings)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0754-hmht
**Tags:** bug-hunt, yggdrasil, runes
**Files:** Runes/src/relations/extractors/python-resolve.mts, Runes/test/relations/extractors/python-resolve.test.mjs, Yggdrasil/source/cli/package.json
**Repo:** ../../../Yggdrasil, ../../../Runes
**Found by:** bug-hunt
**Where:** Runes v1.0.0 src/relations/extractors/python-resolve.mts, resolveAbsolute l.146-172: the discovered project roots (l.146-149) are in the same loop as the ancestor roots; the candidate list per root: the exact module (l.157-158), then the parent-package fallback parentPath/__init__.py and parentPath.py (l.161-163, meant for `from a.b import Symbol`); each root's first hit goes into a single `matches` set (l.165-169), and a file is returned only when matches.size === 1 (l.172); Yggdrasil 6.1.0 calls this through source/cli/src/relations/resolve-path.ts:34 (makeResolvePathToFile), runes pinned at 1.0.0 in source/cli/package.json:86 (main the same)
**Branch:** jarl/009-python-roots
**Merged:** 2a5f1e2 in ../../../Runes
**CI:** none

## What
Reproduction (npm @chrisdudek/yg@6.1.0 with @chrisdudek/runes 1.0.0, fresh clones of Yggdrasil v6.1.0 and Runes v1.0.0, Python 3.14.4, Node 24.11.1, custom scripts): a uv workspace with core and plugin, both with src/acme/__init__.py using pkgutil.extend_path; core/src/acme/models/user.py does `from acme import settings` and `import acme.settings`; nodes core-models, core-settings, plugin. CPython loads core/src/acme/settings.py under every sys.path order. A (core + pkgutil plugin): `yg check --no-approve` PASS, exit 0, no edge for core :1, core :2 or for the plugin's own `from acme import settings`; calling makeResolvePathToFile from runes directly gives undefined for 'acme.settings' both from core and from the plugin. B (core alone): FAIL with user.py:1 and :2 → core-settings. Control C (plugin as a PEP 420 directory without __init__.py): all three edges are there, so the trigger is the sibling's __init__.py, that is the parent-package fallback. Control D (`from acme.settings import DEBUG` with the pkgutil plugin): the edge is there, rescued by the candidate 'acme.settings.DEBUG'. A real repo: apache/airflow @383a9a87 (sparse: airflow-core/src, task-sdk/src, providers http, sqlite and common/sql, 6 pyproject.toml; all five src/airflow/__init__.py with pkgutil.extend_path; the only airflow.settings is airflow-core/src/airflow/settings.py): none of the 8 `from airflow import settings` gives an edge (2 in the airflow-core models, 6 in task-sdk, of which 3 are marked `# noqa: SDK002`, that is a boundary Airflow lints itself); with airflow-core alone the two core occurrences give an edge; Python's PathFinder over the extended __path__ resolves airflow.settings to airflow-core. Within one root the code already puts the exact module above the fallback (comment l.133-136), across roots it does not, and for the `import acme.settings` form the parent-package fallback is never right. This is not 009 (PEP 420 directories as roots and false stdlib hits; its fix will not change this) nor 013 (performance); the Runes tests do not cover pkgutil namespaces; Runes main c72d1af unchanged. Logs: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-42/synthetic/repro.log, <the session scratchpad, since lost>/bughunt/yggdrasil/verify-42/real/repro.log; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-2/F6-python-parent-fallback-ambiguity/repro.log and real-airflow.log (scripts repro.sh and real-airflow.sh in that directory).

## Why
docs/relations-flows-ports.md:47 says only that 'A module found under two roots gives no edge', and here the module is under one root; :58 promises an edge for a dependency that can be pinned to exactly one target. pkgutil namespaces are a documented PyPA pattern (Airflow, Google Cloud). Only a false negative, no false blocks, and the common form `from ns.mod import Symbol` works, so minor.

## Acceptance
- resolveAbsolute first looks for the exact module or package across all roots, and applies the parent-package fallback only when no root has an exact hit: scenario A gives the edges user.py:1 and :2 → core-settings, and a module found exactly in two roots still gives no edge (a test in python-resolve.test.mjs with two pkgutil roots).
- Yggdrasil pins the Runes release with the fix, and sparse Airflow @383a9a87 gives edges for the 8 `from airflow import settings`.

## Changelog
- Fixed: Python: when several distributions share a pkgutil-style namespace package (Airflow's core, task SDK and providers each ship airflow/__init__.py), `from airflow import settings` and `import airflow.settings` now report the dependency on the one distribution that holds the module, instead of staying silent because the other distributions' __init__.py counted as rival matches. These are new edges, so a graph that passed may turn red (Airflow gains 604 cross-distribution edges).

## Evidence

jarl: a parent module file (e.g. b.py) under another root still counts as a rival — a literal reading of the acceptance would turn three existing silence tests into edges; accepted as the safer option (silence instead of a possible false edge), in line with patch-scope
- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1613, pass 1613, fail 0, catalogue 487 cases, dist/ is fresh; npm run coverage: tests 1613, pass 1613, fail 0, all files 98.76 / 94.02 / 98.62, exit 0; merge 2a5f1e2 (catalogue count conflict resolved to 485 + 2 = 487; resolve-path.mts and its dist merged independently of the Cargo reader, a rebuild changed nothing)

Rerun 2026-11-11 on the built Yggdrasil (release/6.2.0 plus this lease, Runes build of commit c5124ca0525e stamped 1.1.0) beside the published @chrisdudek/yg@6.1.0, on a synthetic project rebuilt from the issue text (one node per directory, no relations, yg check --no-approve --json). 073: uv workspace core and plugin, both src/acme/__init__.py with pkgutil.extend_path, core models/user.py has from acme import settings and import acme.settings, plugin has from acme import settings; settings.py only in core. 6.1.0: no edge. Built: user.py:1 and :2 -> core-settings and plugin.py:1 -> core-settings. Airflow was not rerun.

