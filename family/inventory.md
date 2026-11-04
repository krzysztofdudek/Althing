# The family inventory

What GitHub shows for each public repository of the family. Snapshot taken 2026-10-06 by hand, with read-only calls only: `gh repo view --json visibility,description,repositoryTopics,homepageUrl,defaultBranchRef`, `git ls-remote --heads` against each GitHub URL, and each README read from its default branch. Nothing was run inside a local checkout. Until `ws inventory` writes this file from [the registry](registry.json) with the same calls, it is a dated snapshot and goes stale: compare it with [the canon](canon.md) before relying on it.

One change since the snapshot, made on 2026-11-04: Horde left the family and its repository became private (the canon's "6.3.0: Horde leaves the family"), so its row is gone and the profile row shows the description set that day.

## The family and its shared code

Every repository below is public, with `main` as its default branch.

| Repository | Kind | Remote branches | Description | Topics | README headline (default branch) |
|---|---|---|---|---|---|
| Yggdrasil | core; homepage `https://chrisdudek.com/yggdrasil` | `main`, two dependabot branches | "Say it once. Rules your AI coding agent still follows three sessions later, checked before it moves on. Free local checks, keyless CI." | 20, at the cap: ai-agents, claude-code, cursor, developer-tools, agentic-coding, code-quality, ai-coding, codex, llm-tools, architecture-enforcement, claude-md, code-guardrails, agents-md, ai-code-review, ci-cd, code-review, static-analysis, agent-harness, architecture-as-code, yggdrasil-family | line 7, "**Say it once.**" |
| Grain | core | `main` | "The conventions nobody wrote down. Grain mines them from your code and its git history, with a denominator on every claim." | ai-coding, claude-code, code-analysis, code-conventions, codebase-analysis, coding-agent, coding-standards, context-engineering, git-history, mcp-server, mining-software-repositories, software-architecture, static-analysis, tree-sitter, ai-agents, architecture-as-code, yggdrasil-family | line 3, "**The conventions nobody wrote down.**" |
| JarlSkill | core | `main` | "Your feature branch has more issues than one agent can hold in its head. Jarl makes your coding agent direct a crew: an issue per finding, a worker per issue in its own worktree, nothing closed without evidence and a fresh reviewer's word." | agent-orchestration, agentic-coding, ai-agents, ai-coding, claude-code, claude-code-plugin, coding-agent, developer-tools, git-worktree, issue-tracking, mcp-server, multi-agent, yggdrasil-family, claude-skill, code-review, architecture-as-code | line 3, "**Your feature branch has more issues than one agent can hold in its head, so it fixes one, forgets two, and loses the third in the diff.**" |
| RatatoskrSkill | add-on | `main` | "A communication layer between you and your codebase: it keeps your AI coding agent talking in plain language — no jargon, no invented timelines — with one clear yes before anything irreversible." | agentic-guardrails, ai-agents, ai-coding, anthropic, claude-code, claude-code-plugin, claude-skill, non-technical-users, plain-language, human-in-the-loop, ratatoskr, communication-layer, never-speak-in-code, no-estimates, architecture-as-code, yggdrasil-family | line 5, "**A translator between you and your codebase.**" |
| UrdSkill | add-on | `main` | "Your agent hits a gap in the spec and guesses. Urd makes it stop and ask instead." | agentic-guardrails, ai-agents, ai-coding, anthropic, claude-code, claude-code-plugin, claude-skill, spec-driven-development, urd, ask-dont-guess, implementation-discipline, architecture-as-code, yggdrasil-family | line 5, "**Your AI agent hit a gap in the spec, so it guessed, and shipped.**" |
| ResearcherSkill | add-on | `main` | "One file. Your AI coding agent becomes a scientist. 30+ experiments while you sleep." | ai-coding, claude-code, codex, cursor, developer-tools, experimentation, prompt-engineering, research-automation, skill, autoresearch, autonomous, optimization, gemini-cli, ai-agents, architecture-as-code, yggdrasil-family | line 5, "**One file. Your AI coding agent becomes a scientist.**" |
| Runes | shared code, not a member | `main` | "Shared code under the Yggdrasil tool family: tree-sitter relations and AST, a grammar recipe, locks, a command-table CLI and MCP adapter, test kit — installed from npm or vendored behind a byte-exact gate." | cli, dependency-analysis, developer-tools, mcp, static-analysis, tree-sitter, typescript, vendoring | no family section and no canon headline; the README opens "Shared code for the Yggdrasil tool family." |

The release branches of 6.2.0 exist only in local checkouts so far; no repository carries one on GitHub. Runes carries neither `yggdrasil-family` nor `architecture-as-code`: it is not a member, and the canon sets no topics for it.

## The public surfaces

| Surface | Description | Topics | What it carries from the canon |
|---|---|---|---|
| profile, `krzysztofdudek/krzysztofdudek` (public, `main` only) | "Chris Dudek. I build with AI agents and prove their work. Jarl is the loop, Yggdrasil the law, Grain the survey; plus the Ratatoskr, Urd and Researcher add-ons." | ai-agents, yggdrasil-family | the block's opening sentence and the core in the block's order (Jarl, Yggdrasil, Grain), then the three add-ons |
| website, https://chrisdudek.com | not a GitHub repository here; it is built from a private repository the owner drives, with the canon as its source | — | the family's cards, kept by hand against the canon |

Every description and topic list above matches the canon's per-repository section on 2026-10-06.
