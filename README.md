# Fra Prompting til Engineering

Workshop om konfiguration af GitHub Copilot i VS Code: Rules, Skills og Agents.

## Demo-projekt

En simpel todo-app til hands-on øvelser.

```bash
bun install
bun run dev
```

## Evolutionsstigen for Context Management

| Niveau | Type | Context | Beskrivelse |
|--------|------|---------|-------------|
| 1 | [Rules](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) | Static | Altid til stede. Kodestandarder og arkitektur. |
| 1.5 | [Prompt Files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) | On-demand | Genanvendelige prompt-templates med variabler. |
| 2 | [Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) | Dynamic | On-demand viden. Indlæses kun når relevant. |
| 3 | [Agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) | Specialized | Persona-drevet. Begrænsede værktøjer per rolle. |

## Fil-struktur

| Type | Placering | Scope |
|------|-----------|-------|
| Global Rules | `.github/copilot-instructions.md` | Alle chat requests |
| Scoped Rules | `*.instructions.md` | Fil-specifik via `applyTo` glob, kan nestes |
| Prompt Files | `.github/prompts/<navn>.prompt.md` | Genanvendelige prompts med variabler |
| Skills | `.github/skills/<navn>/SKILL.md` | Aktiveres automatisk |
| Agents | `.github/agents/<navn>.agent.md` | Via @-menu |

## Best Practices

**Rules:**
- Hold det rent - generelle standarder, ikke specifikke opgaveløsninger
- Modularitet - flere `.instructions.md` filer med specifikke scopes
- Living Artifact - opdater løbende når I finder fejlmønstre

**Prompt Files:**
- Pak "Perfect Prompts" ind i genanvendelige templates
- Brug variabler til dynamisk indhold
- Del på tværs af teamet via git

**Skills:**
- Undgå Context Bloat - pak komplekse workflows i moduler
- Brug `name` og `description` til aktivering

**Agents:**
- Begræns værktøjer per rolle (Planner: read-only, Developer: full write)
- Brug handoffs til at orkestrere workflows

## Next Steps

1. **Etabler Fundamentet** - Opret `.github/copilot-instructions.md` med core guidelines
2. **Byg en Skill** - Identificer et pain point (f.eks. test-setup) og lav første Skill
3. **Definer Roller** - Eksperimenter med en 'Planner' agent til at separere arkitektur fra kodning

## Ressourcer

- [Workshop Slides](slides/vscode_custom_instructions.pdf) - NotebookLM præsentation fra denne workshop
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/customization/overview) - Fuld dokumentation
- [Agent Skills Spec](https://agentskills.io/home) - Open standard (Claude Code, Cursor, VS Code, GitHub, OpenAI)
- [Agent Skills in VS Code](https://www.youtube.com/watch?v=JepVi1tBNEE) - Video walkthrough
