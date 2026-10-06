# 100 · A binary file with a code extension (an MPEG-TS video segment `*.ts`) is parsed as TypeScript: indexing takes minutes, the tree-sitter wasm runtime crashes, and the model silently loses the scopes of later files or is empty

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/history.mjs, Grain/plugins/grain/engine/partition.mjs, Grain/plugins/grain/engine/learn.mjs, Grain/plugins/grain/engine/vendor/runes/dist/ast/walk.mjs, Grain/plugins/grain/bin/grain.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** history.mjs:130-170 (headTree reads every tracked blob with a grammar extension and decodes it as UTF-8, :163), partition.mjs:166-197 (extractTree: the only gate is `src.length > 1.5e6` at :186, in UTF-16 characters; a bare `} catch {}` at :193; `tr.delete()` at :192 skipped on an exception), history.mjs:345-424 (parseBlobs, byte limit :369), learn.mjs:82 (cache only for files with named scopes), vendor/runes/dist/ast/walk.mjs:5 (walk over node.child(i), the same in Runes main src/ast/walk.mts), bin/grain.mjs:12-14 (--liftoff-only). Git's binary heuristic is already in evals.mjs:58-60, but extraction does not use it. The cited lines are identical on release/6.1.1 (history.mjs differs by 4 lines elsewhere).
**Branch:** jarl/100-binary-and-oversize-sources
**Merged:** 438d8f5
**CI:** none

## What
Reproduction (fresh clone of Grain 6.1.0, ae6152f; machine load 4-11): two fixture clones; in one of them a committed media/hls/segment0.ts with 1 000 000 random bytes (`file`: 'data'), then `grain status` in both. Baseline 0.61 s; with the segment 21.22 s ([history] 5.7 s, learn 15.2 s) and '155 files', so the binary is counted as a source file. Scaling (--no-history, one binary .ts): 0 B 0.33 s, 100 KB 0.66 s, 200 KB 1.08 s, 400 KB 6.69 s, 800 KB 21.8 s. The finder, on a machine with load ~40, measured 2.3 s → 83 s, and ten segments of 300 KB each → 411 s.

On real repositories the effect is not only time:
- A real MPEG-TS from ffmpeg (h264+aac, 1.08 MB): cold run 14.25 s, after swapping the segment 16.3 s; `grain check` on it takes 10.6 s and says 'parse failed … unsupported syntax or a grammar limitation'.
- shaka-project/shaka-player (HEAD 9babbcd) commits 144 MPEG-TS assets as test/test/assets/**/*.ts. A control clone with these files renamed to .ts.bin: `grain status --no-history` 15.0 s, 25 partitions, 14713 scopes, 928 code files with scopes. With the assets: 392.8 s, 17 partitions, 11030 scopes, exit 0, no warning; 325 real JS files lose all their scopes (ui/ 118, third_party/ 75, test/util 39, test/test 60, …).
- A trace of the extractTree loop with the errors printed: test/test/assets/hls-gap/6.ts parses for 224 s and ends with 'RuntimeError: Aborted()'; on hls-ts-h265/0.ts 'TypeError: null.isError' (scopes.mjs:84); then each of the 401 following files fails in 0 ms with 'RuntimeError: table index is out of bounds'. The wasm runtime is dead, result ok 660 / threw 403.
- Minimal, on the fixture: hls-gap/6.ts (152 KB) alone gives Aborted() after 219 s with the model intact; with hls-ts-h265/0.ts: Aborted(), 229 s, '0 partition(s) · 0 groups · 0 conventions · 156 files', 0 of the 124 src/ files have scopes, exit 0. Status blames the repository ('0 source files — no source partition'), and `where handler` answers 'no strong conventions were found in this repository', which is false. With history, a cold `grain status` crashes after 260 s with 'table index is out of bounds', exit 1; a second run gives 0 scopes after 266 s.
- A binary that yields no scope never enters the cache: after an unrelated one-line commit, the refresh again takes 260 s ('153 from cache, 2 parsed').
- Profile of 800 KB of random .ts under liftoff: parse 23%, relFactsFor 73%. The TS extractor from Runes walks the tree three times (errorRows, declarations, uses) through node.child(i), and an ERROR node from binary input has up to 417 thousand children; the Runes walk takes 3.7 s, a TreeCursor walk over the same tree 39 ms.
- A 1.55 MB binary is over the history limit (bytes), but at HEAD it is parsed anyway (1 468 154 decoded characters < 1.5e6): 15.6 s.

Corrections to the issue: HEAD extraction does have a size limit (partition.mjs:186, in characters, not bytes); only the text/binary gate is missing; the cost depends on the content (a real 152 KB segment costs 220-264 s, random 1.55 MB 15.6 s); on an unloaded machine the 1 MB case is 21 s, not 83 s, which is still about 35 times the baseline.

The fix needs three things: a text/binary gate (NUL in the first 8000 bytes, like git and evals.mjs), catching the dead wasm runtime (and freeing the tree on the exception path), and a cursor walk instead of node.child(i). The NUL gate alone will not cover the text collision with Qt Linguist .ts files (XML; not measured).

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-7/G-binary-ts-parse-cost.log and G-binary-ts-scaling.log; verification in <the session scratchpad, since lost>/bughunt/grain/verify-33/ (the first line of each log is the exact command): V-binary-ts-1mb.log, V-binary-ts-scaling.log, V-real-mpegts.log, V-shaka-real.log, V-shaka-lost-files.log, V-shaka-trace.log, V-gap6-wipe.log, V-h265-wipe.log, V-gap6-h265-warm-answers.log, V-gap6-history.log, V-gap6-refresh.log, V-gap6-abort-profile.log, V-cpuprof-800b.log, V-cpuprof-800b-chain.log, V-walk-quadratic.log, V-phase-timing.log, V-nearcap.log.

## Why
Repositories of players and media libraries commit MPEG-TS segments as `*.ts` (shaka-player 144, mux.js 6, videojs/http-streaming a few). On shaka-player 35% of the real code silently disappears from the model, two assets wipe the model entirely, and with history a cold `grain status` ends with exit 1. README:454 promises that Grain 'degrades without crashing'; here it either crashes or answers falsely ('no strong conventions were found in this repository'). Every auto-refresh that touches such a file pays the minutes all over again.

## Acceptance
- A file that is not text (NUL in the first 8000 bytes) is not parsed, neither at HEAD nor in history, and is disclosed the way files skipped by the size limit are.
- A wasm runtime exception (Aborted(), 'table index is out of bounds') does not silently kill the extraction of later files and does not end in an empty model without disclosure; the tree is freed on the exception path too.
- Fixture with hls-gap/6.ts and hls-ts-h265/0.ts added: `grain status` (with and without history) ends with exit 0 with the same partitions and src/ scopes as without them; shaka-player @9babbcd has as many code files with scopes as the control clone with .ts.bin.
- The TS extractor's walk over a tree with a wide ERROR node is not quadratic (TreeCursor or equivalent).

## Changelog
- Fixed: a binary file with a code extension, such as a video segment saved as .ts, is no longer read as source code, so indexing no longer takes minutes or loses the rest of the repository over it, and status names the files it left out.

## Evidence

docs: docs/reference.md: a tracked file with a code extension whose first 8000 bytes hold a NUL byte is binary, not parsed nor counted as source, and named under 'not parsed' and relCoverage.unparsed.binary; a file the parser fails on is named under relCoverage.unparsed.failed; a parser runtime that stops working ends the run with an error naming the file
- **ran:** nice -n 15 node --import ./tests/git-env.mjs --test tests/binary-sources-not-parsed.test.mjs (9ec7e67, then 1b73f29) · **saw:** 9ec7e67: 8 fail (tree.binary undefined; NUL content handed to the parser; no rejection on a dead runtime; tree deleted 0 times; fixture 156 files vs 154); 1b73f29: 8 pass, 0 fail
- **ran:** fixture + the issue's shaka segments hls-gap/6.ts and hls-ts-h265/0.ts as media/a.ts and media/b.ts: grain status, with and without --no-history · **saw:** exit 0 both ways, about 1 s, model line identical to the fixture without them (3 partitions, 31 groups, 84 conventions with history, 154 files) plus 'not parsed: 2 binary files with a code extension (media/a.ts, media/b.ts)'; log scratchpad/patch-611/grain-100/ev-real-segments.log

jarl: EXTR_V bumped once, in the 6.1.1 final pass, together with 041/043 (grain-scope already accepted a one-time re-parse of history) — it also clears history caches poisoned by the dead 6.1.0 parser

jarl: the fourth acceptance line (non-quadratic TS tree walk) moved to Runes 168 — the walk lives in the vendored Runes, which Grain does not edit. For the final pass: the changelog entry should also mention stopping the run with an error on a dead parser runtime and disclosing 'parser failed on'; 119: the relCoverage description in engine/export.mjs needs updating (docs note).
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 1951, pass 1950, fail 0, skipped 1, merge 438d8f5

