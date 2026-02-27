# Code Review Checklists

## Master Checklist

### Functionality

- [ ] Code solves the described problem
- [ ] Edge cases are handled
- [ ] Error states are correctly handled
- [ ] Race conditions / concurrency considered

### Design

- [ ] Fits existing system architecture
- [ ] Appropriate abstraction level
- [ ] No over-engineering (more generic than needed)
- [ ] No information leakage (design decisions spread across modules)

### Security

- [ ] Input validation present for all external inputs
- [ ] No injection vulnerabilities (SQL, NoSQL, command, XSS)
- [ ] Secrets not hardcoded
- [ ] Authentication/authorization correct
- [ ] Error messages don't leak internal information
- [ ] Dependencies checked for known vulnerabilities

### Tests

- [ ] Tests included in the change
- [ ] Tests verify behavior, not implementation details
- [ ] Tests will fail when code is broken
- [ ] Edge cases covered
- [ ] Tests are maintainable (not overly complex)

### Quality

- [ ] Code is readable and maintainable
- [ ] Naming is clear and meaningful
- [ ] Comments explain _why_, not _what_
- [ ] Follows project style guide
- [ ] Documentation updated

### Performance

- [ ] No obvious performance problems (N+1, unnecessary copies, memory leaks)
- [ ] Appropriate data structures chosen
- [ ] Algorithmic complexity reasonable for use case
- [ ] Resources correctly managed (connections closed, memory freed)

---

## Security Checklist

Based on OWASP Top 10 (2021):

- [ ] **A01: Broken Access Control** — correct authorization; no privilege escalation
- [ ] **A02: Cryptographic Failures** — sensitive data encrypted; strong algorithms
- [ ] **A03: Injection** — parameterized queries; input escaping
- [ ] **A04: Insecure Design** — threat modeling for critical paths
- [ ] **A05: Security Misconfiguration** — defaults secured; headers correct
- [ ] **A06: Vulnerable Components** — dependencies updated and scanned
- [ ] **A07: Auth Failures** — strong password storage; session management
- [ ] **A08: Data Integrity** — signing/verification of critical data
- [ ] **A09: Logging Failures** — sufficient logging; no PII in logs
- [ ] **A10: SSRF** — server-side requests validated and restricted

---

## Deep Modules Checklist

For Pass 1 when new modules are introduced:

- [ ] Are interfaces significantly simpler than the implementation?
- [ ] Are the most common use cases trivial to use?
- [ ] Does the module hide its internal design decisions?
- [ ] Are there pass-through methods that just forward calls?
- [ ] Does the change introduce information leakage?
- [ ] Can the implementation change without affecting callers?
