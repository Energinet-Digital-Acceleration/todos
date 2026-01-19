<script lang="ts">
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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <div class="max-w-[600px] mx-auto px-6 py-12 relative">
    <!-- Dark mode toggle -->
    <button
      onclick={toggleTheme}
      class="absolute top-4 right-4 p-2 rounded-full
             bg-gray-200 dark:bg-gray-700
             text-gray-600 dark:text-gray-300
             hover:bg-gray-300 dark:hover:bg-gray-600
             transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             dark:focus:ring-offset-gray-900"
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
      <h1 class="text-3xl font-light text-gray-800 dark:text-gray-100 mb-8 tracking-tight">
        Todos
      </h1>
      <!-- Todo list will go here in future stories -->
    </main>
  </div>
</div>
