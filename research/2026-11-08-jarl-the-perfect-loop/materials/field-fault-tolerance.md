# Fault tolerance and durable records: what the field says for an agent loop

Written on 2026-11-08 by a research agent (Opus 5.5 at xhigh) from about 25 public sources, for the question of this folder. Where a PDF could not be read, the agent used the authors' HTML versions or reviews, and the sources say which. Thresholds marked "the agent's judgement" are its own; no source gives them.

## 1. Principles

**1. Fence every write; an expired lease alone never makes a takeover safe.** A lease bounds how long the grantor waits for a silent holder (Gray and Cheriton), but a paused holder can wake after expiry and still write. A monotonic generation number checked by the store on every write, refusing a stale one, stops it (Kleppmann's fencing tokens; Chubby's "sequencer" carries the lock generation). In the loop: each lease gets a generation per issue, every worker write states it, and the write path (already serialised by the write lock) refuses one below the current; name the branch per generation (`095-g2`) and let the merger merge only the branch the current lease names, so a zombie's commits land where nothing reads them. Limit: only writes that pass the checker are fenced; a zombie can still push to a shared branch, touch files outside its worktree or post to GitHub.

**2. Separate "alive" from "making progress": two signals, two clocks.** Kafka evicts a consumer that stops heartbeating (`session.timeout.ms`) and, separately, one that stops polling (`max.poll.interval.ms`); Temporal has a heartbeat timeout and a start-to-close timeout. A live agent going in circles passes the first and fails the second. In the loop: "no commit, row or log line in 30 minutes" mixes the two. Keep a cheap explicit heartbeat (a log line with the generation and a one-line progress note) and a separate attempt budget (review rounds, attempts, time) whose breach means "alive, not converging": re-scope, do not hand over. Limit: an agent can heartbeat only between tool calls; a 40-minute test run looks dead unless long commands run through a wrapper that heartbeats for them.

**3. Let the heartbeat carry a checkpoint so a successor continues instead of restarting.** Temporal passes the last heartbeat's details to the next attempt; Brandur's idempotency keys store a "recovery point" committed in the same transaction as the step; Armstrong splits stable storage (survives a crash) from volatile. In the loop the record holds, per issue: the lease (generation, branch, worker, model, since); the last checkpoint as a commit sha plus a label from a short fixed list (reproduced, failing test committed, fix committed, suite green, review requested); the dead ends tried and why they failed; open doubts. Uncommitted worktree changes are volatile: a successor may inspect them but never relies on them. Limit: a dying agent's notes can be wrong, so the successor checks the label against the artifact (the commit, a rerun); a checkpoint not written before the crash is lost.

**4. Treat compaction as a crash: restart from the record, not from memory.** Armstrong: processes "do what they are supposed to do or fail as soon as possible"; "let some other process do the error recovery"; "do not program defensively". In the loop: after a compaction or noticed confusion the agent runs resume and re-checks its generation before its next write; if it cannot rebuild where it was, it records what it knows and releases the lease instead of improvising. Limit: this pays only when a restart is cheap; a restart caused by something that never changes just repeats (see 6).

**5. Supervisors start, stop, watch and escalate; they do no work.** OTP: "a supervisor is responsible for starting, stopping, and monitoring its child processes"; Armstrong gives each process one role. In the loop: independent issues are `one_for_one`; issues leased together on one branch are `one_for_all` (one failure reopens the group under a new generation); an issue built on another issue's branch is `rest_for_one`; a worker is `permanent` until its issue is done, a one-shot probe `temporary`. Limit: a coordinator that "just finishes it itself" bloats its context, becomes a single point of failure and destroys the independence that gives review its value; coordinators die too, so all their state must live in the record.

**6. Cap restarts and set aside work that keeps failing.** When OTP's MaxR restarts in MaxT is exceeded, the supervisor kills its children and itself, escalating; the limits multiply across levels. Temporal's non-retryable errors and SQS dead-letter queues do the same for one task. In the loop: count takeovers per issue from its lease lines; after 2 or 3 (the agent's judgement), or non-converging review rounds, turn the issue into a question. Retry transient failures (a session died, a rate limit); never retry an ambiguous spec, a missing environment or a decision that is the owner's. Limit: three re-raises under a coordinator itself restarted three times is nine attempts; size the levels' budgets together.

**7. Make every write idempotent with a key that survives the retry.** AWS: "APIs with side effects aren't safe to retry unless they provide idempotency"; Temporal suggests the workflow run id plus the activity id as the key. In the loop: agents repeat calls whose answer they lost; key each line by (issue, generation, action, step) so a repeat is a no-op answering "already recorded" and replay dedupes by key. Side effects outside the record (a push, a comment, filing an issue) each need their own check before acting. Limit: a key scoped too widely silently drops a genuinely new event.

**8. Derive state by replaying the log; record each agent result exactly once.** In Durable Functions and Temporal the orchestrator is replayed against the history, so it must be deterministic (no current time, no random values, no I/O); finished activity results are saved and "completed Activities will not re-execute as part of a Workflow Replay". Fowler adds that replays must route external calls through a gateway that does not resend them. In the loop: "what runs next" is computable from the record alone; verdicts, evidence and merge shas are written once and never recomputed; staleness is computed when the record is read and never written back as state; issue headers are regenerated from the log, never merged. Limit: a new tool version can read old logs differently (the versioning problem the durable engines document); an LLM's reasoning cannot be replayed, so replay only the record.

**9. A log merged by union converges only under conditions, and nothing of that kind gives mutual exclusion.** A CRDT's merge must be commutative, associative and idempotent; a grow-only set merged by union qualifies. Git's union driver runs a three-way merge, takes "lines from both versions" and leaves them "in random order", so lines must be unique and never edited, never deleted (a retraction is a new line), and the replay orders by a field inside the line, never by file position. Limit: convergence does not give invariants. Bailis et al. show a uniqueness constraint on a chosen value, and AUTO_INCREMENT ids, cannot be kept without coordination: two clones can each lease issue 095 or each mint issue 224, and the union keeps both silently. So: grant leases only in one home checkout; mint ids that need no coordination (writer id plus counter); let the replay pick a deterministic winner, which the loser learns at its next fenced write.

**10. Measure durations on one observer's clock; never compare clocks across machines for safety.** Gray and Cheriton need clock rates within a known epsilon, not synchronised clocks; Kubernetes client-go leader election is "tolerant to arbitrary clock skew, but is not tolerant to arbitrary clock skew rate". In the loop: stale means "no new line for this lease, as seen by me, for 30 minutes", timed from when the coordinator first saw the latest line; safety rests on generations and timestamps are only for display. Limit: after a git pull a line can arrive hours late and make a worker look more alive than it is, which is acceptable for an advisory signal.

**11. A failure detector only suspects; give the holder a jeopardy state and the taker a delay.** The phi accrual detector outputs a suspicion level fitted to the history of heartbeat gaps, not a yes or no; a Chubby client whose lease lapses enters "jeopardy" for a grace period; Chubby holds a failed holder's lock for a "lock-delay" before anyone else can take it. In the loop: "shown as stale for a coordinator" is the right shape. Add: a worker coming back after a gap re-reads its lease and stops if the generation moved; a takeover is written into the log first and the new holder starts after a short delay so a live worker can yield; judge staleness against that worker's own usual gap. Limit: every detector is sometimes wrong; asking a dead agent costs a wait, asking a live one costs part of its context.

**12. Put the irreversible step last: everything before can be undone, everything after can be retried.** A saga (Garcia-Molina and Salem) either completes or runs compensating steps that undo the partial run. In the loop: branch work is discardable (undo is dropping the branch); the merge is the point of no return; recording the merge, closing the issue and removing the worktree are idempotent, keyed by the merge sha; a merger that died between merging and recording is caught up by checking git (is the sha in the release branch?), never by merging again; a bad merge is undone by a revert commit, never by rewriting history. Limit: sagas give no isolation, so write "merging" into the record before merging, so nobody branches from a merge not yet recorded.

**Overkill at this scale:** consensus systems (Raft, ZooKeeper), because the one write lock in the home checkout already decides every grant; heartbeats every few seconds, because an agent's turn takes minutes; phi accrual statistics, because a typical gap per role is enough; snapshots, because Temporal only warns at 10,240 events and archiving closed loops plays the part of Continue-As-New; vector clocks, because a writer id plus a counter is enough; automatic reassignment, which is safe once writes are fenced but whose false takeover duplicates a long job.

## 2. Numbers

| System | Values | Source |
|---|---|---|
| OTP supervisor | intensity 1 in 5 s by default; worker shutdown 5000 ms; guidance a burst of "5 or 10" restarts, "one restart per minute" before escalating; two levels of 10 give 100 restarts; the top level at most 3 | supervisor reference; supervisor principles |
| Temporal retries | first retry after 1 s, each wait 2.0 times longer, at most 100 s; unlimited attempts; no non-retryable types by default | retry policies |
| Temporal heartbeats | sent at most every min(0.8 × heartbeat timeout, 60 s), every 30 s with no timeout set; schedule-to-close infinite by default; start-to-close has no default (one of them must be set) | detecting activity failures |
| Temporal history | warning at 10,240 events, terminated at 51,200 | events page |
| Step Functions retrier | first retry after 1 s, at most 3 attempts, each wait 2.0 times longer, no jitter by default | error handling |
| Chubby | lease 12 s, grace 45 s, lock-delay at most 1 minute; locks expected to be held for hours or days | Burrows |
| Gray and Cheriton | 10-second leases are efficient; longer ones add "insignificant" benefit | review and study notes |
| Kubernetes client-go | LeaseDuration 15 s, RenewDeadline 10 s, RetryPeriod 2 s; 60 s and 30 s tolerate clocks running twice as fast | package doc |
| Kafka consumer | session timeout 45 s, heartbeat every 3 s (at most a third of the session timeout), at most 5 minutes between polls | Confluent docs |
| SQS | visibility timeout 30 s by default; start around 2 minutes and extend with a heartbeat; a 12-hour ceiling that extensions do not reset | AWS docs |
| Akka phi accrual | threshold 8 (12 suggested on EC2); heartbeat every 1 s | Akka docs |
| AWS Builders' Library | pick a false-timeout rate (0.1%) and set the timeout at that latency percentile (p99.9) | Builders' Library |
| Idempotency keys (Brandur) | kept about 24 hours; the reaper cleans up after about 72 hours | Brandur |

Applied to the loop (the agent's inference): heartbeat at about a third of the stale threshold (every 10 minutes for 30); set the stale threshold at a high percentile of the gaps between a lease's lines, measured per role from the loop's own log.

## 3. Anti-patterns

Treating lease expiry as proof of death with no fencing check (client-go itself says it does not guarantee that only one client is acting as a leader). Taking over without announcing it, so two workers end up on one issue. Retrying at every level (AWS: retry at a single point in the stack). Retrying without limit, Temporal's default. Retrying a side effect that is not idempotent. Trusting the compaction summary, or the dying agent's own story, over the record. A supervisor that does the work. A confused agent improvising instead of stopping. Liveness-only heartbeats that show the agent is alive but not that it progresses. The current time, or another machine's timestamp, inside state derived from the log. Editing or deleting log lines. Relying on line order after a union merge. Merging the rendered issue files instead of regenerating them. Next-integer ids minted in two clones. Every agent retrying at once after a shared rate limit (add jitter).

## 4. Sources

- https://www.erlang.org/doc/apps/stdlib/supervisor.html — default limits, restart types and strategies, escalation.
- https://www.erlang.org/doc/system/sup_princ.html — what a supervisor does; tuning; limits multiplying across levels.
- https://erlang.org/download/armstrong_thesis_2003.pdf — the slogans, stable and volatile storage, the error kernel, one role per process.
- https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html — fencing tokens, the pause scenario, timing assumptions.
- https://www.usenix.org/legacy/event/osdi06/tech/full_papers/burrows/burrows_html/ — sequencer, lock-delay, 12 s and 45 s, jeopardy.
- https://emptysqua.re/blog/review-leases-for-distributed-file-cache-consistency/ — Gray and Cheriton's clock assumption and wait-for-expiry (a review, secondary).
- https://carlstrom.com/stanford/quals/mirror/www-db.stanford.edu/~daswani/quals/Gray89%20-%20Leases.htm — notes quoting the 10 s result (secondary).
- https://courses.cs.duke.edu/spring15/cps210/readings/leases-sosp89.pdf — the paper itself; opened, but a scan the agent could not read.
- https://docs.temporal.io/encyclopedia/detecting-activity-failures — timeouts, the heartbeat rate limit, heartbeat details passed to the next attempt.
- https://docs.temporal.io/encyclopedia/retry-policies — retry defaults, non-retryable errors.
- https://docs.temporal.io/activity-definition — idempotence, the key, no re-execution on replay.
- https://docs.temporal.io/workflow-execution/event — history limits.
- https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-code-constraints — deterministic replay, versioning.
- https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html — retrier defaults, HeartbeatTimeout.
- https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html — visibility timeout as a lease, heartbeat extension, dead-letter queues.
- https://builder.aws.com/content/3EumjoZascWd1oZiEgL8ORlv3qE/timeouts-retries-and-backoff-with-jitter — single retry point, idempotency tokens, jitter, p99.9.
- https://docs.confluent.io/platform/current/installation/configuration/consumer-configs.html — Kafka timeouts.
- https://pkg.go.dev/k8s.io/client-go/tools/leaderelection — no fencing guarantee, clock skew against skew rate, defaults.
- https://doc.akka.io/libraries/akka-core/current/typed/failure-detector.html — phi accrual, thresholds.
- https://brandur.org/idempotency-keys — recovery points, retention.
- https://martinfowler.com/eaaDev/EventSourcing.html — rebuilding by replay, snapshots, gateways during replay.
- https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type — CRDT merge rules, G-Set (secondary; Shapiro et al. was blocked).
- https://arxiv.org/abs/1402.2237 — invariant confluence; uniqueness on a chosen value and AUTO_INCREMENT need coordination.
- https://git-scm.com/docs/gitattributes — what the union merge driver does.
- https://www.cs.princeton.edu/research/techreps/598 — the sagas abstract.
- https://microservices.io/patterns/data/saga.html — compensations, no isolation.

Not opened: Hayashibara et al., "The Phi Accrual Failure Detector" (cited by the Akka docs).
