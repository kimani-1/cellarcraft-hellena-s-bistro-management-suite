import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { SupplierDataTable } from "../components/supplier-data-table";
import { PurchaseOrderDataTable } from "../components/purchase-order-data-table";
import { AddPurchaseOrderDialog } from "@/components/AddPurchaseOrderDialog";
import { api } from "@/lib/api-client";
import type { Supplier, PurchaseOrder } from "@shared/types";
export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
  return (
    <div className="space-y-8">
      <AddPurchaseOrderDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        suppliers={suppliers}
        onPurchaseOrderAdded={handlePurchaseOrderAdded}
      />
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Suppliers & Procurement</h1>
          <p className="text-lg text-muted-foreground">Manage your vendor relationships and purchase orders.</p>
        </div>
        <Button className="bg-gold text-charcoal hover:bg-gold/90" onClick={() => setIsAddDialogOpen(true)}>
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
          <SupplierDataTable data={suppliers} isLoading={isLoading} error={error} />
        </TabsContent>
        <TabsContent value="purchase-orders" className="mt-6">
          <PurchaseOrderDataTable data={purchaseOrders} isLoading={isLoading} error={error} />
        </TabsContent>
      </Tabs>
    </div>
  );
}