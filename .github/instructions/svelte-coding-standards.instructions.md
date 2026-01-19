---
applyTo: '*.svelte'
---

# Svelte 5 Coding Standards

## Runes - Det nye reaktivitetssystem

### $state - Reaktiv tilstand
- Brug `$state()` til at erklære reaktiv tilstand
- Arrays og objekter bliver automatisk dybt reaktive (proxies)
- Brug `$state.raw()` til store objekter/arrays der ikke skal muteres (bedre performance)
- Brug `$state.snapshot()` når du skal sende state til eksterne biblioteker

```svelte
<script>
  let count = $state(0);
  let todos = $state([{ done: false, text: 'Lær Svelte 5' }]);
  
  // For store read-only datasæt
  let bigData = $state.raw(fetchedData);
</script>
```

### $derived - Afledt tilstand
- Brug `$derived()` i stedet for `$:` til beregnede værdier
- Brug `$derived.by()` til komplekse beregninger der kræver flere linjer
- Undgå at bruge `$effect` til at synkronisere state - brug `$derived` i stedet

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  let total = $derived.by(() => {
    let sum = 0;
    for (const item of items) {
      sum += item.value;
    }
    return sum;
  });
</script>
```

### $effect - Side effects
- `$effect` bør bruges sparsomt - primært til DOM-manipulation, analytics, og eksterne biblioteker
- **Undgå** at opdatere state i effects - det fører ofte til uendelige loops
- Brug teardown-funktioner til cleanup (f.eks. clearInterval, removeEventListener)
- Effects kører efter DOM er opdateret

```svelte
<script>
  let canvas;
  let color = $state('#ff3e00');
  
  $effect(() => {
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(0, 0, 100, 100);
    
    // Cleanup function
    return () => {
      context.clearRect(0, 0, 100, 100);
    };
  });
</script>
```

### $props - Komponent properties
- Brug destructuring med `$props()` til at modtage props
- Definer fallback-værdier direkte i destructuring
- Tilføj TypeScript types for bedre developer experience
- Brug `$props.id()` til unikke element-IDs

```svelte
<script lang="ts">
  interface Props {
    title: string;
    count?: number;
    onUpdate?: (value: number) => void;
  }
  
  let { title, count = 0, onUpdate }: Props = $props();
  const uid = $props.id();
</script>
```

### $bindable - Two-way binding
- Brug `$bindable()` kun når nødvendigt - det gør dataflow sværere at forstå
- Marker props som bindable når parent-komponenten skal kunne binde til dem

```svelte
<script>
  let { value = $bindable(''), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

## Snippets - Genbrugelig markup

### Grundlæggende snippets
- Brug `{#snippet}` i stedet for slots (deprecated i Svelte 5)
- Snippets kan have parametre og bruges med `{@render}`
- Snippets er mere fleksible end slots

```svelte
{#snippet card(title, content)}
  <div class="card">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
{/snippet}

{@render card('Min titel', 'Mit indhold')}
```

### Snippets som props
- Send snippets til komponenter som props
- Brug `children` snippet til default content

```svelte
<!-- Parent -->
<Card>
  {#snippet header()}
    <h1>Overskrift</h1>
  {/snippet}
  
  Default indhold her
</Card>

<!-- Card.svelte -->
<script>
  let { header, children } = $props();
</script>

<div class="card">
  {#if header}
    {@render header()}
  {/if}
  {@render children?.()}
</div>
```

## Best Practices

### State Management
1. Hold state så lokalt som muligt
2. Brug callback props til at kommunikere ændringer opad
3. Del state via `.svelte.ts` filer når nødvendigt (men eksporter ikke direkte reassignable state)

```typescript
// stores/counter.svelte.ts
let count = $state(0);

export function getCount() {
  return count;
}

export function increment() {
  count += 1;
}
```

### Klasser med reaktiv state
- Brug `$state` i class fields for reaktive properties
- Brug arrow functions for metoder der skal bevare `this`-context

```svelte
<script>
  class Todo {
    done = $state(false);
    text = $state('');
    
    toggle = () => {
      this.done = !this.done;
    };
  }
</script>
```

### Event handlers
- Brug moderne event handler syntax: `onclick` i stedet for `on:click`
- Brug function bindings hvor muligt i stedet for effects

```svelte
<button onclick={() => count++}>
  Klik mig
</button>
```

### TypeScript
- Brug `lang="ts"` i script tags
- Definer interfaces for props
- Brug `Snippet` type fra 'svelte' til at type snippet props

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';
  
  interface Props {
    data: Item[];
    row: Snippet<[Item]>;
  }
  
  let { data, row }: Props = $props();
</script>
```

## Anti-patterns at undgå

1. **Brug ikke `$effect` til at synkronisere state** - brug `$derived` i stedet
2. **Mutér ikke props** medmindre de er markeret med `$bindable`
3. **Undgå at destructure reaktive værdier** - referencerne bliver ikke reaktive
4. **Brug ikke slots** - de er deprecated, brug snippets i stedet
5. **Undgå cykliske effects** - brug `untrack()` hvis nødvendigt
