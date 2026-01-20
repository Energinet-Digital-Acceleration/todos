<script lang="ts">
  import type { Snippet } from 'svelte'
  import { cubicOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'

  let { items, onitemclick, renderItem } = $props<{
    items: any[]
    onitemclick?: (item: any) => void
    renderItem: Snippet<[any]>
  }>()

  const hasItems = $derived(items.length > 0)
</script>

{#if !hasItems}
  <div class="py-12 text-center" in:fade={{ duration: 200 }}>
    <p class="text-stone-400 dark:text-neutral-500 text-[15px]">
      Ingen elementer
    </p>
  </div>
{:else}
  <div class="space-y-1">
    {#each items as item (item.id)}
      <div
        class="group flex items-center gap-3 py-3 px-3 -mx-3
               rounded-xl
               hover:bg-stone-50 dark:hover:bg-neutral-700/50
               {onitemclick ? 'cursor-pointer' : ''}"
        onclick={() => onitemclick?.(item)}
        in:fly={{ y: -20, duration: 300, easing: cubicOut }}
        out:fly={{ y: 20, duration: 300, easing: cubicOut }}
      >
        {@render renderItem(item)}
      </div>
    {/each}
  </div>
{/if}
