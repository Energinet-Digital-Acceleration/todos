---
description: TypeScript kodestandarder for projektet
applyTo: '**/*.ts,**/*.tsx'
---

# TypeScript retningslinjer

## Generelt

- Brug altid eksplicitte typer - undgå `any`
- Foretræk `interface` over `type` for objekter
- Brug `readonly` hvor data ikke skal muteres

## Navngivning

- PascalCase til interfaces og typer
- camelCase til variabler og funktioner
- Brug ikke `I`-prefix på interfaces i dette projekt

## Typer og domænemodeller

- Foretræk string union types frem for `enum` i app-kode
- Brug `enum` kun ved interop-krav eller eksterne kontrakter
- Brug literal types til små, lukkede værdimængder

## Utility types

- Brug `Readonly<T>` for immutable data contracts
- Brug `Pick<T, K>` og `Omit<T, K>` til afledte view-modeller
- Undgå dybe utility-kæder der skader læsbarhed

## Kontrolflow og exhaustiveness

- Brug `switch` med exhaustiveness check for union types
- Brug `never` i default-branch for at fange manglende cases
- Håndter alle states eksplicit frem for implicit fallback

## Fejlhåndtering

- Brug `Result<T, E>` pattern frem for exceptions hvor muligt
- Valider input ved systemgrænser
