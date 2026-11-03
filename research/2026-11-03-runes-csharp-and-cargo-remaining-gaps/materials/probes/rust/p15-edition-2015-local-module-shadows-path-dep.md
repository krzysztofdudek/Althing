---
id: p15-edition-2015-local-module-shadows-path-dep
language: rust
category: import
expectation: edge
cites: "Rust Reference, Preludes, Extern prelude (edition differences: in 2015, crates in the extern prelude cannot be referenced via use declarations); Use declarations (2015: relative to the crate root)"
---

## Rule

Edition 2015, path dependency `util` with no `extern crate util;`, and the root declares its own `mod util;`. In a submodule `use util::slug;` is relative to the crate root, so it names the local module `src/util/mod.rs` (owner localutil), never the dependency (node depsrc).

## Files

```toml path=Cargo.toml
[package]
name = "app"

[dependencies]
util = { path = "util" }
```

```toml path=util/Cargo.toml
[package]
name = "util"
```

```rust path=util/src/lib.rs owner=depsrc
pub fn slug() {}
```

```rust path=src/lib.rs owner=root
mod util;
mod api;
```

```rust path=src/util/mod.rs owner=localutil
pub fn slug() {}
```

```rust path=src/api/client.rs
use util::slug;
```

## Expect

- src/api/client.rs:1 -> node:localutil
- src/lib.rs:1 -> node:localutil
