---
id: p33-dev-and-build-dependencies
language: rust
category: import
expectation: edge
cites: "The Cargo Book, Specifying dependencies, Development dependencies and Build dependencies (dev-deps are visible to tests, examples, benches; build-deps to build.rs)"
---

## Rule

`[dev-dependencies] fixtures = { path = "../fixtures" }` used from `tests/it.rs`; `[build-dependencies] gen = { path = "../gen" }` used from `build.rs`. Each binds its dependency's library.

## Files

```toml path=app/Cargo.toml
[package]
name = "app"
edition = "2021"

[dev-dependencies]
fixtures = { path = "../fixtures" }

[build-dependencies]
gen = { path = "../gen" }
```

```toml path=fixtures/Cargo.toml
[package]
name = "fixtures"
edition = "2021"
```

```toml path=gen/Cargo.toml
[package]
name = "gen"
edition = "2021"
```

```rust path=fixtures/src/lib.rs owner=fixtures
pub fn sample() {}
```

```rust path=gen/src/lib.rs owner=gen
pub fn emit() {}
```

```rust path=app/src/lib.rs owner=root
pub fn f() {}
```

```rust path=app/tests/it.rs owner=tests
use fixtures::sample;
```

```rust path=app/build.rs owner=build
use gen::emit;
fn main() {}
```

## Expect

- app/tests/it.rs:1 -> node:fixtures
- app/build.rs:1 -> node:gen
