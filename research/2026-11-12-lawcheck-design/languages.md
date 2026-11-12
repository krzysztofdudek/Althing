# 6. Languages

Lawcheck reads, from its first release, every language Yggdrasil reads today. The list is the language table of Runes (`src/grammars/languages.mts` at `b326704fa`) and its eleven readers of what a file uses (`src/relations/extractors/`).

## 6.1. Three levels of reading

A language is read at one of three levels. The level decides what a rule and a type can do with a file, and Lawcheck says the level out loud instead of leaving it to be discovered.

| Level | Types by path and content | Script rules on text | Reviewer rules | Syntax tree for script rules | Waivers | Uses read for `may_use` |
|---|---|---|---|---|---|---|
| **Full** | yes | yes | yes | yes | in real comments only | yes |
| **Tree** | yes | yes | yes | yes | in real comments only | no |
| **Text** | yes | yes | yes | no | by reading lines | no |

Types never depend on the language: a path pattern and a content pattern work on any text file. So does a reviewer rule, which reads the file as text.

## 6.2. The languages

| Language | File endings | Level | What its uses are read from |
|---|---|---|---|
| TypeScript | `.ts`, `.mts`, `.cts` | Full | imports and re-exports, resolved through `tsconfig` paths and package exports |
| TSX | `.tsx` | Full | as TypeScript |
| JavaScript | `.js`, `.mjs`, `.cjs`, `.jsx` | Full | imports and `require` |
| Vue and Svelte components | `.vue`, `.svelte` | Full for the script block | as TypeScript, on the script block |
| Python | `.py` | Full | imports, absolute and relative |
| Go | `.go` | Full | imports, resolved through the module and workspace files |
| Rust | `.rs` | Full | `use`, `mod` and paths, resolved through the crate layout |
| Java | `.java` | Full | imports, and names of the same package used with no import |
| Kotlin | `.kt`, `.kts` | Full | imports, and names of the same package used with no import |
| C# | `.cs` | Full | `using`, global usings and the names reachable through the project files |
| C | `.c`, `.h` | Full | includes, resolved through the include directories |
| C++ | `.cpp`, `.cc`, `.cxx`, `.c++`, `.hpp`, `.hh`, `.hxx`, `.h++`, `.cppm`, `.ixx`, `.mpp`, `.ipp`, `.inl`, `.tpp`, `.txx` | Full | includes and module imports |
| PHP | `.php` | Full | `use`, `require` and `include` |
| Ruby | `.rb`, `.rake`, `.gemspec`, `.ru`, and files such as `Rakefile` and `Gemfile` | Full | `require` and `require_relative` |
| JSON | `.json` | Tree | |
| YAML | `.yaml`, `.yml` | Tree | |
| TOML | `.toml` | Tree | |
| Anything else that is text | | Text | |

Built today: every row above, in Runes, with a catalogue of 522 cases for the readers of uses. Lawcheck depends on Runes for trees and uses, as Yggdrasil and Grain do, so that the three tools read a file the same way. Proposed: nothing in this table. It is carried as it is, and it is the part of the family that is hardest to rebuild and that a mistake in would turn into a false pass.

Runes also pins parsers for seven more languages (Scala, Bash, Lua, Zig, Groovy, Solidity, Java properties) that its table does not use. Yggdrasil does not read them, so Lawcheck's first release does not either; they are the first candidates for the Tree level.

## 6.3. What "a use" resolves to

For each use the reader gives one of three answers, and Lawcheck treats each differently:

| Answer | Meaning | In a type with `may_use` |
|---|---|---|
| a file of this repository | the use was followed to a file | checked against the list by that file's type |
| an outside package | the standard library, or a dependency | not governed; a script rule may judge it through `file.uses()` |
| unknown | the reader could not follow it | `warning[unresolved-use]`, counted in the summary; never read as allowed in silence |

Which project files a reader takes into account is the reader's own matter (a `tsconfig`, a Go workspace file, C# project files, a C or C++ compilation database). Lawcheck reads them only when git tracks them or does not ignore them, as Yggdrasil 6.2.0 decided for the same reason: a file that exists on one machine and not on another must not change an answer.

## 6.4. What Lawcheck says about the levels

- A type with `may_use` that holds files at the Tree or Text level: `warning[uses-not-read]`, once per run, with the count and the languages ("12 files of type `scripts` are shell; what they use is not read"). A restriction that cannot be checked is never shown as kept.
- `lawcheck doctor` lists the languages found in the repository with the level of each.
- `lawcheck explain <file>` says the file's language and level.
- A parser that cannot be loaded is `error[parser-failed]`, exit 2. A file whose language should be read and was not is never counted as using nothing.

## 6.5. In a script rule

`file.language` is the language id from the table, or `null` at the Text level. `file.tree()` returns the tree at the Full and Tree levels and `null` otherwise. `file.uses()` returns the list at the Full level and `null` otherwise. A rule written for one language checks `file.language` and returns nothing for the others; a type with a narrow `paths` usually makes that check unnecessary.
