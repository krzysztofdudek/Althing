## [2026-10-06T05:19:31.041Z]
Ratified for types release-loop, release-record, research: rule version eed2d137e7ef8c94, admitted by Krzysztof Dudek.

The owner admitted this rule on 2026-10-06 together with Althing's other starting rails, so that it stands enforced: Althing is public by design, and these rules keep it English-only, free of private paths, binaries and secrets, and structurally in order.
## [2026-10-06T05:19:31.174Z]
Status: advisory → enforced, decided by Krzysztof Dudek. Evidence: Ratified by the owner on 2026-10-06 (Althing starting rails, one batch).

Ratified by the owner; the rule now blocks what breaks it.
## [2026-10-06T05:19:51.269Z]
Status: enforced → advisory, decided by jarl. Evidence: No node of its region exists yet (the region lands in the migration); ratified 2026-10-06, so it returns to enforced without a new ratification once its region exists.

An enforced rule effective on zero nodes is a dead rule; it waits for its region.
## [2026-10-06T05:41:24.271Z]
Status: advisory → enforced, decided by jarl. Evidence: A frozen directory exists: the published 6.1.0 record carries its freeze file, and every file it lists still has its hash.

The rule waited as advisory only because nothing was frozen yet; the owner had already ratified it with Althing's starting rails, so with the first frozen record in place it returns to enforced and holds that record byte for byte.
## [2026-10-06T05:48:23.719Z]
Status: advisory → enforced, decided by jarl. Evidence: The research region now exists and is one of the three node types this rule was ratified for on 2026-10-06; it was set advisory only because none of those regions had a node yet.

A rule set advisory only because it was effective on zero nodes returns to enforced as soon as one of its ratified regions exists. With research folders now in the tree and freezing announced for every cited folder, a frozen folder that changes must block, not warn.
