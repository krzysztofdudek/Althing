# 262 · Rulings ledger: close the fresh fidelity review's findings and turn the nine standing 6.2.0 pointer rows into entries (the rest of the move's step M7)

**Status:** open
**Kind:** docs
**Priority:** 1
**Tier:** strong
**Tags:** althing, migration, needs-owner
**Files:** Althing/method/rulings.md, Althing/method/releases.md, Althing/method/loops.md, Althing/.yggdrasil/model/method/yg-node.yaml, Althing/AGENTS.md
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/method/rulings.md:3 and :10 (the header), :21-33 (the 6.2.0 pointer rows), :277 (family-composition); Althing/method/releases.md:45 (patch policy with no ruling cited); Althing/method/loops.md:45 (release loops close)

## What
Step M7 is on main, merged in 117c1c6 (VISION.md, the rest of method/, the ledger). On 2026-10-06 a fresh Opus reviewer compared every ledger entry with its original ruling side by side; the comparison is kept privately with the originals, and nothing of it is quoted here. 35 of 47 entries and 6 of 9 pointer rows hold as written. The findings, by ledger slug and kind (M meaning, Q quote, C classification, P privacy):
- header (M): it calls every entry the owner's, but changelog-erratum-in-place, blocks-and-composer and the pointer jarl-pinned-in-loop were not ruled by him; it must say the ledger holds his rulings and those taken within his mandate.
- header (P, low): a second sentence describes the private repository that held the family's layer before 2026-10-05; the one neutral sentence about it belongs in method/boundary.md, and the header keeps only how a replaced name reads.
- issues-live-in-althing (M, minor): the last sentence narrows the rule to release loops, while method/releases.md gives a patch a loop of its own; it reads "Althing's loops".
- loop-in-release-directory (M, Q, P low): the original forbids running close on a release loop; the entry softens that, then adds a sentence that reverses it with no ruling behind it (method/loops.md:45 now closes release loops). The entry states the original, and marks in brackets that the later practice rests on no ruling; if the owner wants it to rest on one, that is his word. The owner's reply naming an option is his literal answer, not a label, and the entry says so. Two clauses about the private repository's internals go.
- changelog-erratum-in-place (Q): a quote of the owner is translated but not marked.
- findings-become-issues (C): the original covered one night's research round while he slept; carried as standing it says every finding is worked without asking, which the 6.2.0 loop contradicts (fixes-on-word, then fixes-start) and autonomy-quality now governs.
- free-way-of-working (M, Q): the night is 25 to 26 September 2026, not the 25th; the quote is weaker than the original's register (a neutral word of the same force).
- log-targets-and-context (Q, minor): the quote marker is not the form method/language.md sets.
- code-docs-conflicts (C): overtaken the next day by quality-first-mandate, then by the 6.2.0 practice and autonomy-quality; the ledger states no relation among them.
- blocks-and-composer (C, low): points 8, 11, 12 and 13 were acts of the 6.1.0 release; the entry says so and names the rulings that re-planned the rebuild (shared-code-vendored, horde-on-jarl-record, conditional-trust, consent-by-reach, entry-by-pain).
- shared-code-vendored (M, minor): the pause of the rebuild reads as if in force; it ended the same day.
- no-effort-estimates (Q, minor): the quote is weaker than the original's register.
- family-composition (P): the quote names one repository that is private, and the keyed deny-list lacks that name, so no rail stops it (node rails/run.mjs tree --require-key reports the tree clean). The leak response of method/boundary.md applies: nothing is pushed, the name is replaced by an editorial bracket, and the owner adds it to his deny-list. The name is never repeated in an issue, a log line or a message.
- quality-first-mandate (M, minor; C with code-docs-conflicts): the entry hides that the coordinator chose option C though it had recommended A.
- pointer jarl-pinned-in-loop (M, minor): the row omits that it is the jarl's ruling and that the next Jarl is tested on frozen copies of the loop.
- pointer ask-011 (M): a reaction that carries no decision stays out of the public rulings; the row says it is not recorded at all.
- pointer ask-012 (M): the row drops two limits: the first push is his word after he has read it, and pushes to the tool repositories stay his word.
- patch-scope (C, medium): classed superseded by release-6-2-0, yet that ruling lifted the limit only for the 6.2.0 loop; the rule still governs every patch under patch-per-repo, and method/releases.md:45 states it as policy with no ruling to cite. Carry it as a standing entry that says why it still binds patches, and cite it from releases.md:45.
- runes-last (C, low): its reason is general (shared code is published only once the release's issues are closed); carry it, or state the rule in method/releases.md as method.
- two kinds of release-scoped 6.1.0 rulings (C, low): the Yggdrasil version floor Horde accepts (that version or newer, never "the same major"), carried without the number if Horde still works that way; and the owner's acceptances of batches of proposed defaults (one of them a Horde routing rule: the worker declares an allowed relation, a forbidden dependency goes to the user, then the architect), carried the way horde-default-constants and mapping-change-is-code-change are, or "What is carried" says such an acceptance belongs to its release.
The owner's word, not a writer's choice: findings-become-issues, code-docs-conflicts and quality-first-mandate carry three rules on when the agent asks the owner (findings worked without asking; a real choice of behaviour goes to him; every choice settled without asking). They contradict one another and the 6.2.0 practice, where he held fixes until he named them and received design questions while present, and autonomy-quality governs while he is away. The relation among them goes to him through ws jarl ask (kind charter) before any of those three entries changes; the entries then state his answer, recorded as a ruling. No sentence is written in his place.
Separately, the nine 6.2.0 rulings that stand are pointer rows only because the loop was not in Althing when the ledger was written (rulings.md:21). It is now at releases/6.2.0/, so each row (patch-per-repo, ask-001, autonomy-quality, jarl-pinned-in-loop, one-loop-per-directory, skald-leaves-family, althing-family-layer, ask-011, ask-012) becomes an entry with Origin releases/6.2.0, checked by the rail rulings/ledger, which needs a uses relation from the method node to the loop's node.

## Why
The ledger is the public home of the owner's standing words, the operating doc and the skills cite it by slug, and he reads it before the first push. A mistranslated or misclassified ruling misleads every agent that cites it, and one entry names a private repository that no rail catches.

## Acceptance
- Every finding listed in What is closed in the ledger (or, for runes-last and the two kinds of 6.1.0 rulings, by a decision written into this issue's evidence), and a second fresh Opus reviewer, comparing side by side again, reports no open finding (recorded as --ran/--saw)
- The relation among findings-become-issues, code-docs-conflicts and quality-first-mandate rests on the owner's answer to an ask (its id in the evidence), recorded as a ruling; AGENTS.md section 7 and every skill that cites those slugs agree with it
- family-composition names no private repository, the owner has confirmed the name is on his deny-list, and node rails/run.mjs tree --require-key reports the tree clean
- The nine rows are entries with Origin releases/6.2.0 (with patch-scope if carried), the paragraph that says the loop is not yet here is gone, and yg check && npm test are green with rulings/ledger resolving every pointer

## Evidence

- **ran:** git show --stat 117c1c6 · **saw:** merge: the thesis, the method and the rulings ledger (M7); 11 files changed: AGENTS.md, README.md, VISION.md, method/INDEX.md, althing-architecture.md, issues.md, loops.md, releases.md, research.md, rulings.md, working-model.md
- **ran:** node rails/run.mjs tree --require-key · **saw:** rails tree: clean, although family-composition names a private repository: the keyed deny-list lacks that name

