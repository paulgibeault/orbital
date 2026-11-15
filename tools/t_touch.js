// Touch controls: hint rewriting, stick aim snapping onto orbital directions, and touch-mode toggling.
const { load } = require('./stub'); const assert = require('assert');
const { api, fr } = load(process.argv[2] || 'index.html', '',
  'P,tl,touchKickDir,setTouchMode,orbitAxes,cam,get touchMode(){return touchMode},setAim:v=>touchAim=v,kickDir');
fr(5);
// keyboard mode leaves hints alone
assert.strictEqual(api.tl('hold <kbd>Shift</kbd>'), 'hold <kbd>Shift</kbd>');
api.setTouchMode(true); assert.ok(api.touchMode);
const t = s => api.tl(s);
assert.strictEqual(t('hold <kbd>Shift</kbd> to catch'), 'hold <kbd>GEAR</kbd> to catch');
assert.strictEqual(t('Walk <kbd>A</kbd> / <kbd>D</kbd> to the parcel'), 'Walk <kbd>◀ stick ▶</kbd> to the parcel');
assert.strictEqual(t('Small <kbd>W</kbd>/<kbd>S</kbd> kicks'), 'Small <kbd>stick → PRO / RETRO</kbd> kicks');
assert.strictEqual(t('<kbd>Q</kbd>/<kbd>Tab</kbd> picks'), '<kbd>TARGET</kbd> picks');
assert.strictEqual(t('Press <b>Enter</b> for Level 2 · <b>Esc</b> to keep flying'), 'Tap for Level 2 · <b>✕</b> to keep flying');
assert.ok(/◉ (JUMP|KICK)/.test(t('Hold <kbd>Space</kbd>')));
assert.ok(!/<kbd>[A-Z]<\/kbd>/.test(t('<kbd>B</kbd> <kbd>F</kbd> <kbd>Z</kbd> <kbd>G</kbd> <kbd>W</kbd> <kbd>S</kbd>')), 'single-letter key left behind');
// aim: no stick → normal kick direction; stick near prograde snaps to it exactly; far from any axis stays free
api.P.on = null; api.P.vx += 140; api.P.vy += 60;   // in flight, moving relative to the world
api.setAim(null); assert.strictEqual(api.touchKickDir(), null);
const ax = api.orbitAxes(), c = Math.cos(-api.cam.rot), s = Math.sin(-api.cam.rot);
const toScreen = ([x, y], twist = 0) => { const a = Math.atan2(x * s + y * c, x * c - y * s) + twist; return [Math.cos(a), Math.sin(a)]; };
api.setAim(toScreen(ax.pro, 0.15));   // ~9° off prograde
let k = api.touchKickDir(); assert.strictEqual(k[2], 'orbit');
assert.ok(Math.abs(k[0] - ax.pro[0]) < 1e-9 && Math.abs(k[1] - ax.pro[1]) < 1e-9, 'snaps to prograde');
api.setAim(toScreen([-ax.out[0], -ax.out[1]], -0.2));   // ~11° off radial-in
k = api.touchKickDir(); assert.ok(k[2] === 'orbit' && Math.abs(k[0] + ax.out[0]) < 1e-9, 'snaps to radial in');
api.setAim(toScreen(ax.pro, Math.PI / 4));   // 45°: between axes, free aim
k = api.touchKickDir(); assert.strictEqual(k[2], 'aim');
assert.deepStrictEqual(api.kickDir(), k, 'kickDir uses the touch aim');
api.setTouchMode(false); assert.ok(!api.touchMode);
console.log('touch: hints, snapping and mode toggling ok');
