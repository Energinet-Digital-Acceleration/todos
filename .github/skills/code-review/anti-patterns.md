# Code Review Anti-Patterns

## Reviewer Anti-Patterns

| Anti-Pattern                   | Problem                                          | Solution                                                  |
| ------------------------------ | ------------------------------------------------ | --------------------------------------------------------- |
| **Rubber-stamping**            | LGTM without reading the code                    | Multi-pass ensures thoroughness                           |
| **Nitpick overload**           | Focus on style while logic bugs go unnoticed     | Prioritize passes: security and logic first               |
| **Gatekeeper syndrome**        | Blocking on personal preference                  | Follow Google standard: approve if it improves the system |
| **Inconsistent rigor**         | Different standards for different reviews        | Use checklists for consistency                            |
| **No praise**                  | Only negative feedback                           | Require at least one 🟢 per review                        |
| **Reviewing too much at once** | >200 lines → defect detection drops dramatically | Split into chunks                                         |

## Author Anti-Patterns

| Anti-Pattern        | Problem                                            | Solution                              |
| ------------------- | -------------------------------------------------- | ------------------------------------- |
| **Giant CLs**       | 1000+ lines; impossible to review thoroughly       | Max ~200 lines; stacked PRs           |
| **Mixed purposes**  | Feature + refactor + style change in same CL       | Separate into distinct CLs            |
| **Missing context** | No PR description or link to ticket                | Require description and context       |
| **No self-review**  | Sending code to review without reading it yourself | Self-review checklist first           |
| **Missing tests**   | "Tests will come later"                            | Tests in same CL (except emergencies) |

## Cognitive Load Research

From Microsoft (Greiler et al.) and cognitive science:

- Working memory holds ~4-7 items at once
- At ~450 lines/hour, **87%** of reviews miss defects
- Defect detection drops dramatically with large changesets
- Overloaded reviewers leave _more_ comments but _fewer useful_ ones
- **200 lines** is Google's soft limit — a third of Google's changes touch only one file
- Small changes get careful reads; large changes get skimmed

---

## AI Reviewer Anti-Patterns

| Anti-Pattern            | Problem                                                | Solution                                                         |
| ----------------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| **Hallucinated bugs**   | Flags issues not present in the code                   | Read full file context and quote exact evidence before raising   |
| **Generic boilerplate** | Gives vague feedback without actionable value          | Require file, line, concrete fix, and principle for each finding |
| **Over-reviewing**      | Floods author with low-value comments                  | Prioritize top findings by severity and cap minor comments       |
| **Framework ignorance** | Suggests patterns that conflict with project standards | Read project instructions and tech conventions before reviewing  |
| **Context amnesia**     | Reviews changed lines without surrounding context      | Read nearby code, imports, and call sites before concluding      |
