---
name: security-audit
description: Security audit for StatSarthi. Checks Firebase Security Rules, API key exposure, XSS vectors, auth bypass, and data privacy for government compliance. Use when asked about security or before deploying.
---

# Security Audit — StatSarthi

## When to Use
Before deploying. When asked "is this secure?" or when handling government data.

---

## Audit Areas

### 1. API Key Exposure (CRITICAL)
- [ ] Gemini API key is in `VITE_GEMINI_API_KEY` env var or localStorage — never hardcoded
- [ ] Firebase config values are in env vars (note: Firebase client config is designed to be public)
- [ ] No secret keys in client code
- [ ] No API keys in git history (`git log -p --all -S "key"`)
- [ ] `.env` is in `.gitignore`

### 2. Firebase Security Rules (CRITICAL)
- [ ] Firestore rules restrict read/write per user
- [ ] `gap_reports` collection: users can only read/write their OWN documents
- [ ] `learning_progress` collection: users can only update their OWN progress
- [ ] `quizzes` collection: only authenticated users can create quizzes
- [ ] Firebase Storage rules restrict uploads to authenticated users

Example secure Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /gap_reports/{reportId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
    match /learning_progress/{progressId} {
      allow read, write: if request.auth != null;
    }
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

### 3. XSS & Content Injection
- [ ] AI-generated content rendered via `react-markdown` (auto-escapes HTML)
- [ ] No `dangerouslySetInnerHTML` anywhere
- [ ] User inputs (role selection, quiz answers) are validated before use
- [ ] File uploads restricted to PDF/DOCX types and reasonable size limits

### 4. Auth & Session Security
- [ ] Protected routes check Firebase Auth state before rendering
- [ ] Admin pages verify admin role (not just auth)
- [ ] Session tokens handled by Firebase SDK (not manually stored)
- [ ] Logout clears all local state

### 5. Data Privacy (Government Compliance)
- [ ] Assessment results are private to the official
- [ ] Admin analytics show AGGREGATE data only (not individual scores)
- [ ] No PII in console.log or error reporting
- [ ] PDF uploads stored in Firebase Storage with security rules
- [ ] Privacy Policy page explains data handling

### 6. Input Validation
- [ ] File upload: max size enforced (e.g., 10MB)
- [ ] File upload: only `.pdf`, `.docx` extensions accepted
- [ ] Quiz answer submissions validated (index within bounds)
- [ ] Role/designation selection from predefined list (not free text)

---

## Audit Output Format

```
## Security Audit Results — StatSarthi
Date: YYYY-MM-DD

### 🔴 Critical (Fix Before Deploy)
1. [Issue description + file:line + fix]

### 🟡 Medium (Fix Soon)
1. [Issue description + file:line + fix]

### 🟢 Passed
1. [Check that passed]
```
