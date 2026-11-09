# 040 · A certified absence over a whole partition that mixes tests and production code forbids the repository's test idioms (gin: `require.NoError`, `w.Header`; click: `@click.argument`, `@cli.command`), and check flags idiomatic new tests

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-dsnh
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/mine.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/propose-aspects.mjs, Grain/plugins/grain/engine/propose-classify.mjs, Grain/plugins/grain/engine/check.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/mine.mjs:483 (presentSomewhere) and :519-537 (allAbsenceHolds, used at :542); learn.mjs:216-226 (repoAll only from the scopes whose vocabulary has the predicate); propose-aspects.mjs:274 (scopeFor: a partition fact expanded to the type's whole glob as a flat prohibition `errs: under`, without the exception groups that check honours); propose-classify.mjs:22-30 (isAbsenceRow only for rows below the gate)
**Branch:** jarl/040-absence-certification
**Merged:** e9c6514
**CI:** none

## What
Reproduction (Grain main ae6152f = 6.1.0, yg 6.1.0, node 24.11.1). gin @43fe48e: Grain certifies `_root::_all:method::auto.call:require.NoError` 'methods here never call `require.NoError`' (share 0.923 of 822, 64 deviants, all fires), the same for `w.Header` (63) and 'methods here do not declare a return type of `error`' (64, including Bind, ShouldBind, Run). `grain check` on a new test shaped like TestContextShouldBindWithQuery: '2 known deviation(s) in your change', 'never call `require.NoError`' and 'never call `w.Header`', both with 'Nearest conforming exemplar: recovery.go:35–37 `Recovery`', that is, production middleware; a control test without these calls: 0 deviations. `grain propose` on gin: exactly 2 of 53 aspects enforced, 'No method under `*` may call `require.NoError`.' (64) and '… `w.Header`.' (63); the same proposal has the draft 'Every method … starts with `TestContextShouldBind`, must call `require.NoError`'. In the export, every such partition-wide absence stands beside a certified group convention in the same partition that says the opposite: gin r26 'methods here call `require.NoError`' (10/10 members are deviants from the prohibition), click r21/r16/r23 for `@cli.command` (16/16, 9/9, 7/7), r58/r3 for `@click.argument` (7/7, 42 of 46). click @06b2a67 after adoption in a scratch clone: a new test in the style of tests/test_arguments.py fails `yg check` (exit 1) at tests/test_verify5_argument.py:6 through grain/tests/partition-deco-click-argument. Cause: allAbsenceHolds certifies 'never X' on a partition only when another cell of the same partition does X, so by construction it is the partition's default with a certified group of exceptions; the contrast with other partitions is computed on the pooled rate, so it measures the share of test functions, not a convention (click: non-test functions in tests/ have @click.argument in 14.5%, in examples 14.1%, test_* functions 0%; gin: production functions that never call the test helper raise the share from about 0.87 to 0.923). The drill passes ('5 of 5 caught, 0 false alarms'), because the corpus of violations is exactly the members of the exception group. propose-classify.mjs:22-30 describes this failure ('the minority that do are usually the point'), but applies it only to rows below the gate. The enforced status for certified absences is issue 039 (javapoet @Override); this one concerns the certification, check and the contradiction in the model. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-5/logs/ (v1-gin-check, v2-gin-propose, v3-click-propose, v5-contradiction, v7 and v8 click after adoption, v4 and v9 distributions, v10 contradiction within one proposal).

## Why
README:79-87 and the proposal header say that a negation is a statement about practice, not about what is allowed. The agent gets false information from check that calling the repository's standard assertion helper is a deviation, with an exemplar from production code, and the model contains two certified conventions that contradict each other.

## Acceptance
- An absence of X over a whole partition (`_all`) is not certified when the same partition has a certified cell that does X, or else its scope excludes that cell's members; the contrast compares like with like, without a subpopulation defined by the presence cell.
- gin @43fe48e: `grain check` on a new test shaped like TestContextShouldBindWithQuery reports no deviation about `require.NoError` or `w.Header`, and the exemplar that check gives comes from the same kind or group (a test, not production middleware).

## Changelog
- Fixed: Grain no longer certifies that a whole part of your repository never does something when a group of code in that same part does exactly that, so a new test written the way your existing tests are is no longer reported as a deviation (in gin, `require.NoError` and `w.Header` in tests; in click, `@click.argument` and `@cli.command` in its test suite).

## Evidence

- **ran (history):** node --test tests/absence-beside-presence-group.test.mjs on release/6.1.1 (2d42a4f) and on 2969dbb · **saw:** before: 2 of 4 fail (a partition-wide 'never call' certified beside a test group r0 and beside a directory d[p/t] that do it); after: 4 of 4 pass (local directory absence still certified; no partition-wide absence without a presence cell)
- **ran (history):** grain refresh, models before/after on gin@43fe48e, click@06b2a67, koa@824c1cf, express@7ef98448 (scratchpad/patch-611/grain-040/out, factdiff.mjs) · **saw:** gin: 4 absence surfaces gone (_root _all require.NoError, w.Header + sibling w.Header().Get, returns:error), 0 other facts changed in what they state, 15 exemplar lists re-ranked; click: 2 gone (@cli.command, @click.argument), 8 exemplar lists re-ranked, model.concepts reordered; koa and express: models identical apart from generatedAt
- **ran (history):** grain check on a new gin test shaped like TestContextShouldBindWithQuery (require.NoError + w.Header().Get), old vs new engine · **saw:** before: '2 known deviation(s)', never call w.Header / never call require.NoError, 'Nearest conforming exemplar: recovery.go:35–37 Recovery'; after: '0 known deviation(s)', governed by 1 convention, only pointer 'See: logger_test.go:22–84 TestLogger'
- **ran (history):** YG_BIN=<frozen yg 6.1.0> grain propose on gin and click, old vs new engine (propabs.mjs) · **saw:** gin 55 -> 52 aspects (gone: grain/root/partition-call-require-noerror, partition-call-w-header, partition-returns-error; the presence draft 'Every method … TestContextShouldBind… must call require.NoError' stays); click 41 -> 39 (gone: grain/tests/partition-deco-cli-command, partition-deco-click-argument); enforced unchanged (gin 1, click 2)
- **ran (history):** YG_BIN HORDE_DIR GRAIN_CORPUS_CLONES npm test on 2d3657c · **saw:** tests 1993, pass 1992, fail 0, skipped 1

Needs: MODEL_V (no partition-wide absence certifies any more). Consequence to note: certification of a partition-wide absence already required a certified presence cell in the same partition, so the contradiction filter leaves no partition-wide absence at all; issue 358's 9 across the 14-repo corpus are expected to go to 0 (measured here: gin 3->0, click 2->0). Option not taken: filter only role groups (would keep partition-wide absences beside a directory that does the thing; no difference on gin/click/express/koa).

docs: docs/mathematics.md, Architecture norms, paragraph on group and directory absences: replace the partition-wide sentences (contrasted with the other partitions, still needs the thing present in another cell, none with one partition) with: no partition-wide absence is stated — the contrast certified one only beside a cell of the same partition that does the thing, so it was the partition's default beside a cell of exceptions and its pooled contrast measured the partition's composition (issue 040); a like-with-like contrast is future work. Same file, issue-390 paragraph: 'as for a partition-wide absence' -> 'as the sub-gate band takes for a partition-wide absence'.

docs: docs/validation.md section 'Partition-wide absences against the other partitions (issue 358)': add that 6.1.1 certifies none (issue 040; gin 3->0, click 2->0, express and koa unchanged). docs/results.md: N13 superseded by issue 040 in 6.1.1; re-measure rows counting aspects (gin 55->52, click 41->39 aspects in the proposal).

jarl: accepted that after 040 no partition-wide absence is certified (before the fix it was certified only beside a cell that does the thing, so these are exactly the buggy cases); after 039 such rules are only drafts anyway, so nothing enforced disappears. The narrower option (filtering only role groups) gave the same result on gin, click, express and koa. learn.mjs still passes the unused repoAll — to be removed on the learn chain.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2048, pass 2047, fail 0, skipped 1, merge e9c6514

