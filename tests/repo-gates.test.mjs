/* Source-level gates: the floor every fleet app meets (GAME_INTEGRATION §13a),
 * plus the service-worker shape fleet CI's version rewrite depends on (§10).
 * What the published artifact must contain is tools/verify-artifact.mjs's job.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, isDevOnly } from '../tools/stage.mjs';

const tracked = execSync('git ls-files -z --cached --others --exclude-standard', { cwd: ROOT, encoding: 'utf8' })
  .split('\0').filter(Boolean);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('every tracked JS file parses', () => {
  for (const f of tracked.filter((f) => /\.(js|mjs)$/.test(f))) {
    const r = spawnSync(process.execPath, ['--check', f], { cwd: ROOT });
    assert.equal(r.status, 0, `node --check ${f} failed:\n${r.stderr}`);
  }
});

test('every tracked JSON file parses', () => {
  for (const f of tracked.filter((f) => f.endsWith('.json'))) {
    assert.doesNotThrow(() => JSON.parse(read(f)), `${f} is not valid JSON`);
  }
});

test('one identity everywhere: Arcade.init, manifest scope, sw.js', () => {
  const html = read('index.html');
  const manifest = JSON.parse(read('manifest.json'));
  assert.match(html, /<script src="\/arcade-sdk\.js"><\/script>/);
  assert.match(html, /Arcade\.init\(\{ gameId: 'orbital' \}\)/);
  assert.match(html, /register\('sw\.js', \{ scope: '\/orbital\/' \}\)/);
  assert.equal(manifest.scope, '/orbital/');
  assert.equal(manifest.start_url, '/orbital/');
});

test('the game never touches raw localStorage when the SDK is present', () => {
  // Framed (opaque origin) the property access itself throws, and keys outside
  // arcade.v1.orbital.* are dropped from save exports.
  const src = read('index.html').replace(/\/\/.*$/gm, '');
  for (const m of src.matchAll(/^.*localStorage\.\w+\(.*$/gm)) {
    assert.match(m[0], /if \(!ARC\)|\belse\b|const s = localStorage\.getItem\('oc-'/, `unguarded localStorage use: ${m[0].trim()}`);
  }
});

const sw = read('sw.js');

test("sw.js declares APP_VERSION in the exact form fleet-ci's sed targets", () => {
  assert.match(sw, /^const APP_VERSION = '[^']*';$/m);
  assert.match(sw, /^const GAME_ID = 'orbital';/m, 'GAME_ID must match Arcade.init({ gameId })');
  assert.match(sw, /^const CACHE_NAME = `\$\{GAME_ID\}-v\$\{APP_VERSION\}`;$/m);
});

test('sw.js follows the shared-origin rules', () => {
  assert.ok(sw.indexOf('// arcade:precache-begin') < sw.indexOf('// arcade:precache-end'));
  assert.doesNotMatch(sw, /['"][^'"]*arcade-(?:sdk|audio)\.js['"]/);
  assert.match(sw, /\.filter\(\((\w+)\) => \1\.startsWith\(`\$\{GAME_ID\}-`\) && \1 !== CACHE_NAME\)/);
  assert.ok(sw.includes("'arcade:sw.skipWaiting'"));
  assert.doesNotMatch(sw, /^\s*self\.skipWaiting\(\);/m);
  assert.match(sw, /if \(!url\.pathname\.startsWith\(SCOPE\)\) return;/);
});

test('stage.mjs publishes the game and drops the dev set', () => {
  for (const f of ['index.html', 'manifest.json', 'sw.js', 'icon.png']) {
    assert.ok(tracked.includes(f), `${f} is not tracked`);
    assert.ok(!isDevOnly(f), `${f} would be dropped from the deploy`);
  }
  for (const f of ['README.md', 'DESIGN.md', 'package.json', '.gitignore', 'server.js', 'tools/stub.js',
    'tools/stage.mjs', 'tests/repo-gates.test.mjs', 'logs/x.json', '.github/workflows/pages.yml']) {
    assert.ok(isDevOnly(f), `${f} would ship to the public site`);
  }
});
