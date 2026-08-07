# Design System: Vökuland Vellíðan (Vita Travel transplant)

Reference: https://vita-travel.webflow.io, measured 2026-08-07 (probe: scratchpad/probe/devices.mjs + vita-deep.mjs).
Client: Vökuland Wellness, Eyjafjarðarsveit. All copy/prices/photos from vokulandwellness.is (audit: memory/vokuland-wellness-audit.md).

## 1. Atmosphere
Dark editorial travel-marketplace calm. One deep evergreen-petrol world, photography does the talking,
type is one family with aggressive negative tracking. Motion is text choreography, not image gymnastics.
Variance 7 · Motion 6 · Density 3.

## 2. Color (reference role -> re-aimed value)
- **Ground** `#0A1E1C` (Vita #091B20 shifted from blue-petrol to spruce, toward the client's teal logo)
- **Surface** `#0E2B27` (Vita #0D2E37 analog) for cards/steps
- **Ink** `#F2F7F5`; **Ink-60** rgba(242,247,245,.66) meta; **Ink-40** rgba(242,247,245,.45) hairlines only
- **Accent** `#4CA7A3` seafoam, sampled from their logo. Marks, focus rings, small labels only. Never body text.
- **CTA** white pill, dark label (Vita's move). Radius 80px.
- No pure black, no purple, single palette page-wide.

## 3. Type (measured off reference, same ratios)
Inter (self-hosted 400/500/600), tight negative tracking is the identity:
- Hero display: clamp(64px, 12vw, 176px)/0.98, w600, ls -0.052em
- H2 section: clamp(38px, 4.5vw, 60px)/1.1, w600, ls -0.06em
- Stat number: 45px/1, w600, ls -0.066em
- Card title / body-xxl: 28px/1.2, w600, ls -0.071em
- Body-lg 18px/1.3 w500 ls -0.028em · Body 16px/1.3 w500 ls -0.031em
- Muted = Ink-60, exactly like Vita's white-50/60 pattern.

## 4. Components
- Nav 72px fixed, transparent over hero, gains Ground bg after scroll. One line. Animated burger < 900px.
- Buttons: pill r80, white bg + Ground text, pad 20/32, 16px w500. Ghost variant: 1px Ink-40 border.
- Experience card (Vita featured-item anatomy): image frame (overflow hidden, hover scale 1.06/700ms),
  masked-line title 28px, meta rows in Ink-60 (duration, capacity), "Verð frá" price line, arrow link.
- Steps: numbered 01-04 on Surface blocks (real sequence: the content IS a booking sequence).
- Stats: big number + small label, static (no gauges, no count-up theatrics).

## 5. Sections (Vita structure -> real content)
1 Nav · 2 Hero (deck/hot-tub golden photo, "Vellíðan / í hjarta sveitarinnar") · 3 Three worlds rows
(Kyrrðarhofið / Gistingin / Baðheimurinn + real meta) · 4 About + 4 stats (12 km, 8 gestir, 14 manns, 4 klst)
· 5 Upplifanir grid, 6 real packages w/ real prices · 6 "Settu saman dvölina" 4 steps · 7 Aurora full-bleed
band (their real 2018 aurora photo + their hot-tub copy) · 8 Staðurinn 4 tiles · 9 Sólveig + real
testimonials · 10 Booking contact + hours + footer w/ prototype disclaimer.

## 6. Motion (transplanted, measured vocabulary)
GSAP + ScrollTrigger, native scroll (reference has NO Lenis). Vocabulary:
- fade-up-big: y40 -> 0 + opacity, .9s power3.out (hero headline, section blocks)
- masked line: overflow-hidden wrap, inner y110% -> 0, .8s expo.out (card titles)
- tw-char: section H2 split to chars, opacity stagger .018 (aria-label on H2, spans aria-hidden)
- nav fade-down on load; card grids stagger .08
- Hover: image scale 1.06 / 700ms cubic-bezier(.32,.72,0,1)
- prefers-reduced-motion: init skipped entirely, page fully static/visible. No-JS: fully visible.
- No pins, no scrubs, no marquees. Match the reference's restraint.

## 7. Banned here
Em-dashes anywhere. Fake bookings/forms (booking is honestly mailto/tel). Invented facts (no surname for
Sólveig, no invented counts, 8 gestir not 8-9, sauna is extra fee). Stock imagery (client photos only).
Cream/serif default. Section-number eyebrows outside the real 01-04 sequence. Scroll cues.
