# Archgate → Yggdrasil: concepts worth porting

**Date:** 2026-08-06 · **Scope:** a full read of `archgate/cli` at commit `9efeade` (v0.51.0, 515 commits, last commit 2026-08-06) against Yggdrasil v5.7.0. Sources read: the README, the whole docs site (concepts, reference, guides, the Sentry study), the rule API and its implementation, the check engine (`runner`, `reporter`, `suppressions`, `rule-scanner`, `sarif`, `git-files`, `context`), every command, and the 35 self-governing ADRs in `.archgate/adrs/`. Yggdrasil side: `yg prime`, the `writing-deterministic-aspects` and `suppress-syntax` knowledge, the aspect/node/architecture schemas, and the relevant CLI source.

This is not a competitive comparison; that was a separate market study, which is not public. This asks a narrower question: **which of their ideas are good, independent of who had them, and what would it cost to have them here.**

## The finding that reframes the rest

Archgate ships a diagnostic called the **briefing budget**. Its agent-facing command embeds each rule's normative prose into the agent's briefing and truncates each section at a fixed cap. Their reasoning, stated in their own docs: *prose past that point never reaches the agent the rule governs, and no companion rule can detect it — rules measure code, not the rulebook's own prose.* So `check` reports every section over the cap, corpus-wide, including rules that carry no automated check at all.

Yggdrasil had the same insight first and did not ship it. `scripts/prompt-headroom.mjs` in the Yggdrasil repo opens with: *"the gate only turns red once a prompt actually BREACHES the ceiling — the first anyone sees of a shrinking margin is the commit that finally crosses it, with no warning on any of the commits that spent it down first."* Identical reasoning, arrived at independently, and arguably better implemented — it measures the whole graph, restores state across four interrupt signals, and is honest about SIGKILL.

But it lives in `scripts/`, runs from `repo-check.sh`, and works by temporarily overriding a tier's `max_prompt_chars` to 1 through a gitignored overlay so it can parse the char counts out of stdout. That is a large amount of machinery built to compensate for the engine not reporting a number it already computes. **No adopter of Yggdrasil has this.** Every adopter of archgate does, as a first-class advisory finding, in the JSON payload, escalatable in CI.

That gap — *the insight exists, the product does not carry it* — is the shape of most of what follows, and it has a name in their repo, which is the second concept below.

---

## Tier 1 — port these

### 1. Ship the headroom gauge as a `yg check` diagnostic

**Cost:** small. The engine already computes assembled prompt size for its `prompt-too-large` gate; today it only surfaces the number when a pair is over the line. Report it always, as an advisory finding with the margin, on plain `yg check` (free, no reviewer call).

**Why it matters beyond parity:** `prompt-too-large` currently fires at `--approve` time — the moment you are paying. A margin visible on the free path moves the discovery from "the fill run I just started is refusing" to "the edit I am about to make has 4 KB of room." That is the difference between a gate and an instrument, and the instrument framing is already the pitch.

Retire `scripts/prompt-headroom.mjs` when it lands. Keeping a maintainer-only script that duplicates a shipped diagnostic is the exact failure the next item names.

### 2. The layer ladder: knowledge belongs in the most-validated layer that can reach it

From their `CLAUDE.md`, governing what may go in the agent's memory file:

> Before adding an entry, ask which layer should carry it instead: a static syntax invariant belongs in a custom lint rule, executable behaviour in a test, cross-file governance in a rule file, and behaviour every user shares in a built-in check diagnostic. Only when none of those can reach it does it belong here. **Anything a rule could enforce belongs in the rule, which stays true; a memory entry is validated by nobody and rots silently.**

Yggdrasil's manual has "when to create graph elements" and "things that do NOT become aspects", but both answer *is this an aspect, yes or no*. Neither states the ordering principle: **prefer the layer that gets re-validated, and push knowledge down the ladder whenever a lower layer can reach it.** The bottom rung is not "memory" here — it is a script in the maintainer's own repo, or a paragraph in a doc nobody re-reads.

**Cost:** one section in the manual. **Value:** it is the rule that would have caught item 1 a month ago, it applies verbatim to the routing rule of the documentation repository this was written in, and it is the honest version of a claim Yggdrasil already makes ("say it once") — because a thing said once in an unvalidated layer is not said, it is deposited.

### 3. Stale-suppression detection: the waiver that waives nothing

Archgate marks each suppression comment `matched: boolean` during a run and warns on any that matched no violation. Their framing: unused suppressions are stale exceptions that accumulate as code evolves.

Yggdrasil is ahead on most of this surface and it is worth being precise about it. It already requires a reason (an empty one is rejected outright, not merely warned), masks fenced code blocks in Markdown so documented examples are inert, resolves one line-range set that every reviewer kind honors identically, and warns on unknown aspect ids, wildcards, unbounded ranges, and waivers aimed at a check that cannot false-positive. It goes further than archgate ever does: `portal/api/suppress-coverage.ts` maps live markers to the verification units they cover and joins them against past refusals to produce the false-block signal in `yg aspects --health`.

What it does **not** have is the inverse question: *this marker names a real aspect, sits on a real subject file, and waives nothing, because the code stopped violating.* Nothing notices. The waiver ledger only grows.

**The honest constraint:** for an LLM aspect you cannot answer this without re-running the reviewer with the marker removed — a real cost, on a surface that is supposed to be free. Archgate gets it for nothing because it re-runs every rule every time and everything it runs is a script.

**So the port is scoped:** answer it for deterministic aspects only, where re-running with suppression ranges cleared costs nothing, and say plainly in the output that LLM waivers are not covered. A partial signal that names its own blind spot fits the existing warning family exactly, and refusing to guess on the LLM half is the same discipline as `errs: under`.

### 4. Base-revision comparison — and why the obvious port is wrong

Their rule context carries `changedFiles` (branch diff plus working tree), `fileAtBase(path)` (the file at the merge base, `null` when there is no base or the file is new), and `ast(path, lang, { rev: "base" })` (parse the base revision, so a rule can ask whether *executable structure* changed while ignoring comment-only edits). This buys a class of rule Yggdrasil cannot express at all: co-change requirements ("if the schema changed, a migration must exist"), ratchets ("new code complies, legacy is exempt"), and "the structure changed but no test did".

**Do not port it as context.** A Yggdrasil verdict is valid exactly while its observations hash to the stored value, and the deterministic-aspect contract requires machine-independence — *the same inputs must yield the same violations everywhere*. A merge base is branch-dependent, machine-dependent and time-dependent. Folding it into the hash makes every verdict expire on every branch switch; not folding it makes verdicts that are silently wrong somewhere else. The capability and the lock are structurally incompatible, and the lock is the differentiator.

**Port the use case instead, in the lock's own idiom: a content-addressed baseline.** Record, at adoption, the set of units that violate today; new violations block, recorded ones do not, and the frozen set is itself hashed and reviewable. That is the ArchUnit freeze idea expressed as lock entries, and it is machine-independent by construction.

It is also the answer to the adoption problem the practice actually hits. A repo with two hundred existing violations cannot turn a rule on, and today the only exits are a per-file waiver needing human approval or advisory status that never blocks anything. Neither ratchets. A baseline is what lets a rule go enforced on day one in a codebase that does not yet comply — which is every codebase worth selling into.

---

## Tier 2 — port with conditions

### 5. Rule packs with recorded provenance and drift detection

`adr import <git-url | registry-path>` clones a source, remaps ids into the local sequence, writes the rules, and records provenance in `imports.json`. Later, `adr sync` diffs each imported rule against its upstream, shows which sections changed, and offers keep-local / take-upstream / skip per rule; `--check` exits non-zero when upstream has moved, so CI can flag a repo running a stale copy of a shared rulebook.

Yggdrasil has nothing here. Every aspect is hand-authored per repository, and the same rule deployed into five codebases is five copies that drift silently — the exact failure the operating doc of the repository this was written in exists to prevent, reproduced one level down.

**Why this one is strategic rather than merely useful:** it is the mechanism a deployment practice needs. A rulebook that travels between engagements while the incidents stay behind is the shape of the whole model. Distillation currently moves *lessons* upward as prose; a pack moves *enforcement* downward as code, and `sync --check` is what stops the fifth deployment being a fork.

**The condition, and it is not optional:** archgate scans every incoming rule file statically **before the first byte reaches disk** (their ARCH-024, clause 5). Yggdrasil's own documentation says the read boundary on `check.mjs` is *"a read discipline, not a security sandbox… an adversarial check could still write files or open sockets; the runner does not prevent it. Only run aspects you trust."* That caveat is honest and adequate for hand-written rules. It becomes a vulnerability the moment a command exists that fetches rule code from a URL and runs it. **Packs and item 6 ship together or neither ships.**

### 6. The rule-file scanner as the model for hardening `check.mjs`

Their ARCH-024 is the best single document in the repository and the design is worth copying nearly verbatim:

- **Allowlist, never a denylist** — an enumerated set of permitted import specifiers; anything else refused. A denylist must not be reintroduced.
- **Only `node:`-prefixed specifiers may be allowlisted** — bare forms are shadowable, and `node:module` is excluded specifically because `createRequire()` reconstitutes everything the allowlist removed.
- **Every module-evaluating construct routes through the same check** — static import, literal dynamic `import()`, `export … from`, `export * from`. A non-literal `import()` specifier is refused outright, because a text search for dangerous names misses `import("\x6eode:child_process")`.
- **Dangerous globals blocked by name, not usage shape**, including every spelling of `.constructor` access, with the one residual (a runtime-computed key) documented rather than hidden.
- **A raw-text pass before transpilation** for invisible characters — bidi controls and zero-width characters, the Trojan Source class (CVE-2021-42574) — reported *even when the file fails to parse*, because a file that does not parse is measured by nothing.
- **The AST schema must never reject a node the scanner does not read.** A validation failure would silently drop the node from the walk, and a dropped node is an unscanned node. Fix by widening the schema, never by adding a block.
- And in the Don'ts: **"DON'T read a green check as proof the sandbox holds — a successful escape produces one too."**

**Cost:** real, a few weeks. **Trigger:** only needed if packs ship, or if the honest caveat stops being adequate for another reason.

### 7. The asymmetric escalation flag

Archgate has four advisory diagnostic categories and exactly one escalation switch, `--strict`, resolving CLI flag → committed config → off. There is **no `--no-strict`**: the flag can only tighten a repository's committed setting, never loosen it. They also deliberately deleted their `--max-warnings <n>` flag in a breaking release: *"`--strict` is the single escalation switch; no tolerate-up-to-N budget is offered."*

Yggdrasil's per-aspect `draft / advisory / enforced` is a better model than one global flag and should not be replaced. Two narrower things are worth taking:

- **A flag that can only tighten.** Today, explicit `--approve` / `--no-approve` / `--only-deterministic` always override `auto_approve` in both directions. A local flag that can loosen a committed governance setting is a hole in every rail above it, and the fix costs one line of precedence.
- **The refusal of a numeric tolerance budget.** "Fail above N warnings" always resolves to N, and N is chosen by whoever is blocked. Rationing blocking to irreversible harm is already the stated policy here; refusing a tolerance dial is the same policy applied to the dial itself.

### 8. Never let "not inspected" read as "clean"

They report unparseable rule files in their own array and state the joint condition explicitly: *an empty over-budget list means "nothing over budget" only when the unparsed list is empty too — otherwise part of the corpus was never inspected.*

Yggdrasil's mechanism is stronger — infra failure writes nothing and the pair stays unverified, so it fails closed. What is portable is the **reporting discipline**: a summary line must never let an item that was not inspected sit indistinguishably beside items that passed. `yg check`'s header is the place to hold that line, and it is the same honesty argument as "a green check proves structural isolation only".

---

## Tier 3 — authoring patterns, cheap and immediate

These cost nothing but a convention in the aspect-writing playbook, and they are the highest ratio of value to effort in this report.

**9. A "Key Definitions" section.** Their densest rule pulls every identifier list, blocked-name set and enumerated constraint out of the normative section into its own, so the Decision clauses *cite* rather than *enumerate*. The governing text stays short, stays normative, and survives truncation. Directly applicable to any `content.md` that has grown a list.

**10. Order normative content first, because truncation removes the tail.** Their guidance when a section is over budget: move rationale into the sections that are never briefed, drop historical narration, merge duplicate bullets — and then *stop*: "if the next cut would remove a normative clause, that section is expected to exceed the cap and MUST NOT be shortened further. Record why in the rule's own compliance section." A rule about how to lose text safely, which is a thing every rulebook eventually needs.

**11. Don'ts that name reasoning failures, not just code.** "DON'T read a green check as proof the sandbox holds." "DON'T treat 'the check didn't flag it' as proof of compliance — narration can dodge every matched phrase." "DON'T rely on 'it renders fine in my editor' — both corruptions manifest only in a reader you are not using."

This is the honesty line stated *inside the rule*, at the point of use, where the person about to rationalize is standing. Nobody else in this category does it. **Proposed convention: every enforced aspect's `content.md` carries a short clause naming what a pass does not prove.** It costs two sentences per rule, it is unmistakably the voice the whole practice is built on, and it is the cheapest thing on this list.

**12. Alternatives considered, recorded in the rule.** Their rules carry rejected options and why. Yggdrasil's `log.md` holds WHY, but the log is per-node, invisible to the reviewer, and separate from the aspect — so an agent reading an aspect's `read:` path sees the rule with no record of what was already tried. Every session is free to re-litigate. A short recorded-alternatives clause in `content.md` closes that.

**13. Four rule classes worth stealing outright:**

- **Authored-text integrity** — text containing a sequence a downstream reader decodes differently than it was written. Their two instances: non-ASCII typography in PowerShell files (breaks the parser on a machine the author never runs), and backslash-escaped backticks in Markdown (CommonMark ignores the backslash, the code span closes early, the rendered page is wrong while the editor preview looks fine). The repository this was written in is almost entirely Markdown documents. The class applies here directly.
- **Forward-only comments** — comments describe current behaviour, never how it came to be; a bounded prose budget; structural documentation tags exempt, with `@remarks` / `@description` / `@notes` explicitly **not** exempt as "narrative in a tag's clothing". This is the natural companion to `log.md`: the log is where history goes, and this is the rule that keeps history from leaking into the code instead.
- **Root-contents allowlist** — the repository root may hold only explicitly listed files, each justified against a stated criterion. Worth stealing for the rule, but worth studying for its provenance: it was written *after* a scratch file reached a commit because a cleanup chained with `&&` was skipped by a non-zero exit. The rule cites the incident by number. Yggdrasil has an incident ledger and no worked example of an incident becoming a rule; this is that example.
- **Pin CI actions by full commit SHA** with the exact resolved tag in a trailing comment, floating major tags prohibited because a re-pointed major tag makes the comment silently stop describing the pin.

---

## What not to port

**Domains and identifier prefixes.** Their rules are grouped into five built-in domains, each with an id prefix, extensible with custom ones. It is a flat taxonomy doing a job Yggdrasil's typed node graph, nested aspect ids and seven attachment channels already do with far more precision. Adopting it would be a downgrade wearing the costume of an organizing principle.

**The decision-record genre wholesale.** Numbered records that humans cross-reference by id are a good human artifact and a poor attachment mechanism — a rule that applies where a predicate says it applies is strictly better than a rule that applies where someone remembered to cite it. Take the section structure (items 9–12); leave the id scheme.

**Re-running every rule on every check.** Cheap for them only because every rule is a local script and nothing expensive exists to cache. Adopting it would mean discarding the one mechanism nobody else has.

**Their agent-briefing shape.** They embed rule prose into a briefing payload, which is what forces the truncation the budget diagnostic then has to police. Yggdrasil hands the agent `read:` paths and lets it read whole files — no truncation, no policing needed. Their diagnostic is a good fix for a problem worth not having.

## One thing to watch rather than port

`session-context` reads the **agent's own session transcript** — Claude Code, Cursor, Copilot CLI and opencode session files — and returns it as structured JSON, with sub-session resolution for the harnesses that nest them. Today it is an audit convenience.

It is also the only input they have that Yggdrasil does not: a record of what the agent actually did. The incident ledger here rests on human testimony, which is honest and thin. A transcript is machine testimony about whether the agent read the rules before it wrote, how often a refusal was fixed versus rationalized, and which rule the agent quietly worked around. That is feedstock for the attention layer, not for enforcement. Nothing to build now — but if they ever wire it to a gate, it is a front that does not exist yet.

## Suggested order

1. **Item 2 (the layer ladder)** — one section in the manual, and it is the rule that governs the rest of this list.
2. **Items 9–12 (authoring patterns)** — a playbook convention, no engine work, immediate effect on every rule written after.
3. **Item 1 (headroom as a shipped diagnostic)** — small, retires a script, and turns a gate into an instrument.
4. **Item 3 (stale waivers, deterministic only)** — fits the existing warning family; scope it honestly.
5. **Item 4 (baseline / freeze)** — the largest engine change here and the one with a direct adoption argument behind it.
6. **Items 5 + 6 (packs and the scanner)** — together or not at all.

Items 7, 8 and 13 are small enough to fold into whatever touches their surface next.
