# Yggdrasil 6.1.0: security, scale and a real-reviewer field trial

**Question:** How does Yggdrasil 6.1.0 hold up on trust boundaries, at the scale of a large repository, and with a real reviewer judging real rules?

**Method:** Three angles on `release/6.1.0`: security probes, scale runs on large public repositories, and a real reviewer judging rules on a public library; verifiers re-ran the findings on the container build.

**Status:** concluded

**Conclusion:** With a real reviewer and a clear rule the core holds; the problems are trust (the gate trusts whoever commits, and the docs claim more), scale (whole-repository work on every command) and reviewer edge cases.

## What is here

- [report.md](report.md): the verdict and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path.
