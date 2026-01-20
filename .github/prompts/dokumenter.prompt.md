---
description: Generer dokumentation for den valgte kode
agent: edit
argument-hint: Beskriv hvem dokumentationen er til (fx "nye udviklere", "API brugere")
---

Tilføj dokumentation til følgende kode:
```
${selection}
```

## Målgruppe

${input:audience:Hvem er dokumentationen til?}

Hvis ingen målgruppe er angivet, antag at dokumentationen er til kolleger og andre softwareudviklere.

## Instruktioner

- Tilføj JSDoc/TSDoc kommentarer til funktioner og klasser
- Beskriv parametre og returværdier med typer
- Inkluder et kort eksempel på brug hvis relevant
- Tilpas detaljeniveauet til målgruppen
- Skriv dokumentationen på engelsk (kodestandard)
- Behold al eksisterende kode uændret