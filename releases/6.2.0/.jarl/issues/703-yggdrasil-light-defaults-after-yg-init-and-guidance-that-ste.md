# 703 · Yggdrasil: light defaults after yg init and guidance that steers agents to the architecture file, wildcards and hierarchical rules (ruling yggdrasil-init-defaults-light)

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261112T0314-mmbu
**Tags:** yggdrasil, init, prime, guidance
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the owner, 2026-11-12 (ruling yggdrasil-init-defaults-light)
**Branch:** jarl/703-light-defaults
**Worker:** w-703-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:14

## What


## Why
The owner wants a fresh graph to cost nothing until he chooses more: no log entries and no ratification asked for, a project described by node types with predicates and wildcards rather than one file per node and one path per file, rules organised hierarchically, and yg prime free to let an agent run yg check --approve.

## Acceptance
- [test] A graph made by yg init asks for no log entry on any node type and no ratification of any rule (the default config and every template), and yg check on a fresh project with a code change stays green without a log entry or a ratification; turning either on is one documented setting · by: cd source/cli && npm test
- [test] yg prime, the rules and digest blocks yg init writes, and every knowledge page say nowhere that yg check --approve must not be run, and describe it as the normal way to record verdicts, with the cost of reviewer calls stated · by: cd source/cli && npm test
- [read] yg prime and its derivatives (rules.ts, digest.ts, knowledge pages, default config comments, docs, examples, the init flow's own suggestions) steer an agent first to describe the project in yg-architecture.yaml with node types and when predicates, to map by the broadest wildcard that fits rather than single file paths, and to write rules (aspects) hierarchically, with yg-node.yaml files for what the types cannot say; an inventory of every place changed is in the evidence
- [test] The golden corpus, the docs output samples and the rules digest are regenerated and agree with the new guidance, and yg init --upgrade on an existing graph changes no setting the user chose · by: cd source/cli && npm test
- [read] The guidance tells an agent to narrow a rule by a finer node type (a more specific type whose when predicate covers exactly the files the rule is for, with the rule attached to that type), not by attaching the rule to individual nodes (ruling yggdrasil-narrow-rules-by-node-types), and the inventory lists every place that taught otherwise

## Changelog
- A graph made by yg init asks for no ratification (type_law.ratification: false written, one documented setting to turn it on); no node type asks for a log entry unless log_required is set.
- yg prime and the digest block call yg check --approve the normal way to record verdicts and state what reviewer calls cost.
- Guidance and the first coverage hint lead with node types, broad when wildcards and hierarchical rules; a rule is narrowed with a finer node type, a yg-node.yaml is for what a type cannot say.

## Evidence

### Proof

- **ran (line 8bccfc7c91a1):** cd source/cli && npx vitest run tests/e2e/cli-init-light-defaults.test.ts (before the change) · **saw:** 3 failed, 1 passed: config said ratification true, type-law-unratified blocked an enforced rule on a node type
- **ran (line 8bccfc7c91a1):** cd source/cli && npx vitest run tests/e2e/cli-init-light-defaults.test.ts tests/e2e/cli-type-law.test.ts tests/unit/templates tests/unit/repo (after the change) · **saw:** all passed: fresh init writes ratification false, no log_required true, enforced type rule plus code change stays green, opting in makes it ask
- **ran (line e7e509c06072):** cd source/cli && npx vitest run tests/unit/templates/approve-guidance.test.ts (before the change) · **saw:** 3 failed, 17 passed: yg prime told the agent not to run yg check --approve, no 'normal way to record verdicts' sentence, digest had none
- **ran (line e7e509c06072):** cd source/cli && npx vitest run tests/unit/templates tests/unit/repo (after the change) · **saw:** all passed (352 tests): prime, the digest and all 18 knowledge pages say nowhere that --approve must not be run; prime and digest call it the normal way to record verdicts and state reviewer-call cost
- **ran (line 6cc5e8fe6418):** cd source/cli && npx vitest run tests/unit/templates tests/unit/repo tests/e2e/cli-golden-corpus.test.ts tests/e2e/docs-samples.test.ts tests/unit/cli/init-upgrade.test.ts tests/e2e/cli-type-law.test.ts tests/e2e/cli-init-light-defaults.test.ts · **saw:** 42 files, 507 tests passed after npm run golden:update, docs-samples:update, cli-reference:update, schemas:update, codes:update, glossary:update; digest blocks regenerated in root, examples and a fixture; upgrade keeps ratification true and false as written

### Notes

Assumed: yg init writes type_law.ratification: false explicitly rather than leaving the key out, so a later yg init --upgrade sees a stated answer. The missing-key default (off) is unchanged.

Assumed: the one-time take-up in yg init --upgrade (a graph whose yg-config.yaml says nothing about type_law gets each enforced type rule recorded as ratified and ratification: true written) is left as it is: it is shipped 6.1.0 behaviour for existing graphs, not a fresh-init default. It does ask for ratification afterwards, so it needs the owner's word before it changes.

Assumed: Yggdrasil's own yg-config.yaml now says type_law.ratification: false (ruling yggdrasil-own-graph-follows-703); its log_required: true on twelve types is the repository's own choice and is left. The templates unit-test node maps tests/unit/templates/*.test.ts by wildcard; no change to yg-architecture.yaml.

Assumed: narrowing by a finer node type is taught together with the fact that a file two classifying types match is ambiguous-node-type, so the finer type's files are excluded from the broader when with not.

Inventory of places changed (file: what it said -> what it says). (a) ratification/log: templates/default-config.ts (type_law ratification true, 'false asks for none') -> false, opt-in comment; knowledge/configuration.ts + schemas/config.ts + docs/configuration.md ('yg init writes true') -> writes false; knowledge/aspect-status.ts + docs/aspect-status.md + docs/aspects.md + docs/cli-reference.md (type law is the user's to admit) -> admitted only where type_law.ratification is on; rules.ts Aspect paragraph and --ratify row -> same; knowledge/working-with-architecture.ts log_required + schemas/architecture.ts + docs/nodes.md (enable on types worth capturing; example with log_required true) -> opt-in the user chooses, example line removed; Yggdrasil's own yg-config.yaml ratification true -> false. NOT changed: init --upgrade take-up (init.ts takeUpTypeLaw) and log_required docs of the feature. (b) approve: digest.ts last invariant 'Never run yg check --approve either' -> removed, sentence added; rules.ts Escape hatch 'Do not run yg check --approve' -> removed; rules.ts command table, After-modifying-code paragraph -> normal way plus cost and --dry-run. (c) nodes over types: rules.ts Architecture, Nodes, Unmapped files, Greenfield, Brownfield, pre-flight step 4, node-vs-type paragraph, yg-node.yaml artifact, Node when-to-create, Delegating deliverable 2; knowledge/working-with-architecture.ts (new first section), onboarding.ts C2 and gate lead, schemas/node.ts mapping, default-config.ts DEFAULT_ARCHITECTURE comment; docs/nodes.md, getting-started.md (fast path, concepts, walkthrough note); engine hints core/check-coverage-tiers.ts (3 messages), check-coverage-phase.ts, cli/build-context.ts, cli/impact.ts (cover with a node type first); golden corpus and docs samples regenerated. (d) aspects hierarchy: rules.ts Aspect paragraph, knowledge/aspects-overview.ts, docs/aspects.md -> write rules hierarchically (nested ids, bundle with implies attached once). (e) narrowing: rules.ts (type paragraph, Aspect, when predicate 'Prefer when over splitting node types' removed), knowledge/working-with-architecture.ts, conditional-aspects.ts, docs/nodes.md, docs/conditional-aspects.md, docs/aspects.md -> finer node type with disjoint when. Seen and left: examples/ graphs (node-per-component showcases, no log or ratification settings), portal glossary (descriptive only), docs/showcase.md (describes Yggdrasil's own opt-in).

