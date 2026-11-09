# 043 · Indent-unit detection reads deeply nested files with 2 spaces as 4 or 8 spaces, so check and the post-edit hook flag files that are clean according to Prettier (commander, axios)

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-rqxg
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/lexical.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/lexical.mjs:50-62 (v6.1.0, unchanged on release/6.1.1): candidates only {2,3,4,8} (:54), choice of the smallest width that covers at least 8% of indented lines (:58); tally :67 counts only these four widths
**Branch:** jarl/041-cjs-require-and-indent-unit
**Merged:** ba08bd8
**CI:** none

## What
Reproduction (Grain v6.1.0 b70a4e9). commander.js @ba6d13d: the report 'package tests: files here indent with 2 spaces — 92% of 109, 9 deviants'; in the export 1 file as space8 (command.allowExcessArguments.test.js, widths 2×3, 4×2, 6×22, 8×50, 10×10) and 8 as space4, all fires=true. All 9 pass `prettier@3 --check` (.prettierrc.js without tabWidth, CI runs `prettier --check .`). A new copy of the space8 file, clean according to Prettier: `grain check` → '1 known deviation(s) in your change … Your file `command.verify8copy.test.js` (line 1) indents with 8 spaces' and '52 of 55 indented lines here depart from it' (the file has 87 indented lines and no real difference). The agent gets the same text, without asking, from the PostToolUse hook after every Edit, Write and MultiEdit. `grain selftest` on this index: '6/7 planted deviations caught · 0 false fires'. axios @2426e03b (.prettierrc tabWidth 2): 'package lib: files here indent with 2 spaces — 91% of 53, 5 deviants': Axios.js, AxiosTransformStream.js and Http2Sessions.js as space4, xhr.js and cookies.js as space8, all with 2 spaces; 4 pass prettier, xhr.js differs only in the wrapping of one line. The repo-wide convention also flags the 2-space package-lock.json and the workflow YAML. lexicalPreds directly on synthetic JS: shallow 2-space → space2 (control: shallow 4-space → space4); 2-space mostly at levels 3-4 → space8; mostly at level 3 → 'other'; 4-space at levels 3-4 → 'other'. The comment at :64 ('the unit is the smallest width that recurs (most lines sit deeper than one level)') shows that this case was meant to be handled; the constant 0.08 in docs/mathematics.md:421 has 'cited: none'. partition.mjs:67 feeds auto.lex:indent into the partition features (effect not measured). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-8/logs/v1-commander.log, v1b-shallow-control.log, v2-axios.log, v2b-axios-extra.log, v3-unit.log, v4-posttooluse-hook.log.

## Why
The post-edit hook tells the agent, without being asked, that code clean according to Prettier is wrong, and the deviant counts and shares are skewed (about 8% of commander's test files). Tests and code with callbacks and promises are deeply nested every day. propose and advise exclude formatting rules (docs/reference.md:847), so this does not reach adopted aspects.

## Acceptance
- The indent unit follows from the steps between levels (the gcd of the observed widths or the most frequent difference between adjacent widths): a file with widths 2, 4, 6, 8, 10 is a 2-space file, and tally counts every width.
- commander.js @ba6d13d: the convention 'files here indent with 2 spaces' in package tests has none of the 9 files from the reproduction among its deviants, and `grain check` on a copy of command.allowExcessArguments.test.js reports no indentation deviation; a lexicalPreds unit test for a deeply nested 2-space and 4-space file.

## Changelog
- Fixed: a deeply nested file indented with 2 spaces is no longer reported as indenting with 4 or 8 spaces, and a deeply nested file indented with 4 spaces now reads as 4 spaces.

## Evidence

- **ran (history):** node --test tests/indent-unit-steps.test.mjs on 5c4c799 (lexical.mjs, report-facts.mjs unfixed) · **saw:** pass 3 fail 6: deep 2-space file read 'space4', level-3 2-space 'other', deep 4-space 'space8', tally total 62 of 92 lines, check on deep 2-space copy 'indents with 4 spaces' (log <the session scratchpad, since lost>/patch-611/grain-041/043-red.log)
- **ran (history):** node --test tests/indent-unit-steps.test.mjs on 78f35b8 · **saw:** pass 9 fail 0 (shallow 2/4/tab, Google-style +4 continuations and 4-space-with-JSDoc guards green before and after)
- **ran (history):** grain report/export/check on commander.js @ba6d13d, base 5c4c799 vs 78f35b8 · **saw:** base: package tests 'indent with 2 spaces' 92% of 109, 9 deviants (1 space8, 8 space4); check on copy of command.allowExcessArguments.test.js: 'indents with 8 spaces', '52 of 55 indented lines depart'. fixed: all 109 read space2, no indent deviant (no indentation convention: nothing departs), check on the copy: 0 deviations (<the session scratchpad, since lost>/patch-611/grain-041/commander-base.log, commander-fixed.log)
- **ran (history):** grain report/export/check on axios @2426e03b, base vs fixed (<the session scratchpad, since lost>/patch-611/grain-041/axios-run.sh) · **saw:** base: package lib 'indent with 2 spaces' 5 deviants (Axios.js, AxiosTransformStream.js, Http2Sessions.js space4; xhr.js, cookies.js space8), repo-wide 14 deviants (YAML workflows, package-lock.json, all 2-space); check on a copy of Axios.js 'indents with 4 spaces'. fixed: every file reads space2, no deviant, check on the copy has no indent line (<the session scratchpad, since lost>/patch-611/grain-041/axios-base.log, axios-fixed.log)
- **ran (history):** engine lexicalPreds per file, base vs fixed, on commander, axios, express, koa, flask, click, jsoup, Slim, javapoet, axum (<the session scratchpad, since lost>/patch-611/grain-041/engine-indent.mjs) · **saw:** 4-space repos unchanged: flask 61 space4 (blueprints.py 8->4), click 73, jsoup 194 (HtmlTreeBuilderState other->4), Slim 123, axum 223; every other change is a 2-space file moving to space2 (express 48, koa 7, axios 36, commander 10, YAML workflows) (<the session scratchpad, since lost>/patch-611/grain-041/engine-indent.log)

docs: none required (the 0.08 register row in docs/mathematics.md still matches the code). Needs: EXTR_V (auto.lex:indent is cached per file in the tree and history blob caches; the final pass bumps it once, D5). Wider measurement of the chosen rule against three alternatives over 26 repositories: <the session scratchpad, since lost>/patch-611/grain-041/indent-variants.log, indent-minoldstep.log, indent-minoldstep-2.log (odd-multiple widths misread Javadoc at width 9 as 3-space; the most frequent step alone misread javapoet's 2-space Java as 4).
- **ran (history):** round 2: node --test tests/indent-unit-steps.test.mjs on 6671573 (round-1 tip) with the new comment fixtures · **saw:** pass 9 fail 2: tab file with a 3-line license header 'tally 3 of 28 indented lines depart'; check on a new tab file in a tab repo prints '— scored per file … depart'
- **ran (history):** same on f8feb6e · **saw:** pass 11 fail 0 (license header, JSDoc, Javadoc with and without stars, Python docstring, template literal: lexTally null; a real 3-space line in a 2-space file still counted)
- **ran (history):** reviewer's note-sweep.mjs, round 1 vs f8feb6e, on express, spring-petclinic, commander, axios, flask, jsoup, javapoet · **saw:** files where the clause speaks: express 2->1, spring-petclinic 0->0 (12 newly in the reviewer's run before the * rule), commander 1->0, flask 6->0, jsoup 121->10 (60 of 5623 lines), javapoet 1->1 (<the session scratchpad, since lost>/patch-611/grain-041/note-sweep-round2.log)
- **ran (history):** YG_BIN=… npm test on c90caa6 · **saw:** tests 1992, pass 1991, fail 0, skipped 1
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2027, pass 2026, fail 0, skipped 1, merge ba08bd8

