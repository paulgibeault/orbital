# Orbital Courier

A 2D orbital-mechanics platformer: jump off small worlds, swoosh through real (summed) gravity fields,
and deliver parcels across a living solar system. Level 1 is a playful courier run; Level 2 ("Outer Run")
needs real orbital technique: prograde and retrograde burns, slingshots, launch windows and phasing.

## Play
```
node server.js        # serves the game + saves play logs to ./logs
open http://localhost:8787          # or ?level=2, ?theme=blueprint|amber
```
Press **B** in game for Flight School.

## Controls (short)
- Ground: **A/D** walk · hold **Space** to charge a jump (the launch path is previewed) · release to jump
- Flight: hold **Space** to charge a kick, plus **W/S** (prograde/retrograde) or **A/D** (radial) · **Shift** anchor / landing gear ·
  **Q** switch catch target · hold **F** to warp (auto-brakes before action) · **Esc** cancels a charge
- **Z** overview · **M** minimap · **P** forecast · **T** theme · **H** all keys

## Touch (phones & tablets)
Touch controls switch on with your first touch (and off again when you press a key).
- **Left thumb**: drop a stick anywhere on the left. On the ground it walks; in flight it aims the kick and snaps to
  **PRO / RETRO / IN / OUT** (the markers around you) when you're close to one.
- **Right thumb**: hold **◉ JUMP / KICK** to charge, release to go · hold **GEAR** to catch a world · hold **WARP** · **TARGET** switches the catch target · **✕** cancels a charge or closes a panel.
- **☰** has Flight School, instruments, overview, map, forecast, theme, sound, assist, fullscreen.
- Pinch to zoom; long-press open space to plant a seed (or dig one up). The launcher's left-handed setting mirrors the layout.

## Paul's Arcade / PWA
Published at **https://paulgibeault.github.io/orbital/** and listed in [Paul's Arcade](https://paulgibeault.github.io/#app=orbital).
- Loads the arcade SDK (`/arcade-sdk.js`); saves (ghosts, theme, sound) live under `arcade.v1.orbital.*` via `Arcade.state`.
  Without the SDK (`node server.js`) the game falls back to plain `localStorage` and posts play logs to `logs/`.
- Installable PWA: `manifest.json` + `sw.js` (scoped to `/orbital/`; CI owns `APP_VERSION` and generates the precache list).
- Respects launcher font scale, reduced motion (no shake / chromatic warp) and volume; pauses and mutes when suspended.
- Deploys through the fleet pipeline (`.github/workflows/pages.yml`) on merge to `main`; `npm test` runs the same gates.
- Single visual aesthetic per theme (`T` cycles); the launcher's light/dark theme is intentionally not followed.

## Dev
- `DESIGN.md`: design decisions and playtest findings.
- `tools/`: headless harness (`stub.js`) and regression and sim checks, e.g. `node tools/t_regress.js index.html`;
  `tools/cdp.js` drives headless Chrome for screenshots.
