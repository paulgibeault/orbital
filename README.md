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

## Dev
- `DESIGN.md`: design decisions and playtest findings.
- `tools/`: headless harness (`stub.js`) and regression and sim checks, e.g. `node tools/t_regress.js index.html`;
  `tools/cdp.js` drives headless Chrome for screenshots.
