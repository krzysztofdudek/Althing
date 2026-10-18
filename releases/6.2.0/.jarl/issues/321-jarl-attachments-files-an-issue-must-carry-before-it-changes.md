# 321 · Jarl: attachments: files an issue must carry before it changes state, declared by the profile per kind of issue, stored in a fixed place, checked mechanically

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** jarl, attachments, profile
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/attachments.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (profile, set, show, verify)
**After:** 253

## What
The owner, 2026-10-18 (translated from Polish): when he works on bugs with Jarl in another project, he has the agent take screenshots before and after the fix; some kinds of issue should have the attachment of files enforced mechanically, files of a given kind in a given place (for example a before and an after image under the issue's own folder), and Jarl should handle attachments as a system before a state change. His example: a bug hunt files 50 issues, each becomes its own pull request, each with a description and pictures. Design to be built: (1) the loop's profile declares attachment rules: for a Kind (or a Tag or a declared field value), a list of required slots, each with a name (before, after), the allowed extensions, a minimum size, and the transition that needs it (to review, to done); (2) a command attach <id> <slot> <file> copies the file into the issue's folder at a fixed path (attachments/<id>/<slot>.<ext> under the loop), records its hash, size and type in the issue and in one log line, and replaces a slot only by an appended entry (the earlier file stays, as retraction does); the MCP tool takes a path, never the content; (3) set to a guarded state refuses with a message naming each missing slot and the command that fills it; the hash is rechecked at the gate, so a file replaced behind Jarl's back is noticed; (4) show and the reviewer's brief list the attachments with their paths, so a reviewer agent can open them; verify (251) checks that every recorded attachment exists and matches its hash; (5) an export command writes an issue's description, acceptance, evidence and attachment links as one markdown body for a pull request; (6) where the loop is out of git the files live beside it and the issue records paths relative to the loop; where it is committed, a profile setting names a directory outside the tree or says that large binaries are kept out of git, and attachments never enter the repository by accident (size limit, type list). Jarl does not judge what a picture shows: that stays the reviewer's work, and the gate only guarantees that the proof exists, has the right shape and is the same file that was attached.

## Why
A bug fix without a before and an after picture cannot be reviewed by looking; a rule that lives only in an agent's instructions gets forgotten, a rule the done gate enforces does not; and a workflow that files fifty issues, each a pull request with pictures, needs the proof collected and exported mechanically.

## Acceptance
- The profile can declare required attachment slots per Kind, Tag or field value, with extensions, a minimum size and the transition they guard; a profile without them behaves exactly as before, and a profile that declares them is refused by a Jarl that does not know them
- attach copies the file to the fixed path, records hash, size and type, never overwrites (a new file for a slot is an appended entry), and refuses a wrong extension, an empty file, a missing file or a file outside the allowed size
- set to a guarded state refuses naming every missing slot and the attach command for each, and refuses when a recorded file is missing or its hash no longer matches; a state that is not guarded is unaffected
- show lists the attachments with relative paths; verify checks existence and hash; the library callers of the record code see no change
- export <id> writes one markdown body (description, acceptance, evidence rows, attachment links with relative paths) that a pull request can carry
- Large files never enter git by accident: committed loops follow the profile's setting for where attachments live, with a size limit and a type list; tested in a committed and an out-of-git loop
- SKILL.md describes attachments and the bug-hunt workflow (many issues, each with before and after pictures, each a pull request) in the present tense, without version words

## Evidence

