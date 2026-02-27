```skill
---
name: deep-modules
description: >
  Analysér og refaktorisér en kodebase mod "deep modules"-principperne fra John Ousterhouts
  A Philosophy of Software Design. Brug til at forbedre navigerbarhed for AI-agenter,
  reducere kognitiv kompleksitet, og skabe klare modulgrænser med simple interfaces og
  rig funktionalitet bag dem.
---

# Deep Modules Refactoring

Denne skill hjælper med at analysere og forbedre en kodebase baseret på "deep modules"-principperne.

**Kerneide:** Et modul skal have et simpelt interface og en kompleks implementering.
AI-agenter navigerer en kodebase som en ny medarbejder uden hukommelse — deep modules
med klare interfaces gør det muligt at forstå hvad et modul gør uden at læse
implementeringen.

## Hvornår bruges denne skill

- Kodebasen har mange små filer med minimal logik
- AI-agenter har svært ved at navigere og forstå kodestrukturen
- Du vil forbedre modulgrænser og information hiding
- Du vil reducere token-forbrug ved AI-assisteret udvikling

## Workflow

### 1. Analysér (læs [red-flags.md](./red-flags.md))

Scan kodebasen for problemer:

1. **Find shallow modules**: Moduler hvor interfacet er næsten lige så komplekst som implementeringen
2. **Detect information leakage**: Designbeslutninger der er spredt over flere moduler
3. **Spot pass-through methods**: Funktioner der bare videresender til andre
4. **Map ændringsklynger**: Filer der altid ændres sammen bør sandsynligvis samles

For hvert modul (fil/klasse/mappe med exports):
- Tæl eksporterede members (interface-bredde)
- Vurdér intern kompleksitet (LOC, dependencies, branches)
- Identificér red flags fra [red-flags.md](./red-flags.md)

### 2. Prioritér

Rangér fund efter impact:
- Moduler med flest importører påvirker mest
- Information leakage er ofte den vigtigste fix
- Pass-through methods er lavt hængende frugt

### 3. Refaktorisér (læs [refactoring-patterns.md](./refactoring-patterns.md))

Anvend det relevante mønster:
1. **Konsolidér shallow modules** → saml relaterede moduler bag ét interface
2. **Pull complexity downward** → flyt konfiguration ind i modulet
3. **Eliminér information leakage** → ét modul ejer hver designbeslutning
4. **Generalisér for dybde** → erstat specialiserede moduler med generelle
5. **Reorganisér til feature-baseret struktur** → organisér efter domæne, ikke teknik

### 4. Verificér (brug [checklist.md](./checklist.md))

For hvert refaktoriseret modul:
- Kør eksisterende tests — de skal stadig passe
- Verificér at ingen ekstern kode importerer fra `internal/`
- Tjek at det mest almindelige use case er trivielt

## Regler for denne skill

- Lav ALTID ændringer inkrementelt — én refaktorisering ad gangen
- Kør tests efter HVER ændring
- Bevar eksisterende adfærd — dette er refaktorisering, ikke feature-arbejde
- Når du er i tvivl, foretruk et simplere interface over en simplere implementering
- Undgå anti-patterns beskrevet i [anti-patterns.md](./anti-patterns.md)
- Følg [Ousterhouts principper](./principles.md) som designguide

## Vigtige principper (uddybet i [principles.md](./principles.md))

1. **Moduler skal være dybe** — simpelt interface, kompleks implementering
2. **Pull complexity downward** — interfacets simplicitet trumfer implementeringens
3. **Information hiding** — hvert modul ejer sine designbeslutninger
4. **Design for AI-navigering** — filsystem og interfaces faciliterer progressive disclosure
5. **Test via interfaces** — interface-tests er kontrakten; implementeringen kan ændres frit
```
