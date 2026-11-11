# 539 · Yggdrasil: a judged rule can give one verdict per entry of a structured data file

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Key:** 20261111T0927-ofcw
**Tags:** yggdrasil, rules, cost
**Files:** 
**Repo:** Yggdrasil
**Found by:** field-report
**Where:** rule scope: per

## What
A rule over a data file such as a translation file gives one verdict for the whole file, so every added key invalidates it, every merge of two such branches needs it judged again, the prompt grows with the file and one bad entry refuses the file. A field report removed three judged rules from such a file for this. Proposal: scope per entry, the verdict keyed by the hash of the entry's key and value (so a merge of different keys needs no new call), a selector of keys, and several entries per call with one verdict each. A rule about consistency between entries stays per file.

## Why
Rules on data files are too costly to keep today.

## Acceptance
[read] A design for per-entry verdicts is written and agreed before code

## Evidence

### Notes

Deferred: A new capability that needs a design first; moved past this release.

