<script lang="ts">
  import { addTodo } from '../stores/todos'
  import CharacterCounter from './CharacterCounter.svelte'
  import DueDateAutocomplete from './DueDateAutocomplete.svelte'
  import {
    completeDateInText,
    matchDueDate,
    parseDueDate,
  } from './dueDateUtils'
  import PriorityAutocomplete from './PriorityAutocomplete.svelte'
  import { completePriorityInText, matchPriority } from './priorityUtils'

  let value = $state('')
  let isFocused = $state(false)

  // Show counter only when input has focus and has content
  const showCounter = $derived(isFocused && value.length > 0)

  // Match priority from input
  const currentPriorityMatch = $derived.by(() => {
    const hashIndex = value.lastIndexOf('#')
    if (hashIndex === -1) return undefined

    const afterHash = value.slice(hashIndex + 1)
    if (!afterHash) return undefined

    return matchPriority(afterHash)
  })

  // Match due date from input
  const currentDateMatch = $derived.by(() => {
    if (!value.trim()) return undefined
    return matchDueDate(value)
  })

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      let finalValue = value.trim()

      // If date autocomplete has a match, complete the date text before submitting
      if (currentDateMatch) {
        finalValue = completeDateInText(finalValue, currentDateMatch)
      }

      // If priority autocomplete has a match, complete the priority text before submitting
      if (currentPriorityMatch) {
        finalValue = completePriorityInText(finalValue, currentPriorityMatch)
      }

      if (finalValue) {
        // Parse due date from the final value
        const { title, dueDate } = parseDueDate(finalValue)

        // Add todo with cleaned title and optional due date
        addTodo(title, dueDate ? { dueDate } : undefined)
        value = ''
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      value = ''
    }
  }
</script>

<div class="mb-6">
  <input
    type="text"
    bind:value
    onkeydown={handleKeydown}
    onfocus={() => (isFocused = true)}
    onblur={() => (isFocused = false)}
    placeholder="Tilføj en opgave..."
    aria-label="Tilføj en opgave"
    class="w-full bg-stone-50 dark:bg-neutral-700/50
           text-stone-700 dark:text-neutral-200
           placeholder-stone-400 dark:placeholder-neutral-500
           border border-stone-200 dark:border-neutral-600
           rounded-xl
           text-[15px] py-3 px-4
           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
           dark:focus-visible:ring-offset-neutral-800
           focus:border-stone-300 dark:focus:border-neutral-500"
  />

  <CharacterCounter count={value.length} visible={showCounter} />
  <PriorityAutocomplete currentMatch={currentPriorityMatch} />
  <DueDateAutocomplete currentMatch={currentDateMatch} />
</div>
