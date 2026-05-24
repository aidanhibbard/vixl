# Conventions

Vixl is a **Vue 3 + Vite + Vue Router + Tauri** desktop app. There is no Nuxt layer—no auto-imports, no SSR, no `useFetch` / `useAsyncData`, no `app/` or `server/` directories.

## Components

### Explicit imports

Register components by importing them. Use the `@/` alias (see `tsconfig` / `vite.config`).

```vue
<script setup lang="ts">
import AppHeader from '@/navigation/header/AppHeader.vue'
</script>

<template>
  <AppHeader />
</template>
```

### File names (two words)

Every first-party Vue component file uses **exactly two PascalCase words**. Do **not** repeat the parent folder in the filename—the path already namespaces it.

```text
src/views/IndexPage.vue              →  import, <IndexPage />
src/views/notes/NotesList.vue        →  import, <NotesList />
src/views/notes/NoteDetail.vue       →  import, <NoteDetail />
src/views/SettingsPage.vue           →  import, <SettingsPage />
src/navigation/header/AppHeader.vue  →  import, <AppHeader />
src/navigation/aside/AppSidebar.vue  →  import, <AppSidebar />
src/layouts/default.vue              →  layout; keep as default.vue (router/layout convention)
```

- Use **lowercase** folder segments for areas (`navigation/`, `views/`, `notes/`).
- Avoid single-word names (`Header.vue`, `Sidebar.vue`) and three-word names (`NotesIndexPage.vue`).
- **Dynamic `:is`:** import the component and pass the import, or use `defineAsyncComponent` with a static import path.

### Where things live

| Area | Path |
|------|------|
| Route views | `src/views/` |
| App chrome (sidebar, header) | `src/navigation/aside/`, `src/navigation/header/` |
| Layout shells | `src/layouts/` |
| Shared UI building blocks | `src/components/` |
| shadcn-vue primitives | `src/components/shadcn/ui/` (generated—do not rename to match two-word rules) |
| Composables | `src/composables/` |
| Pinia stores | `src/stores/` |
| Utilities | `src/lib/` |
| Routes | `src/router/` |

Do not reorganize `src/components/shadcn/**`. Compose shadcn primitives from first-party wrappers under `src/components/` or `src/navigation/`.

### Client-only app

The UI runs in a Tauri webview (and Vite dev server during development). Assume **browser APIs** and **no SSR**. Use `onMounted`, composables, Pinia, or Tauri APIs for data and persistence—not server render or Nuxt payload hydration.

## File naming (TypeScript and modules)

- Use **kebab-case** for non-Vue source files: `use-notes.ts`, `note-service.ts`, `note-id.ts`.
- Applies to `src/composables/`, `src/lib/`, `src/stores/`, and any `src/types/` or `src/interfaces/` directories.
- **Exceptions:**
  - Vue SFCs under `src/views/`, `src/components/`, `src/navigation/`, `src/layouts/` (two-word PascalCase filenames as above)
  - `src/router/index.ts`
- Do not add new `PascalCase.ts` or `camelCase.ts` module names outside those exceptions.

## Vue SFC block order

- Use `<script setup lang="ts">` only for script blocks.
- Order: `<script setup lang="ts">`, then `<template>`, then `<style>` only if needed (avoid—see styling).
- Do not use plain `<script>`, non-setup scripts, or JavaScript-only script blocks in first-party Vue files.

## Script setup content order

Group `script setup` content in this order:

1. Imports
2. Types and interfaces
3. Generic constants or static data: `const pageName = 'test'`
4. Composables
5. Reactive state (`ref`, `reactive`, `shallowRef`) and then `computed`

   ```ts
   const state = reactive<{ page: number }>({ page: 1 })
   ```

6. Method constants
7. Watchers and lifecycle / event hooks

Keep each group contiguous. Do not interleave methods with computed values or watchers.

## Methods

- Declare component and composable methods as constants.
- Prefer:

```ts
const handleSubmit = async (): Promise<void> => {
  // ...
}
```

- Avoid:

```ts
async function handleSubmit(): Promise<void> {
  // ...
}
```

## Composables

- Name composable files in kebab-case, for example `use-notes.ts`.
- Export composables as constant functions:

```ts
export const useNotes = () => {
  // ...
}
```

- Keep the composable body ordered as:
  - composables
  - state
  - computed
  - method constants
  - watchers / lifecycle hooks
  - return

## Persisted CRUD forms

For forms that read and write persisted state (settings, note editors, and similar):

- Review existing form patterns and use the **shadcn Vue MCP** before implementing.
- Share validation with **Zod** and **vee-validate** (`@vee-validate/zod`) when the same shape is used in multiple places; colocate schemas in `src/lib/schemas/` or next to the feature composable.
- **Initial load:** fetch in a composable (`onMounted` or immediate setup) or a Pinia store action; expose `loading`, `data`, and `error` refs.
- **After a successful mutation** (`POST` / `PUT` / `PATCH` / `DELETE`): refetch or update store state so the UI matches what was saved—do not leave forms on stale client-only state.
- **Loading:** Use a dedicated `ref` (or store `pending`) so the flow is: set loading `true` → mutate → refresh data → set loading `false` in `finally`.
- **Control flow:** Wrap mutation + refresh in `try` / `catch` / `finally`.
- **Toasts:** On success and failure, use `toast` from `vue-sonner`. Keep messages short and specific.

## Tables and filtered lists

For tables, paginated lists, filters, and search:

- Use shadcn Vue table primitives; consult the **shadcn Vue MCP** before implementing or changing a table.
- Keep list state in a single `reactive` object where practical (page, query, filters, sort).
- Load and refetch via a composable or store; watch the fields that should trigger a refetch.

```vue
<script setup lang="ts">
import { usePosts } from '@/composables/use-posts'

const state = reactive<{
  page: number
  query: string
}>({
  page: 1,
  query: '',
})

const { posts, status, error, refresh } = usePosts(
  computed(() => ({
    page: state.page,
    query: state.query,
  })),
)
</script>
```

- Prefer `AbortController` / `signal` on `fetch` when requests can overlap.

## Routing

- Routes live in `src/router/index.ts`.
- Views map one-to-one under `src/views/` (see route table in repo).
- Use `RouterLink` or `router.push({ name: 'notes' })` for navigation; wire sidebar/header links to named routes instead of `#` placeholders when adding nav.

## Styling and shadcn

First-party UI uses **shadcn-vue** primitives and **Tailwind utility classes** in templates only.

- Do **not** add `<style>` blocks (scoped or unscoped) to first-party Vue components.
- Do **not** use `@apply` in first-party component code.
- Do **not** use `:deep()` to patch shadcn internals—use supported `class` props, compose wrappers, or consult the shadcn Vue MCP.
- Prefer shadcn layout patterns (sidebar blocks, `SidebarMenuButton`, icons beside labels) over bespoke markup.
- Glass / translucent surfaces: Tailwind utilities such as `bg-white/85`, `dark:bg-black/85`, `backdrop-blur-xl`, `border-border/50`.
- Global base styles and tokens: `src/assets/styles/css/tailwind.css` only.
- Consult the **shadcn Vue MCP** before adding or substantially changing UI.

## Scope

These conventions apply to first-party app code. Do not rewrite vendored `shadcn` internals to force this structure.

## Generated and vendored code

- Do not edit generated or vendored shadcn components directly.
- Customize at the call site or via thin first-party wrappers.
- Use upstream docs, MCP references, or local examples before changing primitive usage.

## User feedback, loading, and errors

- Use explicit loading state for user-triggered async actions.
- Wrap mutations in `try` / `catch` / `finally` when failure is possible; use `toast` from `vue-sonner` for feedback.
- Always clear loading in `finally`.
- Keep toast messages short, specific, and user-facing.

## Logging

- Do not add routine `console.log` / `console.warn` / `console.error` in first-party frontend code except temporary debugging removed before merge.
- Backend or native logging belongs in `src-tauri/` (Rust), not in Vue SFCs.

## Types and interfaces

- Reusable contracts live in `src/types/` or `src/interfaces/`, not inside random components or stores.
- Do not use `any`. Prefer precise types, generics, `unknown` with narrowing, or small local interfaces.
- Keep inline typing minimal for one-off helpers.
- Move shared shapes to `src/types/` or `src/interfaces/`.
- Do not export types from store implementation files as the primary home for shared contracts.

## Exports

- Files should export one thing only, except barrel `index.ts` files.
- For multi-method modules, one method per file re-exported from a barrel is fine when it improves clarity.
