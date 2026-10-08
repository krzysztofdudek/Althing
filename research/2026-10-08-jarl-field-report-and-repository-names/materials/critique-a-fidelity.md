# Critique A: fidelity to the owner's intent and the standing rulings

A fresh, read-only critic (Opus) of the first version of [design.md](../design.md), 2026-10-08. Kept as returned, apart from one machine path said in words. The answers are in design.md, "Revision after critique".

**Critical**

**C1. A moved-out item comes back without being marked as growth.** Ruling `jarl-6-2-0-scope` lists "per-machine path overrides" under "Moved out". The owner's ask-002 "yes" approved "everything except what the architect moved out". The design still brings in `.jarl/local.json` and `repos locate` (A.2 §3, 247's acceptance bullet 2). It files them as "6.2.0 (J7, first to set aside)" in Proposed changes, not as "growth, owner's word". It also never says that the plan it "builds on" deferred exactly this (plan §3.4 "Machine identity", §4 "Waits for 6.3.0"). The design drops 247(e) too (A.2 §9: "should be dropped, not carried to 6.3.0"), which the ruling and 247's own deferral note send to 6.3.0, and no RULING row records that drop. Both are changes to scope the owner approved. Each needs his word, or at least a ruling with a ratify item.

**Important**

**I1. The interim ignores when the harm actually happens.** Althing has no remote today (`git remote` is empty). The first push is the owner's word and goes out as one squashed commit (method/althing-architecture.md:78, method/boundary.md:38). So A.2 §9's "honest limit: git's history still holds what was written before" is wrong for history written before that push. A.5 never asks whether the first push comes before the 6.2.0 close. If it does, every home-directory `.jarl-wt/…` path goes public: 144 log lines plus 11 live leases. That is exactly the owner's complaint. The order of the two events is a decision for him, and the design does not raise it.

**I2. A zero-code interim was missed.** In 6.1.0, `--worktree` is optional (jarl-lib.mjs:1213, :1220). Its only reader is `leaseProblems`' "worktree gone" (:2395), which is the false signal 241 removes anyway, and `branches` takes worktree paths from git (:2466). If the briefs stop passing `--worktree` now, no new machine path enters the record: no bridge, no migration, no risk to the gate. A.5 bullet 1 ("no bridge … can remove") is true only for paths already written. A.5 also argues against the owner's diagnosis ("the family's documented layout, not one machine's"). That repeats method/loops.md:18, which his request now overrules. The disagreement should be put to him, not settled inside the design.

**I3. The change to the pin is called a refinement but reverses the ruling.** A.5 "The conversion" quotes only "until it closes". `jarl-pinned-in-loop` also says "We check Jarl 6.2.0 on frozen copies of this loop, not on the loop itself" and "The first loop on 6.2.0 is the next release". Normalizing the live loop reverses both sentences. It also deliberately makes the release's record unreadable to 6.1.0, the very outcome the pin's reason names (method/loops.md:24). The ruling text should say so. The pin is also enforced in code: `ws jarl` refuses writes off the driver commit (workspace/ws.mjs:193-194, family.json `driver`), and no Althing change is listed for it. Nothing says what happens if `normalize` refuses after `close` has already been logged.

**I4. The 246/247 swap is right in substance but under-described.** The titles fit, and `goal-check-lines` already expects the per-repository Check to arrive with 246. But the swap shrinks the bucket the owner approved as "first to set aside": 246 left that bucket and gained the CI default and `--red`. The RULING row says only "the new order", so the ratify item would not show the owner what changed. Two more gaps:
- Under 6.1.0, retitling 246 means a hand edit. There is no title command until 245, and 247's earlier retitle left no trace in the log.
- With 247(e) dropped, those items disappear from the record, against `findings-become-issues`.

**I5. The rejection of item 5 misreads what was asked.** The coordinator said `status --by tag` is too long. B.2 answers with `status --by tag`, which prints 104 lines on this loop, and calls the saving "one line". `list --tag` gives no scoped in-flight, stale or CI lists either. The design should either accept the request or give a real reason.

**I6. One home per fact is broken.** The base in `repos.md` and the `Check (<name>)` lines in `goal.md` repeat `family.json`'s `branch` and `check` (AGENTS.md §7). The Althing row compares locations only (`ws doctor` against `ws.local.json`). Nothing keeps base and check equal to the manifest. A rail or doctor check belongs in the Althing NEW row.

**I7. Rewriting log.md overrides a written method line without saying so.** method/loops.md:20 says "rewriting the log would move the done gate", and loops.md:39 calls log.md the gate's event store. The plan's J7 named "a logged normalization", not a rewrite of 217 lease lines. The equivalence proof is sound, but the design should name the method change it makes.

**Minor**

**M1. The argument for a bounded `show` cuts against it.** B.2 item 4 says "agents skip what they have to remember to ask for". By that same logic, a worker taking over will never ask for `--full` and will miss earlier rounds' findings that are still open. The design should say which earlier findings always stay visible.

**M2. The short version miscounts the rejections.** Point 5 says "Five are rejected". But item 2 and W1 are accepted as NEW work for 6.3.0, and the REJECT rows number eight. The owner gets a wrong headline.

**M3. Rewriting the Check lines is a goal amendment.** goal.md:16 writes `Check: Jarl`, while the design's name would be `JarlSkill`. Changing those lines amends the goal, which needs the mandate-plus-ratify path (method/loops.md:40). The design does not mention it.

**M4. The README lists a missing file.** It lists `findings.json`, which does not exist in the folder.

**Verdict on the owner's ask.** The end state does what he asked: names and fingerprints in the record, location per machine, and `show`/`resume` telling each role where to look. Two things fall short. The scope bookkeeping (C1, I4) does not respect "growth is his word only". And the interim (I1, I2) leaves his actual harm, machine paths reaching a public record, to chance when a free fix exists. He would likely call that part not well thought through.
