---
description: TypeScript kodestandarder for projektet
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript retningslinjer

## Generelt
- Brug altid eksplicitte typer - undgå `any`
- Foretræk `interface` over `type` for objekter
- Brug `readonly` hvor data ikke skal muteres

## Navngivning
- PascalCase til interfaces og typer
- camelCase til variabler og funktioner
- Prefix interfaces med `I` kun hvis det er konvention i projektet

## Fejlhåndtering
- Brug `Result<T, E>` pattern frem for exceptions hvor muligt
- Valider input ved systemgrænser