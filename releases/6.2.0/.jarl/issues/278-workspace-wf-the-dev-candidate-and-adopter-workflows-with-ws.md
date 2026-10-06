# 278 · Workspace WF: the dev, candidate and adopter workflows, with ws plan and ws verdict

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** althing, workspace
**Files:** Althing/.github/workflows/dev.yml, Althing/.github/workflows/candidate.yml, Althing/.github/workflows/adopter.yml, Althing/workspace/ws.mjs
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/.github/workflows/ holds only rails.yml
**After:** 275, 266

## What
Package WF of the workspace design (section 3, CI). dev.yml: every 3 hours, a first job compares the declared branches' heads with the last run's and stops when nothing moved; a full run nightly regardless; dispatch; advisory. candidate.yml: on a push to main that changes releases/*/family.json and on dispatch; builds the manifest's exact commits once, runs each check as a matrix job and the stack scenario per corpus entry, and ends in a job named verdict, green only when every job above succeeded. adopter.yml: on dispatch after a publish and weekly, against the published artifacts. ws plan feeds the matrices and ws verdict decides. Each workflow asks for contents: read only, uses no secret and writes to no tool repository. A check that does not exist yet when this lands is left out of the matrix, and the issue that builds it adds its row.

## Why
A local run proves a candidate on one machine. The family's tags are to be gated by a public verdict on the exact commits, which only CI on Althing's repository can give: in 6.2.0 a person reads it, and from 6.3.0 the tool repositories' tag steps read it.

## Acceptance
- ws plan and ws verdict have tests; verdict exits 1 when any job it needs did not succeed
- After Althing's first push, a dispatched dev run and a dispatched candidate run on 6.2.0 complete on GitHub, candidate's last job is named verdict, and both run URLs are recorded as evidence
- Every workflow declares contents: read and uses no secret; yg check && npm test green

## Evidence

