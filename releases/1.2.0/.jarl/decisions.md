# Decisions

## 2026-11-17 · runes-1-2-0-on-runes-alone
Runes 1.2.0 is released on Runes alone, from its own permanent loop in releases/1.2.0, as Jarl 6.2.1 (later 6.3.0) was on Jarl alone: a release of one repository is a backlog of its own, never a second loop in the open 6.2.0 directory (one-loop-per-directory), and Runes is shared code with its own semver, so the directory takes Runes' number. The manifest names Runes and Althing only; ws release open copies every repository of the previous manifest, so the others were taken out by hand before the first commit, and the goal keeps the Check lines it wrote for them, which nothing here uses. The 25 issues moved from the 6.2.0 loop keep their numbers through the goal's Range lines, so 752 to 765 mean the same issues in both loops; each stays deferred there with a line that points here. Runes runs on the host, as method/environment.md and the 6.2.0 Runes brief say: Runes has no dev container, so every build, test and corpus run is bounded by its own memory cap and passes the machine's throttle. The 6.2.0 rules that reached a whole loop or a worker hold here in the same words, and the 1.2.0 briefs carry them: quality-before-convenience, load-limits-raised (at most two workers in Runes at once), cap-every-test-run-raised, no-work-left-running, machine-throttle-replaces-own-queues, confirm-the-fault-before-the-fix, work-in-area-packages, ci-green-on-github-and-bounded-agents, one-runes-corpus-cache, and for the CHANGELOG runes-1-1-0-changelog-from-1-0-0 read for 1.2.0 against the published 1.1.0.

**By:** jarl

## 2026-11-17 · runes-1-2-0-scope
Runes 1.2.0 takes the 14 reader gaps 752 to 765 and every Runes item moved out of 1.1.0: the six of a-41 and a-42 (700, 709, 586's Runes half, 188, 736, 737) and the five that rulings runes-1-1-0-scope-at-the-cut, runes-kotlin-defaults-in-1-1-0, runes-csharp-value-head-after, runes-csharp-review-findings and runes-csharp-second-review-findings of the 6.2.0 loop moved after 1.1.0 (739, 741, 743, 747, 750). The owner's answer to a-41 and a-42 says the items moved out of Runes 1.1.0 go to the next Runes version, and these five are such items. 188 here is only what is left of it at v1.1.0, the sentence that states the parse cost of text that is not source code; 586 here is only the Runes half, and Yggdrasil's adoption stays with 586 of the 6.2.0 loop. Issues that had no acceptance line in the 6.2.0 loop (709, 736, 737, 743, 747, 750) got one when they were moved, written from their What.

**By:** jarl

## 2026-11-17 · runes-1-2-0-plan
The plan is plans/plan-runes-1.2.0.md: twelve packages in six waves, at most two workers in Runes at once, and the jarl's final pass. Under autonomy-quality the jarl settles the plan's technical decisions: D2 (755) the alias is read from the literal forms of Vite, webpack and Babel configuration the plan lists, and a configuration that exists but whose alias cannot be read makes a bare specifier that names no declared dependency unfollowed, because answering outside there is the false green the issue reports and answering unfollowed everywhere buries a Vue application in noise; D3 (756) vi.mock and jest.mock with a literal path are read as a use, as import() is, and import.meta.glob and require.context are listed in docs/api.md as unread with a test that pins it, because a glob names a set of files and a use binds at most one, so reading it needs a new answer shape no consumer has asked for; D4 (763) a script element with src is read, written into the view as an import in the tag's own bytes so no line moves, as Vue's single-file component spec defines it; D5 (764) one shared line helper in every extractor, as the last package, because a fix in the parser host would miss a consumer that parses with its own parser and would change trees without a change of grammar digest; D6 the Rust build tests run here under cargo and rustc 1.99.1 from the rust:1.99.1-slim image through two wrapper scripts on PATH, which the 1.2.0 briefs give, since this machine has no Rust toolchain and the tests otherwise skip: run on v1.1.0 on 2026-11-17, both build tests ran and passed, none skipped. D1 (how the grammars reach a consumer, 752) and D7 (pushing release/1.2.0) are the owner's and go to him as questions.

**By:** jarl

## 2026-11-17 · ask-1
**Question:** Runes 1.2.0 is worked on a branch, release/1.2.0, that exists only on this machine. Runes' CI on GitHub runs the whole suite on Linux, Windows and macOS, and Runes ships only when that CI is green on the exact commit to be tagged (ruling ci-green-on-github-and-bounded-agents of the 6.2.0 loop). For 1.1.0 the owner gave a standing permission to push release/1.1.0 (ruling runes-push-branch), and that permission names that branch only. May the jarl push Runes' release/1.2.0 to GitHub whenever its tip is green here, with no tag and no publish?
**Options:**
- a, yes, a standing permission for release/1.2.0 (recommended): CI on all three systems runs after every merge, so a Windows or macOS failure shows at once, next to the change that caused it; the branch is public on GitHub while it grows
- b, one push at the end, on the owner's word: nothing reaches GitHub until the candidate is ready; Windows and macOS are seen for the first time then, and a red there means a late round of fixes before the tag
**Answer in own words:** yes. Standing permission: release/1.2.0 of Runes is pushed to GitHub whenever it is green here, with no tag and no publish.

**By:** owner

## 2026-11-17 · runes-1-2-0-push-branch
Runes release/1.2.0 may be pushed to GitHub whenever it is green locally, with no tag and no publish, so CI on Linux, Windows and macOS and the Go and .NET corpus checks run after every merge. Krzysztof, 2026-11-17 (translated from Polish), picking option a of two (a standing permission, b one push at the end on his word; the labels are not his wording): "a"

The owner's words: "a"

**By:** owner

## 2026-11-17 · ask-2
**Question:** Issue 752: the Runes package on npm carries the recipe for its 23 language grammars but not the built grammar files, so every program that uses Runes builds 11 of them itself on first use, after downloading a 940 MB compiler toolchain, and cannot do so at all on Windows (Runes/package.json:45-51, Runes/src/grammars/build.mts:128-143). A new family tool hit this. How should the built grammars reach a user of Runes?
**Options:**
- a, ship all 23 built grammars inside the Runes package (recommended): the package grows from about 0.5 MB to about 2-3 MB compressed (about 25 MB unpacked); no download and no toolchain for a user, Windows works; every file is still checked against the checksum the package already pins; the release workflow builds them before publishing
- b, a second npm package holding only the grammars: the main package stays small; a second package to publish and keep in step, and a second trusted publisher to set up on npm
- c, attach them to each Runes GitHub release and download on first use: no size cost; every fresh machine, container and CI run needs network access to GitHub, and an offline user still builds
- d, keep today's build and only document it: no work; the 940 MB download and the Windows gap stay
**Answer in own words:** a. Ship all 23 built grammars inside the Runes package.

**By:** owner

## 2026-11-17 · runes-grammars-in-package
Runes ships all 23 built grammars inside its npm package (issue 752): the package grows to about 2-3 MB compressed, each file is still checked against its pinned checksum, the release workflow builds them before publishing, and a user needs no download and no toolchain, Windows included. Krzysztof, 2026-11-17 (translated from Polish), picking option a of four (a in the package, b a second package, c GitHub release download, d keep and document; the labels are not his wording): "a"

The owner's words: "a"

**By:** owner

## 2026-11-17 · ask-3
**Question:** 741's line asks that a lone `o is Config`, where Config is a value the file declares, give no edge. C# reads that form the other way: `o is Config` with no designation is the is-type operator, which binds Config as a type first and takes it as a constant only when no type of that name is found (Roslyn's parser turns such a constant pattern into an is-type expression, and its binder tries the type first, for compatibility with C# 6, where a value never hid a type there). So in `class C { const int Config = 1; bool A(object o) => o is Config; }` beside `using Lib;` with a type Lib.Config, C# tests the type Lib.Config: the edge the reader gives today is true, and the line would drop it. The value hides the type only where C# binds the pattern's expression first: a switch arm `Config =>`, `case Config:`, `o is not Config`, an `or` or `and` pattern, a parenthesized one and a positional subpattern (750 already reads that last place so). At 0995b7c all three of `o is Config`, `Config =>` and `o is not Config` read Config as a type. Options: (a) the line as written: every lone constant-pattern name the file declares as a value gives no edge, `o is Config` included; cost: a true edge lost wherever a file has a value and a type of one name, a false green. (b) the C# reading: `Config =>`, `case Config:` and `o is not Config` with Config a value the file declares give no edge, while `o is Config` and each test of a `||` chain keep the edge to the type; the line changes to say so. (c) no change; the false edge of `Config =>` beside a constant of that name stays. Recommended: (b). 741 stays uncommitted until this is answered; 747 goes on.
**Answer:** The jarl chose option b, the C# reading: a lone name the file declares as a value gives no edge where C# binds the pattern's expression first (a switch arm Config =>, case Config:, o is not Config, an or or and pattern, a parenthesized pattern, a positional subpattern), while o is Config, the is-type operator, keeps the edge to the type, as C# tests the type first there. The line as filed would drop a true edge, a false green; 741's acceptance line is rewritten to this reading.

**By:** jarl

## 2026-11-17 · shared-api-page
Runes/docs/api.md is a shared file of the release, as test/relations/catalogue.test.mjs and test/relations/extractor-rev.test.mjs are: packages edit different paragraphs of it and the merger takes both sides, so no issue declares it in Files, where it would hold the page for one lease at a time (plan-runes-1.2.0.md, section 2).

**By:** jarl

## 2026-11-17 · runes-changelog-unreleased-until-the-final-pass
In Runes 1.2.0 the merger copies each merged issue's changelog entry under an [Unreleased] section at the top of Runes' CHANGELOG.md, as Jarl's merger brief asks, and the final pass rewrites that section into [1.2.0] as a user of 1.1.0 meets it (runes-1-1-0-changelog-from-1-0-0 read for 1.2.0). The 6.2.0 Runes brief kept no [Unreleased] section because a test asks the top section to equal the package version; the test skips [Unreleased], and the first such commit (20aceea, after the merge of 586) is in CI. Workers still never edit CHANGELOG.md.

**By:** jarl

## 2026-11-17 · c-sharp-review-minors-fixed-by-the-jarl
The two Minor findings of rev-743-opus are wording, fixed by the jarl on the issues' changelog entries at once (work-in-area-packages): 747 names the false edge an inferred value of another type gives (var Node = f.Root; Node == Node.Parent), and 741 says the value may be declared anywhere in the file. The code comment on besideItself that calls Node = Node.Next the one false reading stays as it is: changing it would spend the approve for a comment. Issue 4, filed by the examiner, is a false edge since v1.1.0 in the same pattern readings; it is worked as its own C# package after this one merges and before the line-numbers package touches csharp.mts.

**By:** jarl

## 2026-11-17 · rust-review-minors-to-the-final-pass
The Minor findings of rev-737-opus on 759 and 760 are taken without a round, since each is wording or a reading only code rustc refuses reaches: the jarl's final pass on release/1.2.0 rewrites the docs/api.md sentences (a path module in a cfg_if! branch is no longer skipped among a file's items; in:: uses come from macro and attribute paths too; the path is given unrawed; mod:: binds whatever path exists), and the ripgrep lines of corpus/explained.md that repeat one template with types those files do not write. The cfg_if! scope reading and the cost of the scope walk were filed by the examiner as 7 and 8, and the two unlisted attribute namespaces as 9. 737 is dropped as not reproduced, and the final pass takes back the 1.1.0 known limit that named it.

**By:** jarl

## 2026-11-17 · runes-1-2-0-findings-in-scope
The issues the examiners and workers of this loop filed (2, 3, 4, 5, 7, 8, 9, 10, 12, 13 to 18) are worked in Runes 1.2.0, not moved to a later version: each is a reader gap or a false or lost edge of the same kind as the owner's scope, most sit in files a package of this loop already changes, and a release that knowingly ships a false edge it has a fix for is a false green (quality-before-convenience). They join packages by area: 2 and 3 join P8 (plan), 5 and 12 already joined 765's and 752's leases, 4 is a C# package before the line-numbers package, 7, 8 and 9 a Rust package beside 700, 10 joins the bundler-alias package (both TypeScript), and 13 to 18 a second Python and Go package after P7 merges. A finding that turns out larger than its area is put to the owner instead.

**By:** jarl

## 2026-11-17 · final-pass-notes-from-752
From the approve of 752 and 12 by rev-752-opus, two Minor findings go to the jarl's final pass on release/1.2.0, which an examiner reviews before the candidate: the Publish step of release.yml gets RUNES_GRAMMAR_OFFLINE and the grammar cache variable, so the prepublishOnly rebuild there can never fetch or compile; README.md:199 (the pin check) says shipped grammars count, beside the README lines 193, 195 and 279 the worker noted.

**By:** jarl

## 2026-11-17 · final-pass-notes-from-762
From the approve of 762 by rev-762-opus: the final pass adds to the docs/api.md limits paragraph that a self-closing component named like a raw-text element (<Title />, <Textarea />) starts raw text, so a commented-out script after it is read, as v1.1.0 read it. Issue 20, the quadratic cost of a run of <script openings with no > (v1.1.0 had it too), joins the TypeScript package with 755 and 10.

**By:** jarl

## 2026-11-17 · resolve-path-shared
Runes/src/relations/resolve-path.mts is shared by the packages of 755, 753 and 757-761, each in its own functions (plan-runes-1.2.0.md, sections 2 and 3: P7 and P8 edit different functions in different waves, P9 the TypeScript config reads), so no issue holds it in Files and the merger resolves a textual conflict there or stops on a semantic one, as for docs/api.md (shared-api-page).

**By:** jarl

## 2026-11-17 · java-inherited-same-name-known-limit
Issue 2 is stated as a known limit, not fixed: across the corpus's Java and Kotlin repositories 456 edges have its shape (javapoet 14, jsoup 39, spring-petclinic 13, moshi 11, okhttp 379), read by name by w-753-opus, and none is false; a fix that answers unfollowed wherever a class with a supertype outside the repository names a type its own package declares would silence 456 true edges to catch none seen, since Runes cannot see a library's member types. docs/api.md says that such a name binds the package's own type, and that Java would bind a member type the library supertype declares under the same name, which the readers cannot see.

**Settles:** 2
**By:** jarl

## 2026-11-17 · c-quoted-include-unfollowed
Issue 753: a quoted C or C++ include that binds no file of the repository answers unfollowed, as its line says, also where the header belongs to a third-party library on the compiler's include path (leveldb's "gtest/gtest.h", "gmock/gmock.h", "benchmark/benchmark.h"; hiredis's "limits.h", "redismodule.h", "testhelp.h"): a quoted include is searched in the including file's directory first, the readers do not know the build's include path, and unfollowed tells a consumer to look where outside would hide a missing local header. docs/api.md states the rule and that a consumer which knows its include path can treat these as outside.

**By:** jarl

## 2026-11-17 · runes-1-2-0-cut-for-new-findings
From 2026-11-17 evening, a new finding of this loop joins Runes 1.2.0 only when it is a false edge, a false answer, a regression against v1.1.0, or a fault of code this release adds; a gap that v1.1.0 already had (a missed edge, an unread form, a cost of an old path) moves to the next Runes version, deferred here with that reason. The cut is made for delivery against the owner's goal of the whole (his word of 2026-11-17 quoted in this loop's goal, the open track starting with Runes 1.2.0), not for effort: every examiner round has filed new old gaps faster than the packages close, and each deferred one stays on record. Under it 22 (aliases in more configuration files, a gap of the new reader's reach), 23, 24, 25 and 26 move to the next Runes version; 21 and the earlier findings already leased stay.

Made under: runes-1-2-0-findings-in-scope

**By:** jarl

## 2026-11-17 · final-pass-notes-from-700
From the approve of 700 by rev-700-opus, the final pass on release/1.2.0 corrects two case texts: the Expect comment of rust-inline-bare-root-silence (the package now has the crate) and the two hard-wrapped lines in the Rule of rust-use-external-crate-silence; the other Minor findings (the 2018 bench case no longer separating editions, a bare macro for every macro_use crate, RUSTC_BOOTSTRAP keyed on any feature text) are recorded on 700 and on 21 for its worker.

**By:** jarl

## 2026-11-17 · abort-cleanup-in-1-2-0
rev-765-opus's Minor (the host's tree.delete and the retry parser's delete reach the runtime after an abort, against docs/api.md) and the issue it filed as 27 (an abort while freeing or resetting is passed through raw and not recorded) are faults of the abort handling this release adds, so 27 stays in Runes 1.2.0 under runes-1-2-0-cut-for-new-findings, with the Minor folded into its line.

**By:** jarl

## 2026-11-17 · final-pass-notes-from-16
From the approve of 13 to 18 and 30 by rev-13-opus: the final pass states in docs/api.md, as a limit of the pytest basedir rule, that beside src/ or a configured root a module of a test package that is neither a test module nor conftest.py, a helper beside a test module in a namespace directory below src/, and a test module named by a custom python_files setting do not get the basedir root unless the basedir holds a conftest.py (three shapes 1.1.0 bound, none in the corpus).

**By:** jarl

## 2026-11-17 · ruby-own-names-without-a-named-file
Issue 753: a name under a framework namespace answers as the repository's (unfollowed when it binds no file) where the file that a prefix of the name requires declares that prefix (lib/rack/attack.rb for Rack::Attack, lib/sinatra/base.rb for Sinatra::Base, the gem's hyphenated name for RSpec::Rails), and outside otherwise. A name the repository declares in a file no prefix of it names (Sinatra::Request in lib/sinatra/base.rb, RSpec::SharedContext in rspec-core: 94 and 14 uses) still answers outside; docs/api.md states it as a limit. Any wider signal (any declaration of the name in the repository) also catches the reopenings applications write, the false unfollowed of the Rails 7.1 test_helper shape, which is the commoner case; the cost is a false outside in a framework's own repository, not in its users'.

**By:** jarl

## 2026-11-17 · final-pass-notes-from-755
From the approve of 755, 10 and 20 by rev-755-opus (round 3, after the takeover): the final pass adds to docs/api.md's known limits that an unread webpack module key or Babel overrides or env can hide an alias that applies to some files only (a false edge where it rebinds a key the top-level alias maps, a false green where it alone maps it), and widens the limit on code that changes the configuration after it is written to any such code; a module-resolver in a plugins array bound by a name answering unfollowed (edges lost only) is recorded on 755.

**By:** jarl

## 2026-11-17 · ask-4
**Question:** Ratify item: runes-1-2-0-findings-in-scope. The examiners of Runes 1.2.0 found 13 further reader faults (a C# false edge in pattern matching, Rust names in cfg_if! blocks and a slow scope lookup, more test-mock forms in TypeScript, Python roots and Go workspaces read wrongly in older ways, one corpus tooling gap). The jarl put them into 1.2.0 rather than a later version, because most sit in code this release already changes and some are false edges. Options: ratify; or name any to move to the next Runes version, which shortens the release by those packages.
**Answer:** ratified. Krzysztof, 2026-11-17 (translated from Polish), picking option a (ratify: all 13 findings stay in Runes 1.2.0; the label is not his wording): "a"

**By:** owner

## 2026-11-17 · ask-5
**Question:** Ratify item: runes-1-2-0-cut-for-new-findings. The examiners keep finding older gaps in the readers (missed edges and unread forms that Runes 1.1.0 had too) faster than they close. From now on only false edges, wrong answers, regressions and faults in new code join Runes 1.2.0; older gaps go to the next Runes version, each kept on record (so far 22 to 26: more bundler config files, a Rust two-binary layout, a slow lookup in huge tsconfig paths, webpack resolve.modules, Jest moduleNameMapper). Options: ratify; or name any to keep in 1.2.0, which delays it by that work.
**Answer:** ratified. Krzysztof, 2026-11-17 (translated from Polish), picking option a (ratify the cut: only false edges, wrong answers, regressions and faults in new code join Runes 1.2.0; the label is not his wording): "a"

**By:** owner

## 2026-11-17 · runes-1-2-0-close-good-enough
From 2026-11-17 evening, Runes 1.2.0 closes at good enough, on the owner's request for a close without excess, relayed by the coordinator of the open track. Every remaining reviewer brief carries this bar verbatim: block only a wrong answer (a false edge or a wrong result), a regression in ordinary files, or a fault in code this release adds that real repositories hit; everything else is filed deferred with no fix round. One fix round per issue; the re-review checks only the fixes. 764 is accepted when its second review passes; a further finding that shows only in lone-CR files is filed deferred (as 40 and 41 are) and 764 merges; no third round. 700: issue 28 fixed the Windows red, and CI on the release tip after it is the record. 38, the final pass, gets one worker and one reviewer, who checks only that Before you upgrade is true and the counts match. Then the release candidate waits for the owner's word on issue 1: no tag and no publish.

Made under: runes-1-2-0-cut-for-new-findings

**By:** jarl
