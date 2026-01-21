<script lang="ts">
  import type { DueDateMatch } from './dueDateUtils'

  let { currentMatch }: { currentMatch?: DueDateMatch } = $props()

  // Get relative text if applicable
  const relativeText = $derived.by(() => {
    if (!currentMatch) return undefined

    const date = new Date(currentMatch.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDay = new Date(currentMatch.date)
    targetDay.setHours(0, 0, 0, 0)

    const diffDays = Math.floor(
      (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays === 0) return 'I dag'
    if (diffDays === 1) return 'I morgen'
    if (diffDays === 2) return 'I overmorgen'

    return undefined
  })
</script>

{#if currentMatch}
  <div
    class="mt-2 px-3 py-2 bg-stone-50 dark:bg-neutral-700/50 rounded-lg border border-stone-200 dark:border-neutral-600"
  >
    <div class="flex items-center gap-2">
      <!-- Calendar icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 text-stone-500 dark:text-neutral-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clip-rule="evenodd"
        />
      </svg>

      <div class="flex items-center gap-2 flex-1">
        <span class="text-sm font-medium text-stone-700 dark:text-neutral-200">
          {currentMatch.formattedDate}
        </span>
        {#if relativeText}
          <span
            class="text-xs text-stone-500 dark:text-neutral-400 font-normal"
          >
            ({relativeText})
          </span>
        {/if}
      </div>

      <span class="text-xs text-stone-500 dark:text-neutral-400">
        Tryk Enter for at tilføje
      </span>
    </div>
  </div>
{/if}
