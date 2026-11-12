# 714 · Yggdrasil: remove all masking of key-shaped values (ruling yggdrasil-no-key-masking)

**Status:** in-progress
**Kind:** cleanup
**Priority:** 1
**Tier:** standard
**Key:** 20261112T0405-bmxy
**Tags:** yggdrasil, keys
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12
**Branch:** jarl/683-keys-more
**Worker:** w-683-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:05

## What


## Why
The owner does not want Yggdrasil to mask key-shaped values in its output: where a user puts a key is the user's matter. The masking added in 6.2.0 (620, 621, 641 to 682, and the keys-more branch) is taken out, while what those packages did besides masking stays.

## Acceptance
- [test] No output of Yggdrasil masks a key-shaped value: every message, refusal, warning, listing and --json document prints what it read as it is, and no masking helper, test or golden case for it remains · by: cd source/cli && npm test
- [read] What the keys packages did besides masking stays (repository-relative POSIX paths, SIGHUP and reviewer process groups, the architecture parser's structured refusals, the owner note on ignored files, C# read only when mapped), and the CHANGELOG, docs and knowledge pages say nothing about masking keys; the list of what was removed and what was kept is in the evidence

## Evidence

### Proof

- **ran (line 6f037cc9a56f):** cd source/cli && npx vitest run tests/unit tests/e2e/cli-validation-codes.test.ts tests/e2e/cli-adopt.test.ts tests/e2e/cli-config-tier-validation.test.ts tests/e2e/cli-key-values-whole.test.ts tests/e2e/cli-secrets-parse-error.test.ts tests/e2e/cli-file-arg-missing.test.ts tests/e2e/relation-checkout-files.test.ts tests/e2e/cli-golden-corpus.test.ts tests/e2e/docs-samples.test.ts tests/e2e/cli-reference-truth.test.ts tests/e2e/cli-aspect-not-found.test.ts tests/e2e/cli-context-json.test.ts tests/e2e/cli-impact.test.ts tests/e2e/cli-read-json.test.ts · **saw:** Test Files 445 passed, Tests 8110 passed, 1 todo; the new cli-key-values-whole suite pins that a key-shaped argument and a key in a rule file print whole; lint, dead-exports and markdownlint clean
- **ran (line 6f037cc9a56f):** cd source/cli && npx vitest run tests/unit plus the e2e files that name stderr, the golden corpus, docs samples and cli-key-values-whole · **saw:** Test Files 659 passed, 1 failed (cli-read-cost-bounds case 3, which needs the repository's own graph without open reviewer pairs); Tests 10078 passed; lint, dead-exports clean; a token-shaped string comes back whole in the CLI failure reason, the debug log line and the binary probe

### Notes

Assumed: only masking added in 6.2.0 is removed. The redaction of text a reviewer provider hands back (redactSecrets, redactedTail: the failure reason of a provider CLI or endpoint, the debug log of a reviewer run, the binary probe) is from 6.1.0 and stays, with its tests; it can go on a word. The structure from the yg-secrets.yaml work (a parse error that names file, line and column and quotes nothing; unknown overlay keys named by position; overlay values hidden from errors) stays, since it is not a mask on key-shaped values; only the redactSecrets call on its YAML reason is removed. URL-credential masking of package sources (344) is older and stays. The refusal of a tier name shaped like a key is removed with the mask (the tier name rule is as in 6.1.0). The graph logs keep their history entries.

Removed: maskSecretShapes, maskSecretShapesInMessage, looksLikeSecret, parseYamlMaskingWarnings and the key pattern (utils/redact.ts is back to its 6.1.0 content); the masking at check's assembly, in the loader, in the output layer (errors, warnings, notes, node and rule not-found answers), in yg owner, yg find, yg type-suggest, yg context --file, yg impact --file, yg aspects, yg aspect-test --tier, the fill telemetry tier, marketplace and tier-selection messages, log add/read/merge-resolve, the parsers of node, flow, rule, adapt, architecture, config and package manifests, progressive reference notices; the tier-name-like-a-key refusal; the code-table wording; tests and suites that pinned masking (cli-key-arguments suite and its node, the K, W, N, M, R, F, G cases of validation-codes, the keyed adopt cases, D1b, F2 and K1-K4 of config-tier-validation, key cases of config-parser, tier-selection, checks-aspects, marketplace-check, aspect-parser-deterministic, fill-writer-coalesce); the CHANGELOG entries of 6.2.0 about masking (the rule-file entry keeps its repository-root wording). Kept: repository-relative POSIX paths (641, 650, 669, 683), SIGHUP and reviewer process groups (647, 661, 670), the architecture parser's structured refusals (671, 682's next steps), the owner note on ignored files (676) and its POSIX normalization, C# read only when mapped (692), the yg-secrets.yaml structure (064), provider-output redaction of 6.1.0.

Assumed (ruling yggdrasil-no-provider-redaction): utils/redact.ts and its test are deleted; the one-line cut of a provider's tail to a few hundred characters stays, as utils/text-tail.ts. Left in place for the owner: the URL-credential masking of package sources in the pack-source error (user:password part of a URL), and the rules provider-redaction and provider-redaction-cascade, which forbid logging a raw prompt or response and name redactSecrets as the wrapper; the code passes them and I did not edit a rule.

Assumed (ruling yggdrasil-redaction-rules-removed): the rules provider-redaction and provider-redaction-cascade are deleted with their drills and logs; attachments removed: types llm-provider and llm-subprocess-base in yg-architecture.yaml (one line each), the verification flow, and the nodes aspect-test, drill, pack, fill-support, fill, reviewer-dispatch and llm/shared. The llm-subprocess-base type description in yg-architecture.yaml still says 'redaction is what matters'; I left it, as the architecture file was not mine to edit beyond the attachments. URL-credential masking of pack-source errors and listings is removed (the record of an install still drops credentials).

