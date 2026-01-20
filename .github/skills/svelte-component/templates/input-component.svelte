<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    value = $bindable(''),
    placeholder = '',
    label = '',
    onsubmit,
    icon,
  } = $props<{
    value?: string
    placeholder?: string
    label?: string
    onsubmit?: (value: string) => void
    icon?: Snippet
  }>()

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed && onsubmit) {
        onsubmit(trimmed)
        value = ''
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      value = ''
    }
  }
</script>

<div class="mb-6">
  {#if label}
    <label
      class="block mb-2 text-sm font-medium text-stone-700 dark:text-neutral-300"
    >
      {label}
    </label>
  {/if}

  <div class="relative">
    {#if icon}
      <div
        class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-neutral-500"
      >
        {@render icon()}
      </div>
    {/if}

    <input
      type="text"
      bind:value
      onkeydown={handleKeydown}
      {placeholder}
      aria-label={label || placeholder}
      class="w-full bg-stone-50 dark:bg-neutral-700/50
             text-stone-700 dark:text-neutral-200
             placeholder-stone-400 dark:placeholder-neutral-500
             border border-stone-200 dark:border-neutral-600
             rounded-xl
             text-[15px] py-3 px-4
             {icon ? 'pl-10' : ''}
             focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
             dark:focus-visible:ring-offset-neutral-800
             focus:border-stone-300 dark:focus:border-neutral-500"
    />
  </div>
</div>
