---
name: code-review
description: Multi-pass code review skill based on Google Engineering Practices, Microsoft research, and OWASP security standards with structured Conventional Comments workflows.
argument-hint: '[command] [path or context]'
---

# Code Review Skill

A technology-agnostic skill for conducting thorough, multi-pass code reviews grounded
in research from Google, Microsoft (Greiler et al.), Jason Cohen's Cisco study,
and OWASP.

## Core principles

1. **Continuous improvement, not perfection** — approve if it improves overall code health
2. **Multi-pass review** — different passes catch different problems
3. **Technical facts over opinions** — data and principles trump preferences
4. **Structured feedback** — use Conventional Comments format (see [feedback-format.md](./feedback-format.md))
5. **Always include praise** — positive reinforcement is as important as criticism
6. **Small changes** — review chunks of ~200 lines max; split larger reviews

## Available workflows

### `/code-review full`

Complete multi-pass review of files at a given path.

**Steps:**

1. **Gather context** — read PR description, commit messages, identify changed files and scope
2. **Assess risk** — new feature vs bugfix vs refactor; determine review depth
3. **Pass 1: Architecture & Design (priority: medium, depth: structural)**
   - Does the overall design make sense?
   - Does it fit the system's existing architecture?
   - Are abstraction levels appropriate?
   - Apply [deep modules checklist](./checklists.md) if new modules are introduced
   - Check for over-engineering or under-engineering
   - **Complete when:**
     - Module boundaries and responsibilities are mapped
     - New abstractions are evaluated for necessity and fit
     - Architecture-impacting risks are documented
4. **Pass 2: Logic & Correctness (priority: high, depth: line-by-line)**
   - Does the code do what it claims?
   - Edge cases handled?
   - Error handling correct and consistent?
   - Race conditions / concurrency considered?
   - Data flow and control flow make sense?
   - **Complete when:**
     - All modified functions/methods are checked for correctness
     - Conditional branches and edge cases are considered
     - Error paths are traced to handlers and outcomes
     - Assumptions in control flow are explicitly validated
5. **Pass 3: Security (priority: high, depth: data-flow)**
   - Apply [security checklist](./checklists.md)
   - Input validation, injection, auth, secrets, error leakage
   - **Complete when:**
     - All external inputs are identified
     - Input-to-sink data flow is traced
     - Relevant [security checklist](./checklists.md) items are checked
     - Security findings are severity-labeled with concrete mitigations
6. **Pass 4: Tests (priority: medium, depth: behavior-verification)**
   - Tests included in the change?
   - Tests verify behavior, not implementation?
   - Will tests actually fail when code breaks?
   - Edge case coverage?
   - **Complete when:**
     - Behavior-critical paths have test coverage
     - At least one regression signal exists for each major finding
     - Tests are assessed for false positives and brittleness
7. **Pass 5: Style & Maintainability (priority: low, depth: scan)**
   - Naming clarity
   - Comment quality (why, not what)
   - Style guide adherence
   - Documentation updated?
   - **Complete when:**
     - Naming and comments are reviewed for clarity and intent
     - Style and conventions are validated against project norms
     - Documentation impact is assessed and noted
8. **Compile output:**
   - Sort findings by severity (🔴 → 🟠 → 🟡 → 🟢)
   - Format as Conventional Comments (see [feedback-format.md](./feedback-format.md))
   - Include at least one 🟢 praise
   - Give verdict: **LGTM** / **Needs Changes** / **Needs Discussion**

**Output format:**

```markdown
# Code Review: [scope]

## Summary

- Files reviewed: X | Lines: Y
- Verdict: LGTM / Needs Changes / Needs Discussion

## Findings

🔴 **Critical issue (blocking):** [title]
File: path/to/file.ts, line X
[Problem description]
[Suggested fix with code example]
[Reference to principle]

🟠 **Major suggestion (blocking):** [title]
...

🟡 **Minor nitpick (non-blocking):** [title]
...

🟢 **Praise:** [title]
...
```

---

### `/code-review security`

Focused security review based on OWASP Top 10 and OWASP Code Review Guide v2.

**Steps:**

1. Identify all external inputs (user input, API calls, file reads, env vars)
2. Trace data flow from input to output
3. Check each item in the [security checklist](./checklists.md)
4. For each finding:
   - Assign severity (🔴/🟠/🟡)
   - Reference OWASP category (e.g., A03:2021)
   - Show problem code with file and line
   - Show fix with code example

---

### `/code-review quick`

Fast review for small changes or time-sensitive situations.

**Steps:**

1. Scan for 🔴 Critical issues (security, data loss, breaking changes)
2. Verify tests are included and reasonable
3. Check naming and overall readability
4. Give verdict: LGTM or flag blockers

**Output:** Short report with critical/major issues and one positive observation.

## Clean review output

If no issues are found after all selected passes:

1. Include at least **2-3 🟢 praise** findings tied to specific code decisions
2. State the verdict as **LGTM**
3. List which passes were completed (e.g., Pass 1-5)
4. Keep the output informative; do not return only "LGTM"

---

### `/code-review diff`

Review the current git diff (staged or unstaged).

**Steps:**

1. Check staged changes with `git diff --cached --stat`
2. If staged changes exist, review staged diff with `git diff --cached`
3. If no staged changes exist, review unstaged diff with `git diff`
4. If user specifies a branch comparison, use `git diff main..HEAD`
5. For each changed file, read surrounding context (not just the diff)
6. Run compressed Pass 1-5 per chunk
7. Flag if a small change makes a large function worse → suggest splitting
8. Consider: does this change improve or degrade overall code health?

---

### `/code-review explain`

Explain code review findings in educational context — useful for mentoring.

**Steps:**

1. Run a full review
2. For each finding, add:
   - **Why it matters** — the principle behind the recommendation
   - **What could happen** — concrete consequence if ignored
   - **Learn more** — reference to source material

## Review dimensions

Each pass covers specific dimensions. The full list:

| Dimension     | Key questions                                                  | Pass |
| ------------- | -------------------------------------------------------------- | ---- |
| Design        | Fits architecture? Right abstraction level? Deep modules?      | 1    |
| Correctness   | Does what it claims? Edge cases? Error handling?               | 2    |
| Complexity    | Understandable quickly? Likely to introduce bugs when changed? | 2    |
| Security      | Input validation? Injection? Auth? Secrets?                    | 3    |
| Tests         | Included? Test behavior? Will fail when broken?                | 4    |
| Naming        | Clear, specific, appropriate length?                           | 5    |
| Comments      | Explain why, not what? No stale TODOs?                         | 5    |
| Style         | Follows project conventions?                                   | 5    |
| Performance   | N+1? Right data structures? Resources cleaned up?              | 2    |
| Documentation | READMEs/API docs updated with the change?                      | 5    |

## Rules

- **Never block on personal style preference** — prefix with "Nit:" instead
- **Style changes and functional changes must not be mixed** in the same review
- Require at least one 🟢 praise per review
- Reference principles in every suggestion (Google standard, OWASP, deep modules, etc.)
- Read the whole file for context, not just the changed lines
- Check [anti-patterns.md](./anti-patterns.md) to avoid common review pitfalls

## Key references

- Google Engineering Practices: google.github.io/eng-practices
- OWASP Code Review Guide v2
- Conventional Comments: conventionalcomments.org
- Cohen: _Best Kept Secrets of Peer Code Review_
- Greiler et al.: "Characteristics of Useful Code Reviews" (Microsoft, 2015)
