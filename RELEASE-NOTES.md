# Release Notes

All notable changes to this project are documented here.

---

## [1.1.3] - 2026-07-02

### Refactored

- Enhanced project creation command with package manager option (`--pm pnpm`, `--pm yarn`)
- Improved package.json generation and route comments
- Updated README for clarity and consistency

---

## [1.1.2] - 2026-07-02

### Refactored

- Removed nunjucks dependency and all view-related configurations
- Streamlined app creation by consolidating module loading and removing unused variables

---

## [1.1.1] - 2026-07-02

### Fixed

- Updated TypeScript configuration to use Node16 module resolution
- Added missing type declarations for node and carabao

---

## [1.1.0] - 2026-07-02

### Added

- Async/await support in application tests
- Unit tests for `resolveFile` function
- Enhanced CLI create tests for package.json scripts and app structure

---

## [1.0.1] - 2026-07-02

### Added

- esbuild configuration for improved bundling and output
- CHANGELOG.md to document project updates

### Changed

- Improved README project structure description

---

## [1.0.0] - 2026-07-02

### Added

- Initial release of Carabao.js
- MVC Node.js web framework built on Express
- TypeScript-first architecture with full type safety
- CLI scaffolding via `npx carabao create`
- Auto-wired routing and controller system
- CommonJS and ESM module support
- Zero-config sensible defaults

---

## Release Guidelines

### Versioning

This project follows **Semantic Versioning (SemVer)**:

- **MAJOR** — incompatible API changes
- **MINOR** — backwards-compatible features
- **PATCH** — backwards-compatible bug fixes

---

## Notes

- Include links to issues or PRs when possible
- Highlight breaking changes clearly under a "Breaking Changes" section
- Keep entries concise and user-focused
