<script lang="ts">
  import { fade } from 'svelte/transition'

  let { count = 0, visible = false } = $props<{
    count: number
    visible: boolean
  }>()

  // Visual feedback for different lengths
  const colorClass = $derived(
    count === 0
      ? 'text-stone-400 dark:text-neutral-500'
      : count < 15
        ? 'text-stone-600 dark:text-neutral-400'
        : count < 25
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-red-600 dark:text-red-400'
  )
</script>

{#if visible}
  <div
    transition:fade={{ duration: 200 }}
    class="mt-2 text-right"
  >
    <span
      class="text-xs font-medium {colorClass} transition-colors duration-200"
      aria-live="polite"
    >
      {count} {count === 1 ? 'tegn' : 'tegn'}
    </span>
  </div>
{/if}
