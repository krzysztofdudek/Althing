# The rails

The rails are the checks behind Althing's gate. Each detector is a plain module in this directory with tests in `test/`. Yggdrasil runs the ones whose input is the tree, through a thin adapter in `aspects/` that each `.yggdrasil/aspects/<id>/check.mjs` re-exports; the git hooks and CI run the ones that need git history or a secret, through `run.mjs`. One detector serves the tree, the staged diff, the pushed range and the commit message, so a rule is written once.

Blocking is kept for what cannot be undone or is broken by construction. Everything else is advisory. A refusal prints the rail's name, the file and the line, and the fix for each rail is below.

## Status: advisory until ratified

A rule that reaches a whole type of file is the owner's to admit (`type_law.ratification: true` in `.yggdrasil/yg-config.yaml`). Until he ratifies a rule with `yg log add --aspect <id> --ratify`, it stands `advisory`: `yg check` shows its refusals as warnings and does not block. Once ratified, its status becomes `enforced` and a refusal blocks the commit and CI. The hook rails in `run.mjs` (names, messages, secrets over the pushed range) are not Yggdrasil rules and block from the start, and the pre-push hook also runs the English, path, secret and binary detectors over every pushed commit, so the leak gate holds before ratification too.

## lang/english

**What it catches.** Polish, the owner's language and the one most likely to slip in. Four rules, over text with fenced code and URLs removed:

- **letter**: a Polish-specific letter (a, c, e, l, n, s, z with their Polish marks) in a word that is not on the allow-list.
- **o-acute**: the letter o-acute in a word whose ASCII-folded form is a Polish word. A bare o-acute is not enough, because Norse and Spanish names have it too.
- **sentence**: two Polish words in one sentence: two distinct words from `lexicon/pl-stopwords.mjs`, two Polish-looking words (lower-case, with a letter cluster, an ending or a prefix English almost never has), or one of each. Inline code spans are left out of this rule.
- **slot**: one such word in a heading, a file name, a `**Tags:**` value, a branch name or a slug, where a single word is already a signal.

**The fix.** Translate the text. The owner's words are written as `Krzysztof, YYYY-MM-DD (translated from Polish): "…"`. A foreign proper name with a Polish letter gets an entry in `lexicon/foreign-allow.mjs`, exact and case-sensitive, with its reason, in a commit of its own. A name on the private deny-list is never allowed: the text changes, not the list.

**Calibration**, 2026-10-05, with `node rails/english.mjs --calibrate`:

| Set | What was read | Result |
|---|---|---|
| positive | a real Polish release loop (266 files): 1,862 Polish paragraphs of at least six words | 100% flagged as written; 99.84% (1,859) flagged once folded to ASCII, which measures the word rules alone |
| negative | Althing's own documents, the README, CHANGELOG and operating docs of the eight family repositories, and Yggdrasil's `docs/` (76 files, 6,331 paragraphs) | 2 paragraphs flagged, both real Polish words quoted inside English text (Jarl's README names the two Polish answer words it accepts; its CHANGELOG gives a Polish example of folding a title); no false positive |

Six Polish paragraphs of fewer than six words were not counted: a one-word line has too little to judge without its letters. Only the counts are recorded here, never the text of the positive set.

**Known limits.** Polish inside a fenced code block passes. A single Polish word in an English sentence, written without its Polish letters, passes. A long Polish sentence broken across hard-wrapped lines is read as one paragraph, but a run of one-word lines is not.
