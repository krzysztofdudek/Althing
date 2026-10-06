---
name: keeping-the-canon
description: Use when the wording that describes the family changes or is checked - the canon, a tool's README family section or headline, a GitHub description or topics, the profile README, the website copy, the tool map or the contracts index, the list of tools in the family, or a phrase the canon retired - and before writing any public sentence about what the family is. Applies whatever language the request is in.
---

# Keeping the canon

The canon, `family/canon.md`, is the one place where wording about the family is written. Every family README's family section, each tool's headline, the GitHub descriptions and topics, the profile README of `krzysztofdudek/krzysztofdudek` and the website copy quote it or adapt it; none of them originate wording of their own. The list of tools comes from one place before even the canon: `family/registry.json`. If a sentence anywhere cannot be reduced to the canon without losing a true fact, the fact goes into the canon first. The canon is never allowed to be less true than what it replaces.

Built today versus where it is going: the canon, the registry, the map and the contracts index are being written in the open loop (the family region), and the drift check moves into the workspace as `ws check canon-sync` with them. Until those files and that command exist in the tree, say so, and do the checks below by hand. Below, `ws` is `node workspace/ws.mjs`.

## What the canon holds

- **The family block**, between `<!-- CANON:FAMILY-SECTION:START -->` and `<!-- CANON:FAMILY-SECTION:END -->`: copied byte for byte into the `## The Yggdrasil family` section of each tool README (Yggdrasil, Grain, Horde, Jarl, Ratatoskr, Urd, Researcher; Runes is shared code, not a member, and carries no family section).
- **The self-reference convention:** a README names its own tool unlinked (bold, no link) and, where its bold name is the first cell of a table row, appends ` (this one)`. Nothing else in its copy differs from the block.
- **The conventions around the block:** versioning (the core on one number, the add-ons and Runes on their own), who raises and lowers law, trust, the dependency graph, the shared contracts, and what is built, not yet built and not measured.
- **Per repository:** the headline (the bold line right after the README's title), the GitHub description with its length, and the topics.
- **What changed, by release:** a dated section for every change to the family's composition or wording, with its ruling.
- **The retired phrases:** each with what replaced it. A retired phrase greps to zero in every surface.
- **The register:** plain words, no jargon put on the reader, what is built today kept apart from where it is going, honesty over hype. Every public sentence about the family follows it.

## Changing a sentence

1. **The registry first** when the change touches which tools exist, their kind (core, add-on, shared) or their repository. The rail `canon/registry-consistent` refuses a canon block, `family/map.md` or `family/contracts.md` that names a core tool or an add-on the registry does not, and no other file may hardcode the list.
2. **The canon next.** Change the sentence in `family/canon.md`, in the block or in its conventions, and add the reason: the ruling that decided it, or the fact that made the old sentence untrue. A change of composition or meaning gets a line in the "what changed" section of the current release.
3. **Retire the old wording** when it is replaced, not merely moved: add it to the retired list with its replacement, then grep every surface for it.
4. **Every surface that quotes it**, each as an issue in the open loop for its repository, never edited from Althing's code:
   - the family section of each of the seven tool READMEs (the core on its release branch, the add-ons on `main`), and a headline where it changed;
   - the GitHub description and topics: `gh repo edit` is the owner's word every time, so the issue carries the exact command for him;
   - the profile README and the profile repository's description, a public repository, pushed on his word;
   - the website: its copy lives in a private repository the owner drives. Althing never names, links or reads it; tell the owner what changed in the canon, and he carries it over.
5. **`family/map.md` and `family/contracts.md`** when a tool's role, place or contracts changed.
6. **Check the drift:** `ws check canon-sync` across every registry repository and surface, once it exists. Until then, by hand: take the block between the markers, apply the self-reference convention for each tool, and compare it with that README's family section and headline on the branch the release declares (`ws status` names it). Record the comparison as an evidence row on the issue.
7. **Anywhere else in Althing** (the README, `VISION.md`, a method document, a skill) a sentence about what the family is links the canon instead of restating it.

## Limits that are checked before a push

- A GitHub description is at most 350 characters; the canon records each one's length.
- A repository has at most 20 topics, lower-case, letters, digits and hyphens. Every family repository carries the shared three: `yggdrasil-family`, `ai-agents`, `architecture-as-code`.
- A headline is one bold sentence, the same in the README and in the canon.

## Never

- A tool README, the profile or the website with family wording the canon does not have.
- A retired phrase left standing anywhere it can be grepped.
- A claim in public wording that is not built today, unless the sentence says it is where the family is going.
- A private name, repository or client in the canon: it is public, like everything in Althing.
