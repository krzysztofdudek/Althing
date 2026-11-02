# 445 · Mimir: an ingest job with a replaceable fetcher, in an overlay area

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** mimir, workplace, jobs
**Files:** Mimir/owner-setup/jobs/ingest.mjs, Mimir/owner-setup/fetchers/fake-fetcher.mjs, Mimir/test/ingest-job.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** the owner, 2026-10-24: ingests collect what is not reachable through MCP, per company, into a private place

## What
A job skeleton for an overlay area: its state in the overlay's repository (a cursor), results to the area's sources, a needs line that names the machine it runs on, and a fetcher that is a module of its own (a fake in tests). No real ingest of any source.

## Why
A symmetric place for the ingest of a company's sources, ready before any real data is touched.

## Acceptance
The fake fetcher continues from the cursor and writes sources that search finds; a second run duplicates nothing; on another machine the job exits 2 with its reason

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

