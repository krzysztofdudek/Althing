# 586 · Runes: the tree-sitter pins move to the newest stable release and every grammar is rebuilt (the Runes half of 586)

**Status:** open
**Kind:** cleanup
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-vteu
**Tags:** runes, dependencies, grammars
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-356-sonnet, issue 356

## What
Runes pins tree-sitter-cli and web-tree-sitter at 0.27.0 (package.json, grammars/manifest.json); Dependabot proposed 0.27.1 on Yggdrasil (pull requests 106 and 107), which Yggdrasil cannot take alone. This issue is the Runes half: the pins move in Runes, the grammars are rebuilt and their sha256 updated. Yggdrasil adopts them when it pins Runes 1.2.0, in a family release; that half stays with issue 586 of the 6.2.0 loop.

Moved from issue 586 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
Yggdrasil cannot take tree-sitter-cli or web-tree-sitter 0.27.1 alone: the grammar manifest shared through Runes pins 0.27.0 and the pinned-grammar test and golden corpus hash the runtime bytes. The pins move in Runes first, then Yggdrasil adopts them.

## Acceptance
- [test] package.json and grammars/manifest.json pin tree-sitter-cli and web-tree-sitter at the newest stable release (0.27.1 or later), every grammar is rebuilt with its sha256 updated in the manifest, and the whole suite passes with every catalogue expectation unchanged, or each change explained on the issue · by: npm run check
- [check] the corpus gate gives the same edges as at v1.1.0, or each difference is explained in corpus/explained.md · by: npm run corpus

## Evidence

