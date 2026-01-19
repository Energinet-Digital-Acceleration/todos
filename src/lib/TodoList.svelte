<script lang="ts">
  import { todos, toggleTodo, clearCompleted } from '../stores/todos'
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

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

<div class="space-y-2">
  {#each activeTodos as todo (todo.id)}
    <div
      class="group flex items-center gap-3 py-3 px-2 -mx-2
             rounded-lg
             hover:bg-gray-100 dark:hover:bg-gray-800
             transition-colors duration-150"
      in:fly={{ y: -20, duration: 300, easing: cubicOut }}
      out:fly={{ y: 20, duration: 300, easing: cubicOut }}
    >
      <!-- Circular checkbox, Things 3 style with fill animation -->
      <button
        onclick={() => handleToggle(todo.id, todo.completed)}
        class="flex-shrink-0 w-5 h-5 rounded-full
               border-2
               {isCompleting(todo.id)
          ? 'border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               dark:focus:ring-offset-gray-900
               transition-all duration-300 ease-out"
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
        class="text-base transition-all duration-300 ease-out
               {isCompleting(todo.id)
          ? 'text-gray-400 dark:text-gray-500 line-through opacity-60'
          : 'text-gray-800 dark:text-gray-100'}"
      >
        {todo.title}
      </span>
    </div>
  {/each}
</div>

<!-- Completed section - only visible when completed todos exist -->
{#if completedTodos.length > 0}
  <div
    class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
    in:fade={{ duration: 200 }}
    out:fade={{ duration: 200 }}
  >
    <!-- Section header with count badge and clear button -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Completed
        </h2>
        <span
          class="inline-flex items-center justify-center px-2 py-0.5
                 text-xs font-medium rounded-full
                 bg-gray-200 dark:bg-gray-700
                 text-gray-600 dark:text-gray-400"
        >
          {completedTodos.length}
        </span>
      </div>
      <button
        onclick={() => clearCompleted()}
        class="text-sm text-gray-400 dark:text-gray-500
               hover:text-gray-600 dark:hover:text-gray-300
               transition-colors duration-150
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               dark:focus:ring-offset-gray-900 rounded"
      >
        Clear completed
      </button>
    </div>

    <!-- Completed todos list -->
    <div class="space-y-2">
      {#each completedTodos as todo (todo.id)}
        <div
          class="group flex items-center gap-3 py-3 px-2 -mx-2
                 rounded-lg
                 hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors duration-150"
          in:fly={{ y: 20, duration: 300, easing: cubicOut }}
          out:fade={{ duration: 200 }}
        >
          <!-- Checked circular checkbox -->
          <button
            onclick={() => handleToggle(todo.id, todo.completed)}
            class="flex-shrink-0 w-5 h-5 rounded-full
                   border-2 border-gray-300 dark:border-gray-600
                   bg-gray-200 dark:bg-gray-700
                   hover:border-gray-400 dark:hover:border-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   dark:focus:ring-offset-gray-900
                   transition-all duration-300 ease-out"
            aria-label="Mark as incomplete"
          >
            <svg
              class="w-full h-full text-gray-400 dark:text-gray-500 p-0.5"
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
          <span class="text-base text-gray-400 dark:text-gray-500 line-through">
            {todo.title}
          </span>
        </div>
      {/each}
    </div>
  </div>
{/if}
