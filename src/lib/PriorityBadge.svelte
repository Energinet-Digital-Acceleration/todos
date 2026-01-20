<script lang="ts">
  import type { Priority } from '../stores/todos'

  interface Props {
    priority?: Priority
  }

  let { priority }: Props = $props()

  const priorityConfig = {
    high: {
      text: 'Høj',
      bgClass: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    },
    medium: {
      text: 'Mellem',
      bgClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    },
    low: {
      text: 'Lav',
      bgClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    },
  } as const
</script>

{#if priority}
  {@const config = priorityConfig[priority]}
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium {config.bgClass}"
  >
    {config.text}
  </span>
{/if}
