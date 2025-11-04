import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/product-card';
import { Search, PlusCircle, ServerCrash } from 'lucide-react';
import type { Product } from '@shared/types';
import { AddProductDialog } from '@/components/AddProductDialog';
import { EditProductDialog } from '@/components/EditProductDialog';
import { api } from '@/lib/api-client';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, subDays } from 'date-fns';
export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await api<{ items: Product[] }>('/api/products');
        setProducts(fetchedData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const agingInventory = products.filter(product => {
    const ninetyDaysAgo = subDays(new Date(), 90).getTime();
    return product.createdAt < ninetyDaysAgo && product.stockLevel > 0;
  }).sort((a, b) => a.createdAt - b.createdAt);
  const handleProductAdded = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  const handleDeleteProduct = async (productId: string) => {
    try {
      await api(`/api/products/${productId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Product Deleted", { description: "The product has been removed from inventory." });
    } catch (error) {
      toast.error("Failed to delete product", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  const renderAllProducts = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <ServerCrash className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold text-destructive">Failed to Load Inventory</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      );
    }
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Products Found</h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? 'Try adjusting your search term.' : 'Your inventory is empty. Add a new product to get started.'}
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
        ))}
      </div>
    );
  };
  return (
    <div className="space-y-8">
      <AddProductDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onProductAdded={handleProductAdded}
      />
      <EditProductDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Inventory</h1>
          <p className="text-lg text-muted-foreground">Manage your exquisite collection of spirits and wines.</p>
        </div>
        <Button className="bg-gold text-charcoal hover:bg-gold/90" onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
      </header>
      <Tabs defaultValue="all-products">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-card/50 border border-border/50">
            <TabsTrigger value="all-products">All Products</TabsTrigger>
            <TabsTrigger value="aging-inventory">Aging Inventory</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, type, or origin..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <TabsContent value="all-products" className="mt-6">
          {renderAllProducts()}
        </TabsContent>
        <TabsContent value="aging-inventory" className="mt-6">
          <div className="rounded-md border bg-card/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3}><Skeleton className="h-20 w-full" /></TableCell></TableRow>
                ) : agingInventory.length > 0 ? (
                  agingInventory.map(product => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.stockLevel}</TableCell>
                      <TableCell>{format(new Date(product.createdAt), 'PPP')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No aging inventory found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}