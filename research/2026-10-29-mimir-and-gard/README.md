# Mimir and Gard: two tools of the workplace

**Question:** How do knowledge on a computer and the working environment of agents enter the family, so that the family grows by a logical step rather than by two tools that fit none of its seats: which tool holds what, how they depend on each other and on the rest of the family, where worktrees and dependencies live, and in what order the work is done?

**Method:** A design pass with the owner in conversation on 2026-10-23 to 2026-10-29, over the specification, architecture and build record of Mimir's first build (a git-based environment of areas for coding agents, 133 issues done on its first build branch), the family's thesis, canon, registry and release method, the 6.2.0 loop, and the owner's requirements, every one of which was mapped to a home (the mapping, which quotes private work, stays outside Althing). Mimir's development documents were ported here with every private name replaced by a neutral one.

**Status:** concluded

**Conclusion:** The family gains a second axis beside the one every tool so far stands on. The first axis is the change in a repository (Grain surveys it, Yggdrasil holds its law, Jarl runs its loop, Horde plans its mission); the second is the workplace, the computer on which every such change is made. Two tools stand on it: **Mimir**, the memory (areas of knowledge and work in git, addresses, topics, search, writes with provenance), and **Gard**, the ground (shells around team repositories, containers, running commands in them, guards, the git gate, cleanup). Gard depends on nothing; the one edge is Mimir to Gard, optional. Gard is built first and ships at 1.0.0 in release 6.2.0; Mimir pauses and resumes in the same loop on the owner's word. Worktrees live in `.worktrees` of the nearest root as topic, view and repo, with one volume per worktree, and every family tool's worktrees follow Gard's place. The two earlier attempts at the same subject, which the thesis calls dormant, are retired.

## What is here

- [gard-design.md](gard-design.md): the design of Gard's target state, the reference for every issue tagged `gard`
- [mimir-specification.md](mimir-specification.md): Mimir's specification of its target state, written before the split
- [mimir-architecture.md](mimir-architecture.md): how the Mimir repository is laid out, before the split
- [git-gate-design.md](git-gate-design.md): the design of the git gate, whose engine moves to Gard
- The plans for the work: `releases/6.2.0/plans/plan-gard.md` and `releases/6.2.0/plans/plan-mimir.md`

## The decisions, with their reasons

1. **Shells are a tool of their own** (the owner, 2026-10-29). Someone may want shells and no Mimir; the knowledge layer and the environment layer answer different questions (what the agent knows, and where it runs), and keeping them apart makes Mimir smaller.
2. **A second axis and a new kind.** Mimir and Gard are machinery, so they are not add-ons, which are disciplines of the agent; they are not core either, because they are not built and tested together with it. The registry gains a third kind, the workplace, each tool with its own number. Taken under the mandate; the kind's name and its sentence in the canon are the owner's.
3. **How they fit the thesis.** Gard fits strongly: proof needs a place where the application, its tests and its law run the same way every time and where an agent cannot litter the host, and Gard gives law a place beside a repository whose team does not want it inside. Mimir fits more loosely and says so: it proves nothing, it carries context, so that no person carries context between repositories, as Ratatoskr keeps any person from carrying messages between agents. The canon needs one sentence on why memory belongs to a family of proof.
4. **Edges point one way.** Gard depends on nothing. Mimir calls Gard (where am I, how is a command run here, the rule directories of the area chain, the end of a topic), and Gard never calls Mimir. An earlier proposal had Gard ask Mimir for rules, which would have been the family's first cycle.
5. **Gard owns where worktrees live** (the owner, 2026-10-29). The layout is topic, view and repo inside the root's `.worktrees`; a Jarl loop applies it through its briefs, with no code edge from Jarl to Gard.
6. **One volume per worktree** (the owner, 2026-10-29). A view is one directory, so its dependencies are its own and parallel workers never overwrite each other's packages; this replaces Mimir's earlier rule that all worktrees of one repo share volumes.
7. **The full range, and the author's job** (the owner, 2026-10-29). Gard gives every mechanism an application could need to come up; making it come up is its author's work. A shell given to a product owner is the case that shows why: the application runs from sources or from images, with demo data if its author provides it, and the materials go to a place in Mimir.
8. **Commits and pushes go through Gard** (the owner, 2026-10-29). Nothing is installed into an application's repository: `gard commit` and `gard push` run the rules (the shell's and those of Mimir's areas) and then call git, in the root's container where it has one. A guard keeps agents from calling git commit and git push directly; a person's commit outside Gard is not gated, which the owner accepts. Mimir alone has no gate.
9. **Gard first.** It is at the bottom of the edges, the 6.2.0 loop is already doing its subject by hand in every family repository, and the order protects the owner's working install of Mimir: nothing leaves Mimir before Gard can take it.
10. **The two earlier attempts are retired** (the owner, 2026-10-29). They were the first attempts at this subject and are not developed; their repositories stay for history only.

## Provenance

Mimir's specification, architecture and gate design were written for its first build between 2026-10-26 and 2026-10-27 and kept outside the Mimir repository by its own rule that the repository holds only its README and licence. They were moved here on 2026-10-29. Every name of a company, a product, a private repository, a private computer or a private disk became a neutral one, and the chapter on the owner's own setup was left out. Issues of Mimir's first loop are cited as M-numbers; that loop stays outside Althing as an archive, and the ones that still matter are listed in `releases/6.2.0/plans/plan-mimir.md`. The reviews of that build are not ported; their findings are in the specification and in the issues they produced.
