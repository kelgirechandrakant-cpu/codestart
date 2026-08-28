# StatSarthi Design System

> **Brand**: StatSarthi (MoSPI Capacity Building)
> **Vibe**: Government Professional, Clean, Accessible, Trustworthy
> **Stack**: React, Tailwind CSS, shadcn/ui, Lucide Icons

## 1. Core Principles
* **Credibility first:** The UI must feel like an official Indian government platform (MoSPI / NSSTA).
* **High Contrast:** Ensure text is readable for all age groups; avoid low-contrast gray-on-gray.
* **Information Density:** Officials need to see competency gaps and data clearly without excessive scrolling.

## 2. Color Palette
* **Primary (MoSPI Blue):** `bg-blue-700` (`#1a56db`) - Used for primary actions, active navigation, and brand headers.
* **Accent (Saffron/Orange):** `bg-orange-500` - Used sparingly for warnings, attention-grabbing badges, or highlights (Indian flag motif).
* **Background:** `bg-slate-50` or `bg-white` - Clean, clinical background to let data visualizations stand out.
* **Text:** `text-slate-900` for primary text, `text-slate-600` for secondary text.

## 3. Typography
* **Font Family:** Inter (or standard sans-serif system fonts).
* **Headings:** Bold, dark slate, sentence case. 
* **Spacing:** Standard Tailwind spacing, leaning towards slightly tighter padding for data tables and dashboards.

## 4. Components (shadcn/ui based)
* **Cards:** White background, subtle border (`border-slate-200`), soft shadow (`shadow-sm`), rounded corners (`rounded-lg`).
* **Buttons:** 
  - Primary: `bg-blue-700 hover:bg-blue-800 text-white`
  - Secondary/Outline: `border-blue-700 text-blue-700 hover:bg-blue-50`
* **Badges (FRAC Levels):**
  - Aware: `bg-slate-100 text-slate-700`
  - Apply: `bg-sky-100 text-sky-700`
  - Advise: `bg-blue-100 text-blue-700`
  - Expert: `bg-indigo-100 text-indigo-700`
  - Ustad: `bg-purple-100 text-purple-700`

## 5. Layout & Navigation
* **Navbar:** White background with bottom border. Logo on the left, navigation links centered, user profile on the right.
* **Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
* **Dashboards:** Use grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) to present competency metrics and radar charts side-by-side.

## 6. AI & Interactions
* **Loading States:** Use descriptive loading text (e.g., "Analyzing competency gaps via Gemini...").
* **Feedback:** Use `toast` notifications for success/error states.
* **Data Viz:** Recharts for Radar and Bar charts, always using MoSPI Blue as the primary data color.

