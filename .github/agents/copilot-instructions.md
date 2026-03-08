# whatsapp-meta-dashboard Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-07

## Active Technologies

- TypeScript 5 + Node.js 20 (Next.js 14 App Router runtime) + Next.js 14 App
  Router, Material-UI v5, TanStack Query (server-first-refactor)

## Project Structure

```text
src/
tests/
```

## Commands

npm test; npm run lint

## Code Style

TypeScript 5 + Node.js 20 (Next.js 14 App Router runtime): Follow standard
conventions

## Recent Changes

- server-first-refactor: Added TypeScript 5 + Node.js 20 (Next.js 14 App Router
  runtime) + Next.js 14 App Router, Material-UI v5, TanStack Query

<!-- MANUAL ADDITIONS START -->

## server-first-refactor: New Architecture Patterns

### New Dependencies (install first)

- `zustand@^4.5.0` — replaces Redux Toolkit for UI/auth/upload state

### Removed Dependencies (after migration complete)

- `axios` → use `apiFetch` from `src/lib/apiFetch.ts`
- `@reduxjs/toolkit`, `react-redux` → use Zustand stores in `src/stores/`
- `react-toastify` → use `useToast()` from `src/contexts/toastContext.tsx`

### Key New Files

- `src/lib/apiFetch.ts` — typed native fetch; auto-injects cookie (server) or
  Bearer (client)
- `src/stores/authStore.ts` — Zustand auth store with `persist` +
  `skipHydration`
- `src/stores/uploadStore.ts` — Zustand upload progress store (in-memory only)
- `src/contexts/toastContext.tsx` — Toast context: `showSuccess`, `showError`,
  `showInfo`
- `src/features/<name>/actions.ts` — Server Actions per feature; returns
  `ServerActionResult`
- `src/app/api/auth/login/route.ts` — Login proxy that sets HttpOnly
  `access_token` cookie
- `src/app/<route>/error.tsx` — Per-segment error boundaries (must be
  `'use client'`)

### Patterns

- Server Component data fetch: `await apiFetch<T>('/endpoint')` — no directive,
  no hook
- Client mutation:
  `startTransition(async () => { const r = await someAction(); if (r.success) { queryClient.invalidateQueries(...); showSuccess(...); } })`
- Infinite scroll: `useInfiniteQuery` with `initialPageParam: 1` (v5 required
  field)
- Numbered pagination: `useQuery` with `placeholderData: keepPreviousData` (v5
  import)
- Auth read: `useAuthStore((s) => s.user)` or
`useAuthStore.getState().access_token`
  <!-- MANUAL ADDITIONS END -->
