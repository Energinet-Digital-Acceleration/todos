<script lang="ts">
  import { cubicOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'
  import {
    clearCompleted,
    deleteTodo,
    todos,
    toggleTodo,
    updateTodo,
  } from '../stores/todos'

  // Filter for active (non-completed) todos
  const activeTodos = $derived($todos.filter((todo) => !todo.completed))

  // Filter for completed todos
  const completedTodos = $derived($todos.filter((todo) => todo.completed))

  // Track items transitioning to completed state for animation delay
  let completingIds = $state(new Set<string>())

  // Track which todo is being edited
  let editingId = $state<string | null>(null)
  let editValue = $state('')

  function handleToggle(id: string, isCompleted: boolean) {
    if (editingId === id || completingIds.has(id)) return

    if (!isCompleted) {
      completingIds = new Set([...completingIds, id])
      setTimeout(() => {
        toggleTodo(id)
        completingIds = new Set([...completingIds].filter((i) => i !== id))
      }, 300)
    } else {
      toggleTodo(id)
    }
  }

  function isCompleting(id: string): boolean {
    return completingIds.has(id)
  }

  function startEdit(id: string, title: string) {
    editingId = id
    editValue = title
  }

  function saveEdit() {
    if (editingId && editValue.trim()) {
      updateTodo(editingId, editValue.trim())
    }
    editingId = null
  }

  function cancelEdit() {
    editingId = null
  }

  function handleEditKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }
</script>

<!-- Empty state -->
{#if $todos.length === 0}
  <div class="py-12 text-center" in:fade={{ duration: 200 }}>
    <p class="text-stone-400 dark:text-neutral-500 text-[15px]">
      Ingen opgaver endnu
    </p>
  </div>
{:else}
  <div class="space-y-1">
    {#each activeTodos as todo (todo.id)}
      <div
        class="group flex items-center gap-3 py-3 px-3 -mx-3
               rounded-xl
               hover:bg-stone-50 dark:hover:bg-neutral-700/50"
        in:fly={{ y: -20, duration: 300, easing: cubicOut }}
        out:fly={{ y: 20, duration: 300, easing: cubicOut }}
      >
        <!-- Circular checkbox -->
        <button
          onclick={() => handleToggle(todo.id, todo.completed)}
          class="flex-shrink-0 w-[22px] h-[22px] rounded-full
                 border-2
                 {isCompleting(todo.id)
            ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
            : 'border-stone-300 dark:border-neutral-500 hover:border-stone-400 dark:hover:border-neutral-400'}
                 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                 dark:focus-visible:ring-offset-neutral-800"
          aria-label="Marker som færdig"
        >
          {#if isCompleting(todo.id)}
            <svg
              class="w-full h-full text-white p-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              in:fade={{ duration: 150 }}
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          {/if}
        </button>

        <!-- Todo title or edit input -->
        {#if editingId === todo.id}
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="text"
            bind:value={editValue}
            onkeydown={handleEditKeydown}
            onblur={saveEdit}
            class="flex-1 bg-transparent text-[15px] text-stone-700 dark:text-neutral-200
                   border-b border-stone-300 dark:border-neutral-500
                   focus:outline-none focus:border-blue-500"
            autofocus
          />
        {:else}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <span
            role="button"
            tabindex="0"
            class="flex-1 text-[15px] leading-relaxed cursor-pointer
                   {isCompleting(todo.id)
              ? 'text-stone-400 dark:text-neutral-500 line-through opacity-60'
              : 'text-stone-700 dark:text-neutral-200'}"
            ondblclick={() => startEdit(todo.id, todo.title)}
            onkeydown={(e) => e.key === 'Enter' && startEdit(todo.id, todo.title)}
          >
            {todo.title}
          </span>
        {/if}

        <!-- Delete button (visible on hover) -->
        <button
          onclick={() => deleteTodo(todo.id)}
          class="flex-shrink-0 opacity-0 group-hover:opacity-100
                 text-stone-400 dark:text-neutral-500
                 hover:text-red-500 dark:hover:text-red-400
                 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blue-500
                 rounded p-1 -mr-1"
          aria-label="Slet opgave"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    {/each}
  </div>
{/if}

<!-- Completed section - only visible when completed todos exist -->
{#if completedTodos.length > 0}
  <div
    class="mt-10 pt-6 border-t border-stone-200 dark:border-neutral-700"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
  >
    <!-- Section header with count badge and clear button -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <h2
          class="text-xs font-semibold text-stone-400 dark:text-neutral-500 uppercase tracking-wider"
        >
          Færdige
        </h2>
        <span
          class="inline-flex items-center justify-center w-5 h-5
                 text-xs font-medium rounded-full
                 bg-stone-100 dark:bg-neutral-700
                 text-stone-500 dark:text-neutral-400"
        >
          {completedTodos.length}
        </span>
      </div>
      <button
        onclick={() => clearCompleted()}
        class="text-xs font-medium text-stone-400 dark:text-neutral-500
               hover:text-stone-600 dark:hover:text-neutral-300
               focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
               dark:focus-visible:ring-offset-neutral-800 rounded px-1"
      >
        Ryd
      </button>
    </div>

    <!-- Completed todos list -->
    <div class="space-y-1">
      {#each completedTodos as todo (todo.id)}
        <div
          class="group flex items-center gap-3 py-2.5 px-3 -mx-3
                 rounded-xl
                 hover:bg-stone-50 dark:hover:bg-neutral-700/50"
          in:fly={{ y: 20, duration: 300, easing: cubicOut }}
          out:fade={{ duration: 200 }}
        >
          <!-- Checked circular checkbox -->
          <button
            onclick={() => handleToggle(todo.id, todo.completed)}
            class="flex-shrink-0 w-[22px] h-[22px] rounded-full
                   border-2 border-stone-200 dark:border-neutral-600
                   bg-stone-100 dark:bg-neutral-700
                   hover:border-stone-300 dark:hover:border-neutral-500
                   focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                   dark:focus-visible:ring-offset-neutral-800"
            aria-label="Marker som ikke færdig"
          >
            <svg
              class="w-full h-full text-stone-400 dark:text-neutral-500 p-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Muted todo title with strikethrough -->
          <span
            class="flex-1 text-[15px] text-stone-400 dark:text-neutral-500 line-through"
          >
            {todo.title}
          </span>

          <!-- Delete button -->
          <button
            onclick={() => deleteTodo(todo.id)}
            class="flex-shrink-0 opacity-0 group-hover:opacity-100
                   text-stone-400 dark:text-neutral-500
                   hover:text-red-500 dark:hover:text-red-400
                   focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blue-500
                   rounded p-1 -mr-1"
            aria-label="Slet opgave"
          >
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      {/each}
    </div>
  </div>
{/if}
