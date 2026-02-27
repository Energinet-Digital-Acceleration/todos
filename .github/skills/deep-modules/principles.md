# Ousterhouts 15 Designprincipper

Fra _A Philosophy of Software Design_ (2. udgave, 2021).

## De 15 principper

1. **Complexity is incremental** — Kompleksitet opbygges gradvist; vær opmærksom på selv små beslutninger
2. **Working code isn't enough** — Fungerende kode er ikke tilstrækkeligt; design matters
3. **Make continual small investments** — Løbende små forbedringer af systemdesign betaler sig
4. **Modules should be deep** — Kerneprincipper: simple interfaces, komplekse implementeringer
5. **Design interfaces for common usage** — De mest almindelige use cases skal være trivielle
6. **Simple interface > simple implementation** — Prioritér altid interfacets simplicitet
7. **General-purpose modules are deeper** — Generiske moduler har tendens til dybere interfaces
8. **Separate general-purpose and special-purpose** — Hold generel og specialiseret kode adskilt
9. **Different layers, different abstractions** — Hvert lag bør repræsentere et nyt abstraktionsniveau
10. **Pull complexity downward** — Træk kompleksitet ind i modulet i stedet for at eksponere det
11. **Define errors out of existence** — Design så fejltilstande ikke kan opstå; brug f.eks. idempotente operationer, fornuftige defaults, og typesystemet til at eliminere ugyldige tilstande
12. **Design it twice** — Overvej altid mindst to alternative designs
13. **Comments should describe non-obvious things** — Kommentarer forklarer det koden ikke selv udtrykker
14. **Design for ease of reading, not writing** — Optimer for læsbarhed
15. **Increments should be abstractions, not features** — Byg abstraktioner, ikke features

## Den visuelle metafor

Tænk på moduler som rektangler:

- **Bredde** = interfacets kompleksitet (antal exports, parametre, typer)
- **Dybde** = implementeringens funktionalitet (intern logik, LOC)

**Deep module** = smalt, højt rektangel (lille overflade, stor dybde)
**Shallow module** = bredt, lavt rektangel (stor overflade, lille dybde)

## Klassiske eksempler på deep modules

- **Unix filsystem**: 5 funktioner (`open`, `read`, `write`, `lseek`, `close`) skjuler enorm kompleksitet
- **Garbage collectors**: Næsten intet synligt interface, ekstremt kompleks intern logik
- **Pytest `assert`**: Ét statement erstatter snesevis af assert-varianter

## Relevans for AI-agenter

AI-agenter navigerer en kodebase som en ny medarbejder uden hukommelse:

- Deep modules lader AI'en læse ét interface og forstå modulet
- Shallow modules tvinger AI'en til at læse hundredvis af sammenkoblede filer
- Progressive disclosure: interface = discovery-lag, implementering = execution-lag
- Sparrer tokens, tid og forbedrer reasoning-kvalitet
