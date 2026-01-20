---
description: Svelte 5 kodestandarder med runes og snippets
applyTo: "**/*.svelte,**/*.svelte.ts"
---

# Svelte 5 kodestandarder

Følg [generelle TypeScript retningslinjer](./typescript.instructions.md).

## Runes

- Brug `$state()` til reaktiv tilstand
- Brug `$state.raw()` til store datasæt der ikke skal muteres
- Brug `$derived()` til beregnede værdier - **aldrig** `$effect` til at synkronisere state
- Brug `$derived.by()` til komplekse beregninger med flere linjer
- `$effect` kun til: DOM-manipulation, browser APIs, eksterne subscriptions
- Returner altid cleanup-funktion fra `$effect` når relevant

## Props og events

- Destructure props med `let { prop } = $props()`
- Brug callback props frem for `$bindable` hvor muligt
- Brug `onclick`, ikke `on:click`
- Håndter modifiers med standard JS: `e.preventDefault()`

## Snippets

- Brug `{#snippet}` og `{@render}` - slots er deprecated
- Type snippets med `Snippet<[ParamTypes]>` fra 'svelte'

## Anti-patterns

- ❌ `$effect` til at opdatere `$state`
- ❌ Destructure reaktive værdier til variabler
- ❌ Slots (`<slot />`)
- ❌ `on:click|preventDefault`