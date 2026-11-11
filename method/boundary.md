# The boundary

Althing is public and everything in it is committed on purpose. Some of the work around the family is not public: the author's engagements with companies, and his private practice. This document says what never crosses into Althing, how something learned in private work may still arrive, and what to do when something crosses by mistake.

## What never enters

- The name of any client, client project, client system or client person.
- The name of a private repository, a private server or a private host, and any link into one.
- A machine path: a home directory, the system temporary directory, a Windows user folder, a `file:` URL, a session scratchpad.
- A secret of any kind: keys, tokens, passwords, and the names key itself.
- A binary file: an image, a screenshot, a recording, a PDF, an archive. A text scan cannot read a screenshot, and a screenshot of a private system is the easiest leak there is. A diagram is SVG or text; a public picture is linked where it is already public.
- Text in a language other than English (see [language](language.md)).

An agent that holds private context from somewhere else, because the same person works in a private repository too, keeps it out of every file, commit and message here. Althing reads nothing outside itself, the public repositories of its registry and the sibling checkouts of those same repositories.

Records written before 2026-10-05 come from a private practice repository; they enter only with everything private removed and everything Polish translated.

## Field reports

Something learned in private work (a bug a tool showed on a real codebase, a number from a deployment) may help the family. It arrives as a field report: distilled before it arrives, generic, with no client, project, person, system or place named, and with this provenance line: "a field report from a private deployment; its origin is not named here." A measurement keeps its numbers and loses the identity of the repository it was taken on. The distilling happens on the private side, never here.

## How the line is held

The first defence is that private material never enters. The rails are the second, and [the rails' README](../rails/README.md) describes each one:

- `lang/english`, `boundary/no-private-paths`, `boundary/no-binaries` and `secret-scan` read every text file of the tree;
- the keyed names rail reads Althing's own commits: every staged line, every commit message, every commit in a pushed range with its author, its committer and the tags pushed with it, and, nightly, the whole history, against a private deny-list it never shows. It also reads the pushed range of another family repository, on the maintainer's machine: `node workspace/ws.mjs names` runs it over a range of that repository's checkout, and the pre-push hook template a tool repository installs (`workspace/hooks/pre-push`) runs it before a push leaves. [The rails' README](../rails/README.md) says what each scan reads and how;
- the pre-push hook is the leak gate: in a public repository CI runs too late, because once a commit is on GitHub, forks, caches and the events API keep it. A push to the canonical repository that the names rail cannot scan is refused; a push to any other remote goes through with a line saying it is unscanned. The template holds the same line for a tool repository: a push to a repository of the family that cannot be scanned is refused.

The deny-list itself is private. What is committed is a file of keyed digests, padded with decoys so that it reveals neither the names nor how many there are. The key lives on the owner's machine and in one CI secret.

## Leak response

When a private name or private text is found in something already committed:

1. Stop. Do not push.
2. Tell the owner: the file, the line, the commit. Never repeat the name in a message, an issue or a log line.
3. Before Althing's first push: fix the text and squash the local history so that no commit carries it (the first push is one commit anyway).
4. After it, on the owner's word: rewrite the history that carries it, force-push, ask GitHub to purge its cached views of the commits, and rotate anything secret that was exposed.
5. Add whatever name was missing to the deny-list (that is the owner's list), and file an issue for the gap that let it through.

## What a green gate does not prove

A green gate proves that the rails passed. It does not prove that nothing private leaked: a paraphrase can identify a client without naming one, and no detector proves an absence. It does not prove that a translation is faithful. It says nothing about whether a release is good.
