# Three gaps of the Runes readers that a consumer meets after 1.1.0

**Question:** At Runes v1.1.0 (1f3476b0e49f982a0d7615acfdd29d279fe3c53a), is each of the three reported gaps real: no grammar bytes in the npm package, no reason in classifyUse for C, C++ and Ruby, and an inherited nested type of a standard-library type answered unfollowed in Java?
**Method:** Each claim was run on the v1.1.0 tree with its built dist, from the scripts in materials/; the Java claim on a synthetic repository and on google/gson at a961b0fe088f8558d00cc1b56e506a3656907a91, fetched into a scratch folder that was removed after; the packaging claim from npm pack and the sizes of the cache folders the grammar build fills.
**Status:** concluded
**Conclusion:** All three are real at v1.1.0 and filed after 1.1.0: the package ships the recipe and no grammar bytes (11 of 23 pins need a source build, and a cold build fetches a toolchain of 940 MB), classifyUse answers a bare absent for every path use in C, C++ and Ruby, and 14 of the 20 unfollowed Java uses in gson are a bare nested type inherited from a library supertype (12 are Entry in one file).

## What is here

- [source.md](source.md): the report as it arrived.
- [triage.md](triage.md): each gap, the commands, what they printed, the code that causes it, the verdict.
- [findings.json](findings.json): the three findings that become issues.
- [materials/](materials/): the two scripts that produced the numbers.
