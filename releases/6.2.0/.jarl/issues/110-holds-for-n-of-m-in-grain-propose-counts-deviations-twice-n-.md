# 110 · 'holds for N of M' in grain propose counts deviations twice: N is the whole established population (deviations included), and M adds the deviations once more

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0853-xanr
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/propose-aspects.mjs, Grain/plugins/grain/engine/propose-markdown.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/propose-aspects.mjs:329 `const n = Math.max(0, (c.established || 0) - exemptedConf)`, where established = f.sraw (export.mjs:561), i.e. the sum of survived-raw over all values, deviations included (mine.mjs:202/431); holdsPhrase :105-110 prints `holds ${n} of ${n+dev}`, adoption = n/(n+dev) :336, provenance :338 `n ${n} conforming`, the evidence line, `holds` and `description` :347 and :366-372; propose-markdown.mjs:133-138 (REFACTOR-BACKLOG.md §1 shows established in the 'conforming' column). On release/6.1.1 (propose-aspects.mjs:408-420) only the label partitions are recounted (`n = confIn.length`), and every other row stays at `n = nAll = established`, so two paths in this function understand n differently.
**Branch:** jarl/110-proposal-counts-and-empty-types
**Merged:** 1098c12
**CI:** none

## What
Reproduction (fresh Grain ae6152f, v6.1.0, node 24.11.1, fresh clones only):

1. commander.js @ba6d13d: the export row tests::_all:file::auto.imp:node:assert/strict has established 110, share 0.955, conformingSites 105 and deviatingSites 5; 105 + 5 = 110 without overlap, so 110 already contains the 5 deviations. `grain report`: '96% of 110 established, 5 deviants'; tests/ has 110 code files outside fixtures. `grain propose` prints and writes to yg-aspect.yaml (the `# holds…` line and `description`): 'It already holds for 110 of 115 files in scope; 5 break it today'. The check.mjs header: 'n 110 conforming, 5 deviating (adoption 96%)'; provenance.json n 110, deviating 5; REFACTOR-BACKLOG.md conforming 110, deviating 5. All 4 certified rows with deviations at partition level in commander follow the same pattern: lex-indent 109 of 118 (export 100+9), lex-imports 105 of 106 (104+1), lex-decl 105 of 109 (101+4), imp-node-assert-strict 110 of 115 (105+5).
2. click @06b2a67: partition-deco-click-argument 1144 of 1235 (91 break), deco-cli-command 1144 of 1194, imp-click 54 of 62. The last one is impossible: tests/ has only 59 tracked files, and propose speaks of 62 'files in scope'. `grain report` for this rule: '91% of 54 established, 5 deviants', and propose prints adoption 87%, because 3 of the 8 deviations at HEAD are fresh scopes outside `established`. So the bug has two parts: surviving deviations counted twice, and the surviving population mixed with the HEAD population in one fraction. On click lex-quote the errors cancel out (52 of 54, correct by accident).
3. gin (from the finder's logs): 'holds for 822 of 886 methods', while check says 759/822 conform.

Distinct from 003 and from the known point 'N break it today vs yg check': here the count of breaking files is right; 'holds' and the total are wrong. Issue 046 only quotes the string 'holds for 34 of 36'. Note for the fix: deviatingSites is a count at HEAD that may include fresh scopes excluded from established, and conformingSites is truncated at 300, so holds and the total must come from one population. Side observation (a known problem, issue 041): 4 of the 5 'deviations' in commander are .cjs files with `require('node:assert/strict')`.

Logs: finder <the session scratchpad, since lost>/bughunt/grain/find-1/logs/f5-holds-double-count.log (script f5-holds-double-count.sh next to it; the gin and click numbers in f3b-absence-enforced.log and f3c-absence-enforced-click.log); verification <the session scratchpad, since lost>/bughunt/grain/verify-47/logs/v1-commander.log, v2-commander-crosscheck.log, v3-click.log, v4-click-scope.log (v3-koa.log is the control repository, without a certified row with deviations).

## Why
The enforced/draft status comes from the drill, not from n or adoption, so no rule changes behavior. But the number the renderer calls 'the number that decides whether to believe the sentence' is wrong in every certified row with deviations, contradicts `grain report` and the export, and can claim there are more files in scope than exist. docs/reference.md (around line 576) says the evidence line starts with 'how many sites in scope hold the rule and how many break it today', and export.mjs:213 describes established as the population used by 'every printed `n of N`' (i.e. N, not n).

## Acceptance
- 'holds' and the total come from one population: either the surviving conforming sites (srawCounts[expected]) out of established, or the conforming sites at HEAD out of (conforming + deviations) at HEAD; the same applies to adoption, provenance, `description` and REFACTOR-BACKLOG.md.
- commander.js @ba6d13d: the rule with the node:assert/strict import says 'holds for 105 of 110 files in scope; 5 break it today'.
- click @06b2a67: imp-click does not give more files in scope than tests/ has tracked files (59).

## Changelog
- Fixed: a proposed rule's "holds for N of M" counted the files that break it twice, and could name more files in scope than the folder has; it now counts the files that follow the rule today beside the files that break it today ("holds for 51 of 59 files in scope; 8 break it today").

## Evidence

- **ran (history):** node --test tests/proposal-holds-one-population.test.mjs on release/6.1.1 engine and on 55eede5 · **saw:** before 0 of 5 pass (e.g. 'holds for 110 of 115 files in scope; 5 break it today', backlog row [96%,110,5]); after 5 of 5 pass
- **ran (history):** YG_BIN=<frozen yg 6.1.0> grain propose on commander.js ba6d13d and click 06b2a67, release/6.1.1 engine vs branch · **saw:** commander imp-node-assert-strict: 'holds for 110 of 111' -> 'holds for 109 of 110 files in scope; 1 break it today' (tests/ has 110 code files; grain report '99% of 110 established, 1 deviant' — 041 moved the old 105/5); click tests imp-click: 'holds for 54 of 62' -> 'holds for 51 of 59 files in scope; 8 break it today' (git ls-files tests = 59); yg adopt --dry-run 'would accept' on both
- **ran (history):** YG_BIN HORDE_DIR GRAIN_CORPUS_CLONES npm test on d7de27d (propose-type-levels with corpus included) · **saw:** tests 2055, pass 2054, fail 0, skipped 1
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2078, pass 2077, fail 0, skipped 1, merge 1098c12

