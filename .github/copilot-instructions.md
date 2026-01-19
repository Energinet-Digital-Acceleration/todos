# Copilot Instructions

## Project Overview

Workshop demo todo-app built with **Svelte 5**, **Tailwind CSS 4**, and **Bun**. Used for teaching VS Code Copilot customization (Rules, Skills, Agents).

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Start Vite dev server
bun run build      # Production build
bun run check      # Svelte type checking
bun run lint       # ESLint
```

## Architecture

**State flow:** `storage.ts` → `todos.ts` → Components

- [src/stores/storage.ts](src/stores/storage.ts) - Unified localStorage persistence (`todos-storage` key)
- [src/stores/todos.ts](src/stores/todos.ts) - Svelte writable store with CRUD: `addTodo`, `toggleTodo`, `deleteTodo`, `updateTodo`, `clearCompleted`
- [src/App.svelte](src/App.svelte) - Root layout + theme management via `$state`/`$effect`
- [src/lib/](src/lib/) - UI components (`TodoInput`, `TodoList`)

## Svelte 5 Patterns (Required)

Full guide: [.github/instructions/svelte-coding-standards.instructions.md](.github/instructions/svelte-coding-standards.instructions.md)

**Critical conventions:**
- `$state()` for reactive state, `$derived()` for computed values
- `$effect()` sparingly - only for DOM/external side effects
- Event handlers: `onclick` (not `on:click`)
- Snippets instead of slots
- TypeScript with `lang="ts"` and `interface Props`

**Store pattern example from [todos.ts](src/stores/todos.ts):**
```typescript
function createTodosStore() {
  const { subscribe, update } = writable<Todo[]>(loadStorage().todos)
  subscribe((todos) => saveStorage({ todos }))  // Auto-persist
  return { subscribe, addTodo: (title) => update(todos => [...]) }
}
export const { addTodo, toggleTodo } = todos  // Export functions directly
```

## Styling Conventions

- **Tailwind CSS 4** with dark mode (`dark:` prefix)
- Theme toggle in App.svelte respects system preference with localStorage override
- Consistent color palette: `stone-*` (light), `neutral-*` (dark)
- Focus states: `focus-visible:ring-2 focus-visible:ring-blue-500`

## Language

UI text is in **Danish**. Keep labels, placeholders, and user-facing strings in Danish.
