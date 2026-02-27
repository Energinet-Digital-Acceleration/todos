# Feedback Format: Conventional Comments

## Labels

| Label          | Meaning                                     | Blocking               |
| -------------- | ------------------------------------------- | ---------------------- |
| **praise**     | Something positive; recognize good practice | Never                  |
| **nitpick**    | Trivial, preference-based observation       | Always non-blocking    |
| **suggestion** | Improvement proposal; explicit what and why | Typically non-blocking |
| **issue**      | A problem that must be resolved             | Typically blocking     |
| **question**   | Something needing clarification             | Non-blocking           |
| **thought**    | An observation; not a direct request        | Non-blocking           |

## Decorations

| Decoration         | Meaning                           |
| ------------------ | --------------------------------- |
| **(blocking)**     | Must be resolved before merge     |
| **(non-blocking)** | Should not prevent merge          |
| **(if-minor)**     | Only fix if the change is trivial |

## Severity Levels

| Severity     | Icon | Description            | Examples                                                  |
| ------------ | ---- | ---------------------- | --------------------------------------------------------- |
| **Critical** | 🔴   | Must fix before merge  | Security hole, data loss, breaking change                 |
| **Major**    | 🟠   | Should fix             | Incorrect logic, missing error handling, bad architecture |
| **Minor**    | 🟡   | Nice-to-have           | Style, naming, minor optimization                         |
| **Praise**   | 🟢   | Positive reinforcement | Elegant solution, good practice, improved tests           |

## Template

```
[Severity Icon] [Label (decoration)]: [Short description]

File: path/to/file.ext, line X
[Specific problem description]

Fix:
  [Suggested code or approach]

Reference: [Principle or best practice]
```

## Example

```
🔴 Critical issue (blocking): SQL Injection Vulnerability

File: src/repository.ts, line 45
Problem: String concatenation in SQL query allows injection:
  db.query(`SELECT * FROM users WHERE id = ${userId}`)

Fix:
  db.query('SELECT * FROM users WHERE id = ?', [userId])

Reference: OWASP A03:2021 – Injection
```

## Examples for Each Severity

### 🟠 Major

```
🟠 suggestion (blocking): Duplicate validation logic should be centralized

File: src/lib/TodoInput.svelte, line 23
Problem: Validation rules are duplicated in multiple components, increasing drift risk.

Fix:
  Extract validation into a shared helper in src/lib and reuse it.

Reference: Google Standard — improve overall code health
```

### 🟡 Minor

```
🟡 nitpick (non-blocking): Nit: Prefer descriptive variable name

File: src/stores/todos.ts, line 15
Problem: Variable `t` reduces readability in a core state transformation.

Fix:
  Rename `t` to `todo` for clarity.

Reference: Readability and maintainability best practice
```

### 🟢 Praise

```
🟢 praise: Clear separation of persistence from business logic

File: src/stores/storage.ts, line 1
Positive: localStorage access is isolated, keeping todo business logic cleaner and easier to test.

Reference: Deep Modules — hide implementation details behind simple interfaces
```

## Rules

- Every review must contain at least one 🟢 praise
- Critical and Major issues must include a suggested fix
- Non-blocking observations must be prefixed with "Nit:" or labeled as nitpick
- Reference the underlying principle in every suggestion
