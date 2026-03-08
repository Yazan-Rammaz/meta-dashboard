# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format with Prettier
```

No test framework is configured in this project.

## Environment

Copy `.env.example` to `.env` and set:

- `NEXT_PUBLIC_BASE_URL` — Backend API base URL (uses legacy CRA naming via
  `next.config.js`)
- `NEXT_PUBLIC_CLOUD_URL` — Cloudinary image base URL
- `NEXT_PUBLIC_BRAND_ICON_PATH`, `NEXT_PUBLIC_CATEGORY_ICON_PATH`,
  `NEXT_PUBLIC_BOUTIQUE_ICON_PATH`, `NEXT_PUBLIC_BOUTIQUE_BANNERS_PATH` —
  Cloudinary paths

## Architecture

### Tech Stack

- **Next.js 14** with App Router
- **Material-UI v5** for UI components
- **Zustand 4.5** for global state (auth + upload progress)
- **TanStack Query v5** for server state and data fetching
- **TypeScript** with `@/*` aliasing to `src/*`

### Directory Structure

```
src/
├── app/              # Next.js App Router: pages + API route handlers
├── features/         # Feature modules (auth, clients, roles, users, dashboard, languages)
│   └── <name>/
│       ├── actions.ts        # 'use server' Server Actions (create/update/delete + revalidatePath)
│       └── components/       # 'use client' page + form + list-item components
├── services/         # TanStack Query hook definitions (useQuery/useMutation wrappers)
├── lib/              # Shared infrastructure: apiFetch.ts (native fetch) + queryClient.ts
├── stores/           # Zustand stores: authStore.ts + uploadStore.ts
├── layouts/          # SidebarLayout + ClientLayout (auth guard)
├── components/       # Shared reusable components (List, Modal, Table, InfiniteScrollTrigger, etc.)
├── ui/               # Low-level UI primitives (Input, Modal, Spinner, etc.)
├── models/           # TypeScript interfaces for data models
├── types/            # Shared types (permissions enum, auth types)
├── contexts/         # React contexts (Sidebar, Translation, AppLang, ToastContext)
├── hooks/            # useAuth, useUpload (Zustand wrappers)
└── utils/            # ability (permission guard), translation_util, formValidation
```

### API Surface — `apiFetch`

All data fetching goes through `src/lib/apiFetch.ts` (native `fetch`, no Axios):

- **Server context** (Server Components, Server Actions, Route Handlers): reads
  `access_token` cookie via `next/headers`
- **Client context** (React hooks / service files): reads `access_token` from
  Zustand `authStore`
- On 401: calls `useAuthStore.getState().logout()` + `notifyError(message)`
  (client-side only)
- On other errors: calls `notifyError(message)` then throws `ApiFetchError`
- Exports: `apiFetch<T>`, `ApiFetchError`, `ServerActionResult<T>`

### TanStack Query Pattern

All API services live in `src/services/`. Each file exports standalone hook
functions built with `useQuery`/`useMutation` from TanStack Query v5, all using
`apiFetch`. Paginated queries accept `{ page?, initialData? }` and have a
matching infinite query (`useGet<Name>InfiniteQuery`) for infinite scroll.

Cache invalidation: `queryClient.invalidateQueries({ queryKey: ['<entity>'] })`
in Server Action's `onSuccess` or inline after `result.invalidateKeys`. The
`queryClient` singleton is in `src/lib/queryClient.ts` and includes
`QueryCache`/`MutationCache` with
`onError: (error) => notifyError(error.message)`.

### Authentication Flow

- Login: POST to `/api/auth/login` (Next.js Route Handler) → backend validates →
  sets HttpOnly `access_token` cookie + returns `{ user, access_token }` →
  `useLoginMutation.onSuccess` calls
  `useAuthStore.getState().setCredentials({ user, access_token })` (persisted to
  `localStorage` under key `auth-store`).
- Auth state is in Zustand `authStore` (persisted with `skipHydration: true`).
  `ClientLayout.tsx` calls `useAuthStore.persist.rehydrate()` on mount and
  redirects to `/login` if no user.
- Logout: POST to `/api/auth/logout` → deletes cookie → `authStore.logout()`
  clears state.
- `src/middleware.ts` is a Next.js middleware stub that currently does no
  server-side auth enforcement.

### Server Actions Pattern

Each feature has `src/features/<name>/actions.ts` with `'use server'` actions:

```ts
export async function createRoleAction(
    body: Partial<Role>,
): Promise<ServerActionResult<Role>> {
    const result = await apiFetch<Role>('/roles', {
        method: 'POST',
        body: JSON.stringify(body),
    });
    revalidatePath('/roles');
    return { success: true, data: result, invalidateKeys: ['roles'] };
}
```

Client components call these with `useTransition` and invalidate TanStack Query
cache on success.

### Toast Notification System

Custom toast system replacing `react-toastify`:

- `src/contexts/toastContext.tsx` — `ToastProvider` + `useToast()` hook; also
  exports module-level `notifyError()` for non-React callers (Axios/fetch
  interceptors, `queryClient` cache handlers)
- `src/components/Toast/index.tsx` — fixed-position MUI Alert stack
  (bottom-right, max 5 toasts)
- Severity levels: `showSuccess` (4s), `showInfo` (3s), `showError` (no
  auto-dismiss)

### Dual Pagination (Roles, Users, Clients)

Feature pages support two view modes with different pagination strategies:

- **List view**: Infinite scroll via `useGet<Name>InfiniteQuery()` +
  `<InfiniteScrollTrigger>` component
- **Table view**: Numbered pagination via `useGet<Name>Query({ page })` + MUI
  `Pagination` in `<TableComponent>`
- Switching to table view resets `page` to 1

### Permission System

- `src/types/permissions.ts` defines the `PermissionKey` enum (e.g.,
  `SUPER_ADMIN`, `clients.read`, `roles.create`).
- `src/utils/ability.tsx` exports `<CanCall permission="...">` — wrap any UI
  element with this to conditionally render based on the current user's
  permissions fetched from `/users/me/permissions`.
- `SUPER_ADMIN` permission bypasses all checks.

### Translation System

- `useTrans()` hook (`src/utils/translation_util.tsx`) returns a
  `(key: string) => string` function.
- Translations are in `src/utils/translations.json`, keyed by language code.
- Language preference is stored in `localStorage` under `app_lang`.
- The `TranslationContext` (from `src/contexts/appLangContext.tsx`) is what
  `useTrans()` reads from.
- Note: there are two translation contexts — `appLangContext` (used by
  `useTrans()`) and `translationContext` (used in `DashboardShared`). Both sync
  with the same `localStorage` key.

### Feature Page Pattern

Each feature in `src/features/<name>/components/` follows this pattern:

1. `<Name>Page.tsx` — `'use client'`; orchestrates TanStack Query hooks,
   `useTransition` for Server Actions, modal state, dual pagination, renders
   `TopNav` + list/table
2. `<Name>Form.tsx` — `'use client'`; form calling Server Actions via
   `useTransition`; `onClose` callback instead of add/edit callbacks
3. `<Name>ListItem.tsx` — individual item in the list view
4. `actions.ts` — `'use server'`; CRUD Server Actions + `revalidatePath`

`TopNav` from `src/features/shared/components/DashboardShared.tsx` is the shared
page header used across all feature pages — it accepts an `add_permission` prop
that wraps the add button in `<CanCall>`.

### Adding a New Feature Page

1. Create model in `src/models/<name>.ts` (include `PaginatedResponse<T>` from
   `src/models/pagination.ts`)
2. Create service in `src/services/<name>.ts` using
   `useQuery`/`useInfiniteQuery` + `apiFetch`
3. Create `src/features/<name>/actions.ts` with `'use server'` CRUD actions
4. Create feature components in `src/features/<name>/components/`
5. Create async Server Component page in `src/app/<name>/page.tsx` that
   prefetches with `apiFetch` and passes `initialData`
6. Create `src/app/<name>/error.tsx` error boundary
7. Add permission keys to `src/types/permissions.ts`
8. Add sidebar entry in
   `src/layouts/SidebarLayout/Sidebar/SidebarMenu/index.tsx`
