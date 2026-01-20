<script lang="ts">
  import type { Snippet } from 'svelte'

  let { title, children, actions } = $props<{
    title: string
    children: Snippet
    actions?: Snippet
  }>()
</script>

<div
  class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm dark:shadow-none
            border border-stone-200/60 dark:border-neutral-700/50
            px-8 py-6"
>
  <div class="flex items-center justify-between mb-4">
    <h2
      class="text-xl font-semibold text-stone-800 dark:text-neutral-100 tracking-tight"
    >
      {title}
    </h2>

    {#if actions}
      <div class="flex gap-2">
        {@render actions()}
      </div>
    {/if}
  </div>

  <div class="text-stone-700 dark:text-neutral-200">
    {@render children()}
  </div>
</div>
