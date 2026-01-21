<script lang="ts">
  import { fade } from 'svelte/transition'
  import { setDueDate } from '../stores/todos'

  // Props
  let { todoId, dueDate } = $props<{
    todoId: string
    dueDate?: number
  }>()

  // Local state for date picker visibility
  let showPicker = $state(false)

  // Format due date for display
  const formattedDate = $derived.by(() => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDay = new Date(dueDate)
    dueDay.setHours(0, 0, 0, 0)

    const diffDays = Math.floor(
      (dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return 'I dag'
    if (diffDays === 1) return 'I morgen'
    if (diffDays === -1) return 'I går'
    if (diffDays < -1) return `${Math.abs(diffDays)} dage siden`

    return date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })
  })

  // Check if date is overdue
  const isOverdue = $derived.by(() => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today.getTime()
  })

  // Check if date is today
  const isToday = $derived.by(() => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDay = new Date(dueDate)
    dueDay.setHours(0, 0, 0, 0)
    return today.getTime() === dueDay.getTime()
  })

  // Format date for input field (YYYY-MM-DD)
  const inputValue = $derived.by(() => {
    if (!dueDate) return ''
    const date = new Date(dueDate)
    return date.toISOString().split('T')[0]
  })

  function togglePicker() {
    showPicker = !showPicker
  }

  function handleDateChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (input.value) {
      const date = new Date(input.value)
      date.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues
      setDueDate(todoId, date.getTime())
    }
    showPicker = false
  }

  function clearDate(e: Event) {
    e.stopPropagation()
    setDueDate(todoId, undefined)
    showPicker = false
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      showPicker = false
    }
  }

  // Close picker when clicking outside
  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.closest('.due-date-picker')) {
      showPicker = false
    }
  }

  $effect(() => {
    if (showPicker) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  })
</script>

<div class="due-date-picker relative shrink-0">
  <button
    onclick={togglePicker}
    class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium
           {dueDate
      ? isOverdue
        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
        : isToday
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
          : 'bg-stone-100 dark:bg-neutral-700 text-stone-600 dark:text-neutral-300 hover:bg-stone-200 dark:hover:bg-neutral-600'
      : 'text-stone-400 dark:text-neutral-500 hover:bg-stone-100 dark:hover:bg-neutral-700'}
           focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
           dark:focus-visible:ring-offset-neutral-800"
    aria-label={dueDate
      ? `Forfaldsdato: ${formattedDate}`
      : 'Tilføj forfaldsdato'}
  >
    <!-- Calendar icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
        clip-rule="evenodd"
      />
    </svg>
    {#if dueDate}
      <span>{formattedDate}</span>
    {/if}
  </button>

  {#if showPicker}
    <div
      class="absolute top-full left-0 mt-1 z-10
             bg-white dark:bg-neutral-800
             border border-stone-200 dark:border-neutral-700
             rounded-lg shadow-lg p-3 min-w-45"
      transition:fade={{ duration: 150 }}
      onkeydown={handleKeydown}
    >
      <input
        type="date"
        value={inputValue}
        onchange={handleDateChange}
        class="w-full px-2 py-1.5 text-sm
               bg-white dark:bg-neutral-700
               text-stone-700 dark:text-neutral-200
               border border-stone-300 dark:border-neutral-600
               rounded-md
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        autofocus
      />
      {#if dueDate}
        <button
          onclick={clearDate}
          class="w-full mt-2 px-2 py-1.5 text-xs
                 text-stone-600 dark:text-neutral-400
                 hover:text-red-600 dark:hover:text-red-400
                 hover:bg-stone-50 dark:hover:bg-neutral-700
                 rounded-md"
        >
          Fjern dato
        </button>
      {/if}
    </div>
  {/if}
</div>
