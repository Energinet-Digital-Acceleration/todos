<script lang="ts">
  import { cubicOut } from 'svelte/easing'
  import { fade, fly } from 'svelte/transition'
  import { clearCompleted, todos, toggleTodo } from '../stores/todos'

  // Filter for active (non-completed) todos
  const activeTodos = $derived($todos.filter((todo) => !todo.completed))

  // Filter for completed todos
  const completedTodos = $derived($todos.filter((todo) => todo.completed))

  // Track items transitioning to completed state for animation delay
  let completingIds = $state(new Set<string>())

  function handleToggle(id: string, isCompleted: boolean) {
    // Ignore clicks during animation
    if (completingIds.has(id)) return

    if (!isCompleted) {
      // Completing: add to transitioning set, toggle after brief delay for animation
      completingIds = new Set([...completingIds, id])
      setTimeout(() => {
        toggleTodo(id)
        completingIds = new Set([...completingIds].filter((i) => i !== id))
      }, 300)
    } else {
      // Uncompleting: toggle immediately
      toggleTodo(id)
    }
  }

  function isCompleting(id: string): boolean {
    return completingIds.has(id)
  }
</script>

<div class="space-y-1">
  {#each activeTodos as todo (todo.id)}
    <div
      class="group flex items-center gap-4 py-3 px-3 -mx-3
             rounded-xl
             hover:bg-stone-50 dark:hover:bg-neutral-700/50"
      in:fly={{ y: -20, duration: 300, easing: cubicOut }}
      out:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
      <!-- Circular checkbox, Things 3 style with fill animation -->
      <button
        onclick={() => handleToggle(todo.id, todo.completed)}
        class="flex-shrink-0 w-[22px] h-[22px] rounded-full
               border-2
               {isCompleting(todo.id)
          ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
          : 'border-stone-300 dark:border-neutral-500 hover:border-stone-400 dark:hover:border-neutral-400'}
               focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
               dark:focus-visible:ring-offset-neutral-800"
        aria-label="Mark as complete"
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

      <!-- Todo title with strikethrough + fade animation -->
      <span
        class="text-[15px] leading-relaxed
               {isCompleting(todo.id)
          ? 'text-stone-400 dark:text-neutral-500 line-through opacity-60'
          : 'text-stone-700 dark:text-neutral-200'}"
      >
        {todo.title}
      </span>
    </div>
  {/each}
</div>

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
          Completed
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
        Clear
      </button>
    </div>

    <!-- Completed todos list -->
    <div class="space-y-1">
      {#each completedTodos as todo (todo.id)}
        <div
          class="group flex items-center gap-4 py-2.5 px-3 -mx-3
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
            aria-label="Mark as incomplete"
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
            class="text-[15px] text-stone-400 dark:text-neutral-500 line-through"
          >
            {todo.title}
          </span>
        </div>
      {/each}
    </div>
  </div>
{/if}
