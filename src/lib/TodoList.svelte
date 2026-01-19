<script lang="ts">
  import { todos, toggleTodo } from '../stores/todos'

  // Filter for active (non-completed) todos
  const activeTodos = $derived($todos.filter((todo) => !todo.completed))
</script>

<div class="space-y-2">
  {#each activeTodos as todo (todo.id)}
    <div
      class="group flex items-center gap-3 py-3 px-2 -mx-2
             rounded-lg
             hover:bg-gray-100 dark:hover:bg-gray-800
             transition-colors duration-150"
    >
      <!-- Circular checkbox, Things 3 style -->
      <button
        onclick={() => toggleTodo(todo.id)}
        class="flex-shrink-0 w-5 h-5 rounded-full
               border-2 border-gray-300 dark:border-gray-600
               hover:border-gray-400 dark:hover:border-gray-500
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               dark:focus:ring-offset-gray-900
               transition-colors duration-150"
        aria-label="Mark as complete"
      ></button>

      <!-- Todo title -->
      <span class="text-gray-800 dark:text-gray-100 text-base">
        {todo.title}
      </span>
    </div>
  {/each}
</div>
