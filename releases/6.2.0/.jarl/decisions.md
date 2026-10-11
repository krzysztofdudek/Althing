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
**Superseded by:** jarl-6-2-0-scope-revised (2026-10-08)

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

## 2026-10-06 · goal-check-lines
The goal names one Check line per repository, mirrored from the release manifest's check entries: Runes npm run check; Yggdrasil cd source/cli && npm test inside its devcontainer; Grain cd plugins/grain && npm test; Jarl cd skills/jarl/scripts && npm test; Horde cd skills/horde/scripts && npm test; Althing yg check && npm test. The merger has run each repository's check on every merge since the loop began, so the loop stops reporting that it lands on testimony alone: the check decides what lands, a review can stop a change and is recorded as testimony. Amending the goal is the owner's word; it is done here under the standing mandate autonomy-quality and goes to him as a ratify item. Jarl 6.1.0 reads Check lines without a repository name; the per-repository form arrives with issue 246, and the lines are rewritten then.

**By:** jarl

## 2026-10-06 · althing-move
Under althing-family-layer, this loop moved on 2026-10-06 from the private practice repository to releases/6.2.0 in Althing, and is translated into English. Stage A was mechanical: repository paths made relative to the new location, the Althing issues (239, 254-259) re-homed with Repo ../.. and their checks under workspace/checks/, absolute paths and session scratchpads rewritten, the four Polish tags renamed partial, compatibility, release and needs-owner. Stage B translated every prose segment (issue titles and sections, the free text of the log lines, the rulings, the asks, the goal) against one glossary, renamed the ruling slugs to English and the issue files to their English titles, and three fresh reviewers compared the open and in-flight issues, every ruling and ask, the goal and a 10% sample of done issues and log lines with the Polish side by side. Evidence: with the Jarl 6.1.0 library imported directly, the original and the moved copy show zero differences in every issue's gate state, header fields and evidence-row count, in the log's event sequence, and in the rulings, asks, status, report, next and list, modulo the slug and file-name maps; the invariant tokens of every Polish segment are in its English one, apart from Polish word fragments and private paths said in words; Althing's English, path, secret and keyed name rails are clean over the whole loop. The map of old to new identifiers stays private. From this commit the live record is here; the private copy is frozen and never written again.

**By:** jarl

## 2026-10-08 · jarl-6-2-0-scope-revised
Jarl's 6.2.0 scope, revised under autonomy-quality (the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.4; it restates the whole of jarl-6-2-0-scope with the changes below). The order: J1 241 → J2 248 (the whole class of truncation to the first line) → J3 245 (narrowed) → J4 249 → 246 → J6 252 (record format marker) → J7 247 → J5 251 (verify) → J8 244 → J9 250 (rebuild of SKILL.md, last); 253 (the goal command) after 246, if it goes in. 246 and 247 trade contents, and each title then says what its issue does: 246 keeps its own subject, the check per repository, and becomes "a merge records the check that decided it", which needs no repository names and no format change; 247 comes back from deferred as the repositories entity (names for sibling repositories declared by Jarl in .jarl/repos.md, root-commit identity checked where Jarl acts, the format deciding how a value is read, no worktree location recorded). Against what the owner approved in a-002: 246 leaves J7, the bucket first to set aside, so the merge check no longer slips with the names; 246 gains the CI default, --red and the derived landing, which are growth and wait for his word (a-018); 247 returns from deferred; two parts of 247 are dropped, not carried to 6.3.0: discovering moved repositories among siblings (the root-commit check finds a wrong or moved checkout and names the fix), and checking that declared files exist on the loop's branch (noise for every issue that creates a file); per-machine path overrides stay out (a symlink beside the loop's checkout is the override, with no code). Jarl's first item to set aside if needed: J7, now 247 alone. Unchanged: jarl-record/2 and moving work between loops stay out; global entry ids stay rejected; the record.mjs contract (jarl-record/1) is unchanged in 6.2.0, and should a package have to change an export, it bumps the version according to the existing rule; jarl-record/2 in 6.3.0; an answer to a ratify item must name who answered, and it rejects coordinator names (jarl, reeve, coordinator, the loop's name).

**By:** jarl
**Supersedes:** jarl-6-2-0-scope

## 2026-10-08 · worktree-paths-before-push
The worktree paths leave this loop's record before Althing's first push (the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.5 items 1 and 2; the work is issue 284). From now on the coordinator passes no --worktree when it leases an issue: a lease is its branch, its worker and its moment, and git knows which worktree holds a branch. Nothing is lost: Jarl 6.1.0's done gate reads a lease line's worker up to the end of the line (jarl-lib.mjs:1766 at 2c12aa3), the Worktree field's only reader is the "worktree gone" warning (:2395), which is wrong for the devcontainer's worktrees anyway, and branches reads worktrees from git (:2466). Before issue 266, in one rewrite by the method of althing-move: the "· worktree <path>" tail of each of the 217 lease lines in log.md becomes "· worktree <its last segment>", and the Worktree field still on a live lease is removed. Jarl 6.1.0's library, imported directly, must show zero difference before and after in every issue's gate state, its header fields other than Worktree and its evidence rows, and in status, next, report and list. The precondition is that no other copy of the loop's log is in flight: the log merges by union, and only main carries this loop. The reason is timing: the first push goes out as one squashed commit before this loop can close, so whatever the record holds then becomes public for good, and whatever is rewritten before it never does; the worktree path is the one value in the record that belongs to one machine. The record is otherwise frozen as its driver wrote it, with jarl-pinned-in-loop and the manifest's pin intact. After the rewrite the paths rail's worktree allowance goes, as a new version of the rule, which is the owner's to ratify. Rewriting the done gate's event store is the owner's kind of choice, so this goes to him for ratification under autonomy-quality.

**By:** jarl

## 2026-10-08 · repo-paths-interim
On whether this loop's relative sibling Repo paths may go public with Althing's first push (issue 266), or the push waits until the loop has closed and been converted to repository names (the question of the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, A.5 item 5, which recommended the first; he answered in conversation before an ask was filed), Krzysztof, 2026-10-08 (translated from Polish): "whichever, as long as in the end it is right and agents know where to look for what". The ruling: the 6.2.0 loop keeps its relative Repo paths, which go public with the first push; loops from 6.3.0 on name repositories (247); briefs resolve every repository to its real checkout on the machine (ws brief, and from Jarl 6.2.0 also show and status --by repo), never by joining the loop's root and a Repo value.

**By:** owner

## 2026-10-08 · ask-018
**Question:** 6.2.0 growth, all of it in one question (the design research/2026-10-08-jarl-field-report-and-repository-names/design.md, Proposed changes, built on a field report from a loop in another project): beyond the Jarl scope you approved in a-002, the design proposes (1) in 246, that a merge no longer records its CI as pending by default but only when a run will report, that a merge which lands while its check is red for a cause outside the branch is recorded with --red naming the issue that tracks the cause, and that whether a repository lands on its check is derived from its merge rows instead of a declared Check line; (2) in 244, that one answer can settle several ratify items with one verdict, and that superseding a ruling names the open issues that still cite it; (3) in 250, that the sentence "a compaction is a session start" also goes into the instructions Jarl's MCP server gives the host; (4) issue 280, that show prints by default only what the done gate counts (every row and verdict since the last start, every unanswered finding) and show --full the whole file. Options: (a) all four into 6.2.0: the Jarl part of the release grows, and 247 stays the first item to set aside; (b) none, they go to 6.3.0: until then a merge's CI stays pending or none, both false for a merge that is not pushed, an outside red is charged to the worker as a round, and show grows with 248's full reviews; (c) choose item by item. Recommendation (the architect's design): (a); it proposes every item for 6.2.0 and names the bounded show explicitly, because 248, already in 6.2.0, makes show grow faster.
**Answer:** The owner chose the option 'All into 6.2.0 (Recommended)' (option label, translated from Polish): the four growth items go into Jarl 6.2.0 — 246's CI default, --red and derived landing; 244's several-ratify answer and supersedes naming the open issues; 250's MCP server sentence; the show bounded by the gate's window (280).

**By:** owner

## 2026-10-08 · ask-003
**Question:** The version of Horde's promises rule package at the 6.2.0 release (D6 of the plan): (a) 6.2.0, per Horde's CLAUDE.md and the bump bullet in the releasing skill — users' yg advise will propose an update with no change in content; the planner's recommendation, and the skill gets a corrected sentence; (b) it stays 6.1.0, because nothing in packages/promises/ changed (the skill's sentence about opening a release).
**Answer:** The owner chose the option '6.2.0 like the whole family (Recommended)' (option label, translated from Polish): the promises rule package is released as 6.2.0 together with the family even when its content is unchanged, per Horde's own rules; the releasing skill's sentence that says otherwise is corrected.

**By:** owner

## 2026-10-08 · ask-004
**Question:** Ratify item: plan-6-2-0 — ten design rulings of the jarl under the autonomy-quality mandate (D2 Kotlin together with Java, D3 a using alias gives an edge and nameof silence, D4 '.' as the whole repository, D5 structural certification of absence, D7 Jarl's fix now, D8 outDir→rootDir plus a warning, D9 Yggdrasil's view = the files git would commit, D10 parsing cost described, D11 the corpus in Runes and Grain, D12 --reference does not turn on progressive mode).
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-005
**Question:** Ratify item: 193-tracked-cache-untrusted — a local cache under .yggdrasil/ tracked by git (.yg-lock.deterministic.json included) is never trusted; repositories that commit it will get, after the upgrade, a warning and unverified script pairs (a Before you upgrade note).
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-006
**Question:** Ratify item: 098-binary-does-not-block — a file without a UTF-16 BOM with a NUL in its first 8000 bytes is binary and skipped with a non-blocking warning (e.g. a .ts video segment), instead of blocking check as unreadable.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-007
**Question:** Ratify item: 042-file-quarantine — in 6.1.1, functions with the same name in a file get no trend conclusions (~5% of scopes); the full solution in 230.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-008
**Question:** Ratify item: 008-skip-parent-without-graph — the commit that adds the first graph does not turn all existing code red in progressive mode; --full still catches everything.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-009
**Question:** Ratify item: jarl-pinned-in-loop — the 6.2.0 loop writes its record with Jarl 6.1.0 until it closes; Jarl 6.2.0 is checked on frozen copies of the loop, and Jarl's merger works in its own worktree.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-016
**Question:** Ratify item: goal-check-lines — the goal now names one Check line per repository (Runes, Yggdrasil, Grain, Jarl, Horde, Althing), mirrored from the release manifest, so the loop reports that its merges land on each repository's check rather than on reviews alone.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-017
**Question:** Ratify item: the Althing rail loop/shape, new version — it now accepts an issue file name ending in a dash, which Jarl 6.1.0 itself writes when it cuts a title at 60 characters (47 files of this loop). Until you admit the new version the rule is advisory: it reports a malformed loop but does not block a commit.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-019
**Question:** Ratify item: jarl-6-2-0-scope-revised — 246 and 247 trade places: 246 becomes 'a merge records the check that decided it' and leaves the bucket first to set aside, 247 returns from deferred as the repositories entity and is now that bucket, the two remaining parts of 247 are dropped rather than carried to 6.3.0, and per-machine path overrides stay out.
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-08 · ask-020
**Question:** Ratify item: worktree-paths-before-push — the coordinator stops recording worktree paths now, and before Althing's first push the 217 machine paths of worktrees in this loop's log are cut to their last segment and the live Worktree fields removed, checked with Jarl 6.1.0's library to change nothing else, by the method of the move (althing-move).
**Answer:** Ratified: the owner chose the option 'Approve all (Recommended)' (option label, translated from Polish) for the ten ratify items put to him together on 2026-10-08.

**By:** owner

## 2026-10-11 · model-calibration-in-6-2-0
The owner, 2026-10-11 (translated from Polish): the skill is for models of every provider, not only Anthropic's — it may suggest, but the whole range is open, without discrimination, because different models are good at different things. Jarl should calibrate itself: it checks what tasks a given model can do and decides whether it fits a category, because otherwise assignment cannot keep up with a new model every few weeks. He chose option B: the mechanism goes into Jarl 6.2.0, as a fifth item beyond the scope of jarl-6-2-0-scope-revised. Direction: the record already holds who did a task, its rounds and the reviewer's findings; add the model that did it; Jarl derives, per model and kind of task, how often work passes without changes, and suggests an assignment without forbidding any. A new model enters the pool at small tasks with a stronger reviewer. The reviewer is never of the worker's own model and never weaker than the worker until the data say otherwise. The hub's and Althing's rules stop naming models: the model is always explicit, any provider is allowed, measurement suggests the split. The first data are in a private deployment's test of three Claude models as workers and reviewers.

**By:** owner

## 2026-10-11 · reviewer-rule-on-clearing-approve
The owner's rule that the reviewer is never of the worker's own model and never weaker than the worker, until the data say otherwise, applies to the approve that clears an issue. A lighter or same-model reviewer is welcome to add a changes verdict first, since in the field a light first reviewer was right in 4 of 4. Until models shows that a reviewer able to clear (neither the worker's model nor ranked below it) checked at least five of its approves for that kind with no miss, the clearing approve comes from a model that is neither the worker's own nor ranked below it; may clear in models is what until the data say otherwise means. A breach is a note and a count, never a refusal. This is an interpretation of the owner's ruling model-calibration-in-6-2-0, made under the mandate and put to him for ratification. Source: research/2026-10-11-jarl-model-calibration-and-field-notes/design.md, A.9.

**By:** jarl

## 2026-10-11 · hooks-silent-while-refreshing
While a hook-started refresh runs, the edit-time hooks answer nothing; they emit no status marker. The acceptance allows the rest to wait or answer with a marker, and the release plan's defaults allow a marker or silence while refreshing, never the old index. A marker on every edit would put a line into the agent's context on each tool call for the seconds or minutes a refresh takes, and SessionStart already says that the hooks are silent while the index is behind. Waiting would stall the edit. Silence is therefore the answer, and the documentation says so.

**Settles:** 228

**By:** jarl
