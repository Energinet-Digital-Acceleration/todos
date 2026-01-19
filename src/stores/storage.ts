import type { Todo } from './todos'

const STORAGE_KEY = 'todos-storage'

export interface AppStorage {
  theme: 'dark' | 'light'
  todos: Todo[]
}

const defaultStorage: AppStorage = {
  theme: 'light',
  todos: [],
}

export function loadStorage(): AppStorage {
  if (typeof window === 'undefined') return defaultStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultStorage, ...JSON.parse(stored) } : defaultStorage
  } catch {
    return defaultStorage
  }
}

export function saveStorage(data: Partial<AppStorage>): void {
  if (typeof window === 'undefined') return
  try {
    const current = loadStorage()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }))
  } catch {
    // LocalStorage unavailable
  }
}
