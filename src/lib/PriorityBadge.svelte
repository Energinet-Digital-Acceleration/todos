<script lang="ts">
  import type { Priority } from '../stores/todos'
  import { getPriorityDisplay } from './priorityUtils'

  interface Props {
    priority?: Priority
    hint?: string
  }

  let { priority, hint }: Props = $props()

  const config = $derived(getPriorityDisplay(priority))
</script>

{#if config}
  {#if hint}
    <div
      class="mt-2 px-3 py-2 bg-stone-50 dark:bg-neutral-700/50 rounded-lg border border-stone-200 dark:border-neutral-600"
    >
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium {config.badgeClass}"
        >
          {config.text}
        </span>
        <span class="text-xs text-stone-500 dark:text-neutral-400">
          {hint}
        </span>
      </div>
    </div>
  {:else}
    <span
      class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium {config.badgeClass}"
    >
      {config.text}
    </span>
  {/if}
{/if}
