const STORAGE_KEY = 'todos-storage'

/**
 * Shape of persisted app data. Uses unknown[] for todos
 * to avoid circular dependency with the todos store.
 * The todos store is responsible for casting to its own Todo type.
 */
export interface AppStorage {
  theme?: 'dark' | 'light'
  todos: unknown[]
}

const defaultStorage: AppStorage = {
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
