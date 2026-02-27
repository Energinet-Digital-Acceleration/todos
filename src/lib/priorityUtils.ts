import type { Priority } from '../stores/todos'

interface ParsedPriority {
  title: string
  priority?: Priority
}

interface PriorityDisplayConfig {
  readonly text: string
  readonly badgeClass: string
  readonly rowBgClass: string
  readonly sortOrder: number
}

const PRIORITY_MAP: Record<string, Priority> = {
  'høj': 'high',
  'mellem': 'medium',
  'lav': 'low',
}

/**
 * Complete display configuration for each priority level.
 * Single source of truth for Danish names, CSS classes, and sort order.
 */
const PRIORITY_DISPLAY: Record<Priority, PriorityDisplayConfig> = {
  high: {
    text: 'Høj',
    badgeClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    rowBgClass: 'bg-red-50/50 dark:bg-red-900/10',
    sortOrder: 0,
  },
  medium: {
    text: 'Mellem',
    badgeClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    rowBgClass: 'bg-amber-50/50 dark:bg-amber-900/10',
    sortOrder: 1,
  },
  low: {
    text: 'Lav',
    badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    rowBgClass: 'bg-green-50/50 dark:bg-green-900/10',
    sortOrder: 2,
  },
}

/**
 * Get display configuration for a priority level.
 * Returns undefined if no priority is provided.
 */
export function getPriorityDisplay(priority?: Priority): PriorityDisplayConfig | undefined {
  if (!priority) return undefined
  return PRIORITY_DISPLAY[priority]
}

export function parsePriority(text: string): ParsedPriority {
  const regex = /#(høj|mellem|lav)\b/i
  const match = text.match(regex)

  if (!match) {
    return { title: text, priority: undefined }
  }

  const priorityText = match[1].toLowerCase()
  const priority = PRIORITY_MAP[priorityText]
  const title = text.replace(regex, '').trim().replace(/\s+/g, ' ')

  return { title, priority }
}

export function matchPriority(partial: string): Priority | undefined {
  if (!partial) return undefined

  const normalized = partial.toLowerCase()

  for (const [danishName, englishPriority] of Object.entries(PRIORITY_MAP)) {
    if (danishName.startsWith(normalized)) {
      return englishPriority
    }
  }

  return undefined
}

export function getPriorityDanishName(priority: Priority): string {
  return PRIORITY_DISPLAY[priority]?.text.toLowerCase() ?? ''
}

export function completePriorityInText(text: string, priority: Priority): string {
  const hashIndex = text.lastIndexOf('#')
  if (hashIndex === -1) return text

  const danishName = getPriorityDanishName(priority)
  return text.slice(0, hashIndex) + `#${danishName}`
}

/**
 * Match a priority hash-tag in text (e.g. "#hø" → 'high').
 * Used by autocomplete in both TodoInput and TodoList edit mode.
 */
export function matchPriorityInText(text: string): Priority | undefined {
  const hashIndex = text.lastIndexOf('#')
  if (hashIndex === -1) return undefined

  const afterHash = text.slice(hashIndex + 1)
  if (!afterHash) return undefined

  return matchPriority(afterHash)
}

/**
 * Sort items by priority (high → medium → low → none), then by createdAt.
 */
export function sortByPriority<T extends { priority?: Priority; createdAt: number }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const aOrder = a.priority ? PRIORITY_DISPLAY[a.priority].sortOrder : 999
    const bOrder = b.priority ? PRIORITY_DISPLAY[b.priority].sortOrder : 999

    if (aOrder !== bOrder) return aOrder - bOrder
    return a.createdAt - b.createdAt
  })
}
