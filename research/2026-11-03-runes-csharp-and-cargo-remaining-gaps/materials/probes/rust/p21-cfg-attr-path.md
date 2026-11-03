---
id: p21-cfg-attr-path
language: rust
category: import
expectation: silence
cites: "Rust Reference, Conditional compilation, The cfg_attr attribute; Modules, The path attribute"
---

## Rule

`#[cfg_attr(unix, path = "imp/unix.rs")] #[cfg_attr(windows, path = "imp/windows.rs")] mod sys;`: on every platform with a path the module is the named file; the conventional `src/sys/mod.rs` (node sys) is a decoy on unix and windows. The safe outcome is silence; an edge to node sys is valid only on other targets.

## Files

```toml path=Cargo.toml
[package]
name = "app"
edition = "2021"
```

```rust path=src/lib.rs
#[cfg_attr(unix, path = "imp/unix.rs")]
#[cfg_attr(windows, path = "imp/windows.rs")]
mod sys;
```

```rust path=src/imp/unix.rs
pub fn f() {}
```

```rust path=src/sys/mod.rs
pub fn f() {}
```

## Expect

- silence
