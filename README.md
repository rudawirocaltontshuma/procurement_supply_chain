# Dimension Supply

A procurement and supply chain management platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

Dimension Supply gives procurement and supply chain teams a single workspace to manage suppliers, purchase requests and orders, approvals, contracts, products, inventory, warehouses, receipts, invoices, spend, and sourcing — with dashboards and reports built on Recharts.

This is a frontend application driven by deterministic, seeded mock data. There is no backend, database, authentication, or external integration — it is meant to be a realistic, fully interactive UI you can run, explore, and build on.

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui
- Responsive and mobile-friendly, with a collapsible sidebar and mobile navigation via Sheet
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Neo Brutalism, and Soft Pop)
- Flexible layouts (collapsible sidebar, variable content widths)
- Authentication screens (login/register, two visual variants)
- A complete procurement and supply chain workflow: suppliers, purchase requests, purchase orders, approvals, contracts, products, inventory, warehouses, receipts, invoices, spend management, sourcing, analytics, reports, and settings

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide
- **Validation**: Zod
- **Forms & State Management**: React Hook Form, Zustand
- **Tables & Data Handling**: TanStack Table
- **Tooling & DX**: Biome, Husky

## Modules

- **Dashboard** — KPIs and charts covering spend, purchase orders, supplier performance, and savings
- **Suppliers** — directory and detail view (overview, contacts, purchase orders, invoices, contracts, performance, activity)
- **Purchase Requests** — request tracking with priority and approval status
- **Purchase Orders** — order lifecycle from draft through received
- **Approvals** — approval queue with a timeline and temporary approve/reject actions
- **Contracts** — contract lifecycle and expiry tracking
- **Products** — product catalog with supplier and cost data
- **Inventory** — stock levels by warehouse with reorder tracking
- **Warehouses** — capacity and utilization overview
- **Receipts** — goods-receipt tracking against purchase orders
- **Invoices** — invoice status and due-date tracking
- **Spend Management** — spend by department, category, and supplier against budget
- **Sourcing** — sourcing event workspace (RFQ/RFP/RFI/auction)
- **Analytics** — procurement, supplier, spend, inventory, and delivery analytics
- **Reports** — spend, supplier, purchase order, invoice, contract, inventory, delivery, and savings reports
- **Settings** — organization profile, notification preferences, approval thresholds, categories, and users

All data is generated locally from a seeded mock dataset. Actions such as approving a request or changing a status update local UI state only and do not persist.

## Colocation File System Architecture

This project follows a **colocation-based architecture**: each route keeps its own pages, components, and logic inside its route folder. Shared UI, hooks, and configuration live at the top level.

```
src
├── app
│   ├── (external)          # Public/root routes
│   └── (main)
│       ├── auth             # Login/register screens
│       ├── dashboard
│       │   ├── _components  # Shared sidebar, header, layout pieces
│       │   └── dimension-supply
│       │       ├── _lib          # Mock data and formatters
│       │       ├── _components   # Shared table/card/chart components
│       │       ├── suppliers
│       │       ├── purchase-requests
│       │       ├── purchase-orders
│       │       ├── approvals
│       │       ├── contracts
│       │       ├── products
│       │       ├── inventory
│       │       ├── warehouses
│       │       ├── receipts
│       │       ├── invoices
│       │       ├── spend
│       │       ├── sourcing
│       │       ├── analytics
│       │       ├── reports
│       │       └── settings
│       └── unauthorized
├── components               # Shared shadcn/ui components
├── config                   # App-wide configuration
├── data                     # Shared mock data (e.g. account users)
├── hooks                    # Reusable hooks
├── lib                      # Utilities, preferences, fonts
├── navigation                # Sidebar navigation config
├── stores                   # Zustand stores
└── styles                   # Tailwind and theme setup
```

## Getting Started

### Run locally

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

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Production build

```bash
npm run build
npm run start
```

### Formatting and Linting

Format, lint, and organize imports:
```bash
npm run check:fix
```
> For more information on available rules, fixes, and CLI options, refer to the [Biome documentation](https://biomejs.dev/).

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get set up and where to make changes.

## License

MIT — see [LICENSE](./LICENSE).
