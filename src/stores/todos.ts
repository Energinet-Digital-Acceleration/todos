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

      const { title: parsedTitle, priority } = parsePriority(trimmed)

      update((todos) => [
        {
          id: crypto.randomUUID(),
          title: parsedTitle,
          completed: false,
          createdAt: Date.now(),
          priority,
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
  }
}

export const todos = createTodosStore()

export const { addTodo, toggleTodo, deleteTodo, updateTodo, clearCompleted } = todos
