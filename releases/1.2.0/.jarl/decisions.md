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
