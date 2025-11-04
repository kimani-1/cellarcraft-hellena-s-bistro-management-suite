import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { SupplierDataTable } from "../components/supplier-data-table";
import { PurchaseOrderDataTable } from "../components/purchase-order-data-table";
import { AddPurchaseOrderDialog } from "@/components/AddPurchaseOrderDialog";
import { EditSupplierDialog } from "@/components/EditSupplierDialog";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { api } from "@/lib/api-client";
import type { Supplier, PurchaseOrder } from "@shared/types";
import { toast } from "sonner";
export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddPoDialogOpen, setIsAddPoDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [suppliersData, poData] = await Promise.all([
          api<{ items: Supplier[] }>('/api/suppliers'),
          api<{ items: PurchaseOrder[] }>('/api/purchase-orders'),
        ]);
        setSuppliers(suppliersData.items || []);
        setPurchaseOrders(poData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch procurement data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handlePurchaseOrderAdded = (newOrder: PurchaseOrder) => {
    setPurchaseOrders(prev => [newOrder, ...prev]);
  };
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };
  const handleSupplierUpdated = (updatedSupplier: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };
  const handleDeleteSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };
  const confirmDeleteSupplier = async () => {
    if (!selectedSupplier) return;
    try {
      await api(`/api/suppliers/${selectedSupplier.id}`, { method: 'DELETE' });
      setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
      toast.success("Supplier Deleted", { description: `${selectedSupplier.name} has been removed.` });
    } catch (err) {
      toast.error("Failed to delete supplier", { description: err instanceof Error ? err.message : "An unknown error occurred." });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };
  return (
    <div className="space-y-8">
      <AddPurchaseOrderDialog
        isOpen={isAddPoDialogOpen}
        setIsOpen={setIsAddPoDialogOpen}
        suppliers={suppliers}
        onPurchaseOrderAdded={handlePurchaseOrderAdded}
      />
      <EditSupplierDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        supplier={selectedSupplier}
        onSupplierUpdated={handleSupplierUpdated}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteSupplier}
        title="Delete Supplier?"
        description={`Are you sure you want to delete ${selectedSupplier?.name}? This action cannot be undone.`}
      />
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Suppliers & Procurement</h1>
          <p className="text-lg text-muted-foreground">Manage your vendor relationships and purchase orders.</p>
        </div>
        <Button className="bg-gold text-charcoal hover:bg-gold/90" onClick={() => setIsAddPoDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </header>
      <Tabs defaultValue="suppliers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-card/50 border border-border/50">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="suppliers" className="mt-6">
          <SupplierDataTable
            data={suppliers}
            isLoading={isLoading}
            error={error}
            onEdit={handleEditSupplier}
            onDelete={handleDeleteSupplier}
          />
        </TabsContent>
        <TabsContent value="purchase-orders" className="mt-6">
          <PurchaseOrderDataTable data={purchaseOrders} isLoading={isLoading} error={error} />
        </TabsContent>
      </Tabs>
    </div>
  );
}