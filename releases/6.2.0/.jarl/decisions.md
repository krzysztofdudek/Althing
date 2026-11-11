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
**Superseded by:** runes-1-1-0-for-jarl-rest-in-1-1-1 (2026-11-03)

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
**Superseded by:** jarl-release-alone-with-every-jarl-issue (2026-10-18)

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

## 2026-10-18 · jarl-release-alone-with-every-jarl-issue
The owner, 2026-10-18 (translated from Polish): release only Jarl for now, and finish every issue that concerns Jarl first; on the architect's review (the scope review of 2026-10-18) he answered 'carry out everything'. So Jarl 6.2.0 ships alone, from branch release/6.2.0 of JarlSkill cut from main, on the Runes 1.0.0 copy it already vendors (Runes 1.1.0 is not required for it); every open Jarl issue goes in, the five that were deferred (281, 282, 283, 289, 290) return to open, and 269 goes in split (its test half now, its README and CLAUDE.md half after Althing's first push). 289 and 308 are one package. The record format step is one: format 2 is raised by the first write a 6.1.0 reader would misread silently (a repository name, an id of 1000 or more, a retraction). The 6.2.0 loop keeps its driver Jarl 6.1.0 (jarl-pinned-in-loop). Issue 258 compares the vendored files rather than version labels and allows a declared exception for Jarl's Runes pin; family.json stays open with Jarl's commit null until the family candidate; 224 is split so that Jarl has its own release issue.

**By:** owner
**Supersedes:** jarl-6-2-0-scope-revised

## 2026-10-18 · skill-split-before-skill-rebuild
The owner, 2026-10-18 (translated from Polish): the Jarl skill is badly built, too much text in one file, and must be split following the best practices for writing skills. Issue 337 does the split (a short SKILL.md and references loaded by role), before 250. 250 then rebuilds the content inside that structure: its acceptance line about the size of the main path (smaller than the old 104.6 KB) is replaced by 337's budget (SKILL.md at most 250 lines and 25 KB), its other lines apply to the file that now holds that content, and 318 and 311 read every file of the skill, references included.

**Settles:** 337

**By:** owner

## 2026-10-19 · format-2-triggers-include-plain-numbers
The record format 2 is raised by the first write of anything a reader of the previous release would read wrongly in silence. The list is four, not three: a repository name in Repo, an issue or a question number of 1000 or more, a retraction, and an issue or question number below 100 written without leading zeros (the previous release reads exactly three digits and would skip such a file). Consequence, written into the release notes: a fresh loop, and any loop holding fewer than 100 issues, becomes format 2 at its first plain number, so every copy of Jarl that touches it must be this release; a loop that already holds 100 issues or more files its next numbers identically in both spellings and is not raised by them. This corrects the wording of jarl-release-alone-with-every-jarl-issue and the acceptance lines of the format and ids issues, which named three triggers.

**By:** jarl

## 2026-10-19 · jarl-fixes-ship-as-a-later-patch
Jarl 6.2.0 is published as it stands. A fix Jarl needs after that ships as 6.2.1 under its own release; nothing is held back for it and the family does not pin a later Jarl tag.

**Settles:** 313

**By:** owner

## 2026-10-28 · everything-stays-in-6-2-0
Nothing of this loop moves to a later release: every open issue, the low-priority ones included, ships in 6.2.0; a tool may still ship a patch on its own when it needs one (the owner, 2026-10-28, translated: 'I would rather not move anything to 6.3.0, let us take everything into account in 6.2.0'; 'patches I do not count: there is 6.2, and later we bump patches per tool as needed').

**By:** owner

## 2026-10-28 · family-repos-leave-only-code-on-host
Every repository of the family is developed so that it leaves nothing on the host but its code: dependencies, build output, caches, temporary files and worker checkouts live in the repository's dev container and its volumes, never in the checkout or anywhere else on the host (the owner, 2026-10-28, translated: 'every repository of the family should work like this, that is: it leaves absolutely no garbage on the host. Only code.'). The pattern is the one issue 346 describes for Yggdrasil.

**By:** owner
**Superseded by:** family-repos-through-gard (2026-10-29)

## 2026-10-29 · new-tools-in-6-2-0
Krzysztof, 2026-10-29 (translated from Polish): "Instead of doing it on the side, we go straight into Althing. Your only task is to prepare the best backlog in the world and integrate our plan with Althing. We do not push there for now. New tools enter 6.2.0. Tag the work to be done accordingly." And later the same day: "In general you do a full port of what we had [outside Althing], but in line with Althing, best in a self-contained way, so that the tickets do not have to refer to anything outside Althing. Then we will have one common loop for the tools and less fuss and mess in directories." And: "Write to Althing so that it applies universally; for my own use case perhaps only a small file [kept privately] for later." The ruling: Gard and Mimir enter release 6.2.0, their whole backlog lives in this loop written for any user, and the owner's private setup stays outside Althing. The issues are 359 to 366 and 424 to 462; the design is research/2026-10-29-mimir-and-gard/.

**By:** owner

## 2026-10-29 · shells-are-a-tool-of-their-own
Krzysztof, 2026-10-29 (translated from Polish): "What I was thinking yesterday: to treat the subject of shells separately from Mimir, as a separate thing. You may want shells but not Mimir. Does it make sense?" And, on the family: "Every thing that joins the family has to make it grow sensibly and logically, so that it is not something silly and unforeseen. In this case it is about environments working and about managing knowledge on the computer, so that the computer is aware of my work, in fact." The ruling: shells, containers, running commands in them, the rules of order and the engine of the git gate become a tool of their own, Gard; Mimir keeps knowledge and work. Gard is named after the enclosure of Norse myth.

**By:** owner

## 2026-10-29 · gard-first-mimir-paused
Krzysztof, 2026-10-29 (translated from Polish): "I would like to have Gard first." And: "How do we now lay out the work to prepare Gard from zero to a full, complete release? We would suspend Mimir for now; only save Mimir's status, so that we know later what we return to." The ruling: Gard is built first to a complete 1.0.0; every Mimir issue waits on 426, which the owner settles; Mimir's state is recorded in releases/6.2.0/plans/plan-mimir.md.

**By:** owner

## 2026-10-29 · worktrees-follow-gard
Krzysztof, 2026-10-29 (translated from Polish; the names of a company and of a project replaced by neutral ones): "The worktree question. It has to be done so that when you have a Jarl like that, it follows Gard's place for worktrees. Tasks may be written up in Desk/Acme/Private/Topics/2026.10.29 - prepare onboarding to Example Application. The repositories are in Desk/Acme/Example Team/Example Application (the shell here)/backend repo (or and frontend repo and more directories for other apps). Does it make sense? Then the worktrees are in Example Application/.worktrees/<backend, frontend or another service, after the directory name above>. Then we support every case. It does not have to be in the same directory; it may be own/external, as I have in [another company's] workspace, and only there the repositories. All of it is meant to allow a container (a devcontainer, for example) that brings up the whole application." When the jarl answered that a Jarl loop needs a worktree per issue, he asked: "And what about a worktree per Jarl task?" The ruling: a shell sits at the level of the application with all its repositories; worktrees live in .worktrees of the nearest root as topic, view and repo, the view mirroring the shell's layout; every view is the whole application, with the repos it does not change on the topic's commit; a Jarl loop applies this through its briefs (gard worktree add with the issue's NNN-slug as the view), with no code edge from Jarl to Gard.

**By:** owner

## 2026-10-29 · one-volume-per-worktree
Krzysztof, 2026-10-29 (translated from Polish): "As for worktrees and volumes, there will be one volume per worktree and that's it, since it is one directory. Nothing will catch on anything for anyone there, right?" The ruling: every worktree's dependencies live in a volume of their own and no two views share one; only a package manager's cache may be shared, because npm and pnpm are made for concurrent use; containers, networks, data volumes and host ports are named and given per view. It replaces Mimir's earlier rule that the worktrees of one repo share their volumes.

**By:** owner

## 2026-10-29 · gard-gives-the-full-range
Krzysztof, 2026-10-29 (translated from Polish): "Getting the application to come up like that is the problem of the application's author. The only thing Gard gives is the full range of possibilities, and I would not limit myself here." And, on what a shell is also for: "An extra goal? A product owner can get a ready shell area to prepare marketing materials from the application." The ruling: Gard offers every mechanism an application may need to come up (sources or prebuilt images, services, data, ports) and limits nothing an author can declare; making an application come up is its author's work; the product owner's case is an example of the design (issue 421), not a condition on every application.

**By:** owner

## 2026-10-29 · earlier-attempts-retired
Krzysztof, 2026-10-29 (translated from Polish): "As for [the two earlier attempts, named in the original], they are to be thrown out; I will not develop them. They were the first approaches to this subject. We can get rid of them at once and keep the repositories only for history." The ruling: the two earlier embodiments that the thesis calls dormant are retired; their repositories stay as history, and the canon and the thesis say so (issue 360). Archiving them on GitHub is a change of settings and waits for the owner's word.

**By:** owner

## 2026-10-29 · no-throwaway-scripts
Krzysztof, 2026-10-26 (translated from Polish), during Mimir's first build: "It is to forbid doing something like that. No non-deterministic scripts are allowed. None, because I keep having this problem working with agents. The harness stops the work, and instead of walking away from the computer I have to sit and watch it." The ruling: Gard's guard script-ban (issue 396) refuses throwaway scripts written on the fly and run at once, with no exceptions, and lets named, deterministic commands through, which can be approved once.

**By:** owner

## 2026-10-29 · proportional-protection
Krzysztof, 2026-10-27 (translated from Polish), during Mimir's first build: "A general request: we do not build odd protections for edge cases in internal tooling. This is not a SaaS." The ruling, for Gard and Mimir: protect against the loss or hiding of someone's work, against deletion and overwriting, against what blocks or slows the work, and against leaks of secrets or private names in ordinary flows; hardening against hostile input is not asked for. Reviewers of the two tools judge findings by it.

**By:** owner

## 2026-10-29 · environment-lives-in-the-shell
Krzysztof, 2026-10-26 (translated from Polish; project names replaced), during Mimir's first build: "Add a basic assumption. Devcontainers go by default into the shell: the shell of one project, of another, of a third. In the target I would rather not add devcontainers to company repositories, unless it is the team's decision; my environment is my business. I have my own odd way of working, and I don't want it to impact others." The ruling: a user's environment (dev container, harness, agent tooling) lives in the shell beside the team's repository, which stays clean; a devcontainer enters a team's repository only when the team decides so (Gard's principles; issue 400).

**By:** owner

## 2026-10-29 · workplace-kind
The registry gains a third kind, workplace, for Mimir and Gard: they are machinery, so not add-ons (disciplines of the agent), and they are not built and tested with the core, so not core; each keeps its own number. The edges point one way: Gard depends on nothing, and the one edge is Mimir to Gard, optional, because an earlier proposal in which Gard asked Mimir for rules would have been the family's first cycle. Gard reads a list of rule directories that Mimir fills. Taken under autonomy-quality; the kind's name and its sentence in the canon are the owner's (issue 360).

**By:** jarl

## 2026-10-29 · gate-engine-in-gard
The engine of the git gate (stubs, chain mode with husky and lefthook, snapshot, allow once) moves from Mimir to Gard, and the rules stay where they are written: in a shell, and in the areas of Mimir, whose directories Mimir adds to Gard's list. The reason: the gate serves the shell's case first (a commit in a code repository opened from a shell, made in its container), and one engine is better than two. The cost: Mimir alone, without Gard, has no gate. Taken under autonomy-quality.

**By:** jarl
**Superseded by:** git-through-gard (2026-10-29)

## 2026-10-29 · gard-1-0-0-scope
Gard 1.0.0 serves Claude Code on macOS, Linux and Windows; GitHub Copilot, Codex and Cursor follow once the owner allows probes on real accounts (issue 420), because a guard that cannot see a tool's events would be a false promise. Gard and Mimir ship at 1.0.0 each in 6.2.0, on their own numbers. Code moves from Mimir to Gard by copy with its tests, and Mimir removes its copy only after the owner's setup runs Gard (issue 433), so the working install never breaks. Taken under autonomy-quality.

**By:** jarl

## 2026-10-29 · mimir-first-loop-archived
Mimir's first loop (185 issues, 133 done) is not moved into Althing: its done work is summarised in releases/6.2.0/plans/plan-mimir.md with the commit it lives on, its open work is filed anew in this loop in English with nothing private, and M-numbers in Mimir's commit messages and in the ported design documents resolve through the table in that plan. The loop itself goes to the owner's private archive (issue 427). Taken under autonomy-quality, for a record without noise.

**By:** jarl

## 2026-10-29 · git-through-gard
Krzysztof, 2026-10-29 (translated from Polish): "In general I would make one simplification. We had a scheme in which we tried to change something in the repository where the application is, so that something wedged itself in there; I would drop that altogether. The only thing I would do is a git intermediary in the shell, through a CLI that exposes the guard, so that we can do things automatically: pre-commit goes by the guard's rules, it may look upwards for rules if there are any, and so on; we may have extra steps on pre-commit or on pre-push. But we will not use git's commands on the repository itself as such, and I think it will be fine. What do you think? A simplification like that." Asked whether the gate then runs through gard commit and gard push with nothing in the application's repository, he answered: "ok". The ruling: Gard installs nothing into a code repository (no hook stubs, no core.hooksPath, no entries in .git/info/exclude); a commit and a push that the rules gate go through gard commit and gard push, which collect the rules of the shell and of the list other tools fill, run them for pre-commit, commit-msg and pre-push, and then call git, inside the root's container where it has one, so the team's own hooks run where their tools are. Everything else is plain git. An agent's plain git commit or git push in a shell's repository is refused by a guard that names the gard command; a person's commit outside Gard (an editor's button, a terminal) is not gated, which the owner accepts. It supersedes the ruling gate-engine-in-gard.

**By:** owner
**Supersedes:** gate-engine-in-gard

## 2026-10-29 · ask-023
**Question:** Ratify: the git gate's engine moves to Gard and its rules stay in shells and Mimir's areas; Mimir alone has no gate (ruling gate-engine-in-gard)
**Answer:** Superseded: Krzysztof, 2026-10-29, chose that the gate runs through gard commit and gard push and nothing is installed into a code repository (ruling git-through-gard).

**By:** owner

## 2026-10-29 · rig-is-the-name
Krzysztof, 2026-10-29 (translated from Polish), asking how to call the repository around an application's repositories in English: "By the way, what should the shell be called in English? Something sensible, so that it isn't silly." The jarl proposed rig, as in a test rig, the apparatus built around a device to run and check it without taking the device apart, because shell already means a command shell everywhere in Gard (its guards read shell commands, gard run starts a program without one); he answered: "yes". The ruling: Gard's word is rig. Code, file names, commands (gard rig show), tags and every new text use it; shell keeps only its sense of a command shell. In the titles of issues 359 to 465, in the rulings recorded before this one and in Mimir's ported documents, shell in the other sense means rig; the bodies, file fields and tags of those issues were reworded the same day.

**By:** owner

## 2026-10-29 · ask-026
**Question:** Issues 346 to 354 make every family repository leave only code on the host, and their pattern puts loop workers in clones on a container volume instead of worktrees. The ruling worktrees-follow-gard puts worktrees in .worktrees of the shell on the host, mounted at the same path in the container, which removes the reason for clones (a worktree made inside a container left dangling entries in the host's git) and keeps the rule, because a worktree is code. Options: (a) 346 to 354 adopt Gard's layout and wait for Gard's run and worktree issues (379, 387), so the family moves once; (b) 346 to 354 go ahead now with clones on a volume, and 424 later moves the family to Gard's layout; (c) 346 to 354 do the dev containers now without the worker part, and the worker part waits for Gard. The jarl recommends (c): containers that leave the host clean are needed now for the release's checks, and the workers' place is decided once, by Gard.
**Answer:** Krzysztof, 2026-10-29 (translated from Polish): "For later; we use only Gard, right away." Asked again in plainer words after the first question, he chose to postpone the work of 346 to 354 and do it through Gard alone, with no interim pattern; this is closest to option (a), but in his own words.

**By:** owner

## 2026-10-29 · family-repos-through-gard
The owner's rule of 2026-10-28 stands: every repository of the family leaves nothing on the host but its code (the owner, translated: 'every repository of the family should work like this, that is: it leaves absolutely no garbage on the host. Only code.'). On 2026-10-29 he chose how: Krzysztof (translated from Polish): "For later; we use only Gard, right away." The ruling: each repository reaches that state through Gard and no interim pattern. It is a root of Gard (its own dev container stays where it has one, otherwise Gard generates one), every command of it runs through gard run, loop workers get their worktrees as Gard's views, and gard verify host-clean proves the result; clones on a volume are not used. Issues 346 to 354 wait on Gard's issues and are reworded to this. A consequence the owner accepts: Yggdrasil's check, which the goal runs inside its dev container, waits until Gard can run it (issue 346).

**By:** owner
**Supersedes:** family-repos-leave-only-code-on-host
**Superseded by:** work-on-the-host-gard-and-mimir-set-aside (2026-11-02)

## 2026-10-29 · progressive-ignores-rule-changes
Krzysztof, 2026-10-29 (translated from Polish): "Yggdrasil progressive should not react to changes of rules." Today a changed rule reaches every use of that rule, so in progressive mode whoever edits or adds a rule answers for every place it already breaks (docs/progressive-mode.md, step 3, in Yggdrasil's release/6.2.0). The ruling: in progressive mode only changes of code bring obligations into scope; a changed rule's findings in code the change did not touch stay visible as findings outside the change, as inherited debt does. Whether this is the default or a setting of the progressive block, and how a new rule is still proved to work, is settled in the design note of the issue that carries it.

**By:** owner
**Superseded by:** progressive-rule-changes-to-discuss (2026-10-29)

## 2026-10-29 · progressive-rule-changes-to-discuss
Krzysztof, 2026-10-29 (translated from Polish), on the universal intermediary (467) and on progressive mode and changes of rules (466): "Both are considerations for when an agent comes to them. We will talk about them." The ruling: his remark that Yggdrasil's progressive mode should not react to changes of rules is a direction to talk through, not a decision; issues 466 and 467 begin with a conversation with the owner, in which the agent sets out what the code does today and the options with what each costs, and nothing is built before his word.

**By:** owner
**Supersedes:** progressive-ignores-rule-changes

## 2026-10-29 · mimir-topic-branches-optional
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 and refined on 2026-10-27 (translated): topic branches are allowed in every area and every code repository, knowledge areas included, and are optional. A topic is a branch of work in its area from the start, pushed as the work goes; at its end the person who leads it decides: one pull request with the topic, no pull request (the history stays for tracing), or a split of the results (pull requests to code repositories and the general knowledge taken to the area's main branch). A pull request is needed only to reach a main branch, and only where the area is shared; an area shared with nobody is pushed to straight. Whether an area or a repository writes by push or by pull request is an explicit setting, never guessed. Housekeeping is not a topic: outside a topic, writes to an area in pull-request mode go to a session branch with one pull request per session, opened on request or at the end of the session.

**By:** owner

## 2026-10-29 · mimir-rules-engine-in-full
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 and kept on 2026-10-27 (translated): the rules engine of Mimir is built in full (match and set, named fragments, one pass, reach, a fixed list of settable fields, RULE_CONFLICT and why), because one general mechanism serves identity, the pull-request command and places for every kind with the origin of each value visible; it is not extended beyond that.

**By:** owner

## 2026-10-29 · mimir-provenance-in-commits
Carried from Mimir's first loop, ruled by the owner on 2026-10-27 (translated): a ledger of the provenance of code commits is dropped. Provenance travels in the trailers of Mimir's commits, in topic branches and in pull requests; a ledger comes back only if in practice the answer to who did this is missing. It replaces the owner's ruling of 2026-10-26 that kept it in a local ledger or git notes.

**By:** owner

## 2026-10-29 · mimir-trusts-cloned-areas
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 (translated): Mimir trusts everything the user cloned: hooks, jobs, extensions and skill scripts of a cloned area run without a further approval, because a cloned area must work at once and an approval at every change would be a constant interruption. The risk (code of an area runs after a plain pull, so a taken-over account of a colleague means code on every machine that pulls) is stated openly in the threat model and the README, and areas from untrusted sources are not cloned.

**By:** owner

## 2026-10-29 · mimir-desk-copy-later
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 (translated): the copy of a Desk is a private repository the user makes when the user wants it; until then mimir doctor reports that there is no copy (BACKUP_MISSING) with its fix, and once a remote exists it watches for unpushed changes. Mimir never creates a remote of a Desk by itself.

**By:** owner

## 2026-10-29 · mimir-container-mode-deferred
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 (translated): the mode in which an agent in a container connects to the Mimir of the host (MCP over HTTP, a thin client of hooks) waits for its first real user. When it is built it is read-only, with a token limited to the chain of areas of its workspace, and only the working directory and the workspace directory are translated.

**By:** owner

## 2026-10-29 · mimir-name-and-licence
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 (translated): the name stays Mimir, the npm package is @chrisdudek/mimir and the command mimir; before publication the command is checked against another program called mimir on the PATH and the README explains the difference. Mimir is released under the MIT licence; the owner confirms the name and the year in the licence file.

**By:** owner

## 2026-10-29 · workplace-self-describing-repositories
Carried from Mimir's first loop, ruled by the owner on 2026-10-26 (translated), and applied to Gard as well: the code, comments, names of files, directories, tests and fixtures, and the text of the README are self-describing and do not point at anything that is not in the repository (sections of a specification, numbers of issues, names of rulings, marks of reviews); a test backed by an aspect of the architecture graph fails on a forbidden pattern. The repository holds no documents but its README and licence; the development documents live in Althing, in English. Commit messages may name the issue they carry, as the loop asks.

**By:** owner

## 2026-10-29 · mimir-no-token-limits-on-mcp
Carried from Mimir's first loop, ruled by the owner on 2026-10-27 (translated): the limit of 500 tokens on MCP instructions and the budget of the tools' schemas are removed entirely; no test or code holds them.

**By:** owner

## 2026-10-29 · mimir-area-hook-modules-register-themselves
Carried from Mimir's first loop, ruled by the owner on 2026-10-27 (translated): hook modules register themselves: the hooks role of the Desk and of every area in the chain is read, and one global hook runs what is there, with a time limit and letting the call through on a failure. The rules of order that the same ruling placed in the owner's Desk are Gard's guards since the split (rulings shells-are-a-tool-of-their-own and environment-lives-in-the-shell); the mechanism of area hooks stays Mimir's.

**By:** owner

## 2026-10-29 · workplace-public-repositories-carry-no-private-names
Carried from Mimir's first loop, ruled by the owner on 2026-10-27 (translated), and applied to Gard as well: the public repository carries no name of the owner's clients, their products or their repositories, in its files or its history, with no aspect and no test in the repository that would itself hold such a list. The leak check is one mechanism of the owner's that serves every repository and keeps the words outside it; in the family this is Althing's keyed names rail, whose committed digests reveal no word and whose key stays on the owner's machine (issues 363, 373, 459).

**By:** owner

## 2026-10-29 · mimir-live-until-stable
Carried from Mimir's first loop, ruled by the owner on 2026-10-27 (translated): Mimir runs from a development install linked to its repository and is fixed live until the owner calls it stable; a global skill tells agents that it is a working draft and asks them to report problems. Shipping it in 6.2.0 (ruling new-tools-in-6-2-0) happens, like every publication, only on the owner's word.

**By:** owner

## 2026-10-29 · mimir-builder-decisions-carried
Carried from Mimir's first loop, decided there by its builder under the mandate on 2026-10-26 and never confirmed by the owner: MCP gains a tool action for the actions of extensions and jobs beside context, read, search, write and workspace; the diary draws facts with Haiku 5.5 and writes the day with Haiku or Sonnet 5.5, compared on two or three real days only when real sessions are imported; Windows is built now and marked alpha until its tests pass on a real runner; the package is prepared in full (pack, a tarball install test, a dry run of publish) and never published without the owner's word; a reproducible product's recipe lies beside it in <name>.recipe.yaml, and a product without one is an original never deleted automatically. Not carried, because later rulings replaced them: container build and the one measurement of Yggdrasil (now Gard's 384 and research 365), packages on the host for Mimir itself (family-repos-through-gard), the rules of order as the owner's setup (Gard's guards), and one pull request per topic by default (mimir-topic-branches-optional).

**By:** jarl

## 2026-11-02 · ask-028
**Question:** The owner wants the rest of the 6.2.0 loop driven by Jarl 6.2.1 (2026-11-02). Jarl 6.2.1's issue 027 vendors Runes 1.1.0, which ships in 6.2.0 only after every Runes issue is closed (runes-last). Which comes first? Option A: Jarl 6.2.1 first, on Runes 1.0.0; 027 moves to the next Jarl patch, and the Runes issues are worked under the new driver. Option B: Runes 1.1.0 first under the old driver, then Jarl 6.2.1 with 027, then the switch; Jarl ships complete, but the Runes work runs on Jarl 6.1.0.
**Answer:** Krzysztof, 2026-11-02 (translated from Polish): "C: first Runes 1.1.0, then Jarl 6.2.1, and then the switch of the 6.2.0 loop to being driven by 6.2.1, with the .jarl made compatible in that release."

**By:** owner

## 2026-11-02 · runes-then-jarl-then-driver-switch
Krzysztof, 2026-11-02 (translated from Polish): "C: first Runes 1.1.0, then Jarl 6.2.1, and then the switch of the 6.2.0 loop to being driven by 6.2.1, with the .jarl made compatible in that release." The order: the Runes issues of this loop are closed and Runes 1.1.0 ships under the pinned driver Jarl 6.1.0; Jarl 6.2.1 then ships with Runes 1.1.0 vendored; then this loop's driver becomes the released Jarl 6.2.1 and its .jarl record is brought to the format Jarl 6.2.1 reads and writes, within release 6.2.0, with verify clean and nothing in the record lost.

**By:** owner

## 2026-11-02 · work-on-the-host-gard-and-mimir-set-aside
Krzysztof, 2026-11-02 (translated from Polish): "That is an old assumption; Gard does not exist, just as Mimir does not, and I do not plan to take up that topic for now. In general we work directly on the server." The family's repositories are developed and tested directly on the host, without Gard or a dev container of their own where they have none (Yggdrasil keeps its own). Gard and Mimir leave release 6.2.0: their issues, and the issues that bring them into Althing, the workspace and the family's repositories, are deferred, not dropped, so the work can be taken up again.

**By:** owner
**Supersedes:** family-repos-through-gard

## 2026-11-02 · ci-green-on-github-and-bounded-agents
Krzysztof, 2026-11-02 (translated from Polish): "And CI has to be clean on GitHub for Runes just as for Jarl. Right, I am going to sleep, you know what to do. You work autonomously. Do not let your agents run nondeterministic scripts, because their harness will stop them." Runes 1.1.0 and Jarl 6.2.1 are done only when their CI on GitHub is green on the exact commit that is tagged; Runes' release/1.1.0 is pushed under runes-push-branch so its CI runs on every merge. Workers and reviewers run only the bounded, plainly written commands their briefs allow.

**By:** owner

## 2026-11-02 · test-tool-name-in-a-code-span
The title of 473 names the JavaScript test tool `jest`, which the English rail's slot rule reads as a Polish stop-word in a heading; the allow-list covers only Polish letters, and the driver Jarl 6.1.0 has no command that changes a title. The heading line of 473 is therefore edited once by hand to write the name as a code span, which the slot rule skips, and nothing else in the issue changes. The gap in the rail is filed as 474.

**By:** jarl

## 2026-11-03 · csharp-unused-alias-silence-over-false-edge
Under autonomy-quality (fewer false greens and false reds): for issue 469, item 3, the directive line of a plain alias target inside a namespace body reads only the nearest namespace, so an unused alias whose target is a farther type gives no edge there, rather than an edge that can be false when a namespace and a global type share a name. A used alias still gives its edge on each line that uses it. The alternative, a resolver field that sees the repository's namespaces, is a new contract and waits for a need.

**By:** jarl
**Superseded by:** csharp-nearer-names-shadow-farther-readings (2026-11-03)

## 2026-11-03 · csharp-nearer-names-shadow-farther-readings
Under autonomy-quality, superseding csharp-unused-alias-silence-over-false-edge: issue 479 found the need that ruling waited for. A farther reading of a C# alias target now carries the nearer names C# would stop at, and the resolver voids it when the repository declares one of them (an optional field shadow and SymbolTable.hasNamespace, documented in Runes' docs/api.md). So an unused alias to a farther type gives its edge when nothing nearer shadows it, and stays silent only when a nearer namespace or type of the repository would win, which is what C# does.

**By:** jarl
**Supersedes:** csharp-unused-alias-silence-over-false-edge

## 2026-11-03 · csharp-invalid-file-scoped-layout-not-a-bug
Under autonomy-quality: the first acceptance line of 486 describes namespace A; using X; namespace B { ... }, a file-scoped namespace beside a block namespace, which C# refuses (CS8955: a source file cannot contain both). With no binding to match, Runes keeps its answer for that layout and nothing is guessed; 486 keeps its docs line, which d24426e meets.

**Settles:** 486

**By:** jarl

## 2026-11-03 · independent-audit-before-the-runes-cut
Krzysztof, 2026-11-03 (translated from Polish): "Let us do it differently. An independent review of both, we will see how much of it there still is, and then we decide. For now you keep working. By the way, can you parallelise more?" Two independent audits, of Runes' C# name lookup and of its Rust reading of Cargo targets, measure the gaps left at release/1.1.0 (research/2026-11-03-runes-csharp-and-cargo-remaining-gaps); the owner decides on their count whether Runes 1.1.0 closes every gap or cuts at what is filed. Work goes on meanwhile, and more of it runs at once than the plan's two Runes workers: up to four Runes workers and reviewers together, with no two corpus runs at the same time.

**By:** owner

## 2026-11-03 · no-fable-model
Krzysztof, 2026-11-03 (translated from Polish, a swear word made neutral): "Stop, not Fable, never." No agent of the family's work runs on the Fable model: not as a worker, a reviewer, an auditor or a critic. The two audits and the review of 487 that were running on it were stopped at once.

**By:** owner
**Superseded by:** models-by-price-quality-time (2026-11-03)

## 2026-11-03 · ask-031
**Question:** With Fable ruled out (no-fable-model) and no other provider enabled on this machine, the only models are Opus, Sonnet and Haiku. The reviewer rule says a reviewer is never of the worker's model and never weaker. Who reviews work done on Opus? Options: A, every worker on Sonnet or Haiku and every reviewer on Opus, with Opus never a worker; B, Opus workers reviewed by a fresh Opus, relaxing never-the-worker's-model for the strongest tier; C, enable another provider (Codex) for reviews of Opus work. Twelve verdicts already given on Fable (184 twice, 469, 476 twice, 479 twice, 472, 481, 484, 485, 486) are re-done under the chosen rule.
**Answer:** Krzysztof, 2026-11-03 (translated from Polish): "Yes, Opus." Read as option B (Opus work reviewed by a fresh Opus) and the audit resumed on Opus; the reading was stated to him for a veto.

**By:** owner

## 2026-11-03 · fresh-opus-reviews-opus
Krzysztof, 2026-11-03 (translated from Polish): "Yes, Opus.", answering who reviews work done on Opus now that Fable is ruled out and no other provider is enabled (read as option B, stated to him for a veto). Work done on Opus is reviewed by a fresh Opus instance that neither wrote nor saw the work; work on Sonnet or Haiku is reviewed by Opus. The twelve verdicts given on Fable are re-done by fresh Opus reviewers. The independent audits run on Opus.

**By:** owner
**Superseded by:** fable-verdicts-stand (2026-11-03)

## 2026-11-03 · fable-verdicts-stand
Krzysztof, 2026-11-03 (translated from Polish), on the plan to re-do the twelve verdicts Fable gave: "Why? They are done, and paid for." The twelve verdicts Fable gave before ruling no-fable-model (184 twice, 469, 476 twice, 479 twice, 472, 481, 484, 485, 486) stand as they were recorded; nothing is reviewed again. Work done on Opus from now on is reviewed by a fresh Opus.

**By:** owner
**Supersedes:** fresh-opus-reviews-opus

## 2026-11-03 · runes-1-1-0-for-jarl-rest-in-1-1-1
Krzysztof, 2026-11-03 (translated from Polish): "Then let us fix only what is for Jarl, and you go ahead with Jarl, and you treat that as 1.1.0, and the rest of the fixes for the other tools of the family go into 1.1.1." Runes 1.1.0 is release/1.1.0 as it stands, which already holds the one change Jarl takes from it (478, the tool-name check), after a final pass (version, CHANGELOG, README); it is tagged and published on the owner's word, and Jarl 6.2.1 vendors it. Every Runes issue still open, and the work in flight on 489 and 490, goes into Runes 1.1.1 on a branch release/1.1.1 cut from the 1.1.0 tag; Yggdrasil, Grain and Horde take Runes 1.1.1 for family 6.2.0. This replaces runes-last for 1.1.0.

**By:** owner
**Supersedes:** runes-last
**Superseded by:** only-jarl-now (2026-11-03)

## 2026-11-03 · only-jarl-now
Krzysztof, 2026-11-03 (translated from Polish): "Well then, if it changes nothing, you do only Jarl, solely and exclusively." Runes 1.1.0 changes nothing Jarl needs, so Jarl 6.2.1 ships on the Runes 1.0.0 it vendors today, and the session works on Jarl 6.2.1 alone. Runes work stops where it stands: release/1.1.0 keeps what is merged, its open issues stay open in the 6.2.0 loop, and nothing of Runes is tagged or published now.

**By:** owner
**Supersedes:** runes-1-1-0-for-jarl-rest-in-1-1-1

## 2026-11-03 · models-by-price-quality-time
Krzysztof, 2026-11-03 (translated from Polish), asked whether his words 'let us not discriminate against any model; price to quality, and time, that is all' also lift the Fable rule: "All of it, but as you said yourself, it does not pay." No model is barred from the family's work; a model is chosen by price against quality and by time, with the model-choice skill (github.com/krzysztofdudek/ModelChoiceSkill). On the data of 2026-11-03 Claude Fable 5.1 is beaten at every effort by Opus 5.5 on coding quality, time and cost, so the table does not pick it.

**By:** owner
**Supersedes:** no-fable-model

## 2026-11-08 · mimir-gard-horde-out-of-the-6-2-0-loop
Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

**Settles:** 224, 255, 256, 257, 258, 264, 276, 277, 297, 358, 363

**By:** owner

## 2026-11-08 · ask-022
**Question:** Ratify: a third kind of the registry, workplace, for Mimir and Gard, with the one edge Mimir to Gard (ruling workplace-kind)
**Answer:** No longer applies, because the tools it concerns are out of the loop. Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." He did not rule on this item itself. Ruling mimir-gard-horde-out-of-the-6-2-0-loop.

**By:** owner

## 2026-11-08 · ask-024
**Question:** Ratify: Gard 1.0.0 serves Claude Code alone, both tools ship at 1.0.0 in 6.2.0, and code moves from Mimir to Gard by copy before Mimir removes it (ruling gard-1-0-0-scope)
**Answer:** No longer applies, because the tools it concerns are out of the loop. Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." He did not rule on this item itself. Ruling mimir-gard-horde-out-of-the-6-2-0-loop.

**By:** owner

## 2026-11-08 · ask-025
**Question:** Ratify: Mimir's first loop stays outside Althing as a private archive, summarised in plan-mimir.md, its open work filed anew here (ruling mimir-first-loop-archived)
**Answer:** No longer applies, because the tools it concerns are out of the loop. Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." He did not rule on this item itself. Ruling mimir-gard-horde-out-of-the-6-2-0-loop.

**By:** owner

## 2026-11-08 · ask-027
**Question:** Ratify: five decisions of Mimir's first builder that the owner never confirmed: the MCP tool action, the models of the diary, Windows now, the package prepared but not published, the recipe beside a product (ruling mimir-builder-decisions-carried)
**Answer:** No longer applies, because the tools it concerns are out of the loop. Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." He did not rule on this item itself. Ruling mimir-gard-horde-out-of-the-6-2-0-loop.

**By:** owner

## 2026-11-09 · backlog-tidy-for-the-three-tools
On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

**Settles:** 142, 143, 224, 225, 227, 229, 230, 232, 255, 256, 257, 258, 259, 266, 267, 268, 276, 300, 327, 340, 341, 356, 357, 475, 501, 502, 503, 509, 510
**By:** owner

## 2026-11-09 · fix-faults-on-sight
A fault in the family's tools or in the workspace that the jarl meets while doing other work is fixed at once instead of being filed for later. A fix that touches code still gets a test and a fresh reviewer. This ruling grants no push: a push to a tool repository stays on the owner's word each time.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Fix things like that right away too, when you see them.""

**By:** owner

## 2026-11-09 · two-compatibility-checks-back-in-the-gate
The two compatibility checks moved out by backlog-tidy-for-the-three-tools return to the conditions of the release: 255 (the shape of Yggdrasil's documents against 6.1.0) and 276 (Grain's full gate with Yggdrasil supplied). The jarl proposed moving them because the workspace they named does not exist, and that was no reason to drop what they prove. Each runs in an environment built for it and does not wait on the workspace issue 275. The rest of backlog-tidy-for-the-three-tools stands. The owner wants the whole release carried out.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, and I want to carry out the whole release.""

**Settles:** 224, 255, 276
**By:** owner

## 2026-11-09 · confirm-the-fault-before-the-fix
Before changing anything, confirm on the release branch that what the issue describes still holds. If it no longer holds, change nothing, say so in your report and stop. The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role worker
**By:** owner

## 2026-11-09 · try-to-break-a-guard
A change to a check, a guard or a refusal is attacked on the built tool: try to get past it, and say in your findings what you tried. The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role reviewer
**By:** owner

## 2026-11-09 · grain-check-with-yggdrasil-supplied
A run of Grain's check in which a test was skipped because Yggdrasil was not supplied does not count. Run it with YG_BIN and GRAIN_CORPUS_CLONES set from a Yggdrasil built from the release tip. If that environment is missing, record no merge and tell the jarl. The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role merger
**By:** owner

## 2026-11-09 · grain-worker-yggdrasil-supplied
Where a line needs Yggdrasil, run with YG_BIN set. A run in which those tests were skipped proves nothing. The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role worker and repo Grain
**By:** owner

## 2026-11-09 · before-you-upgrade-yggdrasil
A change that can turn an adopter's repository red carries a note under ### Before you upgrade in the CHANGELOG (ruling release-6-2-0). The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role worker and repo Yggdrasil
**By:** owner

## 2026-11-09 · before-you-upgrade-grain
A change that can turn an adopter's repository red says so in the changelog entry recorded on the issue, so the final pass gathers it under Before you upgrade (ruling release-6-2-0). The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role worker and repo Grain
**By:** owner

## 2026-11-09 · quality-before-convenience
At every trade-off choose fewer false greens and false reds, fuller tests and a more honest message. Effort is never a reason to cut scope (rulings autonomy-quality and no-effort-estimates). The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** loop
**By:** owner

## 2026-11-09 · six-workers-and-faults-on-sight
At most six workers run at once, and at most two in one repository. A fault met along the way is fixed at once (ruling fix-faults-on-sight). The owner approved this rule from a list the jarl put to him; the wording is the jarl's.

The owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Pin them.""

**Applies to:** role jarl
**By:** owner

## 2026-11-11 · changelog-speaks-well-of-the-product
A CHANGELOG entry says what changed and what to do, in plain words, and never runs the product down: no wording that calls it costly, slow, broken or a trap. The owner gave this as a standing rule when the jarl proposed a note about re-keyed verdicts.

The owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "Only if it really happens on 6.1.0 to 6.2.0. In the changelog we do not write badly about our own product.""

**Applies to:** role worker
**Settles:** 536
**By:** owner

## 2026-11-11 · load-limits-on-this-machine
This machine has 13 cores and 29 GB, with the temporary folder in memory. Six workers at once with their full suites drove the load above 350 and the kernel killed four agents. From now on at most three workers and one examiner run at once, every test run is capped at four parallel processes (node --test --test-concurrency=4, vitest --maxWorkers=4), and generated data larger than a few megabytes goes to a mktemp -d folder under ~/Temp, never under /tmp.

Made under: six-workers-and-faults-on-sight

**Applies to:** loop
**By:** jarl

## 2026-11-11 · one-grain-suite-at-a-time
Grain's full suite runs one test file per core and each file builds an index of about 1 GB, so two full suites at once exhaust this machine's memory, which is what happened on 2026-11-11. Only one full Grain suite runs on the machine at a time: before starting one, check with pgrep -f 'plugins/grain.*--test' that none is running, and if one is, run single files instead and the full suite later. Always pass --test-concurrency=4.

Made under: load-limits-on-this-machine

**Applies to:** loop
**By:** jarl

## 2026-11-11 · cap-every-test-run
Every agent shares one memory budget of about 25 GB (the T3 agents slice), so one runaway test kills every agent on the machine: seven were killed on 2026-11-11. Every build, test, check or probe that can grow runs inside its own memory cap: systemd-run --user --scope -p MemoryMax=6G --quiet <command> on the host, and docker exec … with node --max-old-space-size=4096 or the suite's own worker cap inside the container. A run killed by its cap is a finding to record with what it ran, not a reason to raise the cap.

Made under: load-limits-on-this-machine

**Applies to:** loop
**By:** jarl
