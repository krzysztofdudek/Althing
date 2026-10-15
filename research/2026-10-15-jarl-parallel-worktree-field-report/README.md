# Jarl in a long multi-agent session: a field report, triaged

**Question:** Which of the complaints in a coordinator's report on Jarl 6.1.0, written after one long session with many parallel workers in git worktrees, are defects of Jarl, which are missing documentation, and which are already covered by an issue of the 6.2.0 loop?

**Method:** Read the report as relayed ([source.md](source.md)), checked each claim against JarlSkill at `67615e6` (its `jarl-lib.mjs`, `jarl.mjs` and `SKILL.md`; the code paths cited are the same as at the pinned `2c12aa3`) and against the 6.2.0 loop's Jarl issues (241 to 253, 260, 280 to 283, 287, 289, 290); no scratch-loop probe was run in this pass, so the one claim that needs a reproduction says so in its issue.

**Status:** concluded

**Conclusion:** Of the report's seven requests, four become issues for 6.2.0 (`new` must refuse a field-shaped tag inside a text and answer with what it parsed and left empty; a number must not be allocated from a worktree's stale copy; `review` must say the next step; `check` can note a branch with code and no leased issue), one becomes a documentation issue (the worktree recipe, the choice of mode, and what `in-progress` means, in `help` as well as in the skill), and two are already served (approved-but-open is issue 283; the filters and the default view of `list` exist, only unknown to the reporter). One part is rejected: auto-committing `.jarl/`, because the default mode keeps the loop out of git on purpose and the committed mode already has a merge driver.

## What is here

- [source.md](source.md): the report, anonymised and abridged, as it arrived
- [design.md](design.md): each point against the code and the loop, and what follows
- [findings.json](findings.json): the new issues, in the shape `import` reads

## Provenance

The report comes from a private deployment of Jarl 6.1.0; the project is not named here and the report's own names are replaced by descriptions. The coordinator said it had verified nothing against Jarl's source, and nothing in the report was taken as fact before the check in design.md.
