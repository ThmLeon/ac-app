# Repository Guidelines

## Project Structure & Module Organization
- `src/routes` owns page-level SvelteKit routes; use nested `+page.svelte`/`+layout.ts` pairs to keep route state isolated.
- `src/lib` holds shared logic: `components` for UI primitives, `api` for Supabase bindings, `state` for stores, and `utils` for cross-cutting helpers.
- `static` serves public assets (logos, fonts) directly; keep large media in CDN-backed storage instead.
- Configuration lives at the project root (`svelte.config.js`, `tailwind.config.js`, `eslint.config.js`); update these in tandem when adding new tooling.

## Build, Test, and Development Commands
- `npm run dev` starts the Vite-powered dev server on port 3000.
- `npm run build` generates a production bundle using the Node adapter.
- `npm run preview` or `npm run start` runs the built output to validate deployment artifacts.
- `npm run check` performs `svelte-kit sync` plus `svelte-check` for type safety; pair it with `npm run lint` before every PR.
- `npm run genSupabaseTypes` refreshes strongly-typed Supabase definitions in `src/lib/api/supabase/database.types.ts`.

## Coding Style & Naming Conventions
- Prettier (with the Svelte plugin) enforces two-space indentation and trailing newline formatting; run `npm run format` to auto-fix.
- ESLint uses the Svelte kit config plus TypeScript rules; prefer explicit type annotations on public APIs.
- Name Svelte components in `PascalCase.svelte`, utility modules in `camelCase.ts`, and stores with a `use` or `create` prefix to signal intent.
- Co-locate Tailwind classes with markup; extract shared patterns into `src/lib/components` rather than global CSS.

## Data Fetching, Forms, and APIs
- Fetch data from the client with Svelte Query; avoid server-side fetching to keep interactions responsive and cache-aware.
- Define forms with schemas and Superforms so validation stays centralized and only complete payloads reach Supabase.
- Keep backend call helpers in `src/lib/api`; follow existing patterns and always route Supabase operations through `throwSupabaseErrorIfNeeded` or `throwSupabaseActionErrorIfNeeded`.
- Invoke the SharePoint Supabase Edge Function exclusively via the `callSharepointAPI` helper, and keep its call sites straightforward and readable.

## Testing Guidelines
- There is no dedicated unit test runner yet; rely on `npm run check` and targeted manual verification.
- When adding tests, prefer Vitest colocated beside the feature under `__tests__` or `.test.ts`, and scope mocks to avoid leaking Supabase credentials.
- Always document repro steps or screenshots in the PR when fixing user-visible issues.

## Commit & Pull Request Guidelines
- Follow the Conventional Commits pattern already in history (`feat:`, `fix:`, `chore:`) and keep scope focused per commit.
- Reference related issues in the commit body when available; skip noisy “WIP” commits by squashing before merge.
- PRs should include a concise summary, screenshots for UI changes, a checklist of commands run (dev, check, lint), and notes about Supabase or Azure configuration impacts.

## Environment & Security Notes
- Node 20+ is required; align local tooling via `.nvmrc` or `corepack` to avoid build drift.
- Keep Supabase project IDs, Azure credentials, and MSAL secrets in `.env` files ignored by git; never log them in client code.
- When syncing schema changes, update `genSupabaseTypes` output and verify that `src/lib/api` consumers still narrow types safely.
