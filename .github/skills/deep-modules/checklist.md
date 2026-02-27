# Checkliste: Er modulet dybt nok?

Brug denne checkliste til at evaluere hvert modul efter refaktorisering.

## Interface-kvalitet

- [ ] **Interfacet er markant simplere end implementeringen** — Kan en AI-agent forstå modulet blot ved at læse interfacet?
- [ ] **Mest almindelige use case kræver minimal konfiguration** — Kan modulet bruges korrekt uden at læse implementeringen?
- [ ] **Meningsfuldt navn** — Kommunikerer modulets navn klart dets ansvar?

## Information hiding

- [ ] **Designbeslutninger er skjult** — Er dataformat, algoritmevalg og service-detaljer interne?
- [ ] **Ingen information leakage** — Er designbeslutninger duplikeret i andre moduler?
- [ ] **Stabile interfaces** — Kan implementeringen ændres uden at påvirke kaldere?

## Kompleksitetshåndtering

- [ ] **Pull complexity downward** — Håndterer modulet edge cases internt?
- [ ] **Ingen pass-through methods** — Tilføjer hver funktion reel værdi?
- [ ] **Ingen shallow wrappers** — Er der funktioner der bare kalder én anden funktion?

## Testbarhed

- [ ] **Testbar via interface** — Kan korrekthed verificeres via public API?
- [ ] **Interface-tests eksisterer** — Er der tests der fungerer som kontrakt?
