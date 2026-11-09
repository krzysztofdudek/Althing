# 455 · Mimir: a harness of agent scenarios with measured outcomes

**Status:** dropped
**Kind:** test
**Priority:** 3
**Tier:** strong
**Key:** 20261029T1431-abem
**Tags:** mimir, workplace, tools, tests, needs-owner
**Files:** Mimir/test/agent-scenarios, Mimir/scripts/agent-scenarios.mjs, Mimir/src/agent-metrics/parse.mjs
**Repo:** ../../../Mimir
**After:** 449, 450
**Found by:** owner
**Where:** the owner's measure: Mimir must not get in the agent's way and must cut its escapes to grep, not merely have tools that exist

## What
Four scenarios (find and quote a fact; record a decision in a shared area; work in a project's repository and reach the knowledge of its company; the user says something exists and the branch does not have it), a parser of a tool's transcript into metrics (finished or not, number of steps, number of grep and find calls over knowledge) and a report over scenarios and tools. A real run with a model needs MIMIR_AGENT_E2E=1 and the owner's word, because it costs money.

## Why
Only measured behaviour shows whether the agent actually uses Mimir.

## Acceptance
The parser on four recorded transcripts returns the expected metrics; without the flag the model run is skipped with its reason; the report has a stable order and marks a cell without a run as not run

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

