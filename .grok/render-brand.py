#!/usr/bin/env python3
"""Octile brand cards: walnut desk, brass frame, cream 8-puzzle tiles."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path("/workspace/.grok")
CINZEL = "/workspace/.grok/fonts/Cinzel%5Bwght%5D.ttf"
GARAMOND = "/workspace/.grok/fonts/EBGaramond%5Bwght%5D.ttf"

INK = (20, 17, 14)
WALNUT = (44, 38, 31)
PAPER = (243, 234, 216)
PAPER_HI = (255, 248, 236)
PAPER_LO = (214, 196, 168)
BRASS = (211, 146, 58)
BRASS_HI = (236, 196, 122)
BRASS_LO = (122, 78, 28)
MUTED = (168, 152, 128)


def font(path, size, weight):
    f = ImageFont.truetype(path, size)
    f.set_variation_by_axes([weight])
    return f


def wood(w, h, seed):
    rng = np.random.default_rng(seed)
    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    grain = np.zeros((h, w), np.float32)
    for freq, amp, waves in (
        (11, 0.28, 1.4),
        (23, 0.16, 2.2),
        (46, 0.09, 3.1),
        (8, 0.18, 0.7),
    ):
        phase = rng.random() * 6.28
        shift = x * rng.uniform(0.3, 1.1) + 0.04 * np.sin(x * np.pi * waves)
        grain += amp * np.sin((y * freq + shift) * np.pi * 2 + phase)
    noise = rng.normal(0, 1, (h // 2, w // 8)).astype(np.float32)
    nimg = Image.fromarray(
        ((noise - noise.min()) / (np.ptp(noise) + 1e-6) * 255).astype(np.uint8)
    ).resize((w, h), Image.BICUBIC)
    streaks = np.asarray(nimg).astype(np.float32) / 255.0
    fine = rng.normal(0, 0.035, (h, w)).astype(np.float32)
    tone = 0.52 + grain * 0.16 + (streaks - 0.5) * 0.22 + fine
    cy = (y - 0.48) * 1.25
    cx = (x - 0.5) * 1.08
    vig = 1 - np.clip(cx * cx * 0.85 + cy * cy * 1.15, 0, 1) * 0.62
    tone = np.clip(tone * vig, 0, 1)
    dark = np.array(INK, np.float32)
    light = np.array((96, 72, 48), np.float32)
    mid = np.array(WALNUT, np.float32)
    t = tone[..., None]
    col = dark * (1 - t) + light * t
    col = col * 0.62 + mid * 0.38
    # warm lamp falloff from upper left
    lamp = np.clip(1.08 - (x * 0.55 + y * 0.35), 0.72, 1.12)
    col *= lamp[..., None]
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8), "RGB")


def text_width(text, face, tracking):
    widths = []
    for ch in text:
        box = face.getbbox(ch)
        widths.append(box[2] - box[0])
    return sum(widths) + tracking * (len(text) - 1)


def draw_tracked(base, text, face, xy, fill, tracking, shadow=None):
    x, y = xy
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for ch in text:
        if shadow:
            sx, sy, sc = shadow
            draw.text((x + sx, y + sy), ch, font=face, fill=sc)
        draw.text((x, y), ch, font=face, fill=fill)
        box = face.getbbox(ch)
        x += (box[2] - box[0]) + tracking
    base.alpha_composite(layer)
    return x


def fit_tracked(text, target, weight, tracking_ratio, lo=28, hi=200):
    best = None
    for size in range(lo, hi):
        face = font(CINZEL, size, weight)
        tracking = max(1, int(round(size * tracking_ratio)))
        width = text_width(text, face, tracking)
        if width <= target:
            best = (face, tracking, width, size)
        else:
            break
    if best is None:
        face = font(CINZEL, lo, weight)
        tracking = max(1, int(round(lo * tracking_ratio)))
        best = (face, tracking, text_width(text, face, tracking), lo)
    return best


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return m


def brass_plate(w, h):
    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    hi = np.array(BRASS_HI, np.float32)
    mid = np.array(BRASS, np.float32)
    lo = np.array(BRASS_LO, np.float32)
    band = np.clip((0.18 - np.abs(y - 0.22)) * 3.2, 0, 1)
    t = np.clip(y * 0.85 + 0.08, 0, 1)
    col = lo * t + mid * (1 - t)
    col = col * (1 - band * 0.55) + hi * (band * 0.55)
    # edge darkening
    edge = np.clip(np.minimum(np.minimum(x, 1 - x), np.minimum(y, 1 - y)) * 10, 0, 1)
    col = col * (0.55 + 0.45 * edge[..., None])
    rng = np.random.default_rng(3)
    grain = rng.normal(0, 3.5, (h, w, 1)).astype(np.float32)
    col = np.clip(col + grain, 0, 255)
    return Image.fromarray(col.astype(np.uint8), "RGB")


def paste_round(base, img, xy, radius):
    mask = rounded_mask(img.size, radius)
    base.paste(img, xy, mask)


def tile_face(size):
    img = Image.new("RGB", (size, size))
    y = np.linspace(0, 1, size)[:, None]
    x = np.linspace(0, 1, size)[None, :]
    hi = np.array(PAPER_HI, np.float32)
    mid = np.array(PAPER, np.float32)
    lo = np.array(PAPER_LO, np.float32)
    t = np.clip(y * 0.65 + x * 0.15, 0, 1)[..., None]
    col = hi * (1 - t) + lo * t
    col = col * 0.35 + mid * 0.65
    # soft ceramic rim
    rim = np.clip(np.minimum(np.minimum(x, 1 - x), np.minimum(y, 1 - y)) * 9, 0, 1)
    col = col * (0.78 + 0.22 * rim[..., None])
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8), "RGB")


def draw_board(base, origin, outer, tiles):
    """tiles is a 3x3 list; None is the empty well. origin is top-left of the brass frame."""
    x0, y0 = origin
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        (x0 + 10, y0 + 16, x0 + outer + 8, y0 + outer + 18),
        18,
        fill=(0, 0, 0, 130),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    base.alpha_composite(shadow)

    plate = brass_plate(outer, outer).convert("RGBA")
    paste_round(base, plate, (x0, y0), 16)

    inset = 14
    well = outer - inset * 2
    well_img = Image.new("RGBA", (well, well), (*INK, 255))
    # inner cavity gradient
    arr = np.zeros((well, well, 4), np.uint8)
    yy = np.linspace(0, 1, well)[:, None]
    xx = np.linspace(0, 1, well)[None, :]
    cave = (18 + (1 - yy) * 10 + xx * 4).astype(np.uint8)
    arr[..., 0] = cave
    arr[..., 1] = (cave.astype(np.int16) - 3).clip(0, 255).astype(np.uint8)
    arr[..., 2] = (cave.astype(np.int16) - 5).clip(0, 255).astype(np.uint8)
    arr[..., 3] = 255
    well_img = Image.fromarray(arr, "RGBA")
    paste_round(base, well_img, (x0 + inset, y0 + inset), 10)

    gap = max(6, outer // 38)
    pad = inset + 12
    inner = outer - pad * 2
    cell = (inner - gap * 2) // 3
    ox = x0 + pad + (inner - (cell * 3 + gap * 2)) // 2
    oy = y0 + pad + (inner - (cell * 3 + gap * 2)) // 2
    numeral = font(GARAMOND, int(cell * 0.62), 560)
    for r in range(3):
        for c in range(3):
            val = tiles[r][c]
            tx = ox + c * (cell + gap)
            ty = oy + r * (cell + gap)
            if val is None:
                empty = Image.new("RGBA", (cell, cell), (8, 7, 6, 255))
                paste_round(base, empty, (tx, ty), max(4, cell // 14))
                # inset lip
                lip = ImageDraw.Draw(base)
                lip.rounded_rectangle(
                    (tx, ty, tx + cell - 1, ty + cell - 1),
                    max(4, cell // 14),
                    outline=(70, 52, 28, 180),
                    width=max(1, cell // 28),
                )
                continue
            face = tile_face(cell).convert("RGBA")
            paste_round(base, face, (tx, ty), max(4, cell // 12))
            label = str(val)
            box = numeral.getbbox(label)
            tw, th = box[2] - box[0], box[3] - box[1]
            lx = tx + (cell - tw) / 2 - box[0]
            ly = ty + (cell - th) / 2 - box[1] - cell * 0.02
            glyph = Image.new("RGBA", base.size, (0, 0, 0, 0))
            gd = ImageDraw.Draw(glyph)
            gd.text((lx + 1, ly + 1), label, font=numeral, fill=(255, 248, 236, 150))
            gd.text((lx, ly), label, font=numeral, fill=(48, 36, 26, 235))
            base.alpha_composite(glyph)
    return (x0, y0, outer)


def stack_title(base, text, tagline, center, top, title_target):
    face, tracking, width, size = fit_tracked(text, title_target, 640, 0.085)
    tag_face = font(CINZEL, max(15, int(size * 0.22)), 500)
    tag_track = max(2, int(tag_face.size * 0.22))
    tag_w = text_width(tagline, tag_face, tag_track)
    x = int(center - width / 2)
    # engraved brass: dark recess, light lip, body
    draw_tracked(
        base,
        text,
        face,
        (x, top),
        (*BRASS, 255),
        tracking,
        shadow=(0, 2, (12, 9, 6, 160)),
    )
    # highlight pass, slightly above
    draw_tracked(
        base,
        text,
        face,
        (x, top - 1),
        (*BRASS_HI, 70),
        tracking,
    )
    tag_x = int(center - tag_w / 2)
    tag_y = top + int(size * 0.92)
    draw_tracked(
        base,
        tagline,
        tag_face,
        (tag_x, tag_y),
        (*MUTED, 255),
        tag_track,
        shadow=(0, 1, (12, 9, 6, 120)),
    )
    title_box = (x, top, x + width, top + size)
    tag_box = (tag_x, tag_y, tag_x + tag_w, tag_y + int(tag_face.size * 0.85))
    return title_box, tag_box, size


def render_og():
    w, h = 1200, 630
    base = wood(w, h, 8).convert("RGBA")
    title_box, tag_box, size = stack_title(
        base,
        "OCTILE",
        "AN 8-PUZZLE LABORATORY",
        w / 2,
        48,
        int(w * 0.62),
    )
    outer = 318
    top = tag_box[3] + 28
    # keep the board inside the frame with a margin
    if top + outer > h - 36:
        outer = h - 36 - top
    origin = (int((w - outer) / 2), int(top))
    tiles = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", None],
    ]
    draw_board(base, origin, int(outer), tiles)
    return base.convert("RGB"), {
        "title": title_box,
        "tag": tag_box,
        "board": (origin[0], origin[1], origin[0] + outer, origin[1] + outer),
        "canvas": (w, h),
    }


def render_banner():
    w, h = 1200, 264
    base = wood(w, h, 11).convert("RGBA")
    # lockup sits in the left half, above the midline, clear of the bottom fifth
    face, tracking, width, size = fit_tracked("OCTILE", 430, 640, 0.08, lo=40, hi=120)
    tag_face = font(CINZEL, max(14, int(size * 0.28)), 500)
    tag_track = max(2, int(tag_face.size * 0.2))
    tagline = "AN 8-PUZZLE LABORATORY"
    tag_w = text_width(tagline, tag_face, tag_track)
    left = 56
    title_top = 36
    draw_tracked(
        base,
        "OCTILE",
        face,
        (left, title_top),
        (*BRASS, 255),
        tracking,
        shadow=(0, 2, (12, 9, 6, 160)),
    )
    draw_tracked(
        base,
        "OCTILE",
        face,
        (left, title_top - 1),
        (*BRASS_HI, 70),
        tracking,
    )
    tag_y = title_top + int(size * 0.86)
    draw_tracked(
        base,
        tagline,
        tag_face,
        (left, tag_y),
        (*MUTED, 255),
        tag_track,
        shadow=(0, 1, (12, 9, 6, 120)),
    )
    # short brass rule under the tagline, still in the left half
    rule_y = tag_y + int(tag_face.size * 0.95)
    rule = Image.new("RGBA", base.size, (0, 0, 0, 0))
    rd = ImageDraw.Draw(rule)
    rd.rectangle((left, rule_y, left + 168, rule_y + 2), fill=(*BRASS, 200))
    base.alpha_composite(rule)

    outer = 196
    origin = (w - outer - 72, int((h - outer) / 2) - 4)
    tiles = [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", None],
    ]
    draw_board(base, origin, outer, tiles)
    title_box = (left, title_top, left + width, title_top + size)
    tag_box = (left, tag_y, left + tag_w, tag_y + int(tag_face.size * 0.85))
    return base.convert("RGB"), {
        "title": title_box,
        "tag": tag_box,
        "rule_bottom": rule_y + 2,
        "board": (origin[0], origin[1], origin[0] + outer, origin[1] + outer),
        "canvas": (w, h),
    }


def main():
    og, og_meta = render_og()
    banner, ban_meta = render_banner()
    og.save(OUT / "og-raw.png")
    banner.save(OUT / "x-banner-raw.png")
    print("OG", og_meta)
    print("BANNER", ban_meta)
    # gates
    tw, th = og_meta["canvas"]
    tb = og_meta["title"]
    assert tb[0] > 40 and tb[1] > 24 and tw - tb[2] > 40 and th - tb[3] > 24, tb
    # lettering half to two-thirds
    span = (tb[2] - tb[0]) / tw
    assert 0.48 <= span <= 0.72, span
    bb = ban_meta
    bw, bh = bb["canvas"]
    for name in ("title", "tag"):
        box = bb[name]
        assert box[2] < bw * 0.50, (name, box)
        assert box[3] < bh * 0.80, (name, box)
        assert box[1] > 12, (name, box)
    print("span", round(span, 3), "gates ok")


if __name__ == "__main__":
    main()
