# 466 · Yggdrasil: progressive mode does not make a rule's existing findings the author's when the rule changes

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Key:** 20261029T1518-zjsj
**Tags:** yggdrasil, progressive, workplace, needs-owner
**Files:** Yggdrasil/source/cli/src/core/progressive-scope-resolve.ts, Yggdrasil/source/cli/src/core/check-progressive.ts, Yggdrasil/docs/progressive-mode.md
**Repo:** ../../../Yggdrasil
**Found by:** owner
**Where:** Yggdrasil release/6.2.0: docs/progressive-mode.md, step 3 (a changed rule reaches every use of that rule) and source/cli/src/core/progressive-scope-resolve.ts; ruling progressive-ignores-rule-changes

## What
A consideration to talk through with the owner first (ruling progressive-rule-changes-to-discuss). His remark: progressive mode should not react to changes of rules. Today a change to a rule (its check, its prose, its references, its scope, a package's rule) brings every use of that rule into the change's scope, so whoever edits or adds a rule answers for every place it already breaks. The agent who reaches this issue first prepares the conversation: what the code does today, with file and line; the case that motivates it (in a rig an agent raises and refines the law while it pulls the code toward it); the options (keep it, make it a setting of the progressive block, change the default with a Before you upgrade note) and for each how the rule itself is still proved to run and what becomes of the burn-table rows issues 005 to 007 added; then stops for the owner. Code follows only his word.

## Why
In a rig, an agent raises and refines the law while it pulls the code toward it; if every edit of a rule turned the whole codebase's debt into the editor's red build, progressive mode would stop the very evolution it exists for.

## Acceptance
[test] In progressive mode, a change to a rule's check, prose, references or scope, a new rule, and a change to a package's rule bring none of the rule's findings on unchanged code into the change's scope: they show as warnings, and only findings in changed code block; yg check --full still blocks on all of them; the docs and the CHANGELOG say so (ruling progressive-ignores-rule-changes), red before and green after · by: cd source/cli && npm test

## Evidence

