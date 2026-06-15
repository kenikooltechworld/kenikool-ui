/**
 * scripts/smoke-install.mjs
 *
 * Packs the library into a .tgz and installs it into __smoke/node_modules/kenikool-ui
 * so the smoke test always runs against the exact same artifact a real user gets
 * from `npm install kenikool-ui`.
 *
 * Usage: node scripts/smoke-install.mjs
 * (also called by `pnpm smoke:refresh`)
 */

import { execSync }                               from 'child_process';
import { existsSync, mkdirSync, rmSync, renameSync } from 'fs';
import { resolve, dirname }                        from 'path';
import { fileURLToPath }                           from 'url';
import { createRequire }                           from 'module';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const ROOT       = resolve(__dirname, '..');
const SMOKE_MODS = resolve(ROOT, '__smoke', 'node_modules');
const PKG_DEST   = resolve(SMOKE_MODS, 'kenikool-ui');
const TMP_DIR    = resolve(SMOKE_MODS, '__unpack_tmp');
const TGZ_DEST   = resolve(SMOKE_MODS, 'kenikool-ui-latest.tgz');

// ── 1. Pack ───────────────────────────────────────────────────────────────
console.log('📦  Packing kenikool-ui...');
const packOutput = execSync(`pnpm pack --pack-destination "${SMOKE_MODS}"`, {
  cwd: ROOT,
  encoding: 'utf8',
}).trim();

// pnpm pack prints the full path of the .tgz on the last non-empty line
const tgzPath = packOutput
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.endsWith('.tgz'))
  .at(-1);

if (!tgzPath || !existsSync(tgzPath)) {
  console.error('❌  Could not locate packed .tgz. Output was:\n', packOutput);
  process.exit(1);
}

console.log(`   → packed to ${tgzPath}`);

// ── 2. Unpack to tmp dir ──────────────────────────────────────────────────
console.log('📂  Unpacking into __smoke/node_modules/kenikool-ui...');
mkdirSync(SMOKE_MODS, { recursive: true });

// Remove previous tmp + destination
if (existsSync(TMP_DIR))  rmSync(TMP_DIR,  { recursive: true, force: true });
if (existsSync(PKG_DEST)) rmSync(PKG_DEST, { recursive: true, force: true });

mkdirSync(TMP_DIR, { recursive: true });

// tar: `npm pack` produces a `package/` root inside the tgz
execSync(`tar -xzf "${tgzPath}" -C "${TMP_DIR}"`, { stdio: 'inherit' });

// Rename `package/` → `kenikool-ui/`
const extracted = resolve(TMP_DIR, 'package');
if (!existsSync(extracted)) {
  console.error('❌  Expected "package/" folder inside .tgz — not found.');
  process.exit(1);
}

renameSync(extracted, PKG_DEST);
rmSync(TMP_DIR, { recursive: true, force: true });

// Remove the tgz from node_modules (keep it only at root for reference)
if (existsSync(tgzPath) && tgzPath.startsWith(SMOKE_MODS)) {
  rmSync(tgzPath, { force: true });
}

console.log('✅  kenikool-ui installed into __smoke/node_modules/kenikool-ui');
console.log('   Run: vite __smoke --port 5174 --open');
