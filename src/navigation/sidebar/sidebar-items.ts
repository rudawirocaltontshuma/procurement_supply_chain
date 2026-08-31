import { Fingerprint, type LucideIcon, PackageSearch } from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        id: "dimension-supply",
        title: "Dimension Supply",
        icon: PackageSearch,
        badge: "new",
        subItems: [
          { id: "dimension-supply-dashboard", title: "Dashboard", url: "/dashboard/dimension-supply" },
          { id: "dimension-supply-suppliers", title: "Suppliers", url: "/dashboard/dimension-supply/suppliers" },
          {
            id: "dimension-supply-purchase-requests",
            title: "Purchase Requests",
            url: "/dashboard/dimension-supply/purchase-requests",
          },
          {
            id: "dimension-supply-purchase-orders",
            title: "Purchase Orders",
            url: "/dashboard/dimension-supply/purchase-orders",
          },
          { id: "dimension-supply-approvals", title: "Approvals", url: "/dashboard/dimension-supply/approvals" },
          { id: "dimension-supply-contracts", title: "Contracts", url: "/dashboard/dimension-supply/contracts" },
          { id: "dimension-supply-products", title: "Products", url: "/dashboard/dimension-supply/products" },
          { id: "dimension-supply-inventory", title: "Inventory", url: "/dashboard/dimension-supply/inventory" },
          { id: "dimension-supply-warehouses", title: "Warehouses", url: "/dashboard/dimension-supply/warehouses" },
          { id: "dimension-supply-receipts", title: "Receipts", url: "/dashboard/dimension-supply/receipts" },
          { id: "dimension-supply-invoices", title: "Invoices", url: "/dashboard/dimension-supply/invoices" },
          { id: "dimension-supply-spend", title: "Spend", url: "/dashboard/dimension-supply/spend" },
          { id: "dimension-supply-sourcing", title: "Sourcing", url: "/dashboard/dimension-supply/sourcing" },
          { id: "dimension-supply-analytics", title: "Analytics", url: "/dashboard/dimension-supply/analytics" },
          { id: "dimension-supply-reports", title: "Reports", url: "/dashboard/dimension-supply/reports" },
          { id: "dimension-supply-settings", title: "Settings", url: "/dashboard/dimension-supply/settings" },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Pages",
    items: [
      {
        id: "authentication",
        title: "Authentication",
        icon: Fingerprint,
        subItems: [
          { id: "auth-login-v1", title: "Login v1", url: "/auth/v1/login", newTab: true },
          { id: "auth-login-v2", title: "Login v2", url: "/auth/v2/login", newTab: true },
          { id: "auth-register-v1", title: "Register v1", url: "/auth/v1/register", newTab: true },
          { id: "auth-register-v2", title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
];
