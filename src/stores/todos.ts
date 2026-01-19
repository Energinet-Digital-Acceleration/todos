import { writable } from 'svelte/store'
import { loadStorage, saveStorage } from './storage'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

function createTodosStore() {
  const { subscribe, update } = writable<Todo[]>(loadStorage().todos)

  // Subscribe to changes and persist
  subscribe((todos) => saveStorage({ todos }))

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
    updateTodo: (id: string, title: string) => {
      update((todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, title } : todo))
      )
    },
    clearCompleted: () => {
      update((todos) => todos.filter((todo) => !todo.completed))
    },
  }
}

export const todos = createTodosStore()

export const { addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted } = todos
