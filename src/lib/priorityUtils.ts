import type { Priority } from '../stores/todos'

interface ParsedPriority {
  title: string
  priority?: Priority
}

const PRIORITY_MAP: Record<string, Priority> = {
  'høj': 'high',
  'mellem': 'medium',
  'lav': 'low',
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
  const entry = Object.entries(PRIORITY_MAP).find(([, value]) => value === priority)
  return entry ? entry[0] : ''
}

export function completePriorityInText(text: string, priority: Priority): string {
  const hashIndex = text.lastIndexOf('#')
  if (hashIndex === -1) return text

  const danishName = getPriorityDanishName(priority)
  return text.slice(0, hashIndex) + `#${danishName}`
}
