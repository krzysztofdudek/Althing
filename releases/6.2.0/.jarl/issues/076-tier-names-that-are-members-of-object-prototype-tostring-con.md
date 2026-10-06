# 076 · Tier names that are members of Object.prototype ('toString', 'constructor', …) pass validation, and `yg check --approve` fails with 'NaN reviewer calls' and error[internal]

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** bug-hunt, yggdrasil
**Files:** Yggdrasil/source/cli/src/io/config-parser.ts, Yggdrasil/source/cli/src/core/checks/aspect-contracts.ts, Yggdrasil/source/cli/src/core/tier-selection.ts, Yggdrasil/source/cli/src/core/checks/architecture.ts
**Repo:** ../../../Yggdrasil
**Found by:** bug-hunt
**Where:** source/cli/src/io/config-parser.ts:874 `if (!tiers[raw.default])` (tiers is a plain `{}` from :836); core/checks/aspect-contracts.ts:638 `if (!tiers[tier])` (aspect-tier-unknown); core/tier-selection.ts:41 and :67 `reviewer.tiers[name]` return the inherited function as an LlmConfig without provider and consensus; llm/provider.ts:15 throws `Unknown reviewer provider: undefined`; core/checks/architecture.ts:195 `graph.architecture.node_types[node.meta.type]` (checkTypeWithoutWhenWithMapping), the same pattern at :243, :462, :526 (checkNodeTypesExist :391 builds a Set from Object.keys, so it is correct)
**Branch:** jarl/020-config-errors
**Merged:** 1018760b8bf1703f75f11680b67b681667dc979c
**CI:** none

## What
Reproduction (a fresh clone at tag v6.1.0 built from source, `yg --version` 6.1.0, a new project, the only tier is ollama on the closed port 127.0.0.1:9, so nothing is sent or paid for): an aspect with `reviewer.tier: deep` (control) → error[aspect-tier-unknown]; `toString`, `constructor`, `__proto__`, `hasOwnProperty` and `valueOf` are accepted without a finding, and `yg check` advertises `fix: yg check --approve (1 reviewer pair · 1 call · paid)`. `yg check --approve` with `tier: toString` prints `fill 1 pair · 0 script (free) · NaN reviewer calls`, then `error[internal]: Unexpected error while running check: Unknown reviewer provider: undefined ... This is a bug — please file an issue`, exit 1 (the control `tier: std` on the same closed port gives a classified 'reviewer unreachable' warning and an unverified result). Config: `reviewer.default: deep` → config-default-tier-unknown; `constructor` and `toString` are accepted, and `--approve` with `default: constructor` fails the same way. A node with `type: banana` gets only type-undefined; `type: toString` gets type-undefined and a false error[type-without-when-with-mapping] with the fix 'Add a `when` predicate to type 'toString' in yg-architecture.yaml'. A tier cannot be named `__proto__` (the regex refuses a leading underscore), and a defined tier `toString` is an own property and works correctly. CHANGELOG.md:815 fixed the same class for `yg knowledge read`, `yg schemas read` and `yg impact --type`; the dogfood rule prototype-safe-registry-lookup (CHANGELOG.md:689) by design catches only constant module tables, so maps from the config slip through. No hits in the 6.1.0 and 6.1.1 issues. Log: <the session scratchpad, since lost>/bughunt/yggdrasil/verify-45/logs/prototype-names.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/verify-45/repro.sh; report <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/logs/F3-prototype-names.log, script <the session scratchpad, since lost>/bughunt/yggdrasil/find-4/F3-prototype-names/repro.sh.

## Why
The codes aspect-tier-unknown and config-default-tier-unknown exist to catch an unknown tier name, and the CLI itself calls this crash a bug; the 'paid' hint and a second, false type diagnosis mislead. Nothing is sent, paid for or broken, and the trigger is an odd, invalid name, so minor.

## Acceptance
Lookups of tiers and node types use own-property lookup (Object.hasOwn, Map or Object.create(null)): an aspect with `tier: toString`, `constructor`, `valueOf` or `hasOwnProperty` gets aspect-tier-unknown, `reviewer.default: constructor` gets config-default-tier-unknown, `type: toString` gets only type-undefined, and `yg check --approve` never reaches the provider factory with undefined (e2e test).

## Changelog
- Fixed: a reviewer tier or node type named toString, constructor, valueOf or hasOwnProperty is reported as unknown (aspect-tier-unknown, config-default-tier-unknown, type-undefined) instead of passing and crashing yg check --approve or drawing a false when: error.

## Evidence

- **ran:** git commit (merge of jarl/020-config-errors into release/6.1.1; pre-commit runs scripts/repo-check.sh) · **saw:** yg check: PASS 8163 pairs verified; coverage branches 90.31%; [repo-check] All checks passed; [release/6.1.1 1018760b8] Merge jarl/020-config-errors

