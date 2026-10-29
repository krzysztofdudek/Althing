# 466 · Yggdrasil: progressive mode does not make a rule's existing findings the author's when the rule changes

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** yggdrasil, progressive, workplace, needs-owner
**Files:** Yggdrasil/source/cli/src/core/progressive-scope-resolve.ts, Yggdrasil/source/cli/src/core/check-progressive.ts, Yggdrasil/docs/progressive-mode.md
**Repo:** ../../../Yggdrasil
**Found by:** owner
**Where:** Yggdrasil release/6.2.0: docs/progressive-mode.md, step 3 (a changed rule reaches every use of that rule) and source/cli/src/core/progressive-scope-resolve.ts; ruling progressive-ignores-rule-changes

## What
In progressive mode, a change to a rule (its check, its prose, its references, its scope, a package's rule) no longer brings the rule's uses into the change's scope: only changed code, components and flows do. The rule's findings in code the change did not reach are re-coded as findings outside the change, as inherited debt is, so they stay visible and do not fail the build. First a short design note, recorded in the issue before any code: whether this is the default or a setting of the progressive block (with a Before you upgrade note if the default changes); how the rule itself is still proved to run (its own tests, its pairs judged, a full check on the reference branch); and what becomes of the burn-table rows that issues 005 to 007 added for rule changes. The owner decides the default.

## Why
In a rig, an agent raises and refines the law while it pulls the code toward it; if every edit of a rule turned the whole codebase's debt into the editor's red build, progressive mode would stop the very evolution it exists for.

## Acceptance
- The design note and the owner's word on the default are recorded before code
- A fixture with progressive.reference set: changing a rule that is broken in ten untouched files gives ten findings outside the change and a green exit; changing one of those files makes that file's finding the author's again
- The rule's own correctness is still checked on the change (a rule whose script throws fails the run), and progressive-mode.md and the cross-surface checks say the same as the code

## Evidence

