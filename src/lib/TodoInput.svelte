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

<div class="mt-8 pt-6 border-t border-stone-200 dark:border-neutral-700">
  <input
    type="text"
    bind:value
    onkeydown={handleKeydown}
    placeholder="Add a todo..."
    class="w-full bg-stone-50 dark:bg-neutral-700/50
           text-stone-700 dark:text-neutral-200
           placeholder-stone-400 dark:placeholder-neutral-500
           border border-stone-200 dark:border-neutral-600
           rounded-xl
           text-[15px] py-3 px-4
           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
           dark:focus-visible:ring-offset-neutral-800
           focus:border-stone-300 dark:focus:border-neutral-500"
  />
</div>
