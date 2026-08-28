---
name: perf-audit
description: Performance audit for StatSarthi. Checks bundle size, lazy loading, Gemini response times, Firebase/Firestore query efficiency, and rendering performance. Use when pages feel slow or before demo.
---

# Performance Audit — StatSarthi

## When to Use
"It's slow." "Pages take forever to load." Before demo day.

---

## Audit Areas

### 1. Bundle Size
```bash
npm run build
```
Check output for:
- [ ] Main chunk < 200KB gzipped
- [ ] No single route chunk > 100KB gzipped
- [ ] Heavy libraries (recharts, katex) are lazy loaded
- [ ] shadcn/ui components tree-shaken (only import what you use)
- [ ] Original EduResources pages (commented out) are NOT included in bundle (tree-shaking should handle this since they're not imported)

### 2. Code Splitting
- [ ] All pages use `lazy(() => import('./pages/statsarthi/...'))` in App.tsx
- [ ] Heavy components (RadarChart, QuizEditor) lazy loaded within pages
- [ ] `Suspense` fallback shows loading state

### 3. Gemini API Performance
- [ ] Streaming used for chat responses (`sendMessageStream`)
- [ ] Structured output (JSON schema) used for quizzes — reduces retries
- [ ] PDF base64 encoding happens client-side before API call
- [ ] Large PDFs: warn user if file > 5MB (Gemini has limits)
- [ ] Debounce rapid AI requests

### 4. Firebase/Firestore Query Performance
- [ ] Use Firestore indexes for compound queries
- [ ] Use `.where()` filters — don't fetch entire collections
- [ ] Use `limit()` for paginated queries (analytics dashboard)
- [ ] Cache Firestore reads with `getDocFromCache()` where appropriate
- [ ] Batch writes for bulk operations

### 5. Rendering Performance
- [ ] Radar chart re-renders only on data change (wrap in `useMemo`)
- [ ] Long quiz question lists use virtualization or pagination
- [ ] No layout shift during loading (skeleton placeholders)
- [ ] Animations use `transform`/`opacity` only (not `width`/`height`)

### 6. Image & Asset Optimization
- [ ] Logo/images in WebP format
- [ ] Fonts preloaded in `index.html`
- [ ] No unused CSS (Tailwind purges automatically)

---

## Quick Wins If Slow
1. Add `loading="lazy"` to images
2. Wrap radar chart data calculation in `useMemo`
3. Split admin analytics into separate lazy chunk
4. Use Firestore `limit(50)` on analytics queries
5. Reduce Gemini `temperature` for faster responses
