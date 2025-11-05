# student-wellness

This repository contains a small Next.js TypeScript demo for a student wellness app. It includes a stubbed "Login with University SSO" flow (mock API) and a simple auth context that stores a token and user in localStorage.

Quick start

1. Install dependencies

```bash
npm install
```

2. Start the dev server (port 3001 used in this workspace example)

```bash
npx next dev -p 3001
```

3. Open http://localhost:3001

What I added (high level)
- `hooks/useAuth.tsx` — AuthProvider and `useAuth()` hook.
- `pages/index.tsx` — login page with "Login with University SSO" button.
- `pages/api/login.ts` — mock API endpoint returning { user, token }.
- `pages/dashboard.tsx` — simple dashboard showing user info and logout.
- `pages/_app.tsx` — wraps app with `AuthProvider`.

Notes
- This is a stub SSO implementation — replace `/api/login` with your real SSO/OIDC flow when ready.
