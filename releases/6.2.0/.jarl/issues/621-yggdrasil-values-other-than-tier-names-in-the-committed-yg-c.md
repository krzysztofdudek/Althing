# 621 · Yggdrasil: values other than tier names in the committed yg-config.yaml are printed whole when they…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1625-whnk
**Tags:** 
**Files:** Yggdrasil/source/cli/src/core/checks/credentials.ts
**Repo:** Yggdrasil
**Found by:** rev-220-fable
**Where:** the review of 220, 296, 297
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Yggdrasil: values other than tier names in the committed yg-config.yaml are printed whole when they are shaped like an API key: config.endpoint by the reviewer-endpoint-committed warning (source/cli/src/core/checks/credentials.ts), progressive.reference by the note 'could not be measured against', and a YAML tag by the YAMLWarning Node prints with the source line on every command; yg aspect-test --tier echoes an unknown tier typed on the command line whole. Existed before this change.

## Why


## Acceptance


- [test] An API-key-shaped config.endpoint in the committed yg-config.yaml makes the reviewer-endpoint-committed warning, and an API-key-shaped progressive.reference the 'could not be measured against' note, print the value redacted, red before and green after · by: cd source/cli && npm test
- [test] An API-key-shaped YAML tag in yg-config.yaml is not printed whole by the YAMLWarning line a command emits, and yg aspect-test --tier given an API-key-shaped unknown tier does not echo it whole, red before and green after · by: cd source/cli && npm test

## Changelog
- Security: an API key pasted into yg-config.yaml as part of a config.endpoint, as progressive.reference or as a YAML tag, or typed after yg aspect-test --tier, is shown by its first four characters in the reviewer-endpoint-committed warning, the could-not-be-measured note, the unknown-tag warning and the unknown-tier message.

## Evidence

### Proof

- **ran (line f89cecc11942):** cd source/cli && npx vitest run tests/e2e/cli-config-tier-validation.test.ts -t 'K[1-4]:' (before the fix) · **saw:** 4 failed: K1 the endpoint warning and K2 the could-not-be-measured note held the whole key instead of sk-a[REDACTED]
- **ran (line f89cecc11942):** cd source/cli && npx vitest run tests/e2e/cli-config-tier-validation.test.ts tests/unit/utils/redact.test.ts tests/unit/io tests/unit/core/checks-credentials.test.ts tests/e2e/cli-committed-endpoint-key.test.ts tests/e2e/cli-progressive-gate.test.ts tests/integration/progressive-scope-resolve.test.ts tests/unit/cli/aspect-test tests/unit/repo (after the fix) · **saw:** Test Files 88 passed (88), Tests 1492 passed (1492); K1 and K2 pass in text and --json
- **ran (line be14ce11cd9a):** cd source/cli && npx vitest run tests/e2e/cli-config-tier-validation.test.ts -t 'K[1-4]:' (before the fix) · **saw:** 4 failed: K3 the YAMLWarning line held the whole key, K4 yg aspect-test --tier echoed the whole key
- **ran (line be14ce11cd9a):** cd source/cli && npx vitest run tests/e2e/cli-config-tier-validation.test.ts tests/unit/utils/redact.test.ts tests/unit/repo and the files above (after the fix) · **saw:** Test Files 88 passed (88), Tests 1492 passed (1492); K3 passes for check, check --json, aspects and owner, K4 passes

### Notes

Assumed: the unknown-tag warning is kept and masked, not silenced, so a mistyped tag is still reported; the masking covers every place that reads yg-config.yaml, and tags in other graph files are left as found.

