import { writable } from 'svelte/store'
import { parsePriority } from '../lib/priorityUtils'
import { loadStorage, saveStorage } from './storage'

export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
  priority?: Priority
  dueDate?: number
}

function createTodosStore() {
  const { subscribe, update } = writable<Todo[]>(loadStorage().todos)

  // Subscribe to changes and persist
  subscribe((todos) => saveStorage({ todos }))

  return {
    subscribe,
    /**
     * Adds a new todo item to the store.
     * 
     * Parses the title for priority indicators (e.g., "!high", "!medium", "!low")
     * and creates a new todo with a unique ID and timestamp. The new todo is
     * prepended to the existing list.
     * 
     * @param title - The todo title, optionally prefixed with priority (e.g., "!high Buy milk")
     * @param options - Optional configuration including dueDate timestamp
     * 
     * @remarks
     * - Trims whitespace from the title
     * - Ignores empty titles (no-op)
     * - Automatically extracts priority from title using `parsePriority`
     * - Generates a unique UUID for each todo
     * - Persists changes to localStorage via store subscription
     * 
     * @example
     * ```typescript
     * addTodo('!high Fix critical bug')  // Creates high priority todo
     * addTodo('Buy groceries')           // Creates todo with no priority
     * addTodo('  ')                      // No-op (empty after trim)
     * addTodo('Call dentist', { dueDate: 1737388800000 }) // Creates todo with due date
     * ```
     */
    addTodo: (title: string, options?: { dueDate?: number }) => {
      const trimmed = title.trim()
      if (!trimmed) return

      const { title: parsedTitle, priority } = parsePriority(trimmed)

      update((todos) => [
        {
          id: crypto.randomUUID(),
          title: parsedTitle,
          completed: false,
          createdAt: Date.now(),
          priority,
          ...(options?.dueDate && { dueDate: options.dueDate }),
        },
        ...todos,
      ])
    },
    toggleTodo: (id: string) => {
      update((todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      )
    },
    deleteTodo: (id: string) => {
      update((todos) => todos.filter((todo) => todo.id !== id))
    },
    updateTodo: (id: string, title: string) => {
      update((todos) =>
        todos.map((todo) => {
          if (todo.id !== id) return todo

          const { title: parsedTitle, priority } = parsePriority(title)

          return {
            ...todo,
            title: parsedTitle,
            priority: priority !== undefined ? priority : todo.priority,
          }
        })
      )
    },
    clearCompleted: () => {
      update((todos) => todos.filter((todo) => !todo.completed))
    },
    setDueDate: (id: string, dueDate: number | undefined) => {
      update((todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, dueDate } : todo))
      )
    },
  }
}

export const todos = createTodosStore()

export const { addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted, setDueDate } =
  todos
