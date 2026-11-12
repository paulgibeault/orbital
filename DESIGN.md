# Orbital Courier — design notes

## Core feeling
Jump free of a small body, get bent and flung by gravity fields, and come swooshing back.
Leaving costs little, momentum is never reset, near misses feel great, and getting back is a relief.

## Rule #1: keep the sky unpredictable
If flight becomes predictable, the game has no reason to exist.
- Gravity is **real and summed from every body**, with no gravity zones, no sphere-of-influence cutoffs and no auto-capture.
- Bodies move on their orbits, so the field is always changing and no two flights are the same.
- **No trajectory preview.** Players learn the sky by feel. (If we ever add a hint, it should be short, earned, and fuzzy.)
- The stable integrator (semi-implicit Euler at 240 Hz) only stops numerical drift. It doesn't make flight easier to predict.
- Steering is limited on purpose: one kick per flight, plus heavy mode. You set the flight up, then ride it.

## Level 1: Orbital Courier (current prototype)
Pick up parcels and deliver them across a small solar system. Pay = distance + speed tip + style.
- **Style:** grazes (skim a surface at speed and escape) and full orbits pay extra.
- **Build layer (creativity):** deliveries earn *seed moons*. Plant them anywhere (hold longer for a bigger one)
  to shape your own slingshot routes. Moving planets crush seeds planted in their path, so where you plant matters.
- Physics that falls out naturally: the kick is along your motion relative to the dominant body,
  so kicking at closest approach adds the most energy (the Oberth effect). Players learn this by feel.

## Physics tuning decisions (2026-11-11)
- **The sun is a bowl.** The sun's pull is inverse-square close in, but beyond `haloR` it grows gently with distance (`haloExp` 0.5).
  Nothing escapes forever; big jumps become long swoops back. (Before this, 82% of full-charge jumps left the system.)
  A stronger halo (exp 1) would lock the outer bodies into rigid formation, so we don't use it.
- **The sun can't be landed on.** Touching it gives an elastic "solar bounce" that conserves energy and refreshes your kick.
  (With the deeper sun, landing on it was a softlock.)
- **Playtest 1 (8.5 min, no deliveries):** ~7 of 8.5 minutes were spent drifting around the sun (flights of 171/114/87 s).
  The player held Shift for 80–100 s per flight trying to come down. Old heavy mode made the *sun* pull harder, which made things worse.
- **Fix: Shift = Reach.** Grab the nearest world (never the sun; prefers the current target). Its pull ×3,
  drift away from it bleeds off, and you ride in its frame of reference, so the sun can't pin you to its surface (an early version did).
  Simulated results: flights >30 s dropped from ~45% to ~3%, and the median flight is ~6 s.
- 2 kicks that recharge in flight; orbiting the sun no longer pays style; hint after 20 s of drifting.
- Level 1 = 5 scripted deliveries: Kettle→Pip, Pip→Brindle, Brindle→Kettle, Kettle→Ada, Bo→Outpost.
- **Playtest 2 (17 min, Level 1 done in 7:10, 14 deliveries).** Feedback: "forces don't act as anticipated", "not clear how the anchor is chosen or controlled".
  Log forensics: reach grabbed worlds 3,000+ px away and switched 35× mid-hold; holding Shift far out pushed the player *outward*
  (the frame-of-reference trick removed the sun's pull home); pressing Shift jolted force by up to 1,100 px/s²; 6 of 38 kicks went >45° off visible motion;
  the player tried Tab/N/↑ looking for anchor control, toggled camera spin 8× in 5 s, and 5 of 6 seeds were crushed by the asteroid belt.
- **Anchor redesign:** always-visible ring on the anchor; Q/Tab cycles worlds within 650 px; locked while Shift is held;
  a plain tether pull (240 px/s², ramps in over 0.35 s) plus drift bleed; disabled inside the sun's corona. No more frame-of-reference trick.
- **Aimed kicks:** arrow keys set the direction (screen-relative); with no arrow, the kick goes along your motion relative to your anchor. A chevron shows the direction.
- **Camera:** in flight, up = away from your anchor; with no anchor it holds still. Outer wall beyond 2,300 px; the sun "spits" bounces out (+90 px/s).
- **Seeds:** planting shows the paths moving bodies sweep, and refuses spots inside them.
- Smart-player sim: median flight ~4 s; direct hits per leg 16–63%, with most misses landing on another world.

## Telemetry
Run `node server.js`, then open http://localhost:8787. Sessions save to `logs/session-*.json` every 5 s.
Tracked: jumps (charge, dwell time), flights (duration, max distance from the sun, kicks, heavy time, **air-steer attempts**,
**extra Space presses with no kick left**), landings, grazes and orbits, deliveries, seed use, 10 Hz position samples, frame hitches and input latency.

## Level 2: Outer Run (slingshots) — built 2026-11-11
Goal: reaching the outer worlds should *require and reward* gravity assists, without being hard.
- **Why a separate, wider system:** in Level 1's compact system, a planet's escape speed ≈ its orbital speed, so any jump that
  leaves a world can reach anywhere (even a much weaker jump reached 2,800 px). Assists only matter when your own push is small
  next to orbital speeds. That means worlds far apart relative to their size (Dock: escape 138 vs. orbit 307 px/s), and a max jump
  that only *just* escapes (145) plus one small kick (25). Getting to 3× your orbit needs only ~25% more speed, so every bit of
  extra push leaks reach.
- **System "Cinder":** Dock (home), Ferry, **Anvil** (gas giant: the slingshot, bounces you), Wisp (Anvil's moon: launch pad),
  Lantern, Tern. Best unassisted reach from Dock ≈ 3,300 px, so Tern (4,000) needs a slingshot (~2/3 of simulated successes used one).
- **Anchor = landing gear:** 550 px range, firm catch and settle, but it can't carry you between orbits. **G** toggles Assist (Level 1 anchor).
- **Readability:** a callout after every pass ("Slingshot! Anvil +95" / "Braked by Ferry −86", with energy change shown as an equivalent burn);
  the trail glows warm while gaining energy and cool while losing it; chained slingshots multiply style points; scripted hints per job.
- Gas giants are non-landable everywhere (Bellows was added to Level 1, too: it would have been a softlock).
- Simulated player, per departing jump: Dock→Ferry 42%, Ferry→Wisp 40%, Wisp→Lantern 21%, Lantern→Dock 18%, Dock→Tern 5%
  (misses land on stepping stones 17–38% of the time). Humans timing launches should do better. **Needs a real playtest.**
- Open: a "reach gauge" (how far your current energy can carry you) was deliberately left out. Add it only if the logs show flailing.

## Level 3: Accretion ("you are the gravity")
You start as a pebble. Collected debris starts orbiting *you*. Once you're heavy enough, small bodies get pulled into your orbit.
The roles flip: you become a well that others fall into. Ends as a star.

## Level 3 (later): 3D
Same rules in 3D. The camera up-vector blending will be the hard part.

## Ideas parking lot
Pushable moons · launched seeds that orbit (n-body) · pulsing and repulsor fields · binary chaos ·
Lagrange-point rest stops · trajectory echoes (ride your old trail) · rhythm-synced orbits · black-hole descent.

## Visibility + live forecast (2026-11-11)
Playtest feedback on Level 2: "great but pretty tough… difficult to see". The user explicitly asked for live orbit prediction.
- **Forecast (P toggles; on by default).** It integrates your real path forward using the game's exact step and ordering, and the worlds ride
  fixed rails, so it's exact apart from your future inputs (checked: ~7 px residual, flat over 20 s = sampling granularity). It shows:
  the landing point (green ✓ if it's the target), upcoming passes with a ghost of the world *where it will be* plus the predicted slingshot value,
  bounces, 5 s ticks, a dashed "if you kick now" path, and your launch path while charging a jump (hold at full, release on the window).
  Horizon: 10 s in Level 1, 45 s in Level 2. Cost ~5 ms per run in Level 2, so the main path and kick preview alternate frames.
- **See more of the board:** Level 2 camera scale 0.55; wheel zooms out to 0.12; **Z** = whole-system overview; **M** = minimap with the forecast.
- **Visuals:** nebula and tinted twinkling stars; additive star corona; worlds lit from the star's side, with an atmosphere rim; banded gas giants;
  a motion streak on each world's orbit (shows which side is "behind" for slingshots); faint slingshot-zone ring; target orbit highlighted.
- **Hold F** to fast-forward 3× through long coasts.
- This revises the "keep the sky unpredictable" rule: the user chose prediction for this game. Chaos still comes from the moving field;
  the forecast just makes it readable.

## Teaching real orbital mechanics + UI overhaul (2026-11-11)
User: "Perhaps I'm not using the mechanics correctly… teach me… very empty screen… give the UI some love."
Log forensics (Level 2, 20 min, 130 kicks): 57% of aimed kicks were *radial* (mostly toward the sun or target), only 13% prograde,
and only 9% happened near top speed. That's the classic "point at the target" instinct, which orbits punish.
- **Orbital controls:** kick with **W** prograde / **S** retrograde / **A**·**D** radial in/out, relative to the body you orbit
  (the smallest Hill sphere containing you). Arrows still aim on screen; no key = prograde. On-ship W/S/A/D markers show the directions.
- **Orbit instruments:** osculating orbit from the effective potential (Pe/Ap, valid with the halo); the Kepler ellipse is drawn when the orbit is
  inside the inverse-square region. The launch orbit is computed *after* the forecast climbs out of the launch world's pull
  (computing it at the surface overstated Ap ~5×). Instrument gauge (sqrt scale): your Pe–Ap band vs. the target's orbit band.
- **Closest approach** to the target in the forecast: dashed you↔ghost line, green "✓ catchable" when within landing-gear range.
- **Coach:** live, state-aware advice (falls short → W at Pe or slingshot; overshoots → S at Ap; crosses → timing; on course → Shift when ringed).
- **Flight School (B; opens at Level 2):** 9 illustrated pages: the big picture, reading the forecast, W/S (Hohmann), the Oberth effect,
  slingshots, launch windows, catch and land, moon launch, recipes.
- **★ ratings per delivery:** delivered · under par (25 s Level 1 / 90 s Level 2) · smart (a slingshot or ≤1 kick).
- **UI:** glass panels (mission card, flight instruments, context-sensitive controls, coach, toasts), 3 themes (**T**: Nebula / Blueprint with a
  labelled polar grid / Amber CRT with scanlines), procedural planet textures (terra, jungle, desert, ice, cratered moons, banded gas giants,
  sun granulation) lit from the star, decorative dust belts, distant galaxies, vignette, camera framing of you + target (**V**).
- Verified with headless Chrome driven over CDP (`/tmp/oc-test/cdp.js`), plus node regression (`/tmp/oc-test/t_regress.js`, `t_ui.js`).

## Same-orbit chases: phasing (2026-11-11)
User: "you cannot hunt down a planet on the same orbital… you never catch up." That's real orbital mechanics: speeding up raises your orbit,
and higher orbits are slower, so you fall behind. **To catch a world ahead, slow down** (drop lower, lap faster); to let one behind catch you, speed up.
- A fixed-size kick almost always overshot: one full S kick at Ferry's orbit gains ~80°/lap, so the right amount is "exactly the gap".
  → **Charged kicks:** hold Space in flight (20%→100% over 0.8 s); the dashed "if you kick now" forecast and its closest approach update live;
  release on green. A tap = 20%.
- **Phase readout** (degrees ahead/behind, ETA if already closing); **coach** says S-to-catch-up / W-to-wait and shows charging guidance;
  new **Flight School** page "Catching a world on your own orbit".
- During a chase the forecast horizon stretches to ~1.25 laps (≤130 s): exact for the first 15 s, coarser after. Warm cost ≈ 5.4 ms per run;
  long previews refresh at ~15 Hz each. Frame CPU p95 6.9 ms.
- Simulated player (the target 30–120° ahead or behind on its own orbit, holding S/W, releasing at the first green):
  Ferry 7/7, Lantern 6/7, Tern 6/7 (the misses were perturbed by Anvil). Typical power: 20–30% to catch up, 50–90% to wait.
  Level 1's outer orbits sit in the halo, where period barely changes with height, so one kick often can't reach green;
  the coach says so ("release anyway; you'll gain every lap").

## Warp + fun pass (2026-11-11)
Playtest: 36-minute session with fast-forward held for 15.7 min (44%), so coasting was the slow part.
- **Warp (F):** ramps to ×8 and auto-brakes so the next slingshot, arrival, landing, bounce or catch window is ≥2.5 s away in real time
  (with a callout). **Rip cam** while warping: close chase view aligned to velocity, speed lines along on-screen motion, plasma tail, shake.
  Charging runs on real time; warp drops to ×1 while charging.
- **Cancel:** Esc / Backspace cancels a jump or kick charge (nothing spent).
1. **Slingshot bullet-time:** ×0.3 at the bottom of fast passes (≤3 s per pass); the gold "perfect window" ring; a PERFECT KICK is ×1.5 power
   + style + a 90 ms hit-stop.
2. **Synth sound** (WebAudio, no assets): warp wind, Doppler planet hum, kick thump, perfect chime, landings, delivery arpeggio + ★ notes,
   slingshot sweeps. **N** mutes.
3. **Stardust streams:** 14-mote clusters (~260 px of orbit, ±35 px) riding natural circular orbits; 75 px magnet; +2 per mote, +25 per stream.
   The forecast rings the motes your path will sweep; it matched reality exactly in tests (aimed sweeps get 10–13 of 14).
4. **Combo meter:** grazes, slingshots, perfect kicks, stardust, orbits and bounces chain within 10 s; style points ×(1 + 0.2·(n−1)), max ×4;
   ends on landing or timeout with a summary.
5. **Comets** on Kepler ellipses (Wanderer in Level 1: 420–2300 px, 64 s; Skipjack in Level 2: 820–4300 px, 80 s, 460 px/s at perihelion):
   heavy-for-size, fleeting slingshots, rideable ("comet ride"), tails, perihelion callouts. The forecast solves Kepler every 8th step.
6. **Express contracts** (free play, alternating): beat the clock (45 s / 150 s) for ×2.5 pay. **Ghost routes:** your best time per
   level+route persists in localStorage and replays as a ghost, rotated to the current pickup world.
7. **More impact:** shockwave rings (land/kick/bounce/slingshot/delivery), screen shake scaled to the event, atmosphere-limb flare and sparks
   when grazing, confetti on deliveries and level completion, hit-stop on perfect kicks.
- Phase readout now only for near-circular co-orbits (it misfired on eccentric crossings).
