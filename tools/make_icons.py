"""Generate the Circle Quest app icons into ../ (the repo root, where the
manifest and service worker live).

The icon: a navy tile with a white circle and an inscribed angle (two chords
meeting on the circle), plus a small XP star — the heart of circle geometry.

Run from anywhere with:  python tools/make_icons.py
Requires Pillow:         python -m pip install pillow
"""
import math
import os

from PIL import Image, ImageDraw

OUT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))

INK = (37, 42, 74, 255)        # #252a4a  brand ink (tile background)
WHITE = (255, 255, 255, 255)
CREAM = (255, 253, 248, 255)   # #fffdf8  app background
PINK = (230, 73, 128, 255)     # #e64980  accent (the marked angle)
GOLD = (245, 158, 11, 255)     # warm gold (the XP star)

SS = 4   # supersample for smooth (anti-aliased) edges


def _star(d, cx, cy, r, fill):
    """Draw a five-point star centred at (cx, cy)."""
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.42
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, fill=fill)


def make(size, pad_ratio=0.0, rounded=True, full_bleed=False):
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # tile
    if full_bleed:
        d.rectangle([0, 0, s - 1, s - 1], fill=INK)
    elif rounded:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=INK)
    else:
        d.rectangle([0, 0, s - 1, s - 1], fill=INK)

    pad = s * pad_ratio
    inner = s - 2 * pad
    cx = cy = s / 2
    R = inner * 0.30                     # the circle's radius
    lw = max(2, int(inner * 0.035))      # stroke width

    # the circle (white ring)
    d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=WHITE, width=lw)

    # three points on the circle -> an inscribed angle at B
    def on(deg):
        a = math.radians(deg)
        return (cx + R * math.cos(a), cy - R * math.sin(a))
    A = on(150)     # left
    B = on(-72)     # bottom-right vertex
    C = on(30)      # right

    # two chords BA and BC (the inscribed angle's arms)
    d.line([B, A], fill=CREAM, width=lw)
    d.line([B, C], fill=CREAM, width=lw)

    # the marked angle arc at B, drawn between the two arms
    angBA = math.degrees(math.atan2(-(A[1] - B[1]), A[0] - B[0]))
    angBC = math.degrees(math.atan2(-(C[1] - B[1]), C[0] - B[0]))
    ar = R * 0.42
    # PIL angles are clockwise from 3 o'clock (y grows down); negate our CCW degs
    d.arc([B[0] - ar, B[1] - ar, B[0] + ar, B[1] + ar],
          start=-angBA, end=-angBC, fill=PINK, width=max(2, int(lw * 0.8)))

    # point dots
    dot = lw * 1.15
    for P in (A, B, C):
        d.ellipse([P[0] - dot, P[1] - dot, P[0] + dot, P[1] + dot], fill=WHITE)
    # centre dot
    d.ellipse([cx - dot, cy - dot, cx + dot, cy + dot], fill=WHITE)

    # a small XP star, top-left, riding the tile
    sr = inner * 0.10
    _star(d, cx - R * 0.95, cy - R * 1.02, sr, GOLD)

    return img.resize((size, size), Image.LANCZOS)


def main():
    make(192).save(os.path.join(OUT, "icon-192.png"))
    make(512).save(os.path.join(OUT, "icon-512.png"))
    # Maskable icon: extra padding so a circular/rounded mask can't crop content.
    make(512, pad_ratio=0.16).save(os.path.join(OUT, "icon-512-maskable.png"))
    # Apple touch icon: full-bleed square (iOS adds its own rounded mask).
    make(180, full_bleed=True).save(os.path.join(OUT, "apple-touch-icon.png"))
    print("Wrote icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png to", OUT)


if __name__ == "__main__":
    main()
