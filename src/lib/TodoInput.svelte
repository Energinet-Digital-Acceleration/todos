<script lang="ts">
  import { addTodo } from '../stores/todos'
  import CharacterCounter from './CharacterCounter.svelte'
  import PriorityAutocomplete from './PriorityAutocomplete.svelte'
  import { completePriorityInText, matchPriority } from './priorityUtils'

  let value = $state('')
  let isFocused = $state(false)

  // Show counter only when input has focus and has content
  const showCounter = $derived(isFocused && value.length > 0)

  // Match priority from input
  const currentMatch = $derived.by(() => {
    const hashIndex = value.lastIndexOf('#')
    if (hashIndex === -1) return undefined

    const afterHash = value.slice(hashIndex + 1)
    if (!afterHash) return undefined

    return matchPriority(afterHash)
  })

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      let finalValue = value.trim()

      // If autocomplete has a match, complete the priority text before submitting
      if (currentMatch) {
        finalValue = completePriorityInText(finalValue, currentMatch)
      }

      if (finalValue) {
        addTodo(finalValue)
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
  <PriorityAutocomplete {currentMatch} />
</div>
