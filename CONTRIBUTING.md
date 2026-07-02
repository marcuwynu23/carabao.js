# Contributing

Thanks for your interest in contributing to Carabao.js.

We welcome bug fixes, features, documentation, and suggestions.

---

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch from `main`
4. Install dependencies:

```bash
npm install
```

---

## Branching Strategy

- `main` — always releasable, all PRs merge here
- `feature/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `docs/<short-description>` — documentation updates
- `refactor/<short-description>` — code improvements without behavior change
- `test/<short-description>` — adding or updating tests
- `chore/<short-description>` — maintenance tasks

Examples:

```
feature/scaffold-pnpm-support
fix/route-param-parsing
docs/update-readme-badges
```

---

## Development Workflow

1. Create a branch from `main`
2. Make your changes
3. Follow the project's coding style and conventions
4. Add or update tests when applicable
5. Run local checks before submitting:

```bash
npm test
npm run build
```

---

## Commit Messages (Conventional Commits)

We follow **Conventional Commits**.

### Format

```
<type>(optional scope): <short description>
```

### Common Types

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation changes
- `refactor` — code restructuring
- `test` — adding/updating tests
- `chore` — maintenance

### Examples

```
feat(cli): add pnpm support to create command
fix(core): handle missing route controller gracefully
docs(readme): add API reference section
test(app): add serve error handling tests
```

### Rules

- Use lowercase for type and description
- Keep messages concise and meaningful
- Use the body for additional context if needed

---

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Verify all tests and checks pass
3. Open a pull request targeting `main`
4. Clearly describe what changed and why

---

## Reporting Issues

Open a GitHub issue with:

- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Node.js version and OS

---

## Suggestions & Feature Requests

Open a GitHub issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

## Code of Conduct

Be respectful and constructive in all interactions.
Harassment or inappropriate behavior will not be tolerated.

---

## Notes

- Maintainers may request changes before merging
- Not all contributions may be accepted, but all will be reviewed

---

Thanks again for contributing.
