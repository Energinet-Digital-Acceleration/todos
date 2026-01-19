# Copilot Instructions for New Music

A Turbo monorepo for music discovery: scrapes album reviews (Pitchfork, SoundVenue), enriches with streaming metadata (Apple Music, Songlink, Anthropic), and displays in TUI (Ink) and web (Next.js) apps.

## Architecture Overview

**Monorepo Structure (Turborepo + Bun workspaces):**
- `packages/core/` - Shared business logic (Clean Architecture: domain/application/infrastructure layers)
- `apps/tui/` - Terminal UI using Ink (React for CLI)
- `apps/web/` - Next.js web app with server-side rendering

**Key Architectural Patterns:**

1. **Clean Architecture Layers** (see [../packages/core/src](../packages/core/src/)):
   - `domain/interfaces/` - Business contracts (IScraper, IAlbumRepository, IEnrichmentStrategy)
   - `application/processors/` - Business logic (AlbumProcessor: dedupe, sort, filter)
   - `infrastructure/` - External I/O (scrapers, repositories, enrichment strategies)
   - `services/` - Orchestration (AlbumService coordinates all components)

2. **Dependency Injection:** All wiring in [../packages/core/src/composition-root.ts](../packages/core/src/composition-root.ts). Use `createAlbumService()` helper in apps. Never instantiate scrapers/repositories directly.

3. **Partial Failure Pattern:** `PartialFailureResult<T>` enables graceful degradation when multiple sources can fail independently (e.g., Pitchfork down but SoundVenue works). See [../packages/core/src/errors/index.ts](../packages/core/src/errors/index.ts).

4. **Data Flow:** Scrape (parallel, max 3 concurrent) → Process (dedupe/sort) → Enrich (sequential with 100ms delays for Apple Music) → Cache (7-day TTL) → Render (TUI/Web)

5. **Enrichment Chain:** [CompositeEnrichmentStrategy](../packages/core/src/domain/interfaces/enrichment.interface.ts) chains: Apple Music (artwork/genre/release date) → Songlink (Spotify/Tidal URLs) → Anthropic (AI-generated summaries)

## Critical Conventions

**Runtime & Package Manager:**
- **Bun runtime** (NOT Node.js) - use `bun run`, `bun install`, `bun add`
- Bun auto-loads `.env` files, prefer `Bun.file()` over `node:fs`
- Turborepo orchestrates workspaces - run commands via `turbo` at root

**Scraping Best Practices:**
- Extend [BaseScraper](../packages/core/src/scrapers/base-scraper.ts) for new scrapers
- **NEVER cache scraper results** (always fetch fresh reviews)
- Max 3 concurrent pages to avoid anti-scraping triggers
- Common pitfall: `$('a').each(async ...)` won't work with Cheerio - use `.toArray()` and `for...of` instead

**API Rate Limiting:**
- Apple Music: **Sequential only** (no `Promise.all`), 100ms delay between calls
- Rationale: Undocumented rate limits cause 429s with parallel requests

**Caching Strategy:**
- **DO cache:** Apple Music API responses, enriched albums (7-day TTL in [FileAlbumRepository](../packages/core/src/infrastructure/repositories/file-album-repository.ts))
- **NEVER cache:** Review page scraping (stale data defeats purpose)
- Database: Neon (PostgreSQL) when `DATABASE_URL` set, else file-based [album-cache.json](../album-cache.json)

**Testing:**
- Use Bun's built-in test runner: `bun test [--watch] [file]`
- Mock external dependencies via interfaces (see tests in `__tests__/` folders)
- Test partial failure scenarios for resilience

## Development Workflows

**Commands (run from root):**
```bash
bun install                           # Install dependencies
bun run dev                           # Start web app (localhost:3000)
bun run tui                           # Run terminal UI
bun run scrape                        # Fetch & cache albums
bun run build                         # Build all apps
bun test                              # Run all tests
bun run check                         # Format + lint (REQUIRED before commits)
```

**Adding Components:**
- **New scraper:** Extend `BaseScraper`, register in [composition-root.ts](../packages/core/src/composition-root.ts), add tests (see [extension-guide.md](../docs/extension-guide.md))
- **New enrichment:** Implement `IEnrichmentStrategy`, add to `CompositeEnrichmentStrategy` chain
- **New repository:** Implement `IAlbumRepository`, update `createRepository()` factory

**Environment Variables:** (see [turbo.json](../turbo.json) for passThroughEnv)
```env
DATABASE_URL=<neon_postgres_url>               # Optional: Use Neon instead of file cache
APPLE_MUSIC_TEAM_ID=<team_id>                  # Apple Music API auth
APPLE_MUSIC_KEY_ID=<key_id>
APPLE_MUSIC_PRIVATE_KEY_PATH=./AuthKey_XXX.p8
ANTHROPIC_API_KEY=<api_key>                    # For AI-generated summaries
```

## Code Quality & Security

**Pre-Commit Checklist:**
1. Run `bun run check` (Biome format + lint, see [biome.json](../biome.json))
2. Verify no secrets committed (`.env`, `.p8` keys are gitignored)
3. Never log credentials/tokens - mask or omit entirely
4. Test partial failure scenarios for new scrapers/enrichment

**Biome Configuration:**
- 100 char line width, 2-space indent, single quotes, trailing commas
- TypeScript: `noNonNullAssertion` off (deliberate - scrapers parse untrusted HTML)

## Key Files Reference

| File | Purpose |
|------|---------|
| [../packages/core/src/composition-root.ts](../packages/core/src/composition-root.ts) | DI container - wire all dependencies here |
| [../packages/core/src/services/album-service.ts](../packages/core/src/services/album-service.ts) | Main orchestration service |
| [../packages/core/src/scrapers/base-scraper.ts](../packages/core/src/scrapers/base-scraper.ts) | Base class for scrapers (Puppeteer + Cheerio) |
| [../packages/core/src/infrastructure/enrichment/](../packages/core/src/infrastructure/enrichment/) | Enrichment strategies (Apple Music, Songlink, Anthropic) |
| [../apps/tui/src/index.tsx](../apps/tui/src/index.tsx) | Terminal UI entry point (Ink/React) |
| [../apps/web/src/app/page.tsx](../apps/web/src/app/page.tsx) | Next.js homepage (SSR, 1-hour revalidation) |
| [../docs/architecture.md](../docs/architecture.md) | Deep dive: error handling, concurrency, caching |
| [../docs/extension-guide.md](../docs/extension-guide.md) | How to add scrapers/enrichment/repositories |

## Common Pitfalls

| ❌ DON'T | ✅ DO |
|---------|-------|
| `$('a').each(async (i, el) => await page.goto(url))` | `const links = $('a').toArray(); for (const el of links) { await page.goto(url) }` |
| `Promise.all(albums.map(enrichAlbum))` | `for (const album of albums) { await enrichAlbum(album); await delay(100) }` |
| Cache scraper results | Cache only enrichment API responses |
| Hardcode `DATABASE_URL` or `APPLE_MUSIC_TEAM_ID` | Use `process.env.*` and document in `.env.example` |
| Log `process.env.ANTHROPIC_API_KEY` | Log `'Anthropic API configured'` instead |
| Instantiate `new PitchforkScraper()` in apps | Use `createAlbumService()` from composition-root |

For detailed architectural patterns, see [../docs/architecture.md](../docs/architecture.md). For extension workflows, see [../docs/extension-guide.md](../docs/extension-guide.md).
