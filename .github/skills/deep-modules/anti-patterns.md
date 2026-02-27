# Anti-Patterns at Undgå

| Anti-Pattern                            | Problem                                             | Løsning                                                                          |
| --------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Utils-mappen der vokser**             | Dump for alt muligt; intet information hiding       | Flyt utilities ind i features der bruger dem, eller skab fokuserede deep modules |
| **Én klasse/funktion per fil**          | Shallow modules overalt; kognitiv overhead for AI   | Konsolidér relaterede enheder bag ét interface                                   |
| **Konfiguration eksponeret opad**       | Skubber kompleksitet til kaldere                    | Beregn fornuftige defaults; tilbyd overrides                                     |
| **Barrel-filer der re-eksporterer alt** | Falsk illusion af interface-design                  | Design intentionelle interfaces der kun eksponerer det nødvendige                |
| **Mikro-funktioner som separate filer** | Massiv navigation-overhead for AI-agenter           | Saml i meningsfulde moduler; brug private hjælpefunktioner                       |
| **Lag-for-lag gennemstik**              | Controller→Service→Repository der bare videresender | Eliminér pass-through lag; hvert lag skal tilføre reel værdi                     |
| **Prematur abstraktion**                | Generalisering uden verificeret behov               | Vent til du ser konkret duplikering; "design it twice"                           |
| **God object / mega-modul**             | Ét modul der gør alt                                | Split efter ansvar, men behold deep interfaces                                   |
