# Upgrade rehearsal: Yggdrasil 6.0.0 → 6.1.0 on a copy of a real graph (issue 528)

Run on 2026-09-28 by a coordinator's worker on a clone of a real project's graph (graph, rules and verdict lock on 6.0.0), against Yggdrasil `release/6.1.0` @ `4f097e322`, following the CHANGELOG's "Upgrading from 6.0.0" section literally. Some research stays private: that graph's content was not read into this report; only counts.

**Result.** Nothing blocked the upgrade and the required part cost nothing: after `yg init --upgrade`, two relation declarations, a CI change and one free script refill, the gate was back to PASS. The optional paid step (re-judging the one reviewer rule under the new prompt) cost about $0.88. No blocking defect; three issues filed (529 P2, 530 P3, 531 P3).

## What opened after the upgrade

| Reason | Count | Kind |
|---|---|---|
| Script verdicts keyed by the earlier release | 187 pairs | script, free |
| Inputs changed (baseline clone effect and root files edited by `init --upgrade`) | 10 pairs | script, free |
| An advisory cross-repository check | 1 pair | script, free |
| New relation findings (in-repo package imports 6.1.0 now resolves) | 2 components, 6 edges | declare the relations |
| Rule hash changes, new rules, companion imports | 0 | — |
| `type-law-unratified` | 0 | `init --upgrade` records existing enforced type rules as ratified |
| Reviewer pairs re-opened | **0** | — |

`check --approve --only-deterministic` filled 198 pairs in about 4 seconds with 0 reviewer calls. The committed reviewer lock was untouched.

## Surprises

- **CHANGELOG (529, P2):** several breaking entries in `[Unreleased]` carry their own "Upgrading:" notes that are not in the numbered upgrade list (unknown config keys now block, `node-unreachable`, `emits`/`listens`, `parents: root`, removal of `yg aspects log`, the `sonnet` default, merge drivers, `.refused/`). Step 3 lists only part of what `init --upgrade` adds, and nothing says the graph's `version:` stays `"6.0.0"`.
- **`init --upgrade` with `core.hooksPath` set (531, P3):** no post-merge hook is written and the manual instruction appears under a misleading "Added to" heading.
- **Empty dry run (530, P3):** `check --approve --dry-run` with nothing to fill still suggests a command, and the preview gives no cost figure.
- **Expected adopter work:** the relation declarations, pinning the CLI in CI (a workflow that ran an unpinned bare `yg check` on Node 20), and the mixed-version red on a machine still on 6.0.0.
