# 266 · Publish Althing: the residual-identity review, the owner's read, one squashed commit, the GitHub repository and the first push (the move's step M12)

**Status:** dropped
**Kind:** process
**Priority:** 2
**Tier:** strong
**Key:** 20261006T0609-dxib
**Tags:** althing, migration, needs-owner
**Files:** 
**Repo:** ../..
**Found by:** jarl
**Where:** Althing has no git remote yet; .github/workflows/rails.yml first runs on the first push
**After:** 264, 265, 284

## What
Before the first push, a one-off fresh Opus residual-identity review reads the whole tree for any passage that could identify a client without naming it, and reports outside Althing (testimony, not proof). The owner then reads VISION.md, method/rulings.md, the 6.2.0 loop's decisions.md, asks.md and goal.md, family/canon.md's history sections, family/history.md, AGENTS.md and rails/README.md. On his word: the local history is bundled and kept privately outside Althing, then squashed to one orphan commit ("Althing: the family layer, first public commit"), so no intermediate state (text before translation, paths before rewriting, a name fixed after a scan) is published; yg check and node rails/run.mjs tree --require-key run on that commit. The owner creates the repository and its secret: gh repo create krzysztofdudek/Althing --public --description "The Yggdrasil family's layer above its tools: the thesis, the canon, every release loop and its rulings, the research, and the workspace that proves each release's exact commits work together. Developed in the open, in English." --homepage "https://chrisdudek.com"; gh repo edit krzysztofdudek/Althing --add-topic yggdrasil-family,ai-agents,architecture-as-code,release-engineering,agentic-coding,claude-code --enable-wiki=false --enable-projects=false --enable-issues=false; gh secret set ALTHING_NAMES_KEY -R krzysztofdudek/Althing from his key file; optionally a main ruleset that blocks force-pushes and deletion and requires no pull request. Actions keep their defaults (enabled, read-only token). The jarl then adds the remote and pushes main, and the pre-push rails scan the one commit. After it, the jarl pushes Althing's main whenever the pre-push rails are green (ask-012). Each of the owner's steps is asked in the chat, with the exact commands, when it is due.

## Why
The first push cannot be taken back: forks, caches and the events API keep whatever it carries. Every check before it is cheap, and every fix after it is a history rewrite.

## Acceptance
- The residual-identity review is done and each passage it flagged is fixed, recorded as an evidence row with counts only
- The owner said "push" after his read, recorded as his answer to an ask
- The pushed main is one commit whose tree equals the last local tree; yg check and node rails/run.mjs tree --require-key were green on it before the push
- rails.yml is green on GitHub on that commit, and the repository's description, topics and settings are as the owner set them

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: Althing is already public on GitHub and its main is pushed. Ruling backlog-tidy-for-the-three-tools.

