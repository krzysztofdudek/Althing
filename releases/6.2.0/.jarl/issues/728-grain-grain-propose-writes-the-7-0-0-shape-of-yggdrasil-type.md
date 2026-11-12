# 728 · Grain: remove everything that writes or reads Yggdrasil's files (propose, advise, oracle, the node and graph options of cochange and measure)

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0648-boyr
**Tags:** 
**Files:** 
**Found by:** jarl
**Where:** plugins/grain/engine (propose-*.mjs, grain-export.mjs, the advise, oracle, cochange and measure commands), the MCP server and the README; ruling grain-analysis-only
**Repo:** Grain

## What


## Why


Ruling grain-analysis-only: Grain's value is the analysis and its conversation with the agent; the commands that write or read Yggdrasil's files tie Grain to formats that 7.0.0 changes or removes.

## Acceptance




- [test] grain propose, grain advise and grain oracle are unknown commands, cochange and measure refuse --nodes, --level node and --graph, and no code in plugins/grain reads or writes a path under .yggdrasil; the suite is green
- [read] Grain's README, usage text and MCP tool descriptions say nothing of proposing or reading a Yggdrasil graph, and the CHANGELOG says what went

## Evidence

