# 437 · Mimir: resource verbs add, remove and set write the manifest through the write core

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, resources
**Files:** Mimir/src/commands/resource-write.mjs, Mimir/src/manifest/edit.mjs, Mimir/test/resource-write.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** jarl
**Where:** Mimir at 10257cd has only the reading verbs of resources; agents and people edit area.yaml by hand

## What
repo add, place add and skill add, and remove and set, write area.yaml through Mimir's write core with its provenance trailers and with validation before the write; check and sync of a kind call the existing check and synchronisation. A field set by set must be on the list of settable fields. An invalid entry changes nothing.

## Why
There is no path from a command to an entry in the manifest with provenance.

## Acceptance
- repo add on a fixture writes the entry in one commit with trailers, and the result validates; an unknown key or an absolute dir gives SCHEMA with its fix and leaves the tree and refs as they were
- place add and skill add work alike; remove deletes the entry; set refuses a field outside the settable list; repeating a command changes nothing; an area that integrates by pull request gets the write on a session branch

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

