<script lang="ts">
  let count = $state(0)
</script>

<main class="container mx-auto p-4">
  <h1 class="text-2xl font-bold">Hello Todo App</h1>
  <button
    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    onclick={() => count++}
  >
    Count: {count}
  </button>
</main>
