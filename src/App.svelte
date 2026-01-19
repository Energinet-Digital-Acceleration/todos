<script lang="ts">
  import TodoInput from './lib/TodoInput.svelte'
  import TodoList from './lib/TodoList.svelte'

  const THEME_KEY = 'todo-theme'

  // Load saved theme or default to light
  function getInitialTheme(): boolean {
    if (typeof window === 'undefined') return false
    try {
      const saved = localStorage.getItem(THEME_KEY)
      return saved === 'dark'
    } catch {
      return false
    }
  }

  let isDark = $state(getInitialTheme())

  // Apply theme to html element and persist
  $effect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
    } catch {
      // LocalStorage unavailable
    }
  })

  function toggleTheme() {
    isDark = !isDark
  }
</script>

<div class="min-h-screen bg-stone-100 dark:bg-neutral-900">
  <div class="max-w-[600px] mx-auto px-8 py-16 relative">
    <!-- Main card container with subtle shadow -->
    <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm dark:shadow-none
                border border-stone-200/60 dark:border-neutral-700/50
                px-8 py-10">
      <!-- Dark mode toggle -->
      <button
        onclick={toggleTheme}
        class="absolute top-6 right-6 p-2.5 rounded-xl
               bg-stone-100 dark:bg-neutral-700
               text-stone-500 dark:text-neutral-400
               hover:bg-stone-200 dark:hover:bg-neutral-600
               hover:text-stone-700 dark:hover:text-neutral-200
               focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
               dark:focus-visible:ring-offset-neutral-800"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
      {#if isDark}
        <!-- Sun icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
      {:else}
        <!-- Moon icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        {/if}
      </button>

      <!-- Main content area -->
      <main>
        <h1 class="text-2xl font-semibold text-stone-800 dark:text-neutral-100 mb-8 tracking-tight">
          Todos
        </h1>

        <TodoList />
        <TodoInput />
      </main>
    </div>
  </div>
</div>
