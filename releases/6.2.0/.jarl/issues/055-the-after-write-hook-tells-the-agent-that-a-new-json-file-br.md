# 055 · The after-write hook tells the agent that a new JSON file breaks the repository's single-quote convention, although JSON allows only double quotes

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T0737-vhfp
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/partition.mjs, Grain/plugins/grain/engine/lexical.mjs, Grain/plugins/grain/engine/facts.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/partition.mjs:306-316 lexDomain: quoteChoice(g) excludes only grammars with a character-literal or rune node, so json returns true (also yaml, toml, properties), and :316 `pid === 'auto.lex:quote' && quoteChoice(g)` bypasses the 'at least 2 observed values' rule; facts.mjs:75-79 keeps `auto.lex:quote=double` of every JSON file (lexical.mjs:83, STR_TYPES extended with the strings of data grammars in g26); the fact id `auto.lex:quote` does not name the grammar
**Branch:** jarl/047-right-norms-per-file
**Merged:** f5f5161
**CI:** none

## What
Reproduction (Grain origin/main ae6152f, engine 6.1.0): brocoders/nestjs-boilerplate @9620f15, `grain refresh`; a copy of src/i18n/en/common.json as src/i18n/de/common.json (valid JSON); a PostToolUse Write payload through the exact check-hook command from hooks/hooks.json (CLAUDE_PLUGIN_ROOT set to the fresh clone) → '[grain] repo-wide (small packages merged) convention: files here quote strings with single quotes / 149/150 established files conform. Your file `common.json` (line 1) quotes strings with double quotes. / Nearest conforming exemplar: .install-scripts/helpers/replace.ts:1 … (preference gap 6.64 bits)'. The same for a new .vscode/launch.json. `grain check src/i18n/en/common.json` on the committed file: '4 flagged as a genuine violations (not delimiter-forced)'. honojs/hono @f23b146: a new src/helper/i18n-test/messages.json → 'package src convention: files here quote strings with single quotes / 267/267 … quotes strings with double quotes' with .ts exemplars. Correction to the issue as filed: partitions contain JSON files (nest _repo: 36; hono src: 1) and these are counted as deviants when the convention is mined (nest: .vscode/extensions.json, .vscode/settings.json, nest-cli.json, package-lock.json, package.json; hono: src/middleware/jwk/keys.test.json), so every committed JSON file counts against the TS style. Editing the existing package.json is silent (a pre-existing deviation, collapsed); the hook speaks on a new JSON file in a partition where TS/JS prefers single quotes (a common Prettier singleQuote; i18n files, tsconfig, fixtures, launch.json). The 6.1.1 fix 'Data files stay out of import rules' concerns only `auto.imp:`. Logs: <the session scratchpad, since lost>/bughunt/grain/verify-22/logs/02-nest-posttooluse-de-common-json.log and 01 and 03-11 in that directory (05-quotechoice-per-grammar.log: `json data=true quoteChoice=true`).

## Why
The README (~226) says the lexical layer 'speaks only where the repository shows a choice (double quotes in Go are the language, not a convention)', and double quotes in JSON are just as much the language. The hook gives unrequested, wrong advice on the hot path after a write, and following it produces invalid JSON.

## Acceptance
- The quote surface does not apply to grammars that cannot express a single-quoted string (at least json; e.g. by skipping b.data grammars or by requiring at least 2 observed values within a grammar), and JSON files are not counted as deviants of the quote convention of TS/JS.
- nestjs-boilerplate @9620f15: the PostToolUse Write hook for a new src/i18n/de/common.json and .vscode/launch.json says nothing about quotes, and `grain check src/i18n/en/common.json` reports no quote violations.

## Changelog
- Fixed: after an agent wrote a new JSON file into a project whose code uses single quotes, Grain told it the file broke the single-quote convention, and check flagged committed JSON files the same way; data files (JSON, YAML, TOML, properties) are no longer counted in or judged by the code's quote style.

## Evidence

- **ran (history):** node --import ./tests/git-env.mjs --test tests/data-grammar-quote-scoping.test.mjs (before / after 8fb1959) · **saw:** before: tests 4, pass 0, fail 4 (json LEX [auto.lex:directive, auto.lex:quote]; 5 JSON files deviants of the single-quote fact; hook on a new common.json: 'files here quote strings with single quotes … quotes strings with double quotes'); after: tests 4, pass 4, fail 0
- **ran (history):** nestjs-boilerplate @9620f15 (fresh clone, engine at 8fb1959): grain status; PostToolUse Write through hooks.json's check-hook for new src/i18n/de/common.json and .vscode/launch.json; grain check src/i18n/en/common.json · **saw:** _repo quote fact exp=single with 0 JSON deviants, json LEX [auto.lex:directive]; both hooks: no output, exit 0; check: 'governed by 0 convention(s) · 0 deviation(s) in your change, 0 pre-existing'
- **ran (history):** nice -n 15 npm test in plugins/grain at 8fb1959 (no YG_BIN) · **saw:** tests 2038, pass 2008, fail 0, skipped 30, exit 0
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2067, pass 2066, fail 0, skipped 1, merge f5f5161

