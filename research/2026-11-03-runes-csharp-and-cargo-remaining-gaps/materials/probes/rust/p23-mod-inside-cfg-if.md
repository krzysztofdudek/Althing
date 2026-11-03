---
id: p23-mod-inside-cfg-if
language: rust
category: import
expectation: edge
cites: "Rust Reference, Modules; cfg-if crate (expands to the items of the taken branch)"
---

## Rule

`cfg_if! { if #[cfg(unix)] { mod unix; } else { mod other; } }` in `src/lib.rs` declares `src/unix/mod.rs` (node unix) on unix. A source-only reader may stay silent (a lost edge); it must never bind a file the branch does not name.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs owner=root
cfg_if::cfg_if! {
    if #[cfg(unix)] {
        mod unix;
    } else {
        mod other;
    }
}
```

```rust path=src/unix/mod.rs
pub fn f() {}
```

```rust path=src/other/mod.rs
pub fn f() {}
```

## Expect

- src/lib.rs:3 -> node:unix
- src/lib.rs:5 -> node:other
