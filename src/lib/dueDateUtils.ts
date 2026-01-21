export interface ParsedDueDate {
  title: string
  dueDate?: number
}

const RELATIVE_DATES: Record<string, number> = {
  'i dag': 0,
  'idag': 0,
  'i morgen': 1,
  'imorgen': 1,
  'i overmorgen': 2,
  'iovermorgen': 2,
}

const WEEKDAYS: Record<string, number> = {
  'søndag': 0,
  'mandag': 1,
  'tirsdag': 2,
  'onsdag': 3,
  'torsdag': 4,
  'fredag': 5,
  'lørdag': 6,
}

const MONTHS: Record<string, number> = {
  'januar': 0,
  'jan': 0,
  'februar': 1,
  'feb': 1,
  'marts': 2,
  'mar': 2,
  'april': 3,
  'apr': 3,
  'maj': 4,
  'juni': 5,
  'jun': 5,
  'juli': 6,
  'jul': 6,
  'august': 7,
  'aug': 7,
  'september': 8,
  'sep': 8,
  'oktober': 9,
  'okt': 9,
  'november': 10,
  'nov': 10,
  'december': 11,
  'dec': 11,
}

/**
 * Get the next occurrence of a specific weekday.
 * If today is the same weekday, returns next week's occurrence (7 days from now).
 * 
 * @param targetDay - The target day of the week (0 = Sunday, 6 = Saturday)
 * @returns Date object set to noon on the target day
 */
function getNextWeekday(targetDay: number): Date {
  const date = new Date()
  const currentDay = date.getDay()

  // Calculate days until target (always at least 7 days if today is the same day)
  let daysUntilTarget = targetDay - currentDay
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7
  }

  date.setDate(date.getDate() + daysUntilTarget)
  date.setHours(12, 0, 0, 0)

  return date
}

/**
 * Parse a specific date in various formats (25/1, 25-1, 25. januar).
 * If the date is in the past, automatically moves it to next year.
 * 
 * @param text - The input text
 * @returns Object with cleaned title and optional dueDate, or null if no date found
 */
function parseSpecificDate(text: string): { title: string; dueDate: number; matchedText: string } | null {
  const trimmed = text.trim()

  // Pattern 1: DD/MM or DD-MM (e.g., "25/1" or "25-1")
  const numericPattern = /\b(\d{1,2})[\/\-](\d{1,2})\b/
  const numericMatch = trimmed.match(numericPattern)

  if (numericMatch) {
    const day = parseInt(numericMatch[1], 10)
    const month = parseInt(numericMatch[2], 10) - 1 // 0-indexed

    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      const now = new Date()
      let year = now.getFullYear()
      let date = new Date(year, month, day, 12, 0, 0, 0)

      // Check if date is valid (e.g., not 31/2)
      if (date.getMonth() !== month || date.getDate() !== day) {
        return null // Invalid date
      }

      // If date is in the past, use next year
      if (date < now) {
        year++
        date = new Date(year, month, day, 12, 0, 0, 0)
      }

      const title = trimmed.replace(numericPattern, '').trim().replace(/\s+/g, ' ')
      return {
        title,
        dueDate: date.getTime(),
        matchedText: numericMatch[0],
      }
    }
  }

  // Pattern 2: DD. MONTH (e.g., "25. januar" or "25. jan")
  const monthNames = Object.keys(MONTHS).join('|')
  const monthPattern = new RegExp(`\\b(\\d{1,2})\\.?\\s+(${monthNames})\\b`, 'i')
  const monthMatch = trimmed.match(monthPattern)

  if (monthMatch) {
    const day = parseInt(monthMatch[1], 10)
    const monthName = monthMatch[2].toLowerCase()
    const month = MONTHS[monthName]

    if (day >= 1 && day <= 31) {
      const now = new Date()
      let year = now.getFullYear()
      let date = new Date(year, month, day, 12, 0, 0, 0)

      // Check if date is valid
      if (date.getMonth() !== month || date.getDate() !== day) {
        return null // Invalid date
      }

      // If date is in the past, use next year
      if (date < now) {
        year++
        date = new Date(year, month, day, 12, 0, 0, 0)
      }

      const title = trimmed.replace(monthPattern, '').trim().replace(/\s+/g, ' ')
      return {
        title,
        dueDate: date.getTime(),
        matchedText: monthMatch[0],
      }
    }
  }

  return null
}

/**
 * Parse relative Danish dates from text (i dag, i morgen, i overmorgen).
 * 
 * @param text - The input text that may contain a relative date
 * @returns Object with cleaned title and optional dueDate timestamp
 * 
 * @example
 * parseDueDate('Køb mælk i dag') // { title: 'Køb mælk', dueDate: <today at noon> }
 * parseDueDate('Møde i morgen') // { title: 'Møde', dueDate: <tomorrow at noon> }
 */
export function parseDueDate(text: string): ParsedDueDate {
  const trimmed = text.trim()
  if (!trimmed) {
    return { title: trimmed, dueDate: undefined }
  }

  // Try to match specific dates first (25/1, 25. januar, etc.)
  const specificDate = parseSpecificDate(trimmed)
  if (specificDate) {
    return {
      title: specificDate.title,
      dueDate: specificDate.dueDate,
    }
  }

  // Try to match weekdays
  const weekdayPattern = Object.keys(WEEKDAYS).join('|')
  const weekdayRegex = new RegExp(`\\b(${weekdayPattern})\\b`, 'i')
  const weekdayMatch = trimmed.match(weekdayRegex)

  if (weekdayMatch) {
    const matchedWeekday = weekdayMatch[1].toLowerCase()
    const targetDay = WEEKDAYS[matchedWeekday]
    const date = getNextWeekday(targetDay)

    const title = trimmed.replace(weekdayRegex, '').trim().replace(/\s+/g, ' ')

    return {
      title,
      dueDate: date.getTime(),
    }
  }

  // Try to match relative dates
  const relativePatterms = Object.keys(RELATIVE_DATES).join('|')
  const relativeRegex = new RegExp(`\\b(${relativePatterms})\\b`, 'i')
  const relativeMatch = trimmed.match(relativeRegex)

  if (relativeMatch) {
    const matchedText = relativeMatch[1].toLowerCase()
    const daysToAdd = RELATIVE_DATES[matchedText]

    const date = new Date()
    date.setDate(date.getDate() + daysToAdd)
    date.setHours(12, 0, 0, 0)

    const title = trimmed.replace(relativeRegex, '').trim().replace(/\s+/g, ' ')

    return {
      title,
      dueDate: date.getTime(),
    }
  }

  return { title: trimmed, dueDate: undefined }
}

export interface DueDateMatch {
  date: number
  matchedText: string
  fullText: string
  formattedDate: string
}

/**
 * Match partial date input for autocomplete.
 * 
 * @param text - The input text that may contain a partial date
 * @returns Match object with date info, or undefined if no match
 * 
 * @example
 * matchDueDate('Køb mælk i mor') // { date: <tomorrow>, matchedText: 'i mor', fullText: 'i morgen', formattedDate: '21. jan 2026' }
 * matchDueDate('Køb mælk man') // { date: <next monday>, matchedText: 'man', fullText: 'mandag', formattedDate: '27. jan 2026' }
 */
export function matchDueDate(text: string): DueDateMatch | undefined {
  const trimmed = text.trim().toLowerCase()
  if (!trimmed) return undefined

  // Try to match partial relative dates (i dag, i morgen, i overmorgen)
  for (const [dateText, daysToAdd] of Object.entries(RELATIVE_DATES)) {
    // Check if the input partially matches this date text
    const lastWord = trimmed.split(/\s+/).pop() || ''
    const secondLastWord = trimmed.split(/\s+/).slice(-2, -1)[0] || ''
    const lastTwoWords = secondLastWord && lastWord ? `${secondLastWord} ${lastWord}` : lastWord

    if (dateText.startsWith(lastTwoWords) && lastTwoWords.length > 0) {
      const date = new Date()
      date.setDate(date.getDate() + daysToAdd)
      date.setHours(12, 0, 0, 0)

      return {
        date: date.getTime(),
        matchedText: lastTwoWords,
        fullText: dateText,
        formattedDate: formatDate(date),
      }
    }
  }

  // Try to match partial weekdays
  for (const [weekdayName, weekdayNum] of Object.entries(WEEKDAYS)) {
    const lastWord = trimmed.split(/\s+/).pop() || ''

    if (weekdayName.startsWith(lastWord) && lastWord.length >= 2) {
      const date = getNextWeekday(weekdayNum)

      return {
        date: date.getTime(),
        matchedText: lastWord,
        fullText: weekdayName,
        formattedDate: formatDate(date),
      }
    }
  }

  // Check if there's a complete match (for specific dates like 25/1)
  const parsed = parseDueDate(text)
  if (parsed.dueDate) {
    const date = new Date(parsed.dueDate)
    // Find what was matched by comparing titles
    const matchedText = text.replace(parsed.title, '').trim()

    if (matchedText) {
      return {
        date: parsed.dueDate,
        matchedText,
        fullText: matchedText,
        formattedDate: formatDate(date),
      }
    }
  }

  return undefined
}

/**
 * Format a date for display in Danish format.
 * 
 * @param date - The date to format
 * @returns Formatted date string (e.g., "21. jan 2026")
 */
function formatDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleDateString('da-DK', { month: 'short' })
  const year = date.getFullYear()
  return `${day}. ${month} ${year}`
}

/**
 * Complete partial date text in input string.
 * Similar to completePriorityInText for priorities.
 * 
 * @param text - The input text with partial date
 * @param match - The matched date info
 * @returns Text with completed date keyword
 * 
 * @example
 * completeDateInText('Køb mælk i mor', matchedDate) // 'Køb mælk i morgen'
 */
export function completeDateInText(text: string, match: DueDateMatch): string {
  // Find the last occurrence of the matched text and replace with full text
  const lastIndex = text.toLowerCase().lastIndexOf(match.matchedText.toLowerCase())
  if (lastIndex === -1) return text

  return (
    text.substring(0, lastIndex) +
    match.fullText +
    text.substring(lastIndex + match.matchedText.length)
  )
}
