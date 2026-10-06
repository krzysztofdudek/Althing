# 039 · Certified 'absence' conventions become enforced prohibitions: 'No method under src/test/** may be annotated with @Override' (javapoet), a ban on @click.argument in click's tests, 'may call Err' in ripgrep

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-aspects.mjs, Grain/plugins/grain/engine/propose-status.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/propose-aspects.mjs:350-352 and :383-387 (v6.1.0; :471 on release/6.1.1): 'A CERTIFIED `false` direction STAYS ELIGIBLE' only marks the direction 'absence'; propose-status.mjs:237 `a.finalStatus = a.origin === 'certified-convention' ? 'enforced' : 'advisory'` does not read a.direction; compare the below-gate branch propose-aspects.mjs:437-447 and :477 (draftReason 'absence-not-forbiddance')
**Branch:** jarl/039-absence-never-enforced
**Merged:** aa81131
**CI:** none

## What
Reproduction (Grain v6.1.0 b70a4e9, yg 6.1.0): square/javapoet @b9017a9, `YG_BIN=<yg> node grain.mjs propose`, `yg adopt .yggdrasil-proposal`, `yg check --no-approve --full --aspect grain/src/directory-deco-override`. The only enforced rule is 'No method under `src/test/**` may be annotated with `@Override`.' (provenance: origin certified-convention, expected "false", direction "absence", status enforced, deviating 20, 0.1 bit per instance); yg-aspect.yaml opens with the preamble 'CANNOT contain, by construction: A rule about an ABSENCE', and below it stands `status: enforced`. After adopt the check fails with 20 violations, among them TestFiler.java:42/65/73/78/83 (a class that does `implements Filer`, with correctly annotated overrides) and TypesTest.java:31/36. After the adoption is committed, a new, correct test file with `@Override public void run()` breaks an ordinary progressive `yg check`. pallets/click @06b2a67: both enforced rules are absences, 'No method under `tests/**` may be annotated with `@cli.command`' (50 sites, share 0.957, 0.7 bit) and the same for `@click.argument` (91 sites, 0.930), in a test suite that tests exactly these decorators; in the same run the absence of `@click.option` below the gate (0.852) stays a draft with absence-not-forbiddance. ripgrep @3fce3b5: the only enforced rule is 'No method under `crates/core/flags/**` may call `Err`' (2 sites, 0.0 bit; `Err(` occurs 28 times in that directory). From the survey: jsoup @088614f (the same @Override rule, 114 errors), AutoMapper @6e8697b ('No type under `src/UnitTests/**` may extend `IValueResolver`', 'No type under src/IntegrationTests/** may extend ExpressionVisitor'). The same proposals contain certified drafts saying the opposite: 'Every method under `src/**`, in a file mentioning `equals`, must be annotated with `@Override`' (its scope overlaps the ban in 12 test files) and 'must be annotated with `@cli.command`' in sdist files. Grain 6.0.0 did the same more widely (src/**, 88 sites), so this is not a 6.1.0 regression. The comment's assumption (a certified absence is a true 'this partition never uses X') stopped being true with issues 253 and 358 of 6.1.0, which certify an absence as 'less often than elsewhere'. The design comes from ticket 115 (its log is kept in a private repository). The mechanism that certifies such absences on a mix of tests and production code (gin require.NoError) is issue 040. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-11/logs/ (01-08 javapoet, 09-11 click, 12 Grain 6.0.0, 13-14 contradictory rules, 15-16 ripgrep).

## Why
The preamble printed at the top of every yg-aspect.yaml says that a proposal cannot contain a rule about an absence; README.md:79-88: 'Intent, forbiddance and "never" rules, no … Grain does not decide what a codebase must never do'; docs/reference.md:828 excludes absences from `origin: convention` in advise; docs/reference.md:634-636: enforced is 'nothing between the maintainer and turning this rule on today'. Meanwhile the only enforced rules in Java, Python and Rust are prohibitions that the repository's correct code breaks and that, after adoption, block new correct code.

## Acceptance
- A rule with direction 'absence' never gets the enforced status (it stays a draft with draftReason absence-not-forbiddance, at most advisory); propose-status reads a.direction.
- javapoet @b9017a9 and click @06b2a67: the proposal from `grain propose` has no enforced rule with direction absence; a test in tests/ covers a certified absence.

## Changelog
- Fixed: a proposal no longer turns a rule about something your code does not do into an enforced rule; such a rule stays a draft you can promote yourself.

## Evidence

docs: docs/reference.md 'What enforced means in a proposal': the certified-convention bullet promotes to enforced only a rule that does not state an absence; add a bullet under 'Everything else stays draft' for draftReason absence-not-forbiddance (set before any drill; any rule about an absence, certified or sub-gate, is never drilled and never leaves draft; its check is kept for a maintainer to promote); 'What an adopter actually gets': enforced also means the rule does not state an absence; provenance.json draftReason list: absence-not-forbiddance also covers a certified absence that ships a check (issue 039). README and docs/results.md enforced counts move (javapoet 1->0, click 2->0; re-measure the Yggdrasil and gin self-proposals).

red->green: tests/absence-never-enforced.test.mjs with YG_BIN (frozen 6.1.0 build): on release/6.1.1 3 of 3 fail (a certified absence earned enforced from a clean stand-in drill and from a real yg drill; draftReason null without yg); on 457b708 3 of 3 pass. grain propose with YG_BIN, release/6.1.1 vs 457b708: javapoet @b9017a9 enforced 1 -> 0 (grain/src/directory-deco-override now draft absence-not-forbiddance; aspectsAbsenceNotForbiddance 0 -> 4, equal to aspectsByDraftReason); click @06b2a67 enforced 2 -> 0 (partition-deco-cli-command and partition-deco-click-argument now draft absence-not-forbiddance; aspectsAbsenceNotForbiddance 2 -> 4). Logs and outputs: scratchpad/patch-611/grain-039/.

docs: docs/reference.md 'What the command prints': earning status enforced also needs a rule that does not state an absence. commands/propose.md:24 (enforced bullet): add 'and that does not state an absence'. docs/results.md R1: gin's two enforced call rules become draft (absence-not-forbiddance), so 'gin 2' and the 12-rule total move; re-measure.

round 2 (f88385e): certifiedWithCasesCount leaves out direction absence; new assertion in tests/absence-never-enforced.test.mjs red (actual 2, expected 1) before, green after; skipped.absence removed; propose.mjs header corrected. Touched tests with YG_BIN: 60/60 pass.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1903, pass 1902, fail 0, skipped 1, merge aa81131

