---
name: idea-submission
description: Generate the SIH 2026 Idea Submission document for SIH26101. Covers problem understanding, proposed solution, architecture, feasibility, and impact — formatted for the SIH portal submission.
---

# Idea Submission — SIH 2026 (Deadline: 20 Sept 2026)

## When to Use
When preparing the idea submission document for the SIH portal. Can be done in parallel with building.

---

## What the SIH Portal Requires

The idea submission typically needs:

1. **Problem Understanding** — Restate the problem in your own words, show domain knowledge
2. **Proposed Solution** — What you're building, how it solves the problem
3. **Technical Architecture** — Stack, data flow, system design
4. **Feasibility & Innovation** — Why this approach works, what's novel
5. **Impact & Scalability** — Who benefits, how it scales beyond MoSPI
6. **Team Details** — Members, skills, mentor

---

## Section 1: Problem Understanding

Write this to show judges you understand MoSPI's actual problem:

**Key points to hit:**
- India's Official Statistical System employs thousands of officers across CSO, NSSO, and state directorates
- NSSTA (National Statistical Systems Training Academy) conducts training but lacks AI-powered tools to identify WHO needs WHAT training
- The Capacity Building Commission requires Annual Capacity Building Plans (ACBP) — but there's no automated way to assess competency gaps at scale
- iGOT Karmayogi has 1.7 crore+ users and thousands of courses, but MoSPI officials have no personalized pathway through this ecosystem
- Training materials (manuals, guidelines, SQAF documents) exist but there's no way to auto-generate assessments from them

**Domain terms to use:** FRAC framework, Karmayogi Competency Model (KCM), SQAF, NSSTA, Capacity Development Division, Mission Karmayogi, Official Statistical System

---

## Section 2: Proposed Solution — StatSarthi

Structure around the 3 pillars:

### Pillar 1: AI Competency Gap Finder
- Official selects role → takes AI diagnostic assessment → gets radar chart showing gaps
- Uses FRAC-mapped competency requirements per role
- 4 competency domains (Statistical, Technical, Digital Governance, Behavioural) with 28+ areas specific to MoSPI

### Pillar 2: iGOT Pathway Recommender
- Maps gaps to curated iGOT Karmayogi courses
- Prioritized learning plan (biggest gaps first)
- Progress tracking with milestone checkpoints
- Deep-links to iGOT portal for seamless ecosystem integration

### Pillar 3: AI Quiz/MCQ Generator
- Upload any training PDF → AI generates Bloom's Taxonomy-tagged MCQs
- Editable, exportable (PDF/CSV), assignable as assessments
- Feeds results back into competency gap model (continuous improvement loop)

---

## Section 3: Technical Architecture

**Stack:**
- Frontend: React 18 + Vite + TypeScript + shadcn/ui
- Backend: Firebase (Firestore + Auth + Storage)
- AI: Google Gemini 2.5 Flash with structured JSON output
- Charts: Recharts (radar charts for gap visualization)
- PDF Processing: Base64 encoding → Gemini inline data grounding

**Key technical differentiators:**
- Gemini's structured output (JSON schema) ensures MCQs are always properly formatted
- PDF grounding means the AI reads the ACTUAL uploaded material, not generic knowledge
- Bloom's Taxonomy tagging ensures assessments test multiple cognitive levels
- Firestore enables real-time analytics queries (aggregate gaps by department, role, competency)

---

## Section 4: Feasibility & Innovation

**Feasibility:**
- Built on proven stack (React + Firebase + Gemini) — team has shipped a production app (pptmaker.co.in) with similar architecture
- Core AI pipeline (PDF → Gemini → structured output) is already working in the existing codebase
- Can be deployed on Firebase Hosting or any cloud (Vercel, Railway, or government NIC infrastructure)

**Innovation:**
- First platform to combine FRAC competency mapping + AI assessment + iGOT integration for any ministry
- Bloom's Taxonomy-aware quiz generation — not just random MCQs, but cognitively structured assessments
- Continuous feedback loop: assessment results → updated gaps → refined recommendations

---

## Section 5: Impact & Scalability

**Immediate impact (MoSPI):**
- NSSTA can identify training priorities across 10,000+ statistical officers
- Training coordinators save hours by auto-generating assessments from existing materials
- Officials get personalized learning paths instead of generic training mandates

**Scalability:**
- The competency framework is pluggable — swap MoSPI competencies for any ministry's FRAC data
- Works for all 27+ ministries on iGOT Karmayogi
- Can serve state/UT statistical directorates (Support for Statistical Strengthening scheme)
- Multi-language support possible via Gemini's multilingual capabilities

---

## Section 6: Team Details

Fill in:
- Team Name: [YOUR TEAM NAME]
- College: [YOUR COLLEGE]
- Team Leader: Chandrakant Kelgire
- Mentor: [FACULTY MENTOR NAME]
- Members: [6 MEMBER NAMES + ROLES]

---

## Submission Checklist

- [ ] Problem understanding shows MoSPI domain knowledge
- [ ] Solution clearly maps to all 3 PS requirements (gaps, iGOT, MCQs)
- [ ] Architecture diagram included
- [ ] Feasibility backed by existing working codebase
- [ ] Impact section mentions scalability to other ministries
- [ ] Team details complete with mentor
- [ ] Video demo (if required) — record Screen 4 (radar chart) and Screen 6 (quiz generator)
