# Gaps of the Runes readers found by a stress test of a new tool

**Question:** At Runes v1.1.0 (1f3476b0e49f982a0d7615acfdd29d279fe3c53a), is each reader gap that a stress test of a new family tool reported real: bundler aliases answered outside, a Python package under lib/ losing its absolute self-imports, a relative Python from-import answered unfollowed where the absolute one resolves, the Rust path-attribute and inline extern-crate uses, a Go replace between modules, the Vue and Svelte script view, and lone CR line ends?
**Method:** Each claim was built as a minimal repository in a folder from mktemp -d and run on the v1.1.0 tree with its built dist, with the two scripts in materials/ (repros.sh builds the cases, classify-folder.mjs prints every use of every file with its classifyUse answer); each folder was removed after. The sqlalchemy line count is the reporter's and was not re-measured.
**Status:** concluded
**Conclusion:** All reader gaps reproduce at v1.1.0 and are filed after 1.1.0 as ten issues: bundler aliases, import.meta.glob and require.context, Python roots named only by configuration, the relative from-import of a member, Rust #[path] modules, Rust inline paths to an extern crate, Go replace, a commented-out script block, script src, and lone CR line ends.

## What is here

- [source.md](source.md): the report as it arrived.
- [triage.md](triage.md): each gap, the commands, what they printed, the code that causes it, the verdict.
- [findings.json](findings.json): the findings that become issues.
- [materials/](materials/): the two scripts that produced the numbers.
