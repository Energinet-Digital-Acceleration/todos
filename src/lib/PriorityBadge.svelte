<script lang="ts">
  import type { Priority } from '../stores/todos'
  import { getPriorityDisplay } from './priorityUtils'

  interface Props {
    priority?: Priority
  }

  let { priority }: Props = $props()

  const config = $derived(getPriorityDisplay(priority))
</script>

{#if config}
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium {config.badgeClass}"
  >
    {config.text}
  </span>
{/if}
