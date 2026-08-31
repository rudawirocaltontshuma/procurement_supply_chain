import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension Supply",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dimension Supply.`,
  meta: {
    title: "Dimension Supply - Procurement & Supply Chain Management Platform",
    description:
      "Dimension Supply is a procurement and supply chain management platform built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Manage suppliers, purchase requests and orders, approvals, contracts, inventory, and spend from a single workspace.",
  },
};
