# Refaktoreringsmønstre: Fra Shallow til Deep

## Mønster 1: Konsolidér Shallow Modules → Deep Module

**Hvornår:** Flere små, relaterede moduler der bidrager til samme feature/koncept.

**Fremgangsmåde:**

1. Skab ét nyt modul med en public interface-fil (f.eks. `index.ts`)
2. Flyt relaterede moduler ind som private/interne implementeringsfiler
3. Eksponér kun det minimale interface der er nødvendigt
4. Skriv tests der validerer det offentlige interface
5. Opdatér alle importstier

**Eksempel (TypeScript):**

```typescript
// FØR: Mange shallow modules
// auth/validateToken.ts → eksporterer validateToken()
// auth/refreshToken.ts → eksporterer refreshToken()
// auth/parseJwt.ts → eksporterer parseJwt()
// auth/tokenStore.ts → eksporterer getToken(), setToken(), clearToken()
// auth/permissions.ts → eksporterer hasPermission(), getPermissions()

// EFTER: Ét deep module
// auth/index.ts (public interface — kun 3 exports i stedet for 8)
export { authenticate, requirePermission, getSession } from './internal/service'
export type { Session, Permission } from './internal/types'

// auth/internal/ (privat implementering)
// service.ts, jwt.ts, store.ts, permissions.ts, types.ts
```

## Mønster 2: Pull Complexity Downward

**Hvornår:** Kaldere skal tage mange beslutninger for at bruge et modul korrekt.

**Fremgangsmåde:**

1. Identificér konfiguration og beslutningslogik der gentages hos kaldere
2. Flyt logikken ind i modulet med fornuftige defaults
3. Gør det mest almindelige use case til et zero-config kald
4. Tilbyd overrides via options-objekt

**Eksempel:**

```typescript
// FØR: Kalder håndterer kompleksitet
const transport = new FileTransport('/var/log/app.log')
const formatter = new JsonFormatter({ timestamp: true, level: true })
const logger = new Logger(transport, formatter, { minLevel: 'info' })

// EFTER: Kompleksitet trukket ned
const logger = createLogger() // zero-config
const logger = createLogger({ level: 'debug', output: 'custom.log' }) // overrides
```

## Mønster 3: Eliminér Information Leakage

**Hvornår:** Samme designbeslutning (dataformat, protokol) er spredt over flere moduler.

**Fremgangsmåde:**

1. Identificér den delte designbeslutning
2. Skab ét modul der ejer denne beslutning
3. Lad andre moduler interagere gennem det nye moduls interface
4. Fjern duplikeret viden fra de andre moduler

**Eksempel:**

```typescript
// FØR: JSON API format spredt over 3 filer
// api/users.ts:    const response = { data: users, meta: { total: count } }
// api/orders.ts:   const response = { data: orders, meta: { total: count } }
// api/products.ts: const response = { data: products, meta: { total: count } }

// EFTER: Ét modul ejer response-formatet
// api/response.ts
export function paginated<T>(data: T[], total: number) {
  return { data, meta: { total } }
}
// api/users.ts:    return paginated(users, count)
```

## Mønster 4: Generalisér for Dybde

**Hvornår:** Flere specialiserede moduler har overlappende funktionalitet.

**Fremgangsmåde:**

1. Identificér den generelle funktionalitet bag specialiseringerne
2. Skab et generelt modul med en simpel, bred interface
3. Implementér specialiserede use cases oven på det generelle modul

**Princip:** Et modul der kan bruges i mange kontekster har typisk et simplere interface end et der er skræddersyet til én kontekst.

**Eksempel:**

```typescript
// FØR: Specialiserede validatorer
function validateEmail(value: string): boolean { ... }
function validatePhone(value: string): boolean { ... }
function validatePostalCode(value: string): boolean { ... }

// EFTER: Generelt valideringsmodul
function validate(value: string, rules: ValidationRule[]): ValidationResult { ... }

// Specialiseringer som konfiguration
const emailRules: ValidationRule[] = [required(), pattern(EMAIL_REGEX)]
const phoneRules: ValidationRule[] = [required(), pattern(PHONE_REGEX)]
```

## Mønster 5: Reorganisér til Feature-Baseret Struktur

**Hvornår:** Kodebasen er organiseret efter teknisk lag i stedet for domæne/feature.
**Bemærk:** Dette mønster er mest relevant for mellemstore til store projekter. For små projekter eller libraries kan en flad struktur være mere passende.

**Fremgangsmåde:**

1. Identificér logiske features/domæner
2. Skab en mappe per feature
3. Flyt al relateret kode ind i feature-mappen
4. Skab en `index.ts`/public interface per feature
5. Inter-feature kommunikation kun via public interfaces

```
// FØR: Teknisk lag
src/
  routes/userRoutes.ts, orderRoutes.ts
  models/user.ts, order.ts
  services/userService.ts, orderService.ts

// EFTER: Feature-baseret med deep modules
src/
  features/
    users/
      index.ts          ← public interface
      internal/          ← privat implementering
    orders/
      index.ts          ← public interface
      internal/
  shared/
    index.ts            ← fælles utilities
```

## Test-strategi

Deep modules kræver en specifik teststrategi:

1. **Interface-niveau tests (primær):** Test modulet via dets public interface. Disse tests ER kontrakten.
2. **Integration tests:** Verificér at moduler arbejder korrekt sammen via interfaces.
3. **Interne tests (sekundær):** Kun som supplement for kompleks intern logik.

**Pointe:** Interface-tests gør det sikkert for AI at refaktorisere implementeringen frit.
