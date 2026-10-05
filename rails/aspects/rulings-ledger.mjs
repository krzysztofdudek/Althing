// Yggdrasil adapter for rulings/ledger (per node): method/rulings.md.
import { checkLedger } from '../ledger.mjs';
import { tryRead, ownFile } from './read.mjs';

export function check(ctx) {
  const f = ownFile(ctx, 'method/rulings.md');
  if (!f) return [];
  return checkLedger(f.content, { decisionsOf: (v) => tryRead(ctx, `releases/${v}/.jarl/decisions.md`) })
    .map((v) => ({ message: `rulings/ledger: ${v.message}`, file: f.path, line: v.line }));
}
