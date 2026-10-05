// Yggdrasil adapter for loop/shape (per node).
import { checkLoop } from '../loop.mjs';
import { registryOf } from './read.mjs';

export function check(ctx) {
  const reg = registryOf(ctx);
  const names = reg && reg.repos ? new Set(Object.keys(reg.repos)) : null;
  return checkLoop(ctx.files, { registryNames: names }).map((v) => ({ message: `loop/shape: ${v.message}`, file: v.file, line: v.line || 1 }));
}
