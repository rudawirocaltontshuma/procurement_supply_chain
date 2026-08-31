import { PageHeader } from "../_components/page-header";
import { ProductsTable } from "./_components/products-table";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Products" description="Catalog of items sourced across suppliers and categories." />
      <ProductsTable />
    </div>
  );
}
