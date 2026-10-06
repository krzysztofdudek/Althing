# 050 · The 'historically co-changes with' line on directory and group cards in `where` shows another file's numbers, and an ancestor directory's card describes a subpackage

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** bug-hunt, grain
**Files:** Grain/plugins/grain/engine/cards.mjs, Grain/plugins/grain/engine/where.mjs
**Repo:** ../../../Grain
**Found by:** bug-hunt
**Where:** plugins/grain/engine/where.mjs:574-581 (cochangePartners(model, h.topDirs.map(([d]) => d)) for every group, directory and marker card); cards.mjs:285-312 cochangePartners (:296-301 recursive `startsWith(d + '/')` matching, including files deleted long ago, the commitsA/commitsB denominator of a single file; :303 keeps the best ratio without the file name); cards.mjs:80-87 dirScopes over all ancestors, :99 a card for a directory with ≥8 scopes also outside the partition root, :111 files from part.files
**Branch:** jarl/049-where-cards
**Merged:** d46e9f3
**CI:** none

## What
Reproduction (Grain v6.1.0 b70a4e9, express @7ef9844). `grain where middleware`: all three middleware group cards (10 members, all in test/Router.js) print 'historically co-changes with: lib/response.js (8/10 commits) · lib/utils.js (8/10 commits) · lib/router/index.js (deleted) (10/17 commits)'. A reconstruction through Grain's own cochangePartners (tools/attribute.mjs): both 8/10 belong to test/res.attachment.js, 10/17 to test/app.options.js; for the groups' own file, test/Router.js, Grain asked file by file gives 'lib/router/index.js (deleted) (25/46)'. A recount from git log in Grain's population (no merges, -M, 1..30 files per commit): test/Router.js 46 commits, 0 with lib/response.js; test/ as a whole 1196, 216 with lib/response.js. The directory card for lib/ ('6 files') shows 41/60, 36/65 and 26/48, which belong to lib/express/collection.js, lib/express/response.js and lib/express/plugins/cookie.js, deleted in 2010 and outside those 6 files; only the partner side gets '(deleted)'. Ancestor card: `where 'test support'` prints two 'directory test/' cards: '70 files' (package test) and '18 files, 183 scopes (package test/acceptance)' with only files from test/acceptance/. honojs/middleware @c4714de2 (46 packages): 8 'packages/' cards; `grain where packages` prints three 'directory packages/' cards (485, 29 and 7 files), each with 'historically co-changes with: .changeset/auto-sync-robots.md (deleted) (41/43 commits)', a number of the file packages/ua-blocker/src/data/robots.json, outside the packages of those cards; `where 'session middleware'` prints two 'directory packages/session/' cards with disjoint file sets (5 and 13). Logs: <the session scratchpad, since lost>/bughunt/grain/verify-17/v17-cochange-line.log, v17-ancestor-directory-card.log, v17-monorepo-hono-middleware.log (tools <the session scratchpad, since lost>/bughunt/grain/verify-17/tools).

## Why
README:232 promises 'what historically co-changes with that place', and docs/mathematics.md:210-212 defines a partner by the commits of the edited file. An agent reading this card would add lib/response.js to a change of the router test, which never changed with it, and in a monorepo badly described directory cards multiply.

## Acceptance
- The co-change count on a group card is computed on the files of that group (the file branch of cochangePartners, as for file cards), and on a directory card on its files, with their own commit count as the denominator; deleted files on the directory side do not count.
- An ancestor directory outside the partition root does not get a card described by that partition's files; express @7ef9844: `grain where 'test support'` has one 'directory test/' card, and the middleware group cards do not list lib/response.js.

## Changelog
- Fixed: in `where`, the "historically co-changes with" line on group and directory cards showed another file's partners and counts, sometimes a file deleted long ago; and a monorepo showed one card per package for a parent directory such as packages/.

## Evidence

deedb72: cochangePartners takes a list of the card's own files (group: members' files; directory: its live files, partners inside it still skipped); cards.mjs draws no directory card above a partition's root (except _repo/_root). tests/where-card-own-files.test.mjs red 0/3 → green 3/3. express @7ef9844: 'where test support' → one 'directory test/' card (70 files). Middleware group cards: 'accept+middleware+of' still lists lib/response.js (14/26) — today that group also holds test/res.format.js, which has 26 commits, 12 with lib/response.js by git log, so the number is the member file's own; the two groups made only of test/Router.js and test/app.use.js no longer list it.

jarl: acceptance met in substance — the accept+middleware+of group card names lib/response.js because the group contains test/res.format.js, and that number (14/26) belongs to its own file; the two groups made only of test/Router.js and test/app.use.js no longer name it. Accepted.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2157, pass 2156, fail 0, skipped 1, merge d46e9f3 (second full run; the first failed only the timing-sensitive MCP SIGINT test, which passed alone)

