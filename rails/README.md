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

## boundary/no-private-paths

**What it catches.** A path that names a machine or a private place: an absolute path under a home directory, the system temporary directory or a Windows user folder; a `file:` URL; a path shaped like a private practice repository's client area or journal entry; a relative Markdown link that climbs out of the repository. It reads code blocks too, because a path in a code block leaks just the same.

**The allowance.** Jarl writes the worktree a lease ran in into its record: the `**Worktree:**` field of an issue and the `· worktree <path>` segment of a log line. Inside `releases/<version>/.jarl/`, and only in those two places, a worktree under a home directory's `.jarl-wt/` or the devcontainer's `wt/` root is allowed. Those lines are true facts about where work ran, they reveal only a user name, and editing `log.md` would change the done gate. A `**Repo:**` or `**Merged:**` field always uses a relative path.

**The fix.** Write the path relative to the repository, as a placeholder that `ws brief` fills in per machine (`{{repo:<name>}}`, `{{wt:<name>}}`), or in plain words ("the session scratchpad"). Link another repository by its GitHub URL.

## boundary/no-binaries

**What it catches.** Any file whose extension names an image, audio, video, archive, font, office document or PDF, and any file with a NUL byte in its first 8,000 characters. A text scan cannot read a screenshot, and a screenshot of a private system is the easiest leak there is.

**The fix.** Draw a diagram as SVG or as text. Link a public picture where it is already public. The allow-list is empty; adding to it takes a ruling that argues the need.

## secret-scan

**What it catches.** Known high-signal secret shapes: private key blocks, AWS, GitHub, npm, Slack, Google and provider keys and tokens, JWTs, the names key, and a credential assigned in quotes. Prose about keys and tokens does not trip it. The same detector runs over every commit of a pushed range (secrets-range), so a secret added and then removed is still caught before it leaves the machine.

**The fix.** Remove it, rotate it if it is real, and keep it out of band: a local file or a CI secret. A refused file is not copied into Yggdrasil's local refused-content store (`stores_content: false`), so the store never holds a second copy of the secret.

**Known limits.** A secret with no known shape (a random password in prose, an internal hostname) passes. The keyed names rail covers private names; nothing covers an unnamed paraphrase.

## links/resolve

**What it catches.** A relative Markdown link whose target does not exist, an absolute link (`/method/x.md`), and a link into a region the file's node does not declare. A node reads another region only through a relation in its `yg-node.yaml`, and structural relations must form a chain without cycles, so links between regions run one way: the root documents link down into the method, the rails, the workspace and the skills; a skill links into the method; the method links into the rails and the workspace, and names a root document in backticks instead of linking it.

**The fix.** Correct the target, or add the relation (`uses`) to the node when the link is a new kind of cross-region link. Another repository is linked by its GitHub URL.

## naming/kebab

**What it catches.** A file or directory name in the document regions (`family/`, `method/`) that is not kebab-case. README.md, INDEX.md, SKILL.md and the other conventional upper-case names are allowed.

**The fix.** Rename it with `git mv` and update its links.

## layout/root

**What it catches.** A file at the root other than README.md, VISION.md, AGENTS.md, CLAUDE.md, LICENSE, CODEOWNERS, package.json, .gitignore and .gitattributes (any other file or directory there belongs to no node, and Yggdrasil's coverage refuses it already), and a package.json that is not private, not an ES module, names no Node version, or has a dependency.

**The fix.** Move the file into its region, or file an issue asking where it belongs. Althing's code runs on Node alone.

## skills/frontmatter

**What it catches.** A `SKILL.md` without frontmatter, whose `name` is not its directory, or whose `description` does not start "Use when" or runs past 1,024 characters. A skill is found by the moment its description names.

**The fix.** Rewrite the description as the moment it applies.

## code/read-only-to-tools

**What it catches.** In `workspace/` code (`.mjs`, `.js`, `.sh` and the like): `git push`, creating or moving a tag, `npm publish`, `gh release`, `gh repo`, `gh pr`, `gh issue` and `gh secret` writes, and a GitHub API call with a writing method, written as a shell line or as an argument array.

**The fix.** Print the command for a person to run on the owner's word. Althing verifies; the acts that leave the machine are his. A needed exception is an architecture change.

## A rule with nowhere to run

A region's node is created with the region's first file, because a node may not map a path that does not exist. Until then the rules of that region are effective nowhere, and `yg check` says so in one warning per rule (`aspect-effective-nowhere`). The warning goes away with the region's first file and its node. It is not something to silence.
