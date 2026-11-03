# Two clones of one committed loop

Run 2026-11-03 with JarlSkill a1132a8, extracted by `git archive a1132a8 skills/jarl` into Althing's ignored `.cache/`. `J` stands for `node <extract>/skills/jarl/scripts/jarl.mjs`. Every repository below is a scratch repository made for the run.

## Two clones file one number

```
git init a; (commit a file); J init "two machines" --committed; git add -A; git commit
git clone a b
(a) J new "filed on machine A" …; commit          → filed 1
(b) git pull                                       → b now has issue 1
(a) J new "second on A" …; commit                  → filed 2 · …/2-second-on-a.md
(b) J new "second on B" …; commit                  → filed 2 · …/2-second-on-b.md
(b) git pull --no-rebase                           → Auto-merging .jarl/log.md (no conflict)
(b) ls .jarl/issues                                → 1-filed-on-machine-a.md 2-second-on-a.md 2-second-on-b.md
(b) J list --all                                   → 2  P2  open  gap  second on A
                                                      2  P2  open  gap  second on B
(b) J verify                                       → verify: clean — every line of the record is placed, and nothing disagrees
(b) J show 2                                       → # 2 · second on A
(b) J set 2 in-progress "test" --branch jarl/2-x --worker w1
                                                   → 2 → in-progress · jarl/2-x · w1   (only 2-second-on-a.md changed)
```

## A fresh clone of a loop with no issue yet

```
git init a; (commit a file); J init "g" --committed; git add -A; git commit
git ls-files .jarl                                 → .gitattributes .gitignore decisions.md goal.md log.md (no issues/)
git clone a b
(b) J new "first in a fresh clone" …               → ENOENT: no such file or directory, scandir '<b>/.jarl/issues'
```
