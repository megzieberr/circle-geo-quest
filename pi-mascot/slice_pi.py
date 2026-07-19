# Slice Megan's Pi sprite sheets (pi-mascot/2-5.png) into game-ready
# animation strips under assets/pi/.
#
# The sheets are AI-generated, so frames do NOT sit on a uniform column
# grid — instead of fixed cells this finds every sizeable connected
# component inside a hand-tuned y-band, clusters them into frames by
# x-gap, and crops per cluster. Small components (frame labels, caption
# text, motion squiggles, dashes) fall below MIN_COMP and vanish; flat
# wide components (the bounce ground-shadows) are dropped unless the
# animation needs them (the hanging bar).
#
# Eye repair: background removal zeroed the RGB of every white area, so
# the eye/glove whites are gone and some pupils floated free inside the
# eye holes. Per frame we flood the complement of the kept mask from the
# crop borders; anything unreachable is enclosed by Pi — enclosed opaque
# pixels are kept (pupils), enclosed transparent regions up to
# HOLE_MAX_FRAC of the body are painted white (the lost whites), larger
# ones stay transparent (arm/torso gaps).
#
# Alignment: wave/thumbs anchor feet to the union bottom (no jitter),
# hang anchors the bar top, bounce keeps band-absolute vertical offsets
# because the vertical travel IS the animation.
import json, os, sys
from collections import deque
from PIL import Image

SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SRC, "..", "assets", "pi")
TARGET_H = 260
HOLE_MAX_FRAC = 0.02
MIN_COMP = 1500          # px; below this = annotation noise, dropped
FLAT_H = 60              # comp bbox height below this = shadow/bar-shaped
GAP = 18                 # px x-gap that separates two frame clusters

SHEETS = [
    # (file, anim, n_frames, y0, y1, align, keep_flat)
    ("2.png", "wave",   8, 370, 780, "feet", False),
    ("3.png", "thumbs", 6, 420, 800, "feet", False),
    ("4.png", "hang",   8, 180, 470, "bar",  True),    # row 1; bar is flat+wanted
    ("5.png", "bounce", 6, 100, 470, "band", False),   # row 1 = frames 1-6
    ("5.png", "bounce2",6, 500, 865, "band", False),   # row 2 = frames 7-12
]

def components(px, w, h):
    seen = [[False]*w for _ in range(h)]
    comps = []
    for sy in range(h):
        for sx in range(w):
            if seen[sy][sx] or px[sx, sy][3] < 25:
                continue
            q = deque([(sx, sy)]); seen[sy][sx] = True; comp = []
            while q:
                x, y = q.popleft(); comp.append((x, y))
                for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and px[nx, ny][3] >= 25:
                        seen[ny][nx] = True; q.append((nx, ny))
            comps.append(comp)
    return comps

def bbox(comp):
    xs = [p[0] for p in comp]; ys = [p[1] for p in comp]
    return min(xs), min(ys), max(xs)+1, max(ys)+1

def build_frame(band, mask_pts, x0, y0, x1, y1):
    """Crop (x0,y0,x1,y1) from band; keep mask_pts + enclosed repairs."""
    w, h = x1-x0, y1-y0
    spx = band.load()
    in_m = [[False]*w for _ in range(h)]
    for (x, y) in mask_pts:
        if x0 <= x < x1 and y0 <= y < y1:
            in_m[y-y0][x-x0] = True
    reach = [[False]*w for _ in range(h)]
    q = deque()
    for x in range(w):
        for y in (0, h-1):
            if not in_m[y][x] and not reach[y][x]: reach[y][x] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w-1):
            if not in_m[y][x] and not reach[y][x]: reach[y][x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0 <= nx < w and 0 <= ny < h and not in_m[ny][nx] and not reach[ny][nx]:
                reach[ny][nx] = True; q.append((nx, ny))
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    opx = out.load()
    enclosed_clear = set()
    for y in range(h):
        for x in range(w):
            if in_m[y][x]:
                opx[x, y] = spx[x+x0, y+y0]
            elif not reach[y][x]:
                if spx[x+x0, y+y0][3] >= 25: opx[x, y] = spx[x+x0, y+y0]
                else: enclosed_clear.add((x, y))
    area = len(mask_pts)
    hole_seen = set()
    for start in enclosed_clear:
        if start in hole_seen: continue
        q = deque([start]); hole_seen.add(start); hole = [start]
        while q:
            x, y = q.popleft()
            for nx, ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                p = (nx, ny)
                if p in enclosed_clear and p not in hole_seen:
                    hole_seen.add(p); q.append(p); hole.append(p)
        if len(hole) <= area * HOLE_MAX_FRAC:
            for x, y in hole: opx[x, y] = (255, 255, 255, 255)
    return out

def main():
    os.makedirs(OUT, exist_ok=True)
    anims = {}   # key -> list of (frame_img, band_y_offset_of_top, align)
    for fname, anim, nframes, y0, y1, align, keep_flat in SHEETS:
        im = Image.open(os.path.join(SRC, fname)).convert("RGBA")
        band = im.crop((0, y0, im.width, y1))
        comps = components(band.load(), band.width, band.height)
        big = []
        for c in comps:
            if len(c) < MIN_COMP: continue
            bx0, by0, bx1, by1 = bbox(c)
            if (by1-by0) < FLAT_H and not keep_flat: continue
            big.append((c, (bx0, by0, bx1, by1)))
        # cluster by x-interval overlap/adjacency
        big.sort(key=lambda t: t[1][0])
        clusters = []
        for c, bb in big:
            if clusters and bb[0] <= clusters[-1]["x1"] + GAP:
                cl = clusters[-1]
                cl["pts"].extend(c); cl["x1"] = max(cl["x1"], bb[2])
                cl["bb"] = [min(cl["bb"][0], bb[0]), min(cl["bb"][1], bb[1]),
                            max(cl["bb"][2], bb[2]), max(cl["bb"][3], bb[3])]
            else:
                clusters.append({"pts": list(c), "x1": bb[2], "bb": list(bb)})
        if len(clusters) != nframes:
            sys.exit(f"{fname} [{anim}]: expected {nframes} frames, found "
                     f"{len(clusters)} clusters at "
                     f"{[(c['bb'][0], c['bb'][2]) for c in clusters]}")
        key = "bounce" if anim == "bounce2" else anim
        for cl in clusters:
            bx0, by0, bx1, by1 = cl["bb"]
            frame = build_frame(band, cl["pts"], bx0, by0, bx1, by1)
            anims.setdefault(key, []).append((frame, by0, align))
    meta = {}
    for name, frames in anims.items():
        align = frames[0][2]
        fw = max(f[0].width for f in frames)
        if align == "band":
            top = min(f[1] for f in frames)
            fh = max(f[1] - top + f[0].height for f in frames)
        else:
            fh = max(f[0].height for f in frames)
        canvases = []
        for img, band_top, _ in frames:
            cnv = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
            dx = (fw - img.width) // 2
            if align == "feet":   dy = fh - img.height
            elif align == "bar":  dy = 0
            else:                 dy = band_top - top          # "band" (bounce)
            cnv.paste(img, (dx, dy), img)
            canvases.append(cnv)
        scale = TARGET_H / fh
        ow, oh = round(fw*scale), TARGET_H
        strip = Image.new("RGBA", (ow*len(canvases), oh), (0, 0, 0, 0))
        for i, cnv in enumerate(canvases):
            strip.paste(cnv.resize((ow, oh), Image.LANCZOS), (i*ow, 0))
        # flat-colour art -> palette PNG with alpha, ~4x smaller in the
        # service-worker cache with no visible loss at display size
        strip.quantize(colors=128, method=Image.FASTOCTREE).save(
            os.path.join(OUT, f"{name}.png"), optimize=True)
        meta[name] = {"frames": len(canvases), "w": ow, "h": oh}
        print(f"{name}: {len(canvases)} frames @ {ow}x{oh}")
    with open(os.path.join(OUT, "meta.json"), "w") as f:
        json.dump(meta, f, indent=2)
    pad = 8
    cs_w = max(meta[n]["w"]*meta[n]["frames"] for n in meta) + 2*pad
    cs_h = sum(meta[n]["h"] + pad for n in meta) + pad
    cs = Image.new("RGBA", (cs_w, cs_h), (250, 247, 240, 255))
    yoff = pad
    for n in meta:
        s = Image.open(os.path.join(OUT, f"{n}.png")).convert("RGBA")
        cs.paste(s, (pad, yoff), s)
        yoff += meta[n]["h"] + pad
    cs.save(os.path.join(SRC, "contact-sheet.png"))
    print("contact sheet written")

if __name__ == "__main__":
    main()
