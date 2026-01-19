<script lang="ts">
  import { addTodo } from '../stores/todos'

  let value = $state('')

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed) {
        addTodo(trimmed)
        value = ''
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      value = ''
    }
  }
</script>

<div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
  <input
    type="text"
    bind:value
    onkeydown={handleKeydown}
    placeholder="Add a todo..."
    class="w-full bg-transparent
           text-gray-800 dark:text-gray-100
           placeholder-gray-400 dark:placeholder-gray-500
           border-none outline-none
           text-base py-2
           focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0
           rounded-md px-2 -mx-2
           transition-shadow duration-200"
  />
</div>
