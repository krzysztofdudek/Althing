# 379 · Gard: views of a topic, and gard worktree add

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, worktrees
**Files:** Gard/src/worktree/add.mjs, Gard/src/worktree/layout.mjs, Gard/src/worktree/names.mjs, Gard/test/worktree-add.test.mjs
**Repo:** ../../../Gard
**After:** 378
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, sections Layout and Worktrees and views; the owner's rulings on the layout and on one volume per worktree

## What
gard worktree add --topic <t> --view <v> [--branch <b>] <repo>... makes .worktrees/<topic>/<view>/<repo dir> in the nearest root, mirroring the shell's layout. The view topic follows the topic's branch; any other view puts the named repos on its branch (created from the topic's branch, or from the main branch when the topic has none) and every other repo the application runs on the topic's commit, detached, because git keeps one branch in one worktree only. Names are checked: the topic as yyyy-mm-dd-slug, the view as a slug (a Jarl issue's NNN-slug fits), no name Windows reserves, and no two names that differ only in case. A branch with the wanted name that Gard did not make is never reused; the answer says so and offers a suffix.

## Why
Every piece of work gets the whole application in its own state, so a worker can bring it up and test exactly its change while others work beside it.

## Acceptance
- A test makes the topic view and two issue views in a shell of three repos and checks each worktree's branch or detached commit and the mirrored paths, including own/api
- Tests refuse a reserved or case-colliding name and a foreign branch of the same name, each with its fix

## Evidence

