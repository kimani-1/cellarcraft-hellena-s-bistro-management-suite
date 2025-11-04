import { useState, useEffect } from "react";
import { SalesDataTable } from "@/components/sales-data-table";
import { SaleReceiptDialog } from "@/components/SaleReceiptDialog";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { api } from "@/lib/api-client";
import type { Sale, Product } from "@shared/types";
import { toast } from "sonner";
export function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [salesData, productsData] = await Promise.all([
          api<{ items: Sale[] }>('/api/sales'),
          api<{ items: Product[] }>('/api/products'),
        ]);
        setSales(salesData.items || []);
        setProducts(productsData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sales data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleViewReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setIsReceiptOpen(true);
  };
  const handleDelete = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedSale) return;
    try {
      await api(`/api/sales/${selectedSale.id}`, { method: 'DELETE' });
      setSales(prev => prev.filter(s => s.id !== selectedSale.id));
      toast.success("Sale Deleted", { description: `Sale record ${selectedSale.id} has been removed.` });
    } catch (err) {
      toast.error("Failed to delete sale", { description: err instanceof Error ? err.message : "An unknown error occurred." });
    } finally {
      setIsDeleteOpen(false);
      setSelectedSale(null);
    }
  };
  return (
    <div className="space-y-8">
      <SaleReceiptDialog
        isOpen={isReceiptOpen}
        setIsOpen={setIsReceiptOpen}
        sale={selectedSale}
        products={products}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onConfirm={confirmDelete}
        title="Delete Sale Record?"
        description={`Are you sure you want to delete this sale record (${selectedSale?.id})? This action cannot be undone.`}
      />
      <header>
        <h1 className="text-4xl font-display font-bold text-foreground">Sales History</h1>
        <p className="text-lg text-muted-foreground">A comprehensive record of all transactions.</p>
      </header>
      <SalesDataTable
        data={sales}
        isLoading={isLoading}
        error={error}
        onViewReceipt={handleViewReceipt}
        onDelete={handleDelete}
      />
    </div>
  );
}