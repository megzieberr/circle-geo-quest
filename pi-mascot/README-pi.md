# Pi mascot — source art & slicer

Megan's Pi character sheets (AI-generated to her spec, backgrounds removed by her):

- `1.png` — three hero poses (not used in-game)
- `2.png` — wave, 8 frames
- `3.png` — thumbs-up, 6 frames
- `4.png` — hanging & swinging, 2 rows of 8 (row 1 is used)
- `5.png` — bounce, 12 frames over 2 rows

`slice_pi.py` turns these into the game assets in `assets/pi/` (one strip PNG
per animation + `meta.json` with frame counts/sizes). Frames are found by
component clustering, not a fixed grid — the sheets aren't uniformly spaced.
It also repairs the eye/glove whites the background removal destroyed (see the
script header) and writes `contact-sheet.png` here for a visual QA pass.

Re-run after changing any sheet: `python slice_pi.py` (needs Pillow).
`js/pi.js` reads `meta.json` at runtime, so new frame sizes need no code edit.

House rules: Pi is pure amusement (no gameplay), hidden under
`prefers-reduced-motion`, and animated with `setInterval` at 6-7 fps —
deliberate, see the pi.js header.
