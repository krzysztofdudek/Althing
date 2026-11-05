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
| negative | Althing's own documents and code, the README, CHANGELOG and operating docs of the eight family repositories, and Yggdrasil's `docs/` (92 files, 6,836 paragraphs, rerun after the operating docs and skills were written) | 2 paragraphs flagged, both real Polish words quoted inside English text (Jarl's README names the two Polish answer words it accepts; its CHANGELOG gives a Polish example of folding a title); no false positive |

Six Polish paragraphs of fewer than six words were not counted: a one-word line has too little to judge without its letters. Only the counts are recorded here, never the text of the positive set.

**Known limits.** Polish inside a fenced code block passes. A single Polish word in an English sentence, written without its Polish letters, passes. A long Polish sentence broken across hard-wrapped lines is read as one paragraph, but a run of one-word lines is not.

## boundary/no-private-paths

**What it catches.** A path that names a machine or a private place: an absolute path under a home directory, the system temporary directory or a Windows user folder; a `file:` URL; a path shaped like a private practice repository's client area or journal entry; a relative Markdown link that climbs out of the repository. It reads code blocks too, because a path in a code block leaks just the same.

**The allowance.** Jarl writes the worktree a lease ran in into its record: the `**Worktree:**` field of an issue and the `· worktree <path>` segment of a log line. Inside `releases/<version>/.jarl/`, and only in those two places, a worktree under a home directory's `Worktrees/<Repository>/` (the host's place: exactly a home's `Worktrees/<Repository>/<name>`, on a Mac or a Linux host, with no `.` or `..` segment and no extra segment), under a home directory's `.jarl-wt/` (the old place, which the closed loop records still hold) or under the devcontainer's `wt/` root is allowed. Those lines are true facts about where work ran, they reveal only a user name, and editing `log.md` would change the done gate. A `**Repo:**` or `**Merged:**` field always uses a relative path.

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

## The shapes of the regions

These rails hold the structure of the regions that a release, the canon, the method and the research live in. Each is a cheap structural keep with a one-line fix.

| Rail | What it catches | The fix |
|---|---|---|
| `layout/family` | a file in `family/` other than `canon.md`, `registry.json`, `map.md`, `contracts.md`, `inventory.md`, `parked.md`, `history.md`; a registry that does not parse as `family-registry/1` | put the file where the placement table in `AGENTS.md` says |
| `layout/research` | a research folder not named `YYYY-MM-DD-<slug>`; a folder without a `README.md` opening with `**Question:**`, `**Method:**`, `**Status:**` (open, concluded, or superseded by a slug) and `**Conclusion:**`; a `findings.json` that does not parse; a file deeper than the folder's top other than under `materials/` | rename, add the header, or move the file into `materials/` |
| `layout/release` | a release directory not named `x.y.z`, without `family.json`, or holding anything besides `plans/`, `briefs/`, the loop and `FROZEN.sha256` | a release directory comes from `ws release open`; anything else about a release belongs in its loop or in `research/` |
| `release/manifest` | a `family.json` that is not a valid `family-release/1`: the release not equal to its directory, a state outside open, candidate, published; a commit while open, or a missing full commit once a candidate; a repository not in the registry; the core on two versions; a previous release that is missing or that the node cannot read; a driver Jarl not pinned to a full commit; a published manifest that is not frozen | correct the manifest; `ws release nodes <version>` declares the relations the rule reads through |
| `freeze/holds` | a file listed in a `FROZEN.sha256` that changed or is gone, or a file added under a frozen directory | restore it from git: a frozen directory never changes, and a correction is new work in a new place |
| `loop/shape` | anything in `releases/<version>/.jarl/` besides `goal.md`, `decisions.md`, `asks.md`, `log.md`, `issues/`, `templates/`, `archive/`, `.gitignore`, `.gitattributes`, `.permanent`; a missing `.permanent`; a committed lock or temporary file; an issue file not named `NNN-<slug>.md`, a number used twice, a header whose number differs from the file's, a missing `**Status:**`, `**Kind:**` or `**Priority:**`; a `**Repo:**` that is absolute or an unknown name | write the loop only through the driver Jarl (`ws jarl`); a `**Repo:**` is a relative path from the loop's root, `../../../<Repo>` |
| `rulings/ledger` | an entry of `method/rulings.md` that is not `## <slug>` followed by `**Date:** YYYY-MM-DD · **Status:** standing \| superseded by <slug> \| retired · **Origin:** releases/<v> \| private <v> loop, translated`; a slug used twice; a superseding slug with no entry; a pointer whose ruling is not in that loop's `decisions.md` | correct the entry; a pointer needs a `uses` relation from the method node to the loop's node |
| `index/in-sync` (advisory) | `releases/INDEX.md` or `research/INDEX.md` differs from what `ws index` writes | run `node workspace/ws.mjs index` |
| `canon/registry-consistent` | the canon's family block (between its markers), `family/map.md` or `family/contracts.md` missing a core tool or add-on of the registry, or naming one the registry lists as retired | the registry is the one place the list is written: change it there first, then the canon, then every surface |

A rule that reads another region (the previous release's manifest, the release's freeze file from its loop, the loop a ledger entry points at, the registry) reads it through a relation of its node. `ws release nodes <version>` writes a release's nodes with those relations; a node without the relation gets a refusal that says so, never a silent pass.

## The hook rails

These rails need git history or a secret, so they cannot be Yggdrasil rules (a Yggdrasil verdict is cached by the inputs a check reads, and a key or a commit range is not one of them). `run.mjs` runs them from the git hooks and from CI, and they block from the start.

| Rail | Where it runs | What it catches |
|---|---|---|
| `names` | pre-commit (staged lines and new file names), commit-msg, pre-push (every commit in the range), CI (the range and the tree), nightly (the whole history) | a name on the private deny-list |
| `messages` | commit-msg, pre-push | a commit message that is not English, links anything but public GitHub and the family's own sites (an agent session, a private host), names a local path, or carries a `Claude-Session` trailer (standard trailers such as `Signed-off-by`, `Reviewed-by`, `Fixes`, `Refs` and `Co-Authored-By` are allowed; a trailer's URL is held to the same link rule); a pushed branch or tag name that is not English |
| `secrets-range` | pre-push, CI | the secret shapes of `secret-scan` in any line a pushed commit adds, so a secret added and removed again is still caught |
| `proper-nouns` (advisory) | pre-commit | new capitalised words in staged Markdown that are not at a sentence start and not in `lexicon/proper-nouns.txt`, printed for a glance, never blocking |

Before a push, the same detectors as the Yggdrasil rules (English, paths, binaries, secrets) also run over every line each pushed commit adds. In a public repository, CI runs too late: once a commit is on GitHub, forks, caches and the events API keep it. So the pre-push hook is the leak gate, CI is detection and alarm, and the first push carries one squashed commit, never the local history.

**The names rail.** The deny-list of private names lives only on the owner's machine. What is committed is `names/digests.json`: an HMAC-SHA256 of each entry under a secret key, truncated to 128 bits and padded with random decoys to a multiple of 512, so the file reveals neither the names nor how many there are. A plain salted hash would fall to anyone hashing a list of company names. Entries and text are folded the same way (Polish and other letters to ASCII, lower case, split at every character that is not a letter or a digit and at camelCase), and every window of one to four words inside a paragraph is checked spaced and joined, so a name is found across a line break, in an e-mail address, a slug, a possessive or written as one word. Long hexadecimal and base64 runs are dropped and lockfiles are not read, so a short entry never collides with a hash. An entry flagged `cap` matches only capitalised text. A finding names the file, the line and the window size, never the entry.

**Its states.** `not initialised` (no `names/digests.json` yet), `no key` (this machine has no `~/.config/althing/names.key` and no `ALTHING_NAMES_KEY`), `key mismatch`, `ready`. A commit made when the rail cannot run says, in one line, that it is unscanned. A push to the canonical repository (a push whose URL, as git hands it to the pre-push hook, ends in `krzysztofdudek/Althing`, on any host or alias; an absent or empty URL counts too) in any state but `ready` is refused: nothing reaches it unscanned. A push to any other remote, such as a contributor's fork, prints one line saying it is unscanned and goes through; the names job of CI runs only on the canonical repository, so a fork's CI is not red for want of a secret. `node workspace/ws.mjs doctor` shows a missing key as a warning, the contributor mode, and a key that does not match as a failure. The key on a new machine comes from the owner; never generate one. `node rails/names.mjs status` prints the state.

**Initialised** 2026-10-05: `names/digests.json` holds 1,024 digests, real ones and decoys together. A scan of this repository's tree and of its whole history with the key found no hit.

**The fix.** Change the text: describe the thing without naming it. A deny-list hit is never a false positive to allow-list. When a private name is found in something already committed: stop, do not push, tell the owner, and follow the leak response in `method/boundary.md`.

## hooks/wired

**What it catches.** A hook in `.githooks/` or `rails.yml` that no longer runs its rails (the Yggdrasil gate, `run.mjs staged`, `message`, `range --require-key --remote "$2"`, `history --require-key`, `yg log merge-resolve`), the names key secret missing from CI, the names job not guarded to the canonical repository, or the hooks and CI pinning different `yg` versions. Without it, a rail that needs a secret or git history could stop running while every other rule stayed green.

**The fix.** Restore the line, or move every pin together.
