import { writable } from 'svelte/store'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

const STORAGE_KEY = 'todos-minimal'

function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    // Corrupt JSON - reset to empty
    return []
  }
}

function saveTodos(todos: Todo[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // LocalStorage unavailable or quota exceeded
  }
}

function createTodosStore() {
  const { subscribe, update } = writable<Todo[]>(loadTodos())

  // Subscribe to changes and persist
  subscribe(saveTodos)

  return {
    subscribe,
    addTodo: (title: string) => {
      const trimmed = title.trim()
      if (!trimmed) return
      update((todos) => [
        {
          id: crypto.randomUUID(),
          title: trimmed,
          completed: false,
          createdAt: Date.now(),
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
    clearCompleted: () => {
      update((todos) => todos.filter((todo) => !todo.completed))
    },
  }
}

export const todos = createTodosStore()

// Re-export individual functions for convenience
export const { addTodo, toggleTodo, deleteTodo, clearCompleted } = todos
