import { useState, useEffect, useCallback } from 'react';
import { CustomerDataTable } from '@/components/customer-data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, ServerCrash } from 'lucide-react';
import { AddCustomerDialog } from '@/components/AddCustomerDialog';
import { EditCustomerDialog } from '@/components/EditCustomerDialog';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { api } from '@/lib/api-client';
import type { Customer } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedData = await api<{ items: Customer[] }>('/api/customers');
      setCustomers(fetchedData.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };
  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };
  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedCustomer) return;
    try {
      await api(`/api/customers/${selectedCustomer.id}`, { method: 'DELETE' });
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      toast.success("Customer Deleted", { description: `${selectedCustomer.name} has been removed.` });
    } catch (err) {
      toast.error("Failed to delete customer", { description: err instanceof Error ? err.message : "An unknown error occurred." });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <ServerCrash className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive">Failed to Load Customers</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      );
    }
    return <CustomerDataTable data={customers} onEdit={handleEdit} onDelete={handleDelete} />;
  };
  return (
    <div className="space-y-8">
      <AddCustomerDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onCustomerAdded={handleCustomerAdded}
      />
      <EditCustomerDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        customer={selectedCustomer}
        onCustomerUpdated={handleCustomerUpdated}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Customer?"
        description={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
      />
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Customers</h1>
          <p className="text-lg text-muted-foreground">Manage customer profiles and loyalty.</p>
        </div>
        <Button className="bg-gold text-charcoal hover:bg-gold/90" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Customer
        </Button>
      </header>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}