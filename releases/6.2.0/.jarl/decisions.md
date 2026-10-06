# Decisions

## 2026-10-02 · patch-per-repo
The owner, 2026-10-02: "this process does not apply to patches, and patching goes independently per repo" (translated from Polish) and "Leave it on a local branch, do not release these fixes" (translated from Polish). This loop is a list of issues for 6.1.1, not a release: each repo makes its own fixes, on a local branch release/6.1.1, and nothing reaches main or is released without the owner's word.

**By:** owner

## 2026-10-02 · fixes-on-word
The owner, 2026-10-02: "Just so you know, you do not make any fixes until I tell you" (translated from Polish). Findings from the bug hunt go into this loop as issues; none is fixed until the owner says which.

**By:** owner

## 2026-10-02 · fixes-start
The owner, 2026-10-02: "go ahead with the fixes" (translated from Polish), after the bug hunt's results and a proposed order were reported (036, the Grain → adopt path, 057 and 023, then the extractors). Fixes go per repo on local branches: Yggdrasil release/6.1.1, Grain release/6.1.1, Runes release/1.0.1 (the relation extractors live in Runes); nothing is pushed or released without his word. Matters that need a design decision go to him as questions and are not settled silently.

**By:** owner

## 2026-10-02 · patch-scope
The jarl's finding (subject to the owner's veto): a patch fixes the defect and nothing beyond it — no new exports, options or contracts (Runes docs/api.md allows a patch nothing more). When a fix requires a behaviour change with a real trade-off, it goes to the owner as a question; when it requires a new option or a rebuild, the patch does only what fits within the defect (e.g. a clear error, or silence instead of a false edge), and the rest goes as an issue to a minor release. For Runes, the planner's default recommendations D1–D9 are adopted (plan in the scratchpad, patch-611/plan-runes.md): version 1.0.1; 012 without a workspace declaration stays with today's indexing of every package.json; 010 only the Runes half (excluded files treated as nonexistent), outDir→rootDir recovery in 1.1.0; 011 with mismatched paths in the references — silence; 014 and 075b in 1.1.0; 053 on Grain's side; 074 strips the BOM, reporting of unparseable configs in 1.1.0.

**By:** jarl
**Superseded by:** release-6-2-0 (2026-10-05)

## 2026-10-02 · yggdrasil-scope
The jarl's finding within patch-scope, subject to the owner's veto (the planner's recommendations, plan in the scratchpad, patch-611/plan-yggdrasil.md): 019 — the mapping entries '/', '//', './' and '.' are rejected with a clear error (the meaning 'the whole repo' is a feature for 6.2.0); 008 — a partial closure in 6.1.1 (a reference relative to HEAD falls back to the whole project, the block is compared with HEAD's parents), the full one (a reference passed in from CI) as an issue for 6.2.0; 029 — only a refusal of imports that the installation does not copy, plus documentation that there is no shared place for helpers yet (the layout in 6.2.0).

**By:** jarl

## 2026-10-02 · grain-scope
The jarl's finding within patch-scope, subject to the owner's veto (the planner's recommendations, plan in the scratchpad, patch-611/plan-grain.md): 039/040 — a convention about something the code never does does not become an enforced rule (it stays a draft), and in 6.1.1 it is not certified when the same part of the repo has a certified group that does it; 107 — the hooks stay silent when HEAD has moved since indexing (refreshing with a lock in 6.2); 053 — Grain stops declaring within-package Java relations, which Yggdrasil does not check; 045/130 — the --shape types report tells the truth about what it writes (enforcement in 6.2); 041/043 — the fixes go into 6.1.1, although they force a one-time re-parse of the history after the upgrade. Not for the patch: 003 (minor), 042 (the patch only stops drawing trend conclusions for functions with the same name and corrects docs/validation.md), 117 (the patch only reports the number of unresolved references).

**By:** jarl

## 2026-10-02 · 036-no-end-of-options
The jarl's finding: the acceptance of 036 named --end-of-options, but Grain sets no minimum git version (README: 'Node 22 or newer and git') and has worked on git 2.23.4, while --end-of-options exists only since 2.24 — requiring a newer git in a patch would be a new behaviour change. The refusal of a range side that starts with '-' holds on every git version (155 bypass attempts, 0 writes, checked on 2.13–2.52), so it is the protection, and --end-of-options was removed.

**By:** jarl

## 2026-10-02 · python-flat-roots
The jarl's finding within patch-scope, subject to the owner's veto: D4 (a) of 009 (an ancestor directory below the project root is not a place to look for imports) loses, in flat layouts, edges that 1.0.0 found and that Python/pytest resolve (Airflow: 490 edges in the provider tests; reviewer rev-runes-009). The fix stays, but for names outside the standard library a directory with conftest.py and no __init__.py (pytest's rootdir rule) and a directory with manage.py (Django runs from it) count as roots; standard-library names are still looked up only in their own directory or at the repo root (D4 b), so the 009 trap does not open. Airflow's DAGs folder and other configuration-dependent roots stay quieter than in 1.0.0 — described in the changelog entry.

**By:** jarl

## 2026-10-02 · changelog-red-after-upgrade
The jarl's finding: that the graph may turn red after an upgrade, because the extractors see more real edges, is said by the CHANGELOG once, in the 'Before you upgrade' section of the final pass, with a list of the languages and forms it affects — not in every entry separately. The entries of individual issues may repeat it but do not have to; the reviewer does not treat the absence of this note in an entry as an error. The form of the section depends on the owner's answer to ask a-001.

**By:** jarl

## 2026-10-02 · cochange-no-new-window
The jarl's finding within patch-scope: the fix for 048 must not introduce a new history limit. completeness, check, review, the hooks and where count file co-changes, as before, over the whole history — carried over to today's paths; grain cochange stays with its existing window of the latest 20 000 commits. Agreement with 127 holds where the windows overlap (repos below 20 000 commits, without mass commits), and the difference for longer histories is described in the documentation. A new window for everything would be a behaviour change with a trade-off — that needs the owner's word.

**By:** jarl

## 2026-10-02 · ask-001
**Question:** Should 6.1.1 release the fixes that close false greens (065: a relation to an ancestor bypasses an architecture ban; Runes 016/011/012/015/017: the extractors start to see dependencies hidden today), given that some repositories will turn red after the upgrade? (a) blocking in 6.1.1 with a 'Before you upgrade' note (recommendation), (b) a warning in 6.1.1, blocking in 6.2.0, (c) hold until 6.2.0.
**Answer:** The owner chose the option 'Blocking right away (Recommended)' (option label, not his words): the fixes that close false greens (065 and the new edges of the Runes extractors) go into 6.1.1 as blocking, with a 'Before you upgrade' section in the CHANGELOG; Grain 054 gets the same type condition as 065.

**By:** owner

## 2026-10-02 · ygg-p3-in-patch
The owner chose the option 'Everything in 6.1.1' (option label): all of Yggdrasil's P3 issues go into the 6.1.1 patch and do not move to 6.2.

**By:** owner

## 2026-10-02 · 116-no-all-use
The acceptance line of 116 about printing the all ↔ use pair on express is dropped: the data show that these methods change together as named functions in only 3 commits, below the threshold of 8, so the requirement rested on a false premise. The contract of 116 remains: pairs with an anonymous side neither use up the budget nor print, and named pairs that meet the threshold print under their own heading. Same-name pairs keyed by position stay in 042. The JSON key names recipe and kinStem (129) are accepted.

**Settles:** 116, 129

**By:** jarl

## 2026-10-03 · 042-file-quarantine
The 042 quarantine stays at file level (all functions with the same name in the file), not only siblings under one parent: in click, 'def cli' sits in different test functions and narrowing brings back a false 'fading', and history alone cannot tell these cases apart. Cost: ~5% of scopes without trend conclusions — better no conclusion than a false one. The proper solution (re-keying the scopes) in 6.2.

**Settles:** 042

**By:** jarl

## 2026-10-03 · 193-tracked-cache-untrusted
193: a local cache/state under .yggdrasil/ tracked by git (index or HEAD) is never trusted — .yg-lock.deterministic.json included. Test 6A in cli-log-remaining, which claims that a committed verdict cache survives a revert, is rewritten (option a): a revert of the committed files only, no log-integrity, a clean free fill, check --approve exit 0. This closes a false green, so in line with ask-001 (the owner: blocking right away with 'Before you upgrade') it goes in with a note in the CHANGELOG: a repository that commits .yg-lock.deterministic.json or another local cache will get, after the upgrade, a warning and unverified script pairs — the fix: add the file to .gitignore, remove it from the index (git rm --cached) and run the free yg check --approve --only-deterministic.

**Settles:** 193

**By:** jarl

## 2026-10-03 · 098-binary-does-not-block
098: a file without a UTF-16 BOM marker that has a NUL byte in its first 8000 bytes is treated as binary — skipped as in 6.1.0, with a non-blocking relation-file-binary warning (pointing to coverage.excluded / .gitignore). This narrows the literal wording of the acceptance for UTF-16 without a BOM (today only a warning, not relation-parse-failed): without a BOM, UTF-16 cannot be told apart from a binary file (e.g. a .ts video segment), and a patch must not turn a repository red for something that is not a defect. relation-parse-failed stays blocking for UTF-16 text with a BOM that still has a NUL, and for a file whose tree is nothing but ERROR.

**Settles:** 098

**By:** jarl

## 2026-10-03 · runes-101-not-yet
Asked about publishing Runes 1.0.1 (2026-10-03, when all of Grain's 6.1.1 fixes had been merged), the owner chose the option 'Not yet' (option label): Runes stays on the local branch; Grain and Yggdrasil finish the rest of their fixes, and their wrap-up (the Runes pickup, Grain's README 131, the final pass) waits for his word.

**By:** owner

## 2026-10-03 · 008-skip-parent-without-graph
008: when comparing the progressive block with HEAD's parents, we skip a parent that has no yg-config.yaml (the commit/PR that adds the first graph). This goes slightly beyond the scope of yggdrasil-scope, but it keeps the promise of progressive mode (adoption does not turn all existing code red) and agrees with Grain's sentence in 196: 'progressive mode starts once the adoption is committed on the local reference branch, or merged into origin/<branch>'. A PR that adds the first graph with a reference pointing at itself passes the measured step; --full still catches it.

**Settles:** 008, 210

**By:** jarl

## 2026-10-04 · finish-open-work
The owner, 2026-10-04: "Only close out the open work and do not open new tasks. I will let you know when you can" (translated from Polish). We finish the six Yggdrasil packages in progress (020-config-errors, 066-nested-roots, 079-singletons, 206-adopt-and-merge-truth, 032-check-report, 166-ignores-and-leftovers) through review and merge; we do not start the packages 028-packages and 021-navigation, the Runes pickup or the final passes until he says so.

**By:** owner

## 2026-10-04 · 189-merge-only
189 in 6.1.1 covers a merge made in this clone (including one stopped on a conflict): yg check and yg check --approve require the merge's entry. Rebase and squash (with no merge commit) move to a separate issue, 221, because they leave no trace in the history by which they could be recognised the same way.

**Settles:** 189, 221

**By:** jarl

## 2026-10-05 · resume-after-finishing
The owner, 2026-10-05, after a description of the rest of the work (two Yggdrasil packages, three small issues, the Runes release on his word, the pickup, the final passes, the corpus gate): "Continue" (translated from Polish). We resume along the recommended path: the packages 028-packages and 021-navigation, and the small package 221/222. Publishing Runes 1.0.1 still requires his explicit yes — I will ask separately when it is needed.

**By:** owner

## 2026-10-05 · runes-last
The owner, 2026-10-05: "We will release Runes only once we have closed all the issues, because something more may still come in and there is no point releasing earlier" (translated from Polish). Runes 1.0.1 is not published before all issues in the 6.1.1 scope are closed (except those deliberately moved to later minor releases). We join Runes into Grain (143) and Yggdrasil (142) and check it on the local branch release/1.0.1 (the package built locally, without publishing); pinning to the published version is a release step, in the family's order: Runes first, then Grain and Yggdrasil. Should anything come in for Runes meanwhile, it goes onto release/1.0.1 before publishing.

**By:** owner

## 2026-10-05 · release-6-2-0
The owner, 2026-10-05, asked about the 14 issues moved to later releases, chose the option 'Everything now, as 6.2.0' (option label): we fix all of the loop's issues, and the release changes its number — the family core (Yggdrasil, Grain, Jarl, Horde) 6.2.0, Runes 1.1.0. This is a renumbering of the open loop, not a second loop (releasing-the-family, point 3): the loop moves to releases/6.2.0, the branches release/6.1.1 → release/6.2.0 (Yggdrasil, Grain), release/1.0.1 → release/1.1.0 (Runes); the full family release protocol applies (a release issue with the tag release, one core version, the order Runes → Jarl → Horde/Yggdrasil/Grain per the skill). The patch-scope restriction (no new options or contracts) no longer applies; behaviour changes go with a 'Before you upgrade' note (ask-001). The question of whether the parts of issues that the *-scope rulings deliberately cut off for a minor release also go in is put to the owner separately.

**By:** owner
**Supersedes:** patch-scope

## 2026-10-05 · autonomy-quality
The owner, 2026-10-05: "Work autonomously when I am not available. Quality above everything. Decide that way" (translated from Polish). When he is away, the jarl settles things itself and records the ruling (decide), putting quality above pace and cost: at every trade-off, the choice that gives fewer false green and false red results, fuller tests and a more honest message, even at the cost of a longer loop. Still requiring his word: publishing and the release (224), pushing to remote repositories, irreversible things.

**By:** owner

## 2026-10-05 · plan-6-2-0
The plan for the rest of the release: releases/6.2.0/plans/plan-6.2.0.md (packages R1–R7, C1, RF in Runes; Y1–Y5, YF in Yggdrasil; G1–G10, C2, GF in Grain; H1 in Horde; J1 in Jarl; the corpus gate, section 6). The jarl's rulings (autonomy-quality, the planner's recommendations, all chosen for quality): D2 (a) — the Kotlin twin of 233 in this release, one 'Before you upgrade' for both languages; D3 (b) — a using alias gives an edge like using static, nameof stays silent with a stated reason (in nameof a simple name binds to a member first); D4 (a) — '.' is the only spelling of 'the whole repository' and means everything no other node maps, excluding .yggdrasil/, nested projects and coverage.excluded; '/', '//', './' rejected with a hint; two such nodes are an error; D5 (a) — certification of absence is structural, by comparison with the population in its own partition, without recognising tests by name (the README stays true); D7 (a) — Jarl's fix for worktrees in a container in this release (J1); D8 (a)+(c) — recovery of the package entry through outDir→rootDir, and where that is not possible, a package-entry-missing warning, without assigning to the package directory; D9 (a) — Yggdrasil's view is the files git would commit (tracked plus untracked non-ignored), from the working tree; D10 (a) — the cost of parsing junk input described in the CHANGELOG and README, with no time budget (determinism); D11 (a) — the E and R corpus in Runes, P and the parity of the three tools in Grain, the skill names both commands; D12 (a) — --reference never turns on progressive mode, it only overrides the reference where the configuration turned it on. The defaults from section 12 of the plan are adopted. Left for the owner: D1 (pushing Runes release/1.1.0 without a tag before publishing) and D6 (the version of the promises package).

**By:** jarl

## 2026-10-05 · runes-push-branch
The owner, 2026-10-05, on question D1 of the 6.2.0 plan, chose the option 'Yes, push the branch (Recommended)' (option label): when Runes is ready (package RF), the jarl pushes Runes' release/1.1.0 branch to GitHub without a tag and without publishing; Grain and Yggdrasil take in exactly that commit (Yggdrasil through a GitHub archive, Grain through vendoring), and Runes CI runs on that SHA. Publishing stays last (runes-last). This applies only to that branch; other pushes remain on his word.

**By:** owner

## 2026-10-05 · jarl-pinned-in-loop
This loop writes its record with Jarl 6.1.0 until it closes (the architect of Jarl, plans/jarl-architecture-6.2.0.md, section 3.5): the loop's CLI is the main checkout ../JarlSkill on the main branch (c9c36cf = v6.1.0 plus a CHANGELOG-only change), and that checkout never switches branches during the release. Jarl's packages work in worktrees ~/.jarl-wt/JarlSkill-NNN, and Jarl's merger merges into release/6.2.0 in its own worktree (~/.jarl-wt/JarlSkill-release), never in the main checkout. We check Jarl 6.2.0 on frozen copies of this loop, not on the loop itself. Jarl's MCP tools in the session are the installed 6.1.0 — consistent with the CLI. The first loop on 6.2.0 is the next release.

**By:** jarl

## 2026-10-05 · one-loop-per-directory
The owner, 2026-10-05, after the proposal of .jarl/<name>/ (many named loops in one repository, closing as a state instead of moving to the archive): "Hmm, actually I think I would rather it stayed as it is, as a single jarl 'mission'" (translated from Polish). The layout stays: one .jarl/ directory is one loop; several loops at once are several directories (--root), and a finished loop goes to .jarl/archive/ with the archive command. We do not bring this direction into 6.2.0, nor file it as an issue.

**By:** owner

## 2026-10-05 · ask-002
**Question:** Do Jarl's issues 241 and 244-250, and the new ones from the architect's review (verify, a record format marker, ratify for decisions made under the mandate), go into the 6.2.0 release (the ruling release-6-2-0 was made before them)? Options: (a) everything except the items the architect moved out, with repositories as the first to set aside should the release have to close earlier (the recommendation of the architect and the jarl); (b) only bug fixes (241, 248, 249, 245 narrowed), the rest in 6.3.0; (c) everything, including the items the architect moved out.
**Answer:** The owner: "yes" (translated from Polish), to the question of whether the architect's variant goes in (everything from the recommended Jarl 6.2.0 set except what the architect moved out; repositories first to set aside should the release have to close earlier) — after the architect's conclusions were explained and after rejecting the idea of .jarl/<name>/.

**By:** owner

## 2026-10-05 · jarl-6-2-0-scope
Jarl's 6.2.0 scope per the architect (plans/jarl-architecture-6.2.0.md, section 4; the owner's answer to a-002 'yes'): the order J1 241 → J2 248 (the whole class of truncation to the first line) → J3 245 (narrowed) → J4 249 → J6 record format marker → J7 repositories as an entity (246 with the core of 247) → J5 verify → J8 244 (options, decide --ratify, --by when answering a ratify item) → J9 250 (rebuild of SKILL.md, last); optionally a goal command, if J7 goes in. Moved out: finding moved repositories and checking that files exist (the rest of 247), jarl-record/2, moving work between loops, per-machine path overrides. Rejected: global entry ids. Jarl's first item to set aside if needed: J7. The jarl's rulings within this scope: the record.mjs contract (jarl-record/1) unchanged in 6.2.0 — should a package have to change an export, it bumps the version according to the existing rule; jarl-record/2 in 6.3.0. An answer to a ratify item must name who answered, and it rejects coordinator names (jarl, reeve, coordinator, the loop's name).

**By:** jarl

## 2026-10-05 · skald-leaves-family
The owner, 2026-10-05: "Throw Skald out of the family. It was a prototype. Do it as the first thing and put it everywhere right away, in the descriptions and the READMEs or wherever" (translated from Polish). Skald is no longer a member of the Yggdrasil family: the add-ons are Ratatoskr, Urd and Researcher. Changed the same day: the canon (with a history entry), INDEX.md, VISION.md, the releasing-the-family skill; the family section in the README and CLAUDE.md of seven repositories and the profile README, pushed to main (JarlSkill 2c12aa3, Horde b1e7607, Ratatoskr 166e155, Urd dd3de02, Researcher 034ec64, profile 6a1c778, Grain 53c84f8; Yggdrasil in progress through the gate) and to the release/6.2.0 branches of Grain and Yggdrasil; the profile description on GitHub changed. The 6.2.0 release does not include Skald. The push was on his explicit "put it everywhere right away" (translated from Polish).

**By:** owner

## 2026-10-05 · ask-010
**Question:** The name of the repository for the family's shared workspace (plans: the earlier family workspace design, section 6): Althing (the architect's recommendation: the assembly of all, where the law was recited; it fits Yggdrasil and Urd), Muster (in English: a gathering for inspection, 'pass muster'), Naust (the shed where a fleet's boats are checked before a voyage) or another; all are free under krzysztofdudek.
**Answer:** The owner: Althing, public. The full answer is in the ruling althing-family-layer.

**By:** owner

## 2026-10-05 · althing-family-layer
The owner, 2026-10-05 (quote): "Althing public, set yourself up a directory plus whatever is needed inside it, and the appropriate CLAUDE.md together with skills. Design a proper, self-sufficient workspace. It must contain the knowledge from [the private practice repository], enough that there is no need to reach into [it]. A public repo. A complete set of everything needed. From now on the family's development happens there (the exception is the landing page, but that is not family; rather, [the private practice repository] will reach into Althing to be able to update the landing page). […] I would do it right away, together with 6.2.0. And move the workplace over there. Release backlogs may be committed there, but one very important rule. Everything that is there is in English. I am doing this deliberately, so that I can work completely in public, including the methodology we use. Design it comprehensively, so that an agent started there does not need to know anything at all about [the private practice repository]. In effect, the vision goes there. […] It will be the layer above the family for us; [The private practice repository] stops being that kind of layer for the Yggdrasil family. […] there everything is in effect committed, deliberately. You can also model it on the construction of [the private practice repository] and on how Yggdrasil is configured there as the control gate. Everything has its place and everything is checked structurally […] Take the best of what we have here. Improve it so it is even better. In general this will be the place for research, investigations, thinking things through, building releases, handling issues and everything around the topic. The skills and CLAUDE.md should be perfectly designed for this" (translated from Polish). It follows: the repo krzysztofdudek/Althing, public, entirely in English; it takes over the family's vision, the canon, the tool map, the release procedure, the release loops (6.2.0 moved now, translated), the family's research and issues; the private practice repository stays private and reaches into Althing (e.g. for the landing page's content). It replaces D11 of the plan in its stack and compatibility part. Ask a-010 (the name) is closed.

**By:** owner

## 2026-10-05 · ask-011
**Question:** Althing, decision 1 of 4 (the Althing design, 8.3): your blunt words in public rulings (the 6.2.0 loop and the standing 6.1.0 rulings) — translated faithfully (recommendation: consistent with 'completely in public' (translated from Polish)) or paraphrased and marked '(paraphrased from Polish)'.
**Answer:** The owner chose the option 'Faithfully, without swear words (Recommended)' (option label): the content, tone and firmness of his words translated faithfully, swear words replaced with a neutral word, the marker '(translated from Polish)'; pure reactions with no decision do not enter the public rulings (they stay private).

**By:** owner

## 2026-10-05 · ask-012
**Question:** Althing, decision 2 of 4 (the Althing design, 8.3): after the first push — a standing permission to push Althing's main branch every time the pre-push checks are green (recommendation; recorded as a ruling in the loop), or every push on your word. Pushes to the tool repositories in 6.2.0 remain on your word.
**Answer:** The owner chose the option 'Standing permission (Recommended)' (option label): after the first push (on his word, after he has read the content), the jarl pushes Althing's main to GitHub on its own whenever the pre-push checks are green (English, zero client names, zero secrets, zero binary files); pushes to the tool repositories remain on his word.

**By:** owner

## 2026-10-05 · ask-013
**Question:** Althing, decision 3 of 4 (the Althing design, 6.6/8.3): the review of the competitive market (market strategy) — stays private, together with three business folders (recommendation; it can be moved later), or goes public to Althing with the rest of the family's research.
**Answer:** The owner chose the option 'Stays private (Recommended)' (option label): the competition review stays private, together with three business folders; it can move to Althing later in one move.

**By:** owner

## 2026-10-05 · ask-014
**Question:** Althing, decision 4 of 4 (the Althing design, 8.3): one sentence in the shared family description, which will go into the README of every tool, e.g. 'The family is developed in the open in Althing: its releases, research and rulings.' — add it or not (without it the READMEs do not change; a pointer to Althing in the tools' agent instructions will be there anyway).
**Answer:** The owner chose the option 'Yes, add the sentence (Recommended)' (option label): one sentence about Althing goes into the shared family description and into the READMEs of the seven tools, after Althing's first push.

**By:** owner

## 2026-10-06 · ask-015
**Question:** Althing: approval of Althing's 18 Yggdrasil rules (without it they stand as advisory): English only; zero private paths; zero binary files; links work; the layout of the root directory, family, research and releases; file names; the release manifest; frozen files; the loop's shape; the rulings ledger; consistency of the tool list; skill headers; workspace code with no writes to the tools; secret detection; wired hooks. Yes — the jarl runs the approvals on the owner's behalf and the rules become enforced.
**Answer:** The owner chose the option 'Yes, approve all (Recommended)' (option label): the 18 Althing rules are approved; the jarl runs the approvals on his behalf.

**By:** owner
