# 586 · Runes and Yggdrasil: the tree-sitter pins move to 0.27.1 (Dependabot pull requests 106 and 107 on Yggdrasil)

**Status:** deferred
**Kind:** cleanup
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1404-cgno
**Tags:** runes, yggdrasil, dependencies
**Files:** 
**Repo:** Runes, Yggdrasil
**Found by:** jarl
**Where:** w-356-sonnet, issue 356

## What


## Why
Yggdrasil cannot take tree-sitter-cli or web-tree-sitter 0.27.1 alone: the grammar manifest shared through Runes pins 0.27.0 and the pinned-grammar test and golden corpus hash the runtime bytes. The pins move in Runes first, then Yggdrasil adopts them.

## Acceptance
[read] Either the pins move to 0.27.1 in Runes with the grammars rebuilt and Yggdrasil adopts them with its golden corpus regenerated and explained, or the record says why 0.27.0 stays for this release

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-1-1-0-scope-at-the-cut

