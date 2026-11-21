// Launch control + rewind: aim leans the launch, W/S set power by hand, R rewinds the flight (to the pad, same window).
const { load } = require('./stub');
const { api, fr, key } = load(process.argv[2], '', 'P,hidePanel,LOG,REW,T,FC,STICK,touchTick,launchDir,get simT(){return simT},get bodies(){return bodies},set touchMode(v){touchMode=v}');
const { P, T } = api; api.hidePanel(); fr(5);
const ok = (c, m) => { if (!c) { console.error('FAIL', m); process.exit(1); } };
// aim: hold Space, then D for ~0.5 s — your feet stay planted, the launch leans
const ang0 = P.ang;
key('keydown', 'Space'); fr(3); key('keydown', 'KeyD'); fr(30); key('keyup', 'KeyD');
ok(Math.abs(P.ang - ang0) < 0.02, 'walked while charging: ' + (P.ang - ang0));
ok(P.tilt > 0.5 && P.tilt < 0.7, 'tilt after 0.5s: ' + P.tilt);
key('keydown', 'KeyD'); fr(120); key('keyup', 'KeyD');
ok(Math.abs(P.tilt - T.aimTilt) < 1e-9, 'tilt clamps at aimTilt');
// power: by hand, stops filling on its own
key('keydown', 'KeyS'); fr(30); key('keyup', 'KeyS'); const c1 = P.charge; fr(30);
ok(P.chargeManual && Math.abs(P.charge - c1) < 1e-9, 'manual power held steady: ' + c1 + ' → ' + P.charge);
key('keydown', 'KeyW'); fr(30); key('keyup', 'KeyW');
ok(P.charge > c1 + 0.2, 'W raised power');
P.tilt = 0.3; P.charge = 0.9;   // a long flight for the rewind checks below
// launch goes where the arrow points (relative to the world, ignoring the tiny walk drift)
const b = P.on, [lx, ly] = api.launchDir(), tJump = api.simT, angJ = P.ang, tiltJ = P.tilt, chJ = P.charge;
key('keyup', 'Space');
const rvx = P.vx - b.vx, rvy = P.vy - b.vy, L = Math.hypot(rvx, rvy);
ok((rvx * lx + rvy * ly) / L > 0.999, 'launch direction matches arrow');
ok(Math.abs(L - (T.jumpMin + (T.jumpMax - T.jumpMin) * chJ)) < 1, 'launch speed matches power');
console.log(`aim: tilt ${tiltJ.toFixed(2)} rad, power ${(chJ * 100).toFixed(0)}% → launched along the arrow at ${L.toFixed(0)} px/s`);
// partial rewind: fly 3 s, rewind 0.5 s real (= 1.5 s sim), let go, keep flying
fr(180); ok(!P.on, 'still flying after 3s (landed on ' + (P.on && P.on.name) + ')'); const tFly = api.simT;
key('keydown', 'KeyR'); fr(30); key('keyup', 'KeyR'); fr(1);
const back = tFly - api.simT;
ok(back > 1.3 && back < 1.7, 'rewound ~1.5 s sim: ' + back.toFixed(2));
ok(!P.on, 'partial rewind leaves you flying');
// full rewind: back on the pad, same spot, same aim, same clock (so the same launch window)
key('keydown', 'KeyR'); fr(120); key('keyup', 'KeyR'); fr(1);
ok(P.on === b, 'full rewind lands you back on ' + b.name);
const rw = api.LOG.events.filter(e => e.type === 'rewind').pop();
ok(Math.abs(api.simT - rw.to) < 0.03, 'clock waited on the pad while R was held');
ok(rw.ground && Math.abs(rw.to - tJump) < 0.02, 'clock back to the jump: ' + (rw.to - tJump).toFixed(3));
ok(Math.abs(P.tilt - tiltJ) < 1e-9 && Math.abs(P.ang - angJ) < 1e-9, 'same spot + aim');
ok(!api.LOG.flight && api.LOG.events.some(e => e.type === 'rewind' && e.ground), 'rewind logged');
// re-launch identically from the pad (no frames in between, so the same instant): the flight replays exactly
const relaunch = () => { key('keyup', 'KeyR'); key('keydown', 'Space'); P.chargeManual = true; P.charge = chJ; key('keyup', 'Space'); fr(60); return [P.x, P.y, api.simT]; };
const p1 = relaunch();
key('keydown', 'KeyR'); fr(60);
const p2 = relaunch();
const dd = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
ok(Math.abs(p1[2] - p2[2]) < 1.01 / 240, 'same clock on replay (±1 step): ' + (p1[2] - p2[2]));
ok(dd < 3, 'same launch replays the same flight: ' + dd.toFixed(2) + ' px');
console.log(`rewind: −${back.toFixed(2)} s partial, full rewind back on ${b.name} at t=${rw.to} (jumped at ${tJump.toFixed(2)}), replay drift ${dd.toFixed(2)} px`);
// touch slingshot: hold ◉, point the stick — it sets aim + power
api.touchMode = true;
key('keydown', 'KeyR'); fr(60); key('keyup', 'KeyR'); fr(1); ok(P.on, 'on pad for touch test');
key('keydown', 'Space'); fr(2);
const S = api.STICK; S.id = 1; S.vx = 0.4; S.vy = -0.6; api.touchTick();
ok(P.chargeManual && P.charge > 0.5 && P.charge < 0.9, 'stick sets power: ' + P.charge.toFixed(2));
ok(Math.abs(P.tilt) > 0.05, 'stick sets aim: ' + P.tilt.toFixed(2));
S.id = null; key('keyup', 'Space'); ok(!P.on, 'touch launch fired');
console.log('touch slingshot ok · launch + rewind tests pass');
