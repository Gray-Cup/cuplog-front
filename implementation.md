# CupLog — Design Implementation Guide
### Landing Page for a Specialty Coffee Cupping Score Application

---

## 1. Brand Identity

### Concept
**CupLog** is where the rigor of professional coffee cupping meets the warmth of craft. The design inherits Ozone Coffee's editorial DNA — peach warmth, bold typography, clean structure — but adds a **data layer**: score cards, flavor wheels, session logs. Think of it as *a Field Notes notebook crossed with a laboratory report*.

### Brand Personality
- **Expert but approachable** — for baristas, Q-graders, and enthusiastic amateurs alike
- **Analogue warmth, digital precision** — handwritten-feeling forms, but perfectly structured data
- **Obsessive about detail** — because cupping *is* obsessive about detail

### Tagline Options
- *"Score every sip."*
- *"Your cupping journal, perfected."*
- *"Precision in every cup."*

---

## 2. Colour System

### Primary Palette

| Token | Value | Usage |
|---|---|---|
| `--color-peach` | `#F2C4A0` | Hero background, header bg, warm sections |
| `--color-peach-dark` | `#E8A87C` | Hover states, accents on peach bg |
| `--color-ink` | `#111008` | Primary text, nav, headings |
| `--color-paper` | `#FDFAF5` | Page body background (warm off-white, not pure white) |
| `--color-white` | `#FFFFFF` | Cards, modals, secondary CTAs |
| `--color-rule` | `#D4C4B0` | Horizontal dividers, borders |

### Accent / Score Colours
Used for flavour profile tags and cupping score indicators:

| Token | Value | Usage |
|---|---|---|
| `--color-score-citrus` | `#F5E6A3` | Citrus / bright flavour tag |
| `--color-score-floral` | `#E8D5F0` | Floral tag |
| `--color-score-nutty` | `#F0DEC0` | Nutty / caramel tag |
| `--color-score-fruity` | `#F5C4C4` | Fruity / berry tag |
| `--color-score-cocoa` | `#D4C0B0` | Cocoa / chocolate tag |
| `--color-score-green` | `#C8DDB8` | Vegetal / herbal tag |

These pastel swatches mirror Ozone's per-origin label system — each cupping session card can carry a colour coded to its dominant flavour.

### CSS Variables Block

```css
:root {
  /* Core */
  --color-peach: #F2C4A0;
  --color-peach-dark: #E8A87C;
  --color-ink: #111008;
  --color-paper: #FDFAF5;
  --color-white: #FFFFFF;
  --color-rule: #D4C4B0;

  /* Scores */
  --color-score-citrus: #F5E6A3;
  --color-score-floral: #E8D5F0;
  --color-score-nutty: #F0DEC0;
  --color-score-fruity: #F5C4C4;
  --color-score-cocoa: #D4C0B0;
  --color-score-green: #C8DDB8;

  /* Functional */
  --color-cta-primary-bg: #111008;
  --color-cta-primary-text: #FFFFFF;
  --color-cta-secondary-bg: #FFFFFF;
  --color-cta-secondary-text: #111008;
  --color-cta-secondary-border: #111008;
}
```

---

## 3. Typography

### Font Stack

**Display / Hero / Wordmark:** `Instrument Serif`
**Body / Nav / Labels / Data:** `Instrument Sans`

Both are available via `next/font/google` and designed as a matched pair — this is the closest free match to Ozone's editorial warmth.

```tsx
// app/layout.tsx
import { Instrument_Serif, Instrument_Sans } from 'next/font/google'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${instrumentSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

### Type Scale

```css
:root {
  --font-display: var(--font-display), 'Georgia', serif;
  --font-body: var(--font-body), 'Helvetica Neue', sans-serif;

  /* Scale */
  --text-xs:   0.75rem;   /* 12px — metadata, timestamps */
  --text-sm:   0.875rem;  /* 14px — labels, tags */
  --text-base: 1rem;      /* 16px — body copy */
  --text-lg:   1.125rem;  /* 18px — sub-headings */
  --text-xl:   1.375rem;  /* 22px — card titles */
  --text-2xl:  1.75rem;   /* 28px — section headings */
  --text-3xl:  2.5rem;    /* 40px — large section headings */
  --text-hero: clamp(3.5rem, 8vw, 7rem); /* Hero — fluid */
}
```

### Typography Rules
- **Logo "CupLog"** — Instrument Serif, bold weight, tracked slightly. Consider letter-spacing: 0.02em
- **Hero headline** — Instrument Serif italic or regular, fluid size (clamp), lowercase, left-aligned, no pretension
- **Section labels** — Instrument Sans ALL CAPS, font-weight: 700, letter-spacing: 0.12em, small size (~13px)
- **Nav links** — Instrument Sans, regular weight, 15–16px
- **Score numbers** — Instrument Sans, tabular-nums, monospaced feel for alignment
- **Product/Session names** — Instrument Sans, ALL CAPS, bold

---

## 4. Spacing & Layout System

### Base Grid
- Max content width: `1280px`
- Page padding (horizontal): `clamp(1.5rem, 5vw, 4rem)`
- Section vertical padding: `clamp(4rem, 8vw, 8rem)`
- Column gap in product grids: `0` (use thin border rules between columns, not gaps — this is Ozone's signature)

### Spacing Tokens

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;
}
```

### Key Layout Patterns
- **Two-row header** (logo/CTA row + nav row, separated by rules)
- **Full-bleed section backgrounds** (peach → white → peach alternation)
- **Vertical rule dividers** between card columns (not gaps)
- **Left-aligned everything** — no centred hero text
- **Generous negative space** in hero — text occupies left 50–60%, right side breathes

---

## 5. Navigation Component

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ CUPLOG                                    ● START CUPPING →     │  ← Row 1 (peach bg)
├─────────────────────────────────────────────────────────────────│
│ Features    How it Works    Pricing    About       Log in  Sign up │  ← Row 2 (peach bg)
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Notes
- Full-width `border-bottom: 1px solid var(--color-ink)` between rows
- `position: sticky; top: 0; z-index: 100`
- Background: `var(--color-peach)` — stays peach even on scroll (Ozone does this)
- Logo: Instrument Serif, `font-size: 1.5rem`, `letter-spacing: 0.04em`
- "● START CUPPING →" — the bullet dot (●) before the CTA text is a signature Ozone detail. Keep it.
- CTA in nav: no button background — just bold text with `→` arrow and the bullet prefix
- Underline nav links on hover, no other decoration

```tsx
// components/Nav.tsx sketch
<header className="sticky top-0 bg-peach z-50">
  <div className="nav-top border-b border-ink flex justify-between items-center px-page py-4">
    <a href="/" className="font-display text-2xl tracking-wide">CupLog</a>
    <a href="/signup" className="font-body font-bold text-sm tracking-wide uppercase flex gap-2 items-center">
      <span>●</span> Start Cupping <span>→</span>
    </a>
  </div>
  <div className="nav-bottom flex justify-between items-center px-page py-3">
    <nav className="flex gap-8 text-sm">
      <a href="#features">Features</a>
      <a href="#how-it-works">How it Works</a>
      <a href="#pricing">Pricing</a>
      <a href="#about">About</a>
    </nav>
    <div className="flex gap-6 text-sm">
      <a href="/login">Log in</a>
      <a href="/signup">Sign up</a>
    </div>
  </div>
</header>
```

---

## 6. Page Sections — Landing Page

### Section 1: Hero

**Background:** `var(--color-peach)`
**Layout:** Full viewport height or 85vh minimum

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Score every                                                      │
│  cup.                                                             │
│                                                                   │
│  The cupping log built for people who                             │
│  care what's in their cup. Track flavour,                         │
│  score sessions, and build your palate.                           │
│                                                                   │
│  [  Start for free →  ]  [  See how it works →  ]                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Typography:**
- Headline: Instrument Serif, `--text-hero`, regular or italic, lowercase, `line-height: 0.95`
- Subtext: Instrument Sans, `--text-lg`, regular weight, `max-width: 520px`, `margin-top: 2rem`

**Buttons (side by side):**
- Primary: Black bg, white text, `padding: 1rem 2rem`, no border-radius (sharp corners), `→` suffix
- Secondary: White bg, black text, black border, same dimensions

**Background detail:** Optionally add a very subtle grain texture overlay (`opacity: 0.04`) using CSS noise for warmth — avoids the flat digital look.

---

### Section 2: "FRESHEST SESSIONS" — Session Card Grid

Mirrors Ozone's "FRESHEST ARRIVALS" product grid exactly, but for cupping sessions.

**Background:** `var(--color-paper)` (off-white)

**Section header:**
```
RECENT SESSIONS                    ←  ALL CAPS, 13px, 0.12em tracking, bold
────────────────────────────────── ←  full-width horizontal rule
```

**Grid:** 4 columns, separated by `1px solid var(--color-rule)` vertical lines, no gap

Each session card:
```
┌──────────────────────┐
│                      │
│   [Session Image]    │  ← Square image or illustrated flavour wheel preview
│   or color swatch    │
│                      │
├──────────────────────┤
│ ETHIOPIA: YIRGACHEFFE│  ← ALL CAPS, Instrument Sans bold
│ Natural Process      │  ← subtitle
│                      │
│ Score: 87.25    ────  │  ← score prominent, then rule
│                      │
│ Fragrance    8.5     │  ← metadata rows, two-col
│ Flavour      8.75    │
│ Acidity      8.0     │
│ Body         8.25    │
│ Aftertaste   8.5     │
│                      │
│ [  View Session  ]   │
└──────────────────────┘
```

**Card colour coding:** Each card has a pastel background swatch for the dominant flavour (matching the `--color-score-*` tokens) — just like Ozone's per-origin bag label colours.

---

### Section 3: Feature Categories (Shop Coffee equivalent)

4 category tiles in a 2×2 or 4×1 row, text-heavy, no icons.

```
┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐
│                  │                  │                  │                  │
│  Cupping Sessions│  Score History   │  Flavour Wheel   │  Team Cuppings   │
│                  │                  │                  │                  │
│  Log every       │  Track your      │  Visual tasting  │  Invite your     │
│  session with    │  scores over     │  notes with      │  team. Score     │
│  SCA-standard    │  time and see    │  the full SCA    │  together.       │
│  scoring forms.  │  how your palate │  flavour wheel   │  Compare and     │
│                  │  develops.       │  built in.       │  discuss.        │
│  Start logging → │  View history →  │  Explore wheel → │  Invite team →   │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

Separated by vertical rules. No icons, no rounded cards, no shadows. Pure editorial.

---

### Section 4: Marquee / Ticker

Replicates Ozone's scrolling rewards ticker. Use for social proof or feature highlights.

```
→ SCA-Standard Scoring → 10 Attributes → Team Sessions → Export to PDF → Flavour Wheel → Built for Q-Graders → Free to Start →
```

**Style:** Peach background, ink text, Instrument Sans, ALL CAPS, continuous loop, slow scroll (40s duration). This breaks the page rhythm and adds kinetic energy.

```css
.marquee-track {
  display: flex;
  gap: 3rem;
  animation: marquee 40s linear infinite;
  white-space: nowrap;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

---

### Section 5: "How It Works" — Our Story equivalent

3-column editorial section with illustration or photography.

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│                      │                      │                      │
│  [Illustration]      │  [Illustration]      │  [Illustration]      │
│                      │                      │                      │
│  Log                 │  Score               │  Reflect             │
│                      │                      │                      │
│  Start a cupping     │  Rate 10 SCA         │  Review your         │
│  session in seconds. │  attributes with     │  sessions over       │
│  Add your coffees,   │  precision sliders.  │  time. See your      │
│  origin, process,    │  Add tasting notes   │  palate develop.     │
│  and roast details.  │  and flavour tags.   │  Export. Share.      │
│                      │                      │                      │
│  [See the form →]    │  [Try scoring →]     │  [View dashboard →]  │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

**Illustrations:** Commission or use the same Ilya Milstein-style editorial illustration aesthetic — warm, flat, character-driven. For MVP, use high quality photography of cupping equipment (cupping bowls, spoons, score sheets) with warm tones.

---

### Section 6: Score Breakdown Hero (large brand statement)

Mirrors Ozone's large manifesto text block.

**Background:** `var(--color-peach)`

```
We're unapologetically obsessed with
the language of coffee — and the
numbers behind every great cup.
```

Instrument Serif, `clamp(2rem, 4vw, 3.5rem)`, regular weight, left-aligned, `max-width: 900px`. No CTA here — let it breathe.

Small supporting text below: "Find your score → [Take the flavour quiz]" — echoes Ozone's "Find your flavour" link.

---

### Section 7: Flavour Selector (Find Your Flavour equivalent)

Horizontal tab selector for flavour categories. User clicks a flavour to see matching coffees/sessions.

```
[ Citrus ]  [ Floral ]  [ Nutty ]  [ Fruity ]  [ Cocoa ]  [ Spicy ]  [ Sweet ]
```

Each tab on click reveals:
- A flavour description in italic Instrument Serif
- A score preview or sample session card
- "Show me sessions like this →" link

**Tab style:** Simple text tabs, no pill backgrounds. Active state gets an underline (2px solid ink). No box shadows or rounded tabs.

---

### Section 8: Pricing

Simple 3-column pricing, same no-nonsense aesthetic. No rounded cards, thin border rules.

```
┌──────────────────┬──────────────────┬──────────────────┐
│                  │                  │                  │
│  FREE            │  PRO             │  TEAM            │
│                  │  £9 / month      │  £29 / month     │
│                  │                  │                  │
│ ──────────────── │ ──────────────── │ ──────────────── │
│ 10 sessions/mo   │ Unlimited        │ Unlimited        │
│ Basic scoring    │ sessions         │ sessions         │
│ Flavour tags     │ Full SCA form    │ Up to 10 members │
│                  │ PDF export       │ Shared sessions  │
│                  │ History graphs   │ Role management  │
│                  │                  │ Priority support │
│ ──────────────── │ ──────────────── │ ──────────────── │
│ [  Get started ] │ [  Start trial ] │ [  Contact us  ] │
└──────────────────┴──────────────────┴──────────────────┘
```

---

### Section 9: Footer

```
┌────────────────────────────────────────────────────────────────┐
│ CupLog                                          [B Corp-style  │
│ Score every cup.                                 trust badge]  │
│                                                                │
├──────────────────┬──────────────────┬──────────────────────────┤
│ Product          │ Support          │ Company                  │
│                  │                  │                          │
│ Features         │ Help Centre      │ About                    │
│ Pricing          │ Contact          │ Blog                     │
│ Changelog        │ Privacy Policy   │ Careers                  │
│ Roadmap          │ Terms            │ Twitter / X              │
│                  │                  │ Instagram                │
├──────────────────┴──────────────────┴──────────────────────────┤
│ Sign up for cupping tips and new feature updates               │
│ [  your@email.com                          Subscribe →  ]      │
├────────────────────────────────────────────────────────────────┤
│ © 2025 CupLog · All rights reserved         Feeling bold?      │
│                                             Try a blind cup →  │
└────────────────────────────────────────────────────────────────┘
```

**Note:** The "Feeling bold? Try a blind cup →" footer easter egg mirrors Ozone's "Feeling adventurous? Try a lucky dip coffee" — keep this personality detail, it's charming.

---

## 7. Component Library Reference

### Horizontal Rule
```css
.rule {
  width: 100%;
  height: 1px;
  background: var(--color-ink);
  border: none;
  margin: 0;
}

.rule--light {
  background: var(--color-rule);
}
```

### Section Label
```css
.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink);
  margin-bottom: var(--space-2);
}
```

### Primary Button (Sharp, Black)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--color-cta-primary-bg);
  color: var(--color-cta-primary-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1.5px solid var(--color-ink);
  border-radius: 0; /* SHARP — no radius */
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-primary:hover {
  background: var(--color-peach-dark);
  color: var(--color-ink);
}
```

### Secondary Button (White / Outlined)
```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--color-cta-secondary-bg);
  color: var(--color-cta-secondary-text);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.02em;
  border: 1.5px solid var(--color-ink);
  border-radius: 0;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-secondary:hover {
  background: var(--color-paper);
}
```

### Score Tag / Flavour Badge
```css
.score-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 0; /* sharp */
}

.score-tag--citrus  { background: var(--color-score-citrus); }
.score-tag--floral  { background: var(--color-score-floral); }
.score-tag--nutty   { background: var(--color-score-nutty); }
.score-tag--fruity  { background: var(--color-score-fruity); }
.score-tag--cocoa   { background: var(--color-score-cocoa); }
.score-tag--green   { background: var(--color-score-green); }
```

### Vertical Divider (between grid columns)
```css
.col-divider {
  width: 1px;
  background: var(--color-rule);
  align-self: stretch;
}
```

### Score Display (Large Number)
```css
.score-display {
  font-family: var(--font-body);
  font-size: 3.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--color-ink);
}

.score-display__label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-ink);
  opacity: 0.6;
  margin-bottom: var(--space-1);
}
```

---

## 8. Tailwind Config (if using Tailwind)

```js
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        peach: '#F2C4A0',
        'peach-dark': '#E8A87C',
        ink: '#111008',
        paper: '#FDFAF5',
        rule: '#D4C4B0',
        score: {
          citrus: '#F5E6A3',
          floral: '#E8D5F0',
          nutty:  '#F0DEC0',
          fruity: '#F5C4C4',
          cocoa:  '#D4C0B0',
          green:  '#C8DDB8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '0.95' }],
      },
      borderRadius: {
        none: '0px', // enforce sharpness as default
      },
      letterSpacing: {
        label: '0.12em',
        wide:  '0.04em',
      },
    },
  },
}

export default config
```

---

## 9. Animation & Motion

### Philosophy
Keep motion minimal and purposeful — one orchestrated page load, subtle hovers. No bouncy spring animations. No parallax gimmicks. The brand is editorial, not playful.

### Page Load Stagger
```css
/* Hero text reveal — stagger children */
.hero-headline {
  animation: fadeUp 0.6s ease forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.hero-sub {
  animation: fadeUp 0.6s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.hero-ctas {
  animation: fadeUp 0.6s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Card Hover
```css
.session-card:hover .session-card__image {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}
```

### Score Counter Animation
When a score number enters the viewport, count up from 0 to the final score:
```tsx
// Use Intersection Observer + useState to trigger
// count from 0 to 87.25 over 800ms with easeOut
```

### Nav Underline Hover
```css
nav a {
  position: relative;
}

nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-ink);
  transition: width 0.2s ease;
}

nav a:hover::after {
  width: 100%;
}
```

---

## 10. Responsive Behaviour

| Breakpoint | Changes |
|---|---|
| `< 640px` | Single column grid. Hero headline drops to `clamp(2.5rem, 10vw, 4rem)`. Nav collapses to hamburger. |
| `640–1024px` | 2-column session grid. Category tiles go 2×2. |
| `> 1024px` | Full 4-column grid. All horizontal layouts active. |

### Mobile Nav
- Hamburger opens a full-screen overlay on peach background
- Links stack vertically, large Instrument Serif display size
- Same "● START CUPPING →" CTA at bottom

---

## 11. Page Structure — File Organisation (Next.js App Router)

```
app/
├── layout.tsx              ← fonts, global CSS, sticky nav
├── page.tsx                ← landing page (all sections)
├── globals.css             ← CSS variables, base styles
components/
├── Nav.tsx                 ← two-row sticky header
├── HeroSection.tsx         ← full-bleed peach hero
├── SessionGrid.tsx         ← 4-col session cards
├── CategoryTiles.tsx       ← 4 feature tiles
├── MarqueeTicker.tsx       ← scrolling ticker
├── HowItWorks.tsx          ← 3-col editorial section
├── ManifestoText.tsx       ← large brand statement on peach
├── FlavorSelector.tsx      ← tabbed flavour browser
├── PricingSection.tsx      ← 3-col pricing
├── Footer.tsx              ← multi-col footer
├── ui/
│   ├── Button.tsx          ← primary + secondary variants
│   ├── ScoreTag.tsx        ← colour-coded flavour badge
│   ├── SectionLabel.tsx    ← ALL CAPS label + rule
│   └── ScoreDisplay.tsx    ← large score number component
```

---

## 12. Key Design Rules (Quick Reference)

1. **No border-radius anywhere** — all elements are sharp rectangles
2. **No drop shadows** — depth comes from colour contrast, not shadows
3. **Vertical rules, not gaps** — between grid columns, use `1px border`, not `gap`
4. **Peach alternation** — sections alternate between `--color-peach` and `--color-paper`
5. **ALL CAPS for labels** — section titles, product names, nav CTAs
6. **Bullet dot prefix (●)** — before the primary nav CTA only
7. **Arrow suffix (→)** — on all CTA links and buttons
8. **Left-align everything** — no centred hero text, ever
9. **Thin horizontal rules** — between section label and content, always
10. **Score colours** — always use the pastel `--color-score-*` tokens, never random colours
11. **Instrument Serif for impact** — hero, manifesto, large pull quotes only
12. **Instrument Sans for everything else** — nav, body, labels, scores, metadata