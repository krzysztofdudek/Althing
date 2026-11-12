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

## Evidence

