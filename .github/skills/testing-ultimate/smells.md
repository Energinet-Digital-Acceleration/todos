# Test Smells Catalog

Reference catalog for detecting and fixing test smells.
Sources: Meszaros (xUnit Test Patterns), Khorikov, testsmells.org.

## Smell: Obscure Test

**Symptom**: Hard to understand what the test does or why.

**Detection**:

- Test body >30 lines without helper methods
- Test name is generic (`test1`, `testFunction`, `shouldWork`)
- No assertion messages
- Complex setup with no clear connection to assertion

**Fix**:

- Rename to describe scenario + expected outcome
- Extract setup into descriptively-named helpers
- Add assertion messages explaining what failed
- Split if testing multiple concerns

---

## Smell: Eager Test

**Symptom**: One test verifies too many things at once.

**Detection**:

- > 4 assertions on different concerns
- Test name contains "and" or multiple behaviors
- Failure doesn't clearly point to one problem

**Fix**:

- Split into multiple focused tests (one concern each)
- Each test gets a specific scenario name
- Share setup via helpers, not duplication

---

## Smell: Conditional Test Logic

**Symptom**: Control flow (`if`, `for`, `while`, `switch`) inside test body.

**Detection**:

- Any branching/looping construct in test body (not in helpers)

**Fix**:

- Replace loops with parameterized/table-driven tests
- Replace conditionals with separate test cases
- Move complex conditional logic into test utilities

---

## Smell: Fragile Test

**Symptom**: Tests break when internal implementation changes (without behavior change).

**Detection**:

- Assertions on private/internal state or fields
- Strict mock verification of internal call sequences
- Tests use reflection/internal APIs to access state
- Tests depend on specific error message text for logic flow

**Fix**:

- Assert on observable behavior (return values, public state, side effects)
- Use loose mock verification (was called, not exact sequence)
- Test through public interfaces only
- Use error types/codes instead of message strings

---

## Smell: Mystery Guest

**Symptom**: Test depends on external resources not visible in the test.

**Detection**:

- Direct file system reads/writes
- Database queries without explicit setup
- Network calls without mocking
- Environment variable dependencies
- Shared mutable state between tests

**Fix**:

- Make all dependencies explicit in the test
- Use fixtures with clear setup/teardown
- Mock or stub external resources
- Create test data in the test itself

---

## Smell: Test Code Duplication

**Symptom**: Copy-paste of setup, assertions, or test patterns across tests.

**Detection**:

- > 80% similarity between test bodies
- Identical setup blocks repeated
- Same assertion pattern with only values changing

**Fix**:

- Extract shared setup into helpers/fixtures
- Use parameterized tests for value variations
- Create custom assertion helpers for domain-specific checks
- Use test utility methods for common patterns

---

## Smell: Assertion Roulette

**Symptom**: Multiple assertions without messages — failure doesn't identify which one broke.

**Detection**:

- > 2 assertions in one test without distinct failure messages
- Assertions on different concerns without clear labeling

**Fix**:

- Add descriptive message to each assertion
- Or (better): split into separate tests

---

## Smell: Overspecified Mock (Khorikov)

**Symptom**: Mock expectations tied to exact internal call patterns.

**Detection**:

- Mock verifies exact number of calls
- Mock verifies call order between internal methods
- Mock setup mirrors implementation step-by-step

**Fix**:

- Verify outcomes, not interactions
- Use stubs (return values) instead of strict mocks where possible
- Only verify interactions for commands to external systems (not queries)

---

## Smell: Testing Implementation Details (Khorikov)

**Symptom**: Tests knowledge of how something works, not what it does.

**Detection**:

- Testing private methods directly
- Asserting on internal data structures
- Tests that need updating when refactoring without behavior change
- Exposing internal state solely for testing

**Fix**:

- Test through the public API
- Assert on observable outputs and effects
- Apply the Humble Object pattern if needed to extract testable logic

---

## Quick Reference Table

| Smell                  | Key indicator                  | Primary fix                       |
| ---------------------- | ------------------------------ | --------------------------------- |
| Obscure                | Can't understand in 10 seconds | Rename + extract helpers          |
| Eager                  | Tests multiple things          | Split into focused tests          |
| Conditional Logic      | `if`/`for` in test body        | Parameterize or split             |
| Fragile                | Breaks on refactoring          | Test behavior, not implementation |
| Mystery Guest          | Hidden external dependencies   | Make dependencies explicit        |
| Duplication            | Copy-paste patterns            | Extract helpers + parameterize    |
| Assertion Roulette     | Which assertion failed?        | Add messages or split             |
| Overspecified Mock     | Mirrors implementation         | Verify outcomes, not calls        |
| Implementation Details | Tests private state            | Test public API only              |
