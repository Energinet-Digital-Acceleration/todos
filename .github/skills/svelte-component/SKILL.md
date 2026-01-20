---
name: svelte-component
description: Create new Svelte 5 components with best practices, runes, snippets, and Tailwind CSS styling. Use when creating new .svelte files or refactoring components.
---

# Svelte 5 Component Builder

This skill helps you create well-structured Svelte 5 components following project conventions.

## When to use this skill

- Creating new Svelte components from scratch
- Scaffolding component boilerplate
- Ensuring correct Svelte 5 syntax (runes, snippets)
- Following project styling patterns (Tailwind CSS)

## Project conventions

All components must follow the coding standards defined in [../../instructions/svelte-coding-standards.instructions.md](../../instructions/svelte-coding-standards.instructions.md).

Key principles:
- Use `$state()` for reactive state
- Use `$derived()` for computed values (never `$effect`)
- Use `$effect()` only for DOM manipulation, browser APIs, or external subscriptions
- Destructure props with `let { prop } = $props()`
- Use `onclick` instead of `on:click`
- Use `{#snippet}` and `{@render}` instead of slots
- UI text in Danish, code and comments in English

## Component templates

### Basic component template

```svelte
<script lang="ts">
  // Props (if needed)
  // let { propName } = $props<{ propName: Type }>()

  // Local state
  // let value = $state('')

  // Derived state
  // const computed = $derived(someCalculation)

  // Event handlers
  // function handleClick() { }
</script>

<!-- Markup with Tailwind classes -->
<div>
  <!-- Content -->
</div>
```

### Form input component

See [templates/input-component.svelte](./templates/input-component.svelte) for a complete example.

### List component with animations

See [templates/list-component.svelte](./templates/list-component.svelte) for a complete example.

### Component with snippets

See [templates/snippet-component.svelte](./templates/snippet-component.svelte) for a complete example.

## Styling guidelines

Components use Tailwind CSS with support for dark mode:

```svelte
<div class="bg-white dark:bg-neutral-800
            text-stone-700 dark:text-neutral-200
            border border-stone-200 dark:border-neutral-700
            rounded-xl px-4 py-2">
</div>
```

Common patterns:
- Light backgrounds: `bg-white` / `bg-stone-50`
- Dark backgrounds: `dark:bg-neutral-800` / `dark:bg-neutral-700`
- Text: `text-stone-700 dark:text-neutral-200`
- Borders: `border-stone-200 dark:border-neutral-700`
- Hover states: `hover:bg-stone-100 dark:hover:bg-neutral-700`
- Focus: `focus-visible:ring-2 focus-visible:ring-blue-500`

## Step-by-step workflow

1. **Determine component type**: Input, list, modal, card, etc.
2. **Create file**: Place in `src/lib/ComponentName.svelte`
3. **Add script section**: Define props, state, derived values, handlers
4. **Add markup**: Use Tailwind classes following project patterns
5. **Add animations** (if needed): Import from `svelte/transition` and `svelte/easing`
6. **Verify runes usage**: No `$effect` for state synchronization
7. **Check Danish UI text**: All user-facing text in Danish

## Common patterns from codebase

### Keyboard handling
```typescript
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    // Handle enter
  } else if (e.key === 'Escape') {
    e.preventDefault()
    // Handle escape
  }
}
```

### Toggle animations with delay
```typescript
let processingIds = $state(new Set<string>())

function handleToggle(id: string) {
  if (processingIds.has(id)) return
  
  processingIds = new Set([...processingIds, id])
  setTimeout(() => {
    // Perform action
    processingIds = new Set([...processingIds].filter(i => i !== id))
  }, 300)
}
```

### Transitions
```svelte
<script>
  import { fade, fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
</script>

<div in:fly={{ y: -20, duration: 300, easing: cubicOut }}
     out:fly={{ y: 20, duration: 300, easing: cubicOut }}>
</div>
```

## Output format

When creating a component:
1. Create the `.svelte` file in the appropriate location
2. Include all necessary imports
3. Add TypeScript types for props if applicable
4. Follow the component template structure
5. Include aria-labels for accessibility
6. Add Danish UI text where needed
