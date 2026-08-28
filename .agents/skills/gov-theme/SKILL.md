---
name: gov-theme
description: Retheme the app from dark gamer aesthetic (Slate/Cyan/Emerald) to a clean, professional government UI. Covers Tailwind config, color palette, typography, and component styling for gov.in credibility.
---

# Government Theme — Professional Retheme

## When to Use
After `strip-and-fork`. Apply this before building new features so everything looks right from the start.

---

## Step 1: Update Tailwind Config Colors

In `tailwind.config.ts`, replace the dark gamer palette:

```typescript
colors: {
  // Primary — Government Blue (inspired by gov.in, India.gov.in)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#1a56db',   // Main primary
    600: '#1e40af',
    700: '#1e3a8a',
    800: '#1e3a5f',
    900: '#0f172a',
  },
  // Accent — Saffron/Orange (Indian government identity)
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    400: '#fb923c',
    500: '#f97316',   // Saffron accent
    600: '#ea580c',
  },
  // Success — Green (competency achieved)
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  // Warning — Amber (competency gap)
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  // Danger — Red (critical gap)
  danger: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  // Neutral — Clean grays
  surface: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
}
```

## Step 2: Update Background & Base Styles

In `src/index.css`, change from dark theme defaults to light professional:

```css
body {
  @apply bg-white text-surface-900;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}
```

## Step 3: Component Style Updates

### Cards
**Before (dark gamer):**
```
bg-slate-900/80 border-slate-800 text-white
```

**After (government):**
```
bg-white border-surface-200 text-surface-900 shadow-sm
```

### Buttons
**Primary:** `bg-primary-500 hover:bg-primary-600 text-white`
**Secondary:** `bg-surface-100 hover:bg-surface-200 text-surface-700 border border-surface-300`

### Headers
**Before:** Cyan/Emerald gradient text
**After:** `text-primary-700 font-semibold` — simple, authoritative

### Badges
Use semantic colors:
- Gap badge: `bg-danger-50 text-danger-600 border-danger-200`
- Achievement badge: `bg-success-50 text-success-600 border-success-200`
- Info badge: `bg-primary-50 text-primary-600 border-primary-200`

## Step 4: Typography

Use clean, readable fonts:
- **Headings:** Inter or Plus Jakarta Sans (600-700 weight)
- **Body:** Inter (400 weight)
- **Data/Numbers:** Tabular numerals (JetBrains Mono for stats)

Add to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Step 5: Logo & Branding

- App name: **StatSarthi**
- Tagline: "AI-Powered Capacity Building for India's Official Statistical System"
- Use the Ashoka Chakra or a stylized "SS" monogram as favicon
- Header should show: StatSarthi logo + MoSPI reference + iGOT badge

## Step 6: Government Trust Signals

Add to the landing page:
- "Built for Smart India Hackathon 2026"
- "Problem Statement SIH26101 — MoSPI"
- "Aligned with Mission Karmayogi & iGOT Ecosystem"
- Clean footer with: About | Privacy Policy | Contact | SIH 2026

---

## Design Principles

1. **Light theme is mandatory.** Government officials use office monitors in well-lit rooms. Dark mode is a secondary option, not the default.
2. **No neon colors.** No cyan, no fuchsia, no glowing borders. Clean blues, whites, and grays.
3. **Data density matters.** Government users want to see information, not animation. Prioritize content over effects.
4. **Accessibility.** Minimum AA contrast ratios. Large touch targets. Clear labels.
5. **Mobile responsive.** Field officers may access on phones. Test at 375px width.
