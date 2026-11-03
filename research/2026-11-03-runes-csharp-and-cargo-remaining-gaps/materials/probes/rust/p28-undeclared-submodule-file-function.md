---
id: p28-undeclared-submodule-file-function
language: rust
category: import
expectation: edge
cites: "Rust Reference, Modules (only declared modules exist); Paths"
---

## Rule

`src/util/mod.rs` defines `pub fn parse()` and declares no `mod parse;`. A leftover file `src/util/parse.rs` (owner stale) is in no module tree. `use crate::util::parse;` names the function in `src/util/mod.rs` (node util), never the stale file.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
mod util;
mod cmd;
```

```rust path=src/util/mod.rs owner=util
pub fn parse() {}
```

```rust path=src/util/parse.rs owner=stale
pub fn old() {}
```

```rust path=src/cmd/mod.rs owner=cmd
use crate::util::parse;
```

## Expect

- src/lib.rs:1 -> node:util
- src/lib.rs:2 -> node:cmd
- src/cmd/mod.rs:1 -> node:util
