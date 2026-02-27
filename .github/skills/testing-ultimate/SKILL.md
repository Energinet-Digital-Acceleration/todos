---
name: testing-ultimate
description: >
  Comprehensive testing skill for developing and maintaining high-quality tests.
  Covers test analysis, smell detection, test strengthening, characterization tests,
  TDD workflow, and Humble Object refactoring. Technology and language agnostic.
  Use when writing, reviewing, improving, or refactoring tests in any project.
argument-hint: '[command] [path or context]'
---

# Ultimate Testing Skill

A technology-agnostic skill for building and maintaining high-quality test suites,
grounded in established testing principles from Kent Beck, Vladimir Khorikov,
Gerard Meszaros, and Michael Feathers.

## Core principles

1. **Test behavior, not implementation** — tests should describe what the system does, not how
2. **Optimize for refactoring safety** — tests must survive internal restructuring
3. **Fast feedback** — the suite must run quickly enough to use constantly
4. **Tests are investments** — every test should have positive ROI (more value than maintenance cost)
5. **Interface-level testing** — test through public APIs; internals can change freely

See [philosophy.md](./philosophy.md) for the full theoretical foundation.

## Available workflows

### `/testing-ultimate analyze-tests`

Produce a quality dashboard for the project's test suite.

**Steps:**

1. **Discover test files** — scan for common patterns (`*.test.*`, `*.spec.*`, `__tests__/`, `*_test.*`, test directories)
2. **Collect metrics per module:**
   - Number of tests and test files
   - Average test length (lines)
   - Proportion of tests using mocks/stubs
   - Assertion density (assertions per test)
   - Modules with zero test coverage
3. **Apply heuristics:**
   - Long tests (>40 lines) → risk of Eager/Obscure test
   - High mock ratio (>60%) → risk of overspecification
   - Complex domain code without tests → coverage gap
   - Test files significantly larger than source → possible duplication
4. **Generate report:**
   - Table of modules with test counts and risk flags
   - List of untested modules ranked by complexity
   - Top 5 improvement priorities with links to relevant workflows

**Output format:**

```markdown
# Test Suite Analysis

## Summary

- Test files: X | Tests: Y | Avg length: Z lines
- Mock usage: X% | Assertion density: X/test

## Coverage gaps

| Module | Complexity | Tests | Risk |
| ------ | ---------- | ----- | ---- |
| ...    | ...        | ...   | ...  |

## Recommendations

1. [Priority action with rationale]
```

---

### `/testing-ultimate find-test-smells`

Detect common test smells in existing test files. See [smells.md](./smells.md) for the full catalog.

**Steps:**

1. **Scan test files** in the project
2. **Check each test for smells:**

| Smell                  | Detection rule                                                            |
| ---------------------- | ------------------------------------------------------------------------- |
| **Obscure Test**       | >30 lines without helpers; unclear naming; no assertion messages          |
| **Eager Test**         | >4 assertions on different concerns in one test                           |
| **Conditional Logic**  | `if`, `for`, `while`, `switch` inside test body                           |
| **Fragile Test**       | Assertions on private/internal state; strict mock call-order verification |
| **Mystery Guest**      | Direct file system, network, or DB access without explicit fixtures       |
| **Test Duplication**   | Near-identical test bodies (>80% similarity)                              |
| **Assertion Roulette** | Multiple assertions without distinct messages                             |

3. **Generate findings table:**

```markdown
| File | Test | Smell | Severity | Suggested fix |
| ---- | ---- | ----- | -------- | ------------- |
```

4. **Offer to auto-fix** simple smells (naming, splitting eager tests, adding messages)

---

### `/testing-ultimate strengthen-tests`

Improve existing tests to increase their value according to Beck's Desiderata and Khorikov's 4 goals.

**Steps:**

1. **Read target test file(s)**
2. **Apply improvements in order:**
   - **Naming**: Rename tests to `[scenario]_[expected outcome]` or equivalent convention
   - **Split**: Break Eager Tests into focused single-concern tests
   - **Extract**: Move repeated setup into shared helpers/fixtures
   - **Behavioral assertions**: Replace implementation-detail checks with behavior-level assertions
   - **Messages**: Add clear assertion failure messages
   - **Remove dead tests**: Flag tests that always pass or test nothing meaningful
3. **Make changes incrementally** — one improvement at a time, run tests after each
4. **Report changes made** with before/after examples

**Conservative approach**: Never change what a test verifies — only improve how it's expressed.

---

### `/testing-ultimate add-characterization [path]`

Add characterization tests to legacy/untested code (Feathers approach).

**Steps:**

1. **Analyze the target** at `[path]`:
   - Map dependencies (I/O, DB, network, frameworks, global state)
   - Identify existing seams (interfaces, DI, config points)
   - Assess complexity and branching
2. **Introduce seams if needed:**
   - Suggest interface extraction for hard dependencies
   - Propose dependency injection or wrapper patterns
   - Create adapter/facade for framework coupling
3. **Generate characterization tests:**
   - Cover current behavior for typical inputs
   - Test boundary cases derived from code inspection
   - Test error paths that are already handled
   - Mark each test clearly: `// Characterization test — documents existing behavior`
4. **Verify tests pass** against current code (they MUST pass — they describe what IS, not what should be)
5. **Document gaps** — list behaviors that need dedicated unit tests after refactoring

**Key rule**: Characterization tests document reality. If the test fails, the test is wrong (not the code).

---

### `/testing-ultimate enforce-tdd`

Run a guided Red-Green-Refactor TDD loop.

**Steps:**

1. **RED** — Write the test first:
   - Ask/determine the next desired behavior
   - Write ONE failing test that specifies this behavior
   - Run tests → confirm it fails (and only that test fails)
   - If it passes: the behavior already exists — pick a different one

2. **GREEN** — Make it pass minimally:
   - Write the simplest code that makes the test pass
   - No extra features, no premature abstractions
   - Run tests → confirm all green

3. **REFACTOR** — Clean up with safety net:
   - Improve code structure while all tests stay green
   - Apply patterns, extract methods, simplify
   - Run tests after every change
   - If a test breaks: the refactor changed behavior — revert and retry

4. **Log each iteration:**

```markdown
## TDD Log

### Cycle 1: [Behavior description]

- RED: Added test `test_X_does_Y` → ❌ failed as expected
- GREEN: Implemented X → ✅ all pass
- REFACTOR: Extracted helper → ✅ all pass
```

5. **Repeat** until the feature is complete

**Rules:**

- Never write production code without a failing test
- One behavior per cycle
- Tests drive design decisions

---

### `/testing-ultimate refactor-to-humble [path]`

Apply the Humble Object pattern to make untestable code testable.

**Steps:**

1. **Identify the problem** at `[path]`:
   - Code that mixes business logic with I/O, UI, framework, or infrastructure
   - Hard-to-test because of embedded dependencies
2. **Split into two parts:**
   - **Humble Object**: Thin shell handling I/O/framework concerns (minimal logic, hard to test = ok)
   - **Logic Object**: Pure business logic, easily testable in isolation
3. **Refactoring steps:**
   - Extract business rules into a new pure function/class/module
   - Make the Humble Object delegate to the Logic Object
   - Ensure the Humble Object is "too simple to break"
4. **Write tests for the Logic Object** (should be straightforward now)
5. **Verify the Humble Object** still works (integration/smoke test level)

**Examples of Humble Object splits:**

- UI Component → Humble (renders) + Logic (computes what to render)
- API Handler → Humble (HTTP concerns) + Logic (request processing)
- Database Repository → Humble (SQL/ORM) + Logic (query building, validation)
- File Processor → Humble (reads/writes files) + Logic (transforms data)

---

## Checklists

See [checklists.md](./checklists.md) for operational checklists used across all workflows.

## When to use which workflow

| Situation                               | Workflow                                    |
| --------------------------------------- | ------------------------------------------- |
| Starting a new project or feature       | `enforce-tdd`                               |
| Inheriting code without tests           | `add-characterization` → `find-test-smells` |
| Tests exist but feel brittle            | `find-test-smells` → `strengthen-tests`     |
| Want a health check                     | `analyze-tests`                             |
| God class mixing logic and I/O          | `refactor-to-humble`                        |
| AI agent is refactoring production code | `enforce-tdd` or `strengthen-tests` first   |
