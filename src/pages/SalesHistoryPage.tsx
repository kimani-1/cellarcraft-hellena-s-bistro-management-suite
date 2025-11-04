import { SalesDataTable } from "@/components/sales-data-table";
export function SalesHistoryPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-display font-bold text-foreground">Sales History</h1>
        <p className="text-lg text-muted-foreground">A comprehensive record of all transactions.</p>
      </header>
      <SalesDataTable />
    </div>
  );
}