# Review granularity and light models in Jarl loops

**Question:** In the family's Jarl loops, how does what a fresh review finds depend on the size and kind of the change it reviews, so that a rule can say which issues may share one review; and can a light model (Haiku 5.5) do the simple issues of a loop with no more rework than a standard one (Sonnet 5.5)?
**Method:** Part 1 reads the 6.2.0 loop's record and the Runes work of 2026-11-02 to 03: for every reviewed issue with a recorded merge, the size of its change (lines and files from the merge commit in its repository), its kind, tier and repository, the first verdict, the number of rounds, and the severity of what each changes verdict named; findings are grouped by change size to see where reviews start to find real defects. Part 2 is a pilot in the 6.2.1 loop: simple issues done by Haiku and by Sonnet with the model recorded on each, reviewed by Opus; and a set of small issues reviewed once together and, as a control, once each, to see what the shared review misses. A field report from a session that ran a long 6.2.0 loop adds what the record does not hold.
**Status:** concluded
**Conclusion:** In the 6.2.0 record one review per issue was neither the common shape nor what makes a loop slow: 83 of 127 merged units were packages of two to six issues with one review, the median time per issue fell from 47 minutes alone to 17 in a package of four or more, and a review took a median 8 minutes from the worker's last evidence row to the verdict against 14 of work ([materials/time-by-unit.md](materials/time-by-unit.md)). Reviews of changes over about 400 lines named an Important or Critical finding in about half the units, below that in about a quarter, confounded with kind and repository ([materials/review-by-size.md](materials/review-by-size.md)). Whether a shared review misses more, and how Haiku compares with Sonnet, was not measured: the owner dropped part 2 on 2026-11-03 and chose models by judgment (a-001 of the 6.2.1 loop). The batching rule and the model rules go to the design of [research/2026-11-03-jarl-as-a-loop-tool](../2026-11-03-jarl-as-a-loop-tool/README.md) (issue 035).

## Why this question

The owner, 2026-11-03 (translated from Polish): Jarl is slow because it is often one issue, one review; an agent told him shared reviews are less precise; and Jarl hardly uses Haiku although version 5.5 is good enough for simple work. He asked to analyse it before deciding. Issue 007 of the 6.2.1 loop (a review queue offering waiting issues as batches) and issue 006 (a model ceiling in the profile) are the places a decision would land.

## What is known before the measurement

- The driver Jarl of the 6.2.0 and 6.2.1 loops (6.1.0) records no model and knows only the tiers standard and strong; Jarl 6.2.0 adds a light tier and records models. So the 6.2.0 record cannot compare models, only tiers and sizes.
- In 6.2.0, 124 reviewed units: a clean first pass for 44% of standard and 53% of strong ones; 111 of 439 verdicts asked for changes (Jarl 6.2.0's models command, read-only, 2026-11-03).

## Part 2 dropped

Krzysztof, 2026-11-03 (translated from Polish): "As for the measurement, Haiku: no. We will not do the measurement. We will rather choose models by feel." The replay proposed in a-001 (shared reviews and Haiku against Sonnet on finished 6.2.0 work) does not run.
