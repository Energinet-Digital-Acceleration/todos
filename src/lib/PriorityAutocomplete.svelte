<script lang="ts">
  import type { Priority } from '../stores/todos'
  import PriorityBadge from './PriorityBadge.svelte'

  interface Props {
    currentMatch?: Priority
  }

  let { currentMatch }: Props = $props()
</script>

{#if currentMatch}
  <div
    class="mt-2 px-3 py-2 bg-stone-50 dark:bg-neutral-700/50 rounded-lg border border-stone-200 dark:border-neutral-600"
  >
    <div class="flex items-center gap-2">
      <PriorityBadge priority={currentMatch} />
      <span class="text-xs text-stone-500 dark:text-neutral-400">
        Tryk Enter for at tilføje
      </span>
    </div>
  </div>
{/if}
