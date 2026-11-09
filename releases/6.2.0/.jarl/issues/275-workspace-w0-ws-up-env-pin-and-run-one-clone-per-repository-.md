# 275 · Workspace W0: ws up, env, pin and run (one clone per repository, one built tree per commit, the exported environment, a candidate manifest)

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261006T0609-ejsh
**Tags:** althing, workspace
**Files:** Althing/workspace/ws.mjs, Althing/workspace/lib/local.mjs, Althing/workspace/lib/releases.mjs, Althing/workspace/lib/briefs.mjs, Althing/workspace/test/ws.test.mjs, Althing/workspace/README.md, Althing/family/registry.json, Althing/.claude/skills/family-workspace/SKILL.md, Althing/releases/6.2.0/briefs/worker-grain.md, Althing/releases/6.2.0/briefs/reviewer.md, Althing/releases/6.2.0/briefs/merger.md
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/workspace/ws.mjs:26-28 (env, up, run, pin, verify-publish and order "arrive with the workspace packages"); Althing/releases/6.2.0/briefs/worker-grain.md:21-22 ({{env}} renders empty, and Grain's full gate leans on .cache/legacy-grain-gate/, a directory built by hand)

## What
Package W0 of the workspace (research/2026-10-05-family-workspace/design.md, section 2, and the table "Plan changes under A"). Built already: the registry (family/registry.json), the 6.1.0 and 6.2.0 manifests, ws.local.json, and doctor, status, jarl, brief, index, freeze, release open and release nodes. To build: ws up [dev|candidate] <version> [--ref <name>=<ref>] keeps one full clone per registry repository in repos/<name> (the sibling checkouts named in ws.local.json added as a remote called local and fetched first; GitHub otherwise) and builds each needed commit once, in a detached tree at .cache/trees/<name>@<sha12>/, with the registry's build steps. ws env prints the exports the registry's env entries declare, pointing into those trees and never into a development checkout. ws pin <version> fills an open manifest's commits from the declared branch tips and sets it candidate, refusing a commit that is not on its declared branch. ws run <mode> <version> runs the checks under workspace/checks/ over those trees, under nice, holding a lock so two runs never overlap (a second run refuses; it never waits). The brief templates take {{env}} from ws env, and the .cache/legacy-grain-gate/ lines leave them.

## Why
Every cross-tool check of this release (239, 254-259, 276) needs the family's commits built side by side and the environment the tools' suites already read. Today that environment is a hand-built directory with no record of how it was made, and a test skipped for want of a sibling proves nothing.

## Acceptance
- Tests on small synthetic repositories under workspace/fixtures/: ws up builds a commit once and a second run builds nothing; a new commit is a new tree; a local source is fetched before GitHub and a commit's identity is its SHA
- ws env exports exactly the registry's env entries, each under .cache/trees/; a test turns red when an entry would point into a sibling checkout
- ws pin on a fixture fills every commit, sets the state candidate and passes rails/manifest.mjs; a commit not on its declared branch is refused with the repository's name
- ws run refuses while another run holds the lock, runs under nice, prints one line per check and exits 1 when any check is red
- The worker-grain, reviewer and merger templates name no legacy-grain-gate, and ws brief worker --repo grain renders a working {{env}} line
- workspace/README.md, the header of ws.mjs and the family-workspace skill list the four commands as built today; yg check && npm test green

## Evidence

2026-10-28: under the ruling family-repos-leave-only-code-on-host, the built trees this issue places under .cache/trees on the host move into a container or onto its volumes; issue 354 carries the change for the whole workspace

