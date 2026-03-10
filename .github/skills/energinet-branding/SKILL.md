---
name: energinet-branding
description: Apply Energinet brand identity to UI, documents, and content. Use when styling components with Energinet colors, typography, tone of voice, or when generating branded text, HTML, or presentations. Includes logo assets, color palette, and brand voice guidelines.
---

# Energinet Branding

Apply Energinet's official brand identity when building UI, writing content, or generating documents.

## When to use this skill

- Styling components or pages with Energinet colors and typography
- Writing user-facing text that should match Energinet's tone of voice
- Generating branded HTML, emails, presentations, or documents
- Choosing the right logo variant for a given context
- Applying the correct color palette to charts, graphs, or UI elements

## Brand voice (summary)

Energinet communicates as a **trusted public institution** — technically precise, accessible, and forward-looking. Never salesy. Always fact-based.

| We are          | We are NOT                              |
| --------------- | --------------------------------------- |
| Fagligt præcise | Akademisk tunge                         |
| Tilgængelige    | Forsimplende                            |
| Troværdige      | Bureaukratiske                          |
| Fremadrettede   | Naive                                   |
| Samarbejdende   | Envejs-kommunikerende                   |
| Nordisk enkle   | Minimalistiske på bekostning af klarhed |

Full voice guidelines: see `brand-voice-guidelines.md` in this skill directory.

## Color palette (quick reference)

### Primary colors (large surfaces)

| Name          | Hex       | Usage                    |
| ------------- | --------- | ------------------------ |
| Grøn (primær) | `#00A58D` | Main accent, large areas |
| Mørk grøn     | `#008A8B` | Secondary surface        |
| Lys grøn      | `#9FCD91` | Light elements           |
| Mørk blå-grøn | `#09505D` | Contrast, dark surfaces  |

### Key secondary colors

| Name          | Hex       | Usage                                 |
| ------------- | --------- | ------------------------------------- |
| Kontrast grøn | `#00847C` | Accessible contrast on web            |
| Gul accent    | `#FFD424` | Highlight single words/small elements |
| Mørk blå      | `#293A4C` | Dark background / body text           |
| Rød           | `#CE3E33` | Negative only (errors, downtrend)     |

Full palette with all 15 colors in `brand-voice-guidelines.md`.

### CSS usage

```css
:root {
  --energinet-primary: #00a58d;
  --energinet-primary-dark: #008a8b;
  --energinet-primary-light: #9fcd91;
  --energinet-contrast: #09505d;
  --energinet-accent-yellow: #ffd424;
  --energinet-text-dark: #293a4c;
  --energinet-bg-light: #f5faf9;
  --energinet-error: #ce3e33;
}
```

## Typography

- **Primary font**: DIN Next (Light, Regular, Medium, Bold) — for designed materials
- **Office fallback**: Calibri — Word, PowerPoint, Outlook
- **Web fallback**: Inter, Source Sans Pro, or system sans-serif
- **Headings**: Always uppercase, Light or Regular weight, slight letter-spacing
- **Body**: Light weight with Regular sub-headings
- **Border-radius**: 2–4px for clean, professional look

## Logo assets

Logo files are in the `files/` directory in multiple formats:

| Format | Directory             | Best for                   |
| ------ | --------------------- | -------------------------- |
| PNG    | `energinet_logo_png/` | Web, screen, HTML          |
| JPG    | `energinet_logo_jpg/` | Presentations, backgrounds |
| PDF    | `energinet_logo_pdf/` | Print, high-quality output |
| EPS    | `energinet_logo_eps/` | Vector editing, print      |

### Logo variants

| Variant     | Use case                               |
| ----------- | -------------------------------------- |
| `primaer`   | Default — green/blue on white/light bg |
| `hvid`      | White logo on dark/colored backgrounds |
| `sort`      | Black — for monochrome materials       |
| `graa`      | Grey — subtle/muted contexts           |
| `sekundaer` | Secondary variant                      |

**Rules**: Never crop the logo. Always horizontal. Only use defined color variants.

## Design element: "Nettet"

A graphical net element symbolizing the electricity and gas grid. Use in white or primary colors. Typically placed top-right on cover pages.

## Digital implementation checklist

When building Energinet-branded UI:

1. Use `#00A58D` as primary accent and hover color
2. Background: white or very light green (`#f5faf9`)
3. Text: dark (`#293A4C` or black)
4. Links and interactive elements: `#00A58D`
5. Yellow accent (`#FFD424`) sparingly for highlights
6. Use Inter or Source Sans Pro as web font
7. Border-radius: 2–4px
8. Include the primary PNG logo for web contexts

## Tone-by-context quick guide

| Context           | Formality  | Technical depth | Key principle                        |
| ----------------- | ---------- | --------------- | ------------------------------------ |
| Internal comms    | Low-Medium | Varies          | Direct, informal, Danish preferred   |
| Compliance/legal  | High       | High            | Precision and source references      |
| Presentations     | Medium     | Medium          | Visual, minimal text, icons dominate |
| Social media      | Low        | Low             | Video/images/gif for attention       |
| Technical docs    | High       | High            | Precise, reproducible                |
| Employer branding | Low-Medium | Low             | Energetic, cheerful, vivid           |
