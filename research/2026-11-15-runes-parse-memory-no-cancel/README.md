# A Runes parse whose memory grows quadratically, with no way to stop it

**Question:** Is the reported memory growth of the parse a defect in Runes, and where; and can a consumer end a runaway parse through the API?
**Method:** The published package at v1.1.0 was installed in a Node 24 container with no other Runes code. Each claim was run there: the parse memory per file size under a 4 GiB cap, the kill checks under a 1 GiB cap with no swap, and a probe of the runtime's progress callback. The grammars were built from their pins and checked against their sha256. The commands and their output are in [triage.md](triage.md); the scripts are in materials/.
**Status:** concluded
**Conclusion:** The growth is real at v1.1.0 and belongs to the tree-sitter parse, which Runes calls once per file, so it is a gap rather than a defect in Runes' code: the API gives no way to stop a parse that passes a limit, though the runtime does. Filed as issue 765 and deferred after 1.1.0.

## What is here

- [source.md](source.md): the report as it arrived.
- [triage.md](triage.md): each problem, the commands, what they printed, the code that causes it, the verdict.
- [findings.json](findings.json): the finding that becomes an issue.
- [materials/](materials/): the three scripts that produced the numbers.
