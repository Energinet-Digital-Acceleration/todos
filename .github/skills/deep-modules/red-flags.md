# Red Flags — Tegn på dårligt design

Brug disse som detektionsregler ved analyse af en kodebase.

## Detektionstabel

| Red Flag | Beskrivelse | Sådan finder du det |
|---|---|---|
| **Shallow Module** | Interfacet er næsten lige så komplekst som implementeringen | Sammenlign antal exports med intern LOC. Ratio < 3 = shallow |
| **Information Leakage** | En designbeslutning er reflekteret i flere moduler | Søg efter duplikerede typer/strukturer på tværs af filer |
| **Temporal Decomposition** | Kodestruktur baseret på eksekveringsrækkefølge | Funktioner navngivet step1/step2 eller init→process→cleanup |
| **Overexposure** | API tvinger kaldere til at kende sjældent brugte features | Tæl obligatoriske parametre vs. faktisk brug i kodebasen |
| **Pass-Through Method** | Metode der blot videresender til en anden | Funktioner med < 3 linjer der kalder én anden funktion med ~samme signatur |
| **Repetition** | Ikke-triviel kode gentaget flere steder | Identiske eller næsten-identiske kodeblokke |
| **Special-General Mixture** | Specialiseret kode blandet i generelle funktioner | Konfigurationsspecifik logik i generelle moduler |
| **Conjoined Methods** | To metoder med så mange afhængigheder at man ikke kan forstå den ene uden den anden | Funktioner der altid ændres sammen (check git log) |
| **Vague Name** | Upræcis navngivning | Navne som `handle`, `process`, `data`, `manager`, `utils` |
| **Hard to Describe** | Dokumentation skal være lang for at være komplet | Komplekse docstrings/JSDoc der er svære at holde kortfattede |
| **Nonobvious Code** | Adfærd kan ikke forstås umiddelbart | Implicit state, side effects, magiske tal |

## Analysestrategi

### Trin 1: Find shallow modules

```
For hvert modul (fil/klasse/mappe med exports):
  interface_bredde = antal eksporterede funktioner + typer + konstanter
  impl_dybde = intern LOC + antal private funktioner + cyklomatisk kompleksitet
  ratio = impl_dybde / interface_bredde
  
  ratio < 3  → ⚠️ Shallow
  ratio 3-10 → ✅ Acceptabel  
  ratio > 10 → 🟢 Deep
```

**Vigtigt:** LOC alene er ikke nok. Kombiner med:
- Antal imports/dependencies (høj = potentielt leaky)
- Change coupling fra git log (filer der ændres sammen)
- Faktisk brug af exports (ubrugte exports = overexposure)

### Trin 2: Find information leakage

Søg efter et dataformat, en protokol eller algoritme der optræder i mere end ét modul.
Typiske tegn:
- Samme type/interface defineret flere steder
- Parsing/serialisering af samme format i flere filer
- Hardcoded værdier der matcher på tværs af moduler

### Trin 3: Find pass-through methods

```
For hver funktion:
  Hvis body primært er ét kald til en anden funktion
  OG parametrene videregives direkte
  OG tilføjet logik er < 3 linjer
  → Kandidat til eliminering eller sammenlægning
```

### Trin 4: Map ændringsklynger

```
Brug git log til at finde filer der ofte ændres sammen:
  Hvis to+ filer næsten altid committes sammen
  → De bør sandsynligvis være i samme modul
```
