# Contributing to Dimension Supply

Thanks for your interest in improving **Dimension Supply**. This guide covers how to set up your environment and where to make changes.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. It is a frontend-only procurement and supply chain management platform driven by local, seeded mock data — there is no backend, database, or authentication service to configure.

---

## Project Layout

We use a **colocation-based file system**. Each route keeps its own pages, components, and logic.

```
src
├── app                       # Next.js routes (App Router)
│   ├── (external)            # Public/root routes
│   └── (main)
│       ├── auth              # Login/register screens
│       ├── dashboard
│       │   ├── _components   # Shared sidebar, header, layout pieces
│       │   └── dimension-supply
│       │       ├── _lib          # Mock data and formatters
│       │       ├── _components   # Shared table/card/chart components
│       │       └── ...            # One folder per module (suppliers, purchase-orders, etc.)
│       └── unauthorized
├── components                # Shared shadcn/ui components
├── config                    # App-wide configuration
├── data                      # Shared mock data
├── hooks                     # Reusable hooks
├── lib                       # Utilities, preferences, fonts
├── navigation                 # Sidebar navigation config
├── stores                    # Zustand stores
└── styles                    # Tailwind and theme setup
```

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudawirocaltontshuma/procurement_supply_chain.git
   ```

2. **Navigate into the project**
   ```bash
   cd procurement_supply_chain
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear commit messages with conventional prefixes:
  ```bash
  git commit -m "feat: add inventory reorder alerts"
  ```

- Open a Pull Request once ready.
- If your change adds a new screen or component, include a screenshot in your PR description.

---

## Where to Contribute

- **Dimension Supply modules**: `src/app/(main)/dashboard/dimension-supply/<module>/` — each module (suppliers, purchase-orders, contracts, inventory, etc.) is self-contained with its own `page.tsx` and `_components/`
- **Mock data**: `src/app/(main)/dashboard/dimension-supply/_lib/mock-data.ts` — deterministic, seeded data generation shared across modules
- **Shared module components**: `src/app/(main)/dashboard/dimension-supply/_components/` — data table, stat cards, status badges, chart wrappers
- **Auth screens**: `src/app/(main)/auth/`
- **Sidebar navigation**: `src/navigation/sidebar/sidebar-items.ts`
- **Shared UI components**: `src/components/`
- **Hooks**: `src/hooks/`
- **Themes**: `src/styles/presets/`

---

## Guidelines

- Prefer **TypeScript types** over `any`
- Husky pre-commit hooks are enabled — linting and formatting run automatically on commit, and the commit is blocked until issues are fixed
- Follow **shadcn/ui** style and Tailwind v4 conventions
- Keep accessibility in mind (ARIA, keyboard navigation)
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, etc.)
- Avoid unnecessary dependencies — prefer existing utilities where possible
- All data must remain local mock data — do not introduce real backend calls, authentication, or persistence

---

## Submitting PRs

- Open a Pull Request once your changes are ready.
- Ensure your branch is up to date with `main` before submitting.
- Run `npm run check`, `npx tsc --noEmit`, and `npm run build` locally before opening a PR.
- Reference any related issue in your PR for context.

---

## Questions & Support

Report bugs, suggestions, or issues via [GitHub Issues](https://github.com/rudawirocaltontshuma/procurement_supply_chain/issues).
