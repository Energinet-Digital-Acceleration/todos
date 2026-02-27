# Testing Philosophy Reference

## Kent Beck — Test Desiderata

12 desirable properties of tests, acknowledging you cannot maximize all simultaneously:

1. **Isolated** — A test does not affect other tests
2. **Composable** — Tests combine and run in any order
3. **Deterministic** — Same input → always same result
4. **Fast** — Quick execution
5. **Writable** — Reasonably easy to write
6. **Readable** — Easy to read and understand
7. **Behavioral** — Tests behavior, not implementation
8. **Structure-insensitive** — Survives refactoring (structural changes)
9. **Automated** — Runs without manual intervention
10. **Specific** — Failures point precisely to the problem
11. **Predictive** — Catches relevant bugs, not noise
12. **Inspiring** — Tests make you confident and eager to change code

**Key insight**: Test design is about conscious tradeoffs between these properties.

## Vladimir Khorikov — 4 Goals of Unit Tests

1. **Protection against regressions** — Catch bugs when code changes
2. **Resistance to refactoring** — Don't break when internals change
3. **Fast feedback** — Quick enough to run constantly
4. **Maintainability** — Easy to understand and modify

**Tradeoffs:**

- Heavy mocking → fast feedback, but poor resistance to refactoring
- Excessive integration tests → good regression protection, but slow and hard to maintain
- **Recommendation**: Focus on behavioral tests against public interfaces; minimize tests sensitive to internal structure

## Gerard Meszaros — Test ROI

Tests are investments:

- **Cost**: Time to write + time to maintain
- **Return**: Fewer bugs, faster refactoring, living documentation

Poorly designed tests have **negative ROI** — they create more work than they save.
Test smells are the primary indicator of negative-ROI tests.

## Michael Feathers — Legacy Code

- **Legacy code = code without tests** — regardless of age
- **Seams**: Points where behavior can be changed without modifying the code
  - Interface seams (dependency injection)
  - Object seams (subclassing/wrapping)
  - Preprocessing/configuration seams
- **Characterization tests**: Document what the code _actually does_ before refactoring
- **Method**: Find seams → write characterization tests → refactor with safety net

## Emily Bache — Test Desiderata 2.0

Operationalizes Beck's desiderata for modern teams:

- Test suite overall goals: fast feedback, good coverage, living documentation
- Concrete guidelines for when to accept tradeoffs (e.g., temporarily flaky tests)
- Emphasis on test suites as team assets, not individual artifacts

## The Testing Pyramid

- **Base**: Many unit tests — fast, isolated, logic-focused
- **Middle**: Fewer integration tests — component interaction
- **Top**: Few E2E tests — full system flows

Principle: **Most cheap tests, fewest expensive tests.**

## AI-Specific Testing Principles

- AI agents make many small changes quickly — **tests are the contract**
- TDD-like workflows provide a **feedback loop** keeping agents on track
- Test via module interfaces — enables AI to change internals freely
- Keep tests stable against internal refactoring
- Fast suites — AI needs to run tests frequently; slow tests reduce iteration speed
