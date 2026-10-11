@AGENTS.md

## Claude Code here

- **Skills by moment.** The table in section 5 of `AGENTS.md` names them. The installed Jarl plugin's skill is the loop's mechanics; [directing-a-release-loop](.claude/skills/directing-a-release-loop/SKILL.md) says only what differs in Althing, and [releasing-the-family](.claude/skills/releasing-the-family/SKILL.md) is the release procedure.
- **The Agent tool.** Every call sets `model` explicitly, as section 8 of `AGENTS.md` says. An unpinned spawn inherits the session's model, and that is a bug. When in doubt, check the transcript's model fields.
- **Plugins.** Jarl and Grain are enabled in `.claude/settings.json` for their MCP tools. The MCP Jarl is the installed plugin; a release loop's record is written by its driver Jarl through `node workspace/ws.mjs jarl`. When the two differ in version, use `ws jarl` for every write; `ws doctor` names the mismatch.
- **No memory store.** Never write to the agent memory directory or a `MEMORY.md` while working here. The repository is the memory.
- **Where work happens.** In Althing, on `main`. Worker worktrees exist only for code issues (`workspace/`, `rails/`) and in the tool repositories, under `~/.jarl-wt/` ([method/environment.md](method/environment.md)).
- **Local settings.** Claude Code writes permission grants, with local paths, into `.claude/settings.local.json`; it is ignored by git and never committed.
