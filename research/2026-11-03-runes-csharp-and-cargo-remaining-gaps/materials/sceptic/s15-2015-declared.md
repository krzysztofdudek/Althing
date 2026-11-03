---
id: s15-2015-declared
language: rust
category: import
expectation: edge
cites: "As p14, p15 and p16, edition 2015, with src/api/mod.rs declaring the importing modules"
---

## Rule

Edition 2015. The root declares `mod util;` and `mod shapes;`, has `extern crate engine_core as core2;`, and the package has a path dependency `util`. In declared modules of `api`: `use util::slug;` is the local module, `use ::shapes::Circle;` the root's module, `use core2::Engine;` the dependency.

## Files

```toml path=Cargo.toml
[package]
name = "app"

[dependencies]
util = { path = "util" }
engine-core = { path = "engine-core" }
```

```toml path=util/Cargo.toml
[package]
name = "util"
```

```rust path=util/src/lib.rs owner=depsrc
pub fn slug() {}
```

```toml path=engine-core/Cargo.toml
[package]
name = "engine-core"
```

```rust path=engine-core/src/lib.rs owner=dep
pub struct Engine;
```

```rust path=src/lib.rs owner=root
extern crate engine_core as core2;
mod util;
mod shapes;
mod api;
```

```rust path=src/util/mod.rs owner=localutil
pub fn slug() {}
```

```rust path=src/shapes/mod.rs
pub struct Circle;
```

```rust path=src/api/mod.rs
mod a;
mod b;
mod c;
```

```rust path=src/api/a.rs
use util::slug;
```

```rust path=src/api/b.rs
use ::shapes::Circle;
```

```rust path=src/api/c.rs
use core2::Engine;
```

## Expect

- src/api/a.rs:1 -> node:localutil
- src/api/b.rs:1 -> node:shapes
- src/api/c.rs:1 -> node:dep
