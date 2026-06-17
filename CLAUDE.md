# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development

- Build library: `pnpm build`
- Build with watch mode: `pnpm dev`
- Start Storybook: `pnpm storybook`

### Testing & Quality

- Run all tests: `pnpm test`
- Run tests in watch mode: `pnpm test:watch`
- Lint source code: `pnpm lint`
- Type check: `pnpm typecheck`

## Architecture Overview

Kenikool UI is a dual-target UI component library providing implementations for both React and Vanilla JavaScript.

### Project Structure

- `src/react/`: React component implementations.
- `src/vanilla/`: Vanilla JS implementations using Web Components (Custom Elements), typically inheriting from `KBaseElement`.
- `src/core/`: Shared utilities, types, and constants used by both targets.
- `src/themes/`: Theme management and hooks for handling light/dark/dracula themes.
- `src/styles/`:
  - `tokens/`: CSS variable definitions for different themes.
  - `components/`: Component-specific CSS.
  - `base.css`: Global base styles.

### Key Design Patterns

- **Dual implementation**: Features are mirrored across `src/react` and `src/vanilla` to provide consistent API and behavior across frameworks.
- **Custom Elements**: Vanilla components use the standard Web Components API for zero-config integration.
- **Theme-aware styling**: Uses CSS tokens (variables) to allow runtime theme switching without reloading styles.
- **Bundling**: Uses `tsup` for efficient bundling into CJS and ESM formats.
