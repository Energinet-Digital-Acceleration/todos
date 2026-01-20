# Copilot Instructions

## Project Overview

Workshop demo todo-app built with **Svelte 5**, **Tailwind CSS 4**, and **Bun**.

## Architecture

**State flow:** `storage.ts` → `todos.ts` → Components

- [src/stores/storage.ts](../src/stores/storage.ts) - localStorage persistence
- [src/stores/todos.ts](../src/stores/todos.ts) - Svelte store med CRUD
- [src/App.svelte](../src/App.svelte) - Root layout + theme
- [src/lib/](../src/lib/) - UI components

## Svelte 5 Patterns

Følg [Svelte 5 kodestandarder](./instructions/svelte-coding-standards.instructions.md).

## Sprog

- UI-tekst: Dansk
- Kode og kommentarer: Engelsk