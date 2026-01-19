<script lang="ts">
  import { todos, toggleTodo } from '../stores/todos'
  import { fly, fade } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'

  // Filter for active (non-completed) todos
  const activeTodos = $derived($todos.filter((todo) => !todo.completed))

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
