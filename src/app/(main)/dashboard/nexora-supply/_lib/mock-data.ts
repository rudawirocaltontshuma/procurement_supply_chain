// Deterministic mock data for the Nexora Supply procurement & supply chain module.
// All data is generated client/server-shared from a seeded PRNG so it stays stable across renders.
// This module has no backend, database, or network calls — everything lives in memory.

// ---------------------------------------------------------------------------
// Seeded PRNG helpers
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260831);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)] as T;
}

function pickMany<T>(items: readonly T[], count: number): T[] {
  const pool = [...items];
  const out: T[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rand() * pool.length);
    out.push(pool.splice(idx, 1)[0] as T);
  }
  return out;
}

function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2) {
  const value = rand() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function id(prefix: string, index: number, width = 4) {
  return `${prefix}-${String(index).padStart(width, "0")}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const TODAY = new Date("2026-08-31T00:00:00.000Z");

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function randomDate(daysBack: number, daysForward = 0) {
  const offset = randInt(-daysBack, daysForward);
  return isoDate(addDays(TODAY, offset));
}

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------

export const CATEGORIES = [
  "Raw Materials",
  "Packaging",
  "Electronics",
  "Office Supplies",
  "IT Equipment",
  "Facilities",
  "Logistics Services",
  "Industrial Equipment",
  "Chemicals",
  "MRO",
  "Professional Services",
  "Marketing Services",
] as const;

export const DEPARTMENTS = [
  "Operations",
  "Manufacturing",
  "IT",
  "Marketing",
  "Facilities",
  "R&D",
  "Finance",
  "Sales",
  "HR",
  "Logistics",
] as const;

const CITIES = [
  { city: "Chicago", country: "United States" },
  { city: "Houston", country: "United States" },
  { city: "Atlanta", country: "United States" },
  { city: "Los Angeles", country: "United States" },
  { city: "Shenzhen", country: "China" },
  { city: "Shanghai", country: "China" },
  { city: "Ho Chi Minh City", country: "Vietnam" },
  { city: "Bangalore", country: "India" },
  { city: "Pune", country: "India" },
  { city: "Warsaw", country: "Poland" },
  { city: "Hamburg", country: "Germany" },
  { city: "Rotterdam", country: "Netherlands" },
  { city: "Monterrey", country: "Mexico" },
  { city: "Sao Paulo", country: "Brazil" },
  { city: "Busan", country: "South Korea" },
  { city: "Singapore", country: "Singapore" },
  { city: "Manchester", country: "United Kingdom" },
  { city: "Toronto", country: "Canada" },
] as const;

const SUPPLIER_NAME_PARTS_1 = [
  "Apex",
  "Vertex",
  "Northbridge",
  "Meridian",
  "Cascade",
  "Summit",
  "Ironclad",
  "Bluewave",
  "Redstone",
  "Silverline",
  "Global",
  "Continental",
  "Pacific",
  "Atlas",
  "Orbit",
  "Titan",
  "Frontier",
  "Harbor",
  "Union",
  "Vantage",
  "Keystone",
  "Nexus",
  "Prime",
  "Sterling",
  "Cobalt",
  "Granite",
  "Anchor",
  "Zenith",
  "Beacon",
  "Cornerstone",
  "Lumen",
  "Delta",
];

const SUPPLIER_NAME_PARTS_2 = [
  "Materials",
  "Supply Co.",
  "Industries",
  "Manufacturing",
  "Logistics",
  "Components",
  "Solutions",
  "Group",
  "Trading",
  "Systems",
  "Partners",
  "Works",
  "Technologies",
  "Sourcing",
  "Distribution",
  "Fabrication",
  "Enterprises",
];

const CONTACT_FIRST_NAMES = [
  "Maria",
  "James",
  "Wei",
  "Priya",
  "Ahmed",
  "Sofia",
  "Liam",
  "Yuki",
  "Carlos",
  "Anna",
  "David",
  "Fatima",
  "Noah",
  "Elena",
  "Raj",
  "Grace",
  "Tom",
  "Mei",
  "Lucas",
  "Ingrid",
];

const CONTACT_LAST_NAMES = [
  "Chen",
  "Novak",
  "Patel",
  "Silva",
  "Kowalski",
  "Nguyen",
  "Okafor",
  "Rossi",
  "Muller",
  "Kim",
  "Andersson",
  "Fischer",
  "Santos",
  "Ivanov",
  "Suzuki",
  "Bakker",
  "Lopez",
  "Schmidt",
  "Costa",
  "Brandt",
];

function personName() {
  return `${pick(CONTACT_FIRST_NAMES)} ${pick(CONTACT_LAST_NAMES)}`;
}

function companyName(used: Set<string>) {
  let name = "";
  do {
    name = `${pick(SUPPLIER_NAME_PARTS_1)} ${pick(SUPPLIER_NAME_PARTS_2)}`;
  } while (used.has(name));
  used.add(name);
  return name;
}

// ---------------------------------------------------------------------------
// Status enums
// ---------------------------------------------------------------------------

export type SupplierStatus = "Active" | "Pending Approval" | "Suspended" | "Inactive";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type PurchaseRequestStatus = "Draft" | "Submitted" | "Approved" | "Rejected" | "Converted";
export type PurchaseOrderStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Sent"
  | "Partially Received"
  | "Received"
  | "Closed"
  | "Cancelled";
export type ContractStatus = "Active" | "Draft" | "Expiring Soon" | "Expired" | "Terminated";
export type ProductStatus = "Active" | "Discontinued" | "Backordered" | "New";
export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Overstock";
export type ReceiptStatus = "Pending" | "Partial" | "Completed" | "Rejected";
export type InvoiceStatus = "Pending" | "Approved" | "Paid" | "Overdue" | "Disputed";
export type SourcingStatus = "Draft" | "Open" | "Evaluating" | "Awarded" | "Closed" | "Cancelled";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type PriorityLevel = "Low" | "Medium" | "High" | "Urgent";

// ---------------------------------------------------------------------------
// Entity types
// ---------------------------------------------------------------------------

export interface SupplierContact {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: (typeof CATEGORIES)[number];
  city: string;
  country: string;
  status: SupplierStatus;
  risk: RiskLevel;
  performanceScore: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  totalOrders: number;
  totalSpend: number;
  activeContracts: number;
  onboardedDate: string;
  paymentTerms: string;
  contacts: SupplierContact[];
  tags: string[];
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: (typeof CATEGORIES)[number];
  supplierId: string;
  unitCost: number;
  unitOfMeasure: string;
  status: ProductStatus;
  leadTimeDays: number;
  stock: number;
}

export interface PurchaseRequest {
  id: string;
  title: string;
  requester: string;
  department: (typeof DEPARTMENTS)[number];
  category: (typeof CATEGORIES)[number];
  amount: number;
  dateSubmitted: string;
  neededBy: string;
  priority: PriorityLevel;
  status: PurchaseRequestStatus;
  justification: string;
}

export interface PurchaseOrderLine {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  department: (typeof DEPARTMENTS)[number];
  category: (typeof CATEGORIES)[number];
  lines: PurchaseOrderLine[];
  itemCount: number;
  amount: number;
  orderDate: string;
  expectedDelivery: string;
  status: PurchaseOrderStatus;
  warehouseId: string;
}

export interface Contract {
  id: string;
  title: string;
  supplierId: string;
  category: (typeof CATEGORIES)[number];
  startDate: string;
  expiryDate: string;
  value: number;
  status: ContractStatus;
  owner: string;
  autoRenew: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  inventoryValue: number;
  utilization: number;
  status: "Operational" | "Limited Capacity" | "Closed";
  manager: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  warehouseId: string;
  available: number;
  reserved: number;
  incoming: number;
  reorderLevel: number;
  status: InventoryStatus;
}

export interface Receipt {
  id: string;
  purchaseOrderId: string;
  supplierId: string;
  itemCount: number;
  date: string;
  warehouseId: string;
  status: ReceiptStatus;
}

export interface Invoice {
  id: string;
  supplierId: string;
  purchaseOrderId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface SourcingEvent {
  id: string;
  title: string;
  category: (typeof CATEGORIES)[number];
  supplierIds: string[];
  deadline: string;
  estimatedValue: number;
  status: SourcingStatus;
  owner: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: (typeof DEPARTMENTS)[number];
  status: "Active" | "Invited" | "Disabled";
}

export interface ApprovalQueueItem {
  id: string;
  requestId: string;
  requestTitle: string;
  requester: string;
  amount: number;
  approver: string;
  submitted: string;
  priority: PriorityLevel;
  status: ApprovalStatus;
  history: { actor: string; action: string; date: string; note?: string }[];
}

// ---------------------------------------------------------------------------
// Warehouses
// ---------------------------------------------------------------------------

const warehouseLocations = pickMany(CITIES, 9);

function warehouseStatus(utilization: number): Warehouse["status"] {
  if (utilization > 92) return "Limited Capacity";
  if (rand() < 0.04) return "Closed";
  return "Operational";
}

export const warehouses: Warehouse[] = warehouseLocations.map((loc, index) => {
  const capacity = randInt(40_000, 220_000);
  const utilization = randInt(38, 97);
  return {
    id: id("WH", index + 1, 2),
    name: `${loc.city} Distribution Center`,
    city: loc.city,
    country: loc.country,
    capacity,
    inventoryValue: Math.round(capacity * randFloat(8, 34)),
    utilization,
    status: warehouseStatus(utilization),
    manager: personName(),
  };
});

// ---------------------------------------------------------------------------
// Suppliers
// ---------------------------------------------------------------------------

const supplierStatuses: SupplierStatus[] = [
  "Active",
  "Active",
  "Active",
  "Active",
  "Pending Approval",
  "Suspended",
  "Inactive",
];
const riskLevels: RiskLevel[] = ["Low", "Low", "Medium", "Medium", "High", "Critical"];
const usedSupplierNames = new Set<string>();

export const suppliers: Supplier[] = Array.from({ length: 128 }, (_, i) => {
  const loc = pick(CITIES);
  const performanceScore = randInt(52, 99);
  const onTimeDeliveryRate = randInt(60, 100);
  const qualityScore = randInt(55, 100);
  const totalOrders = randInt(2, 340);
  const contactCount = randInt(1, 3);
  return {
    id: id("SUP", i + 1),
    name: companyName(usedSupplierNames),
    category: pick(CATEGORIES),
    city: loc.city,
    country: loc.country,
    status: pick(supplierStatuses),
    risk: pick(riskLevels),
    performanceScore,
    onTimeDeliveryRate,
    qualityScore,
    totalOrders,
    totalSpend: Math.round(totalOrders * randFloat(800, 24_000)),
    activeContracts: randInt(0, 4),
    onboardedDate: randomDate(2200, -30),
    paymentTerms: pick(["Net 15", "Net 30", "Net 45", "Net 60", "Due on Receipt"]),
    contacts: Array.from({ length: contactCount }, () => ({
      name: personName(),
      title: pick(["Account Manager", "Sales Director", "Operations Lead", "VP Sales", "Regional Manager"]),
      email: `${pick(CONTACT_FIRST_NAMES).toLowerCase()}.${pick(CONTACT_LAST_NAMES).toLowerCase()}@example.com`,
      phone: `+1-${randInt(200, 999)}-${randInt(200, 999)}-${randInt(1000, 9999)}`,
    })),
    tags: pickMany(
      ["Preferred", "Diverse-Owned", "ISO 9001", "Sustainable", "Strategic", "Local", "Single Source"],
      randInt(1, 3),
    ),
  };
});

export function getSupplier(idValue: string) {
  return suppliers.find((s) => s.id === idValue);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const PRODUCT_NOUNS = [
  "Steel Coil",
  "Corrugated Box",
  "Circuit Board",
  "Laptop Stand",
  "Safety Gloves",
  "Hydraulic Pump",
  "Industrial Sensor",
  "Packaging Tape",
  "Aluminum Sheet",
  "LED Panel",
  "Server Rack",
  "Office Chair",
  "Forklift Battery",
  "Conveyor Belt",
  "Resin Pellets",
  "Copper Wire",
  "Pallet Wrap",
  "Router Module",
  "Filtration Unit",
  "Solvent Drum",
  "Bearing Set",
  "Power Supply",
  "Cable Harness",
  "Printer Cartridge",
  "Warehouse Shelving",
  "Fastener Kit",
  "Thermal Paste",
  "Protective Coating",
  "Motor Assembly",
  "Valve Assembly",
];

const productStatuses: ProductStatus[] = ["Active", "Active", "Active", "New", "Backordered", "Discontinued"];

export const products: Product[] = Array.from({ length: 214 }, (_, i) => {
  const supplier = pick(suppliers);
  const unitCost = randFloat(2, 4800, 2);
  return {
    id: id("PRD", i + 1),
    sku: `SKU-${randInt(10000, 99999)}`,
    name: `${pick(PRODUCT_NOUNS)} ${pick(["Standard", "Pro", "Heavy Duty", "Compact", "Industrial", "Mk II", "Elite"])}`,
    category: supplier.category,
    supplierId: supplier.id,
    unitCost,
    unitOfMeasure: pick(["Each", "Box", "Pallet", "Meter", "Kg", "Case"]),
    status: pick(productStatuses),
    leadTimeDays: randInt(3, 75),
    stock: randInt(0, 12_000),
  };
});

export function getProduct(idValue: string) {
  return products.find((p) => p.id === idValue);
}

// ---------------------------------------------------------------------------
// Purchase requests
// ---------------------------------------------------------------------------

const prStatuses: PurchaseRequestStatus[] = ["Draft", "Submitted", "Approved", "Approved", "Rejected", "Converted"];
const priorities: PriorityLevel[] = ["Low", "Medium", "Medium", "High", "Urgent"];

export const purchaseRequests: PurchaseRequest[] = Array.from({ length: 226 }, (_, i) => {
  const amount = randFloat(200, 185_000, 2);
  const dateSubmitted = randomDate(360, -1);
  return {
    id: id("PR", i + 1),
    title: `${pick(PRODUCT_NOUNS)} Replenishment`,
    requester: personName(),
    department: pick(DEPARTMENTS),
    category: pick(CATEGORIES),
    amount,
    dateSubmitted,
    neededBy: isoDate(addDays(new Date(dateSubmitted), randInt(7, 60))),
    priority: pick(priorities),
    status: pick(prStatuses),
    justification: pick([
      "Replenishing depleted stock ahead of peak season.",
      "New project requires additional materials.",
      "Existing supplier contract renewal shortfall.",
      "Equipment replacement due to end-of-life.",
      "Cost-saving bulk purchase opportunity.",
      "Urgent operational requirement from site team.",
    ]),
  };
});

// ---------------------------------------------------------------------------
// Purchase orders
// ---------------------------------------------------------------------------

const poStatuses: PurchaseOrderStatus[] = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Sent",
  "Partially Received",
  "Received",
  "Closed",
  "Cancelled",
];

export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 218 }, (_, i) => {
  const supplier = pick(suppliers);
  const orderDate = randomDate(400, -5);
  const lineCount = randInt(1, 6);
  const supplierProducts = products.filter((p) => p.supplierId === supplier.id);
  const pool = supplierProducts.length > 0 ? supplierProducts : products;
  const lines: PurchaseOrderLine[] = Array.from({ length: lineCount }, () => {
    const product = pick(pool);
    return { productId: product.id, quantity: randInt(1, 500), unitCost: product.unitCost };
  });
  const amount = Math.round(lines.reduce((sum, l) => sum + l.quantity * l.unitCost, 0) * 100) / 100;
  return {
    id: id("PO", i + 1),
    supplierId: supplier.id,
    department: pick(DEPARTMENTS),
    category: supplier.category,
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
    amount,
    orderDate,
    expectedDelivery: isoDate(addDays(new Date(orderDate), randInt(5, 90))),
    status: pick(poStatuses),
    warehouseId: pick(warehouses).id,
  };
});

export function getPurchaseOrder(idValue: string) {
  return purchaseOrders.find((p) => p.id === idValue);
}

export function purchaseOrdersForSupplier(supplierId: string) {
  return purchaseOrders.filter((p) => p.supplierId === supplierId);
}

// ---------------------------------------------------------------------------
// Contracts
// ---------------------------------------------------------------------------

const contractStatuses: ContractStatus[] = ["Active", "Active", "Draft", "Expiring Soon", "Expired", "Terminated"];

export const contracts: Contract[] = Array.from({ length: 112 }, (_, i) => {
  const supplier = pick(suppliers);
  const startDate = randomDate(1000, -60);
  const expiryDate = isoDate(addDays(new Date(startDate), randInt(180, 1400)));
  const daysToExpiry = Math.round((new Date(expiryDate).getTime() - TODAY.getTime()) / DAY_MS);
  let status: ContractStatus = pick(contractStatuses);
  if (daysToExpiry < 0) status = rand() < 0.7 ? "Expired" : status;
  else if (daysToExpiry < 60) status = rand() < 0.7 ? "Expiring Soon" : status;
  return {
    id: id("CTR", i + 1),
    title: `${supplier.category} Supply Agreement`,
    supplierId: supplier.id,
    category: supplier.category,
    startDate,
    expiryDate,
    value: Math.round(randFloat(15_000, 2_400_000)),
    status,
    owner: personName(),
    autoRenew: rand() < 0.4,
  };
});

export function contractsForSupplier(supplierId: string) {
  return contracts.filter((c) => c.supplierId === supplierId);
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export const inventory: InventoryItem[] = Array.from({ length: 336 }, (_, i) => {
  const product = pick(products);
  const warehouse = pick(warehouses);
  const reorderLevel = randInt(20, 500);
  const available = randInt(0, 2000);
  let status: InventoryStatus = "In Stock";
  if (available === 0) status = "Out of Stock";
  else if (available < reorderLevel) status = "Low Stock";
  else if (available > reorderLevel * 6) status = "Overstock";
  return {
    id: id("INV", i + 1),
    productId: product.id,
    warehouseId: warehouse.id,
    available,
    reserved: randInt(0, Math.max(1, Math.floor(available * 0.3))),
    incoming: randInt(0, 400),
    reorderLevel,
    status,
  };
});

// ---------------------------------------------------------------------------
// Receipts
// ---------------------------------------------------------------------------

const receiptStatuses: ReceiptStatus[] = ["Pending", "Partial", "Completed", "Completed", "Rejected"];

export const receipts: Receipt[] = purchaseOrders
  .filter(() => rand() < 0.85)
  .map((po, i) => ({
    id: id("RCT", i + 1),
    purchaseOrderId: po.id,
    supplierId: po.supplierId,
    itemCount: po.itemCount,
    date: isoDate(addDays(new Date(po.orderDate), randInt(3, 45))),
    warehouseId: po.warehouseId,
    status: pick(receiptStatuses),
  }));

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

const invoiceStatuses: InvoiceStatus[] = ["Pending", "Approved", "Paid", "Paid", "Overdue", "Disputed"];

export const invoices: Invoice[] = Array.from({ length: 224 }, (_, i) => {
  const po = pick(purchaseOrders);
  const issueDate = isoDate(addDays(new Date(po.orderDate), randInt(1, 60)));
  return {
    id: id("INVC", i + 1),
    supplierId: po.supplierId,
    purchaseOrderId: po.id,
    amount: Math.round(po.amount * randFloat(0.2, 1)),
    issueDate,
    dueDate: isoDate(addDays(new Date(issueDate), randInt(15, 60))),
    status: pick(invoiceStatuses),
  };
});

export function invoicesForSupplier(supplierId: string) {
  return invoices.filter((inv) => inv.supplierId === supplierId);
}

// ---------------------------------------------------------------------------
// Sourcing events
// ---------------------------------------------------------------------------

const sourcingStatuses: SourcingStatus[] = ["Draft", "Open", "Evaluating", "Awarded", "Closed", "Cancelled"];

export const sourcingEvents: SourcingEvent[] = Array.from({ length: 58 }, (_, i) => {
  const category = pick(CATEGORIES);
  const candidateSuppliers = suppliers.filter((s) => s.category === category);
  const pool = candidateSuppliers.length >= 3 ? candidateSuppliers : suppliers;
  return {
    id: id("SRC", i + 1, 3),
    title: `${category} Sourcing Event`,
    category,
    supplierIds: pickMany(pool, randInt(2, 5)).map((s) => s.id),
    deadline: randomDate(-30, 120),
    estimatedValue: Math.round(randFloat(20_000, 950_000)),
    status: pick(sourcingStatuses),
    owner: personName(),
  };
});

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

const roles = [
  "Procurement Manager",
  "Buyer",
  "Approver",
  "Finance Analyst",
  "Warehouse Lead",
  "Administrator",
  "Sourcing Specialist",
];

export const users: AppUser[] = Array.from({ length: 24 }, (_, i) => {
  const first = pick(CONTACT_FIRST_NAMES);
  const last = pick(CONTACT_LAST_NAMES);
  return {
    id: id("USR", i + 1, 3),
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@nexorasupply.com`,
    role: pick(roles),
    department: pick(DEPARTMENTS),
    status: pick<AppUser["status"]>(["Active", "Active", "Active", "Invited", "Disabled"]),
  };
});

// ---------------------------------------------------------------------------
// Approval queue
// ---------------------------------------------------------------------------

function approvalStatusFromRequest(prStatus: PurchaseRequestStatus): ApprovalStatus {
  if (prStatus === "Submitted") return "Pending";
  if (prStatus === "Approved") return "Approved";
  return "Rejected";
}

export const approvalQueue: ApprovalQueueItem[] = purchaseRequests
  .filter((pr) => pr.status === "Submitted" || pr.status === "Approved" || pr.status === "Rejected")
  .slice(0, 90)
  .map((pr, i) => {
    const status = approvalStatusFromRequest(pr.status);
    const approver = pick(users.filter((u) => u.role === "Approver" || u.role === "Procurement Manager"));
    const history: ApprovalQueueItem["history"] = [
      { actor: pr.requester, action: "Submitted request", date: pr.dateSubmitted },
    ];
    if (status !== "Pending") {
      history.push({
        actor: approver?.name ?? "Procurement Manager",
        action: status === "Approved" ? "Approved request" : "Rejected request",
        date: isoDate(addDays(new Date(pr.dateSubmitted), randInt(1, 10))),
        note:
          status === "Approved"
            ? "Within budget and vendor pre-approved."
            : "Exceeds department budget for this quarter.",
      });
    }
    return {
      id: id("APR", i + 1, 3),
      requestId: pr.id,
      requestTitle: pr.title,
      requester: pr.requester,
      amount: pr.amount,
      approver: approver?.name ?? "Procurement Manager",
      submitted: pr.dateSubmitted,
      priority: pr.priority,
      status,
      history,
    };
  });

// ---------------------------------------------------------------------------
// Aggregations
// ---------------------------------------------------------------------------

export const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);

export const spendByCategory = CATEGORIES.map((category) => ({
  category,
  spend: Math.round(purchaseOrders.filter((po) => po.category === category).reduce((sum, po) => sum + po.amount, 0)),
})).sort((a, b) => b.spend - a.spend);

export const poStatusBreakdown = poStatuses
  .filter((status, i, arr) => arr.indexOf(status) === i)
  .map((status) => ({
    status,
    count: purchaseOrders.filter((po) => po.status === status).length,
  }));

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

export const spendTrend = MONTHS.map((month, i) => {
  const base = 380_000 + i * 14_000;
  return {
    month,
    spend: Math.round(base + randFloat(-60_000, 90_000)),
    budget: Math.round(base * 1.12),
  };
});

export const supplierPerformanceTrend = MONTHS.map((month) => ({
  month,
  onTime: randInt(78, 97),
  quality: randInt(82, 99),
}));

export const savingsTrend = MONTHS.map((month, i) => ({
  month,
  savings: Math.round(18_000 + i * 1_800 + randFloat(-4000, 6000)),
  target: 20_000 + i * 1_500,
}));

export const departmentSpend = DEPARTMENTS.map((department) => ({
  department,
  spend: Math.round(
    purchaseOrders.filter((po) => po.department === department).reduce((sum, po) => sum + po.amount, 0),
  ),
  budget: Math.round(randFloat(300_000, 1_800_000)),
})).sort((a, b) => b.spend - a.spend);

export const topSuppliersBySpend = [...suppliers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 10);

export const monthlyProcurementVolume = MONTHS.map((month, i) => ({
  month,
  orders: randInt(40, 95) + Math.floor(i * 1.5),
  requests: randInt(50, 120) + Math.floor(i * 1.8),
}));

export const kpis = {
  totalSpend,
  pendingRequests: purchaseRequests.filter((pr) => pr.status === "Submitted").length,
  openPurchaseOrders: purchaseOrders.filter((po) =>
    ["Draft", "Pending Approval", "Approved", "Sent", "Partially Received"].includes(po.status),
  ).length,
  activeSuppliers: suppliers.filter((s) => s.status === "Active").length,
  outstandingInvoices: invoices.filter((i) => i.status === "Pending" || i.status === "Overdue").length,
  outstandingInvoiceValue: invoices
    .filter((i) => i.status === "Pending" || i.status === "Overdue")
    .reduce((sum, i) => sum + i.amount, 0),
  totalSavings: savingsTrend.reduce((sum, s) => sum + s.savings, 0),
  onTimeDeliveryRate:
    Math.round((suppliers.reduce((sum, s) => sum + s.onTimeDeliveryRate, 0) / suppliers.length) * 10) / 10,
  contractsExpiringSoon: contracts.filter((c) => c.status === "Expiring Soon").length,
};

export function getWarehouse(idValue: string) {
  return warehouses.find((w) => w.id === idValue);
}
