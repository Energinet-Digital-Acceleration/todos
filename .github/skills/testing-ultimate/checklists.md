# Testing Checklists

Operational checklists used across all testing workflows.

## Pre-commit test quality checklist

- [ ] Tests are behavioral — they describe what, not how
- [ ] Domain logic and algorithms are well-covered
- [ ] Test names describe scenario + expected outcome
- [ ] Tests are fast enough to run on every change
- [ ] No test smells introduced (Eager, Obscure, Fragile, Mystery Guest)
- [ ] Refactoring production code doesn't require test changes (unless behavior changed)
- [ ] New tests fail for the right reason when production code is reverted

## Characterization test checklist

- [ ] All characterization tests pass against current code
- [ ] Tests document existing behavior, not desired behavior
- [ ] Each test is clearly marked as a characterization test
- [ ] Seams are identified for future refactoring
- [ ] Dependencies are mapped and documented

## TDD cycle checklist

- [ ] RED: Test written before production code
- [ ] RED: Test fails for the expected reason
- [ ] GREEN: Minimal code written to pass
- [ ] GREEN: No extra features or premature abstractions
- [ ] REFACTOR: All tests still pass after cleanup
- [ ] REFACTOR: Code is cleaner without behavior changes

## Test suite health checklist

- [ ] Suite runs in < 30 seconds (unit tests)
- [ ] No flaky tests (deterministic results)
- [ ] Tests are isolated (no shared mutable state)
- [ ] Tests can run in any order
- [ ] Domain logic coverage > 80%
- [ ] Test smells are actively managed
- [ ] AI can safely refactor internals without breaking tests

## Humble Object checklist

- [ ] Logic Object contains zero I/O, UI, or framework code
- [ ] Humble Object is "too simple to break"
- [ ] Logic Object has comprehensive unit tests
- [ ] Humble Object is covered by integration/smoke tests
- [ ] The split follows natural domain boundaries
