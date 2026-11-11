# 300 · Grain: the import check's node-type pattern matches a typed TypeScript parameter and a dynamic import, so an 'imports X' rule refuses a file that imports nothing

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261011T2138-mzem
**Tags:** grain, check
**Files:** Grain/plugins/grain/engine/propose-checks.mjs, Grain/plugins/grain/engine/propose-base.mjs, Grain/plugins/grain/engine/propose-lattice.mjs, Grain/plugins/grain/engine/extract.mjs, Grain/plugins/grain/engine/config.mjs
**Repo:** Grain
**Found by:** rev-grain-003-opus2
**Where:** plugins/grain/engine/propose-lattice.mjs:267
**After:** 212
**Branch:** jarl/294-announced-counts
**Worker:** w-294-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 11:25

## What


The import check's node-type pattern still matches TypeScript's required_parameter (issue 180 fixed this only in Grain's own import reading) and dynamic import(...) calls. So an 'imports X' rule refuses a .ts file that imports nothing but has a typed parameter, and a dynamic import is read as a static one. The check also does not read Ruby and Lua require calls, and an index import (../base/index) is not matched to ~/lib/base, the same as extraction. The check of 212 now reads module-level CommonJS require and string literals; this issue brings the node-type pattern in line with what extraction records.

Checked on 2026-11-09 against release/6.2.0: the check and extraction resolve an index import the same way and neither strips /index, so that clause is no fault. A dynamic import matches only as a bare import token: it counts as an import seen and never matches a specifier.

## Why


A false refusal on a file that imports nothing is a false red the adopter cannot explain; it was already present on the release base, so it is not a regression of 212, but 212 is where the check is now being made right.

## Acceptance


- [test] A .ts file with a typed parameter and no imports is not refused by an imports X rule, red before and green after · by: cd plugins/grain && npm test
- [test] A dynamic import is either read with its specifier or named as unread, with a case · by: cd plugins/grain && npm test
- [read] Ruby require_relative and Lua require are read by the check or documented as unread, with a case

## Changelog
- The import check no longer reads a typed TypeScript parameter or a dynamic import() as an import, and reads Ruby and Lua require calls like the rest of the family does.
- The import check also leaves a load inside a block that takes no parameters out of the file's own imports, as the stored scopes do.

## Reviews
- **changes** · by rev-294-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1206-pswg
  Important (299 line 1, plugins/grain/engine/scopes.mjs:429): a C++ constructor declared without a body inside its class (Foo(const Foo&) = delete; Bar() = default;) is still counted as a method with a name shape, because the bodiless path calls nameFacts without the enclosing class; the check leaves it out, so the rule announces more than it refuses. Probe: class Foo { Foo(const Foo&) = delete; } counts ["Foo"], refuses []. The same call at scopes.mjs:571 passes no enclosing class either. The test of 299 has no such case. | Important (300 line 3, plugins/grain/engine/propose-checks.mjs:66-72): the check reads a Ruby load inside a block without parameters as module level, extraction does not (scopes.mjs:676, any callable). Probe: a file holding only task :default do require "rake/testtask" end, or at_exit { require "json" }, records no import and is refused by a must-import rule at line 1, and by a must-not-import rule for that module; on the release branch neither refused. This is the false refusal of a file that imports nothing which the issue removes, opened for Ruby by the new code. | Important (294 line 1): the corpus run does not meet the line as written (every rule). All 13 name-shape rules agree with yg check --full, the two the issue names included. The quote rule on source/cli/tests/fixtures announces 11 and the check refuses 0: the nested-project files are still in the count of every other rule kind (propose-nodes.mjs:105, NAME_SHAPE_ENUMERATORS), which the worker assumed and the line does not allow. Either the other counted kinds leave nested projects out too, or the director narrows the line. | Minor (294 line 1, 300): the vitest import rule announces 12 and the check refuses 10; the two are files with no import, which grain counts as breaking and the check by design never refuses. The release branch hid this for files with a typed parameter; refusedToday cannot evaluate an import check (propose-checks.mjs:338), so the count is not corrected. | Read lines judged met: 299 line 2 by the tests "PHP: a type named like a fixed name leaves the count and the check alike" and "a named function expression in a parameter default is neither counted nor refused", both red at 35cd2a37; 299 line 3 by the config.mjs header (strip: "a pattern for the marker the language owns on a name ... removed before a shape is read"; "A constructor or destructor the table cannot name is told apart elsewhere, in nameFacts (extract.mjs)"), with the changelog clause on constructors true only once the first finding is fixed; 300 line 3 by the tests "Ruby require_relative and require are read at module level" and "Lua require is read at module level", apart from the second finding. Tried and held: C++ templates, out-of-line and nested constructors, destructors, operators, prototypes, a free function named like another class; C K&R and function-pointer returns; Lua field, method, table and multiple assignment; JS and TS defaults, class fields, overloads, decorators; Python, PHP, Ruby, Go, Java, C#, Rust; import-equals, a typed import(), require in a function, Lua pcall(require) and require(variable). 326 neighbouring tests pass. EXTR_V is asked for in the commit body of 0d07c534, as the final pass expects.
  outside the issue, filed as 563: Grain: the type-name check and the count disagree in TypeScript on the release branch already: an abstract class and a namespace are counted and never refused, a type alias is refused and not counted (probe: abstract class Ab {} counts Ab, refuses nothing; type Alias = {} counts nothing, refuses Alias)
  outside the issue, filed as 564: Grain: a TypeScript or JavaScript file whose only use of import is import.meta is refused by a must-import rule though it records no import (present on the release branch; the import check takes the meta property for an import seen)
- **approve** · by rev-294b-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T1255-rvet
  Round 1 is answered at 8b41b629; no Critical, no Important. 299: scopes.mjs:429 and :571 now pass the enclosing class, and 20 C and C++ probes count and refuse the same names (deleted, defaulted, explicit, move, template, nested, union, friend and out-of-line constructors, a free function named like a class, in .cpp and .hpp). 300: the check decides module level by the node types extraction uses (propose-checks.mjs:77-80); 26 Ruby, 16 Lua and 23 TypeScript and JavaScript probes agree with the imports extraction records in both directions of the rule (blocks with and without parameters, lambda, proc, def, class, module, singleton class, begin and rescue, modifiers, BEGIN, pcall, a function called in place, re-exports, a dynamic import). 294 line 1: on Yggdrasil release/6.2.0 all 19 promoted rules (16 enforced, 3 advisory) announce exactly what yg check --no-approve --full refuses; the quote rule on tests/fixtures is gone and the vitest rule reads 10 and 10. The marker-file fixture: with the old fixture on the new engine four of five tests pass and only 'CORPUS.md scores the corpus with a plain yg drill' fails with 'the fixture wrote no CORPUS.md', because its only rule with a corpus had package-info.java files, which import nothing, as its deviants; the five mappers give it real deviants and leave the file-name assertions (10 exempted, holds for all 50) as they were, so the test proves what it proved. Read lines: 299 line 2 and line 3 and 300 line 3 stand as the first review quoted them, and the changelog clause on constructors now holds for bodiless ones too. Minor (plugins/grain/engine/propose-aspects.mjs, whole file): 49991 of the 50000 characters the size test allows, and propose-write.mjs 49890; the test passes, and any other branch that adds ten characters to propose-aspects.mjs turns it red at the merge, so the merger should expect a split there. Minor (plugins/grain/engine/propose-lattice.mjs:165, propose-levels.mjs:296): the sub-gate path of the import-free split and the reading of import-free files from the tree cache have no test of their own; the corpus run covers them (advisory import rules 28 and 28, 10 and 10). Minor (plugins/grain/tests/import-obligation-import-free-files.test.mjs:10): at its failing commit the file is red for a missing export, not for an assertion. Minor (plugins/grain/engine/propose-checks.mjs:114): a must-not-import rule for x refuses require_relative 'x', which extraction records as a path under the file's folder, because the specifier is matched as a token of the statement; a known limitation of the matching, now reachable in Ruby. Not checked: the full Grain suite (46 neighbouring test files ran: 311 tests, 307 pass, 4 skipped, 0 fail); canonical-exemplar; any repository other than Yggdrasil for the comparison.

## Evidence

### Proof

- **ran (line c3f4ad1cf7b5):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs (red at 0811c136, green at 6f2c3e95) · **saw:** tests 5, pass 5, fail 0; before the fix the typed-parameter and dynamic-import cases failed with one refusal at line 1 where none was expected
- **ran (line 7c9b4480a29f):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs (red at 0811c136, green at 6f2c3e95) · **saw:** tests 5, pass 5, fail 0; before the fix the typed-parameter and dynamic-import cases failed with one refusal at line 1 where none was expected
- **ran (line c3f4ad1cf7b5):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs · **saw:** tests 5, pass 5, fail 0 at afbdda78; in a tree extracted at 0811c136 the typed-parameter case failed with one refusal at line 1 where none was expected (tests 5, pass 1, fail 4)
- **ran (line 7c9b4480a29f):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs · **saw:** tests 5, pass 5, fail 0 at afbdda78; in a tree extracted at 0811c136 the dynamic-import case failed with one refusal at line 1 where none was expected
- **ran (line f24e9cc59c92):** cd plugins/grain && .cache/legacy-grain-gate/full-gate.sh node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs (red at cdbc92a3, green at ea0a599e) · **saw:** 7 tests, 7 pass: Ruby and Lua require read at module level, a load in a block without parameters is not an import, a dynamic import is unread
- **ran (line c3f4ad1cf7b5):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs · **saw:** tests 7, pass 7 at 8b41b629; in a tree extracted at 6911b5a8 the two Ruby block cases fail
- **ran (line 7c9b4480a29f):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/import-check-reads-what-extraction-reads.test.mjs · **saw:** tests 7, pass 7 at 8b41b629; in a tree extracted at 6911b5a8 the two Ruby block cases fail

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Assumed: a dynamic import() is named as unread (extraction records none, its specifier is a runtime value), so the check no longer counts its bare import token; Ruby require/require_relative and Lua require are read by the check at module level, as extraction reads them. The /index clause needed no change (already holds).

