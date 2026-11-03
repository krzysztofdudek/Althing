# 184 · Family: a gate with a corpus of real repositories (pinned commits as fixtures, heavy smoke tests of the whole stack) before every tag

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** harness, process
**Files:** Runes/corpus/manifest.json, Runes/corpus/goldens, Runes/corpus/explained.md, Runes/scripts/corpus.mjs, Runes/package.json, Runes/.github/workflows/ci.yml
**Repo:** ../../../Runes
**Found by:** owner
**Where:**
**Branch:** jarl/184-corpus-gate
**Merged:** 8551da6 in ../../../Runes
**CI:** red

## What
The owner, 2026-10-02: “external repositories locked at a specific commit could simply be a fixture […] heavy smoke tests like that for the whole stack […] scenarios that concretely do concrete things” (translated from Polish); “I used to do it this way” (translated from Polish). Build a corpus: public repositories at fixed commits for each language of the family (TS/JS, Python, Go, Java, Kotlin, C#, PHP, Ruby, Rust, C, C++) plus the layouts from the bug hunt (Next.js app/[locale], npm/pnpm/uv monorepos, Cargo with [[bin]], solution-style tsconfig, ASP.NET with a top-level Program). Scenarios: (1) Runes edges vs a golden snapshot in the repo, (2) grain propose → a real yg adopt → yg check --full, (3) comparison with the language's own resolver (tsc, npm/pnpm, a TOML parser). Where the harness lives (Runes for edges, Grain already has GRAIN_CORPUS_CLONES, a cross-cutting scenario) — to be settled in the design. Starting material: the reviewers' scripts from the 6.1.1 loop (session scratchpad patch-611/review-*).

## Why
The 6.1.1 bug hunt found 180+ defects in real layouts that the tools' own test suites did not know; regressions of the fixes themselves were caught only by comparison with the real tools on real repos.

## Acceptance
One command runs the corpus locally and in CI; the golden edge snapshot is in the repo; an unexplained edge change, a false edge, a rejected adoption or a discrepancy with the real tool turns the gate red; the releasing-the-family skill points to the command.

## Evidence

jarl: per the 6.2.0 plan (section 6, D11), 184 is the Runes part (edges and oracles, package C1); the stack scenario and the parity in Grain split off into 239; the releasing-the-family skill will be corrected in the same work.

jarl: under the move (althing-move) the skill half of 184, the plan's row ALT, is now issue 279, and the acceptance line on the releasing-the-family skill is 279's. 184 keeps the Runes half (package C1: the corpus manifest, the edge goldens and their explanations, the resolver oracles), so its Files now name C1's Runes files instead of the skill in Althing, and its Repo is Runes alone, the stack scenario having gone to 239.
- **ran:** node --test test/corpus.test.mjs (the test over release/1.1.0's scripts/, before corpus.mjs exists) · **saw:** pass 0, fail 10
- **ran:** nice -n 15 node --test test/corpus.test.mjs (branch jarl/184-corpus-gate, 8491735) · **saw:** pass 10, fail 0: a planted edge change fails verify and update naming file, line and target (UNEXPLAINED + app/main.js:2 -> lib/other.js); an explained.md entry makes it pass; a malformed entry, a short SHA, a stale golden and a failed fetch each exit 1
- **ran:** nice -n 15 node scripts/corpus.mjs verify --tier all --explained <empty file> (goldens made with the v1.0.0 dist/) · **saw:** exit 1, corpus verify: FAILED (15): 15 of 33 repositories changed since 1.0.0, 21333 references, 426 of them removed (google-cloud-python 21, poetry 12, react 387, jest 6)
- **ran:** nice -n 15 npm run corpus:update -- --tier all (with corpus/explained.md, each changed reference attributed to the first-parent merge of release/1.1.0 after which it last changed) · **saw:** exit 0, corpus update: passed: 15 goldens rewritten, every change explained; the rewritten goldens are byte-identical to a fresh run of the tip
- **ran:** nice -n 15 npm run corpus:oracles (routine tier, this machine) · **saw:** exit 0, passed with 189 disagreements all explained (airflow 120 recall-loss, zod 34, next-intl 11, jest 23, hiredis 1); SKIPPED, not passed: go (gin, sh) and csharp (CleanArchitecture), no go and no .NET SDK here; CI runs them with --strict
- **ran:** nice -n 15 npm run check; nice -n 15 npm run coverage (clean tree at 8491735) · **saw:** check exit 0: 1935 pass, 0 fail, dist/ is fresh; coverage exit 0: 99.05% lines, 94.80% branches, 99.13% functions

docs: README.md: Building and testing: name npm run corpus, npm run corpus:update -- --only <id> and npm run corpus:oracles, what each gates, that they run outside npm test, and that the corpus CI job runs on release branches, release tags and dispatch
- **ran:** nice -n 15 node --test test/corpus.test.mjs (new symlinked-cache test against 8491735's scripts/corpus.mjs, in a scratch copy) · **saw:** pass 10, fail 1: the oracles through a cache reached by a symbolic link fail
- **ran:** nice -n 15 node --test test/corpus.test.mjs (c00d339) · **saw:** pass 11, fail 0
- **ran:** nice -n 15 npm run corpus (routine tier, c00d339) · **saw:** corpus verify: passed
- **ran:** nice -n 15 npm run check (clean tree at c00d339) · **saw:** exit 0: 1936 pass, 0 fail, dist/ is fresh
- **ran:** nice -n 15 npm run corpus -- --tier all (c2592f9, release/1.1.0 merged in: 470 d4cc825, 471 8b975bf, 295 86bd33b; 236+298 d3580d4 and 237 b7950f3 were already the branch's base) · **saw:** exit 0, corpus verify: passed: 33 repositories, 0 references changed, no golden to regenerate
- **ran:** nice -n 15 node --test test/corpus.test.mjs (c2592f9) · **saw:** pass 11, fail 0
- **ran:** nice -n 15 npm run check (clean tree at c2592f9) · **saw:** exit 0: 1957 pass, 0 fail, dist/ is fresh
- **ran:** nice -n 15 timeout 1800 npm run check; nice -n 15 timeout 3000 npm run corpus · **saw:** check: tests 1957, pass 1957, fail 0, dist/ is fresh; corpus verify: passed (routine tier) on merge 8551da6 of release/1.1.0

CI on 8551da6 and e377daf was red in the corpus job only: the Go oracle, which first ran on GitHub's runner, reported three gin testdata imports; explained in bf4a24d, whose CI is green, as is every later tip; the oracle itself is fixed under 477

