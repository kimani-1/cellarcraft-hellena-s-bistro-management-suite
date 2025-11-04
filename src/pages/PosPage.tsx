import React, { useState, useMemo, useEffect } from 'react';
import type { Product, Sale } from '@shared/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, Trash2, CreditCard, ServerCrash, Wallet } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
type CartItem = {
  product: Product;
  quantity: number;
};
function PosProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  return (
    <Card
      className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 cursor-pointer group"
      onClick={() => onAddToCart(product)}
    >
      <div className="aspect-w-1 aspect-h-1">
        <img src={product.imageUrl || 'https://placehold.co/400x400/1a1a1a/d4af37?text=No+Image'} alt={product.name} className="object-cover w-full h-full" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-foreground truncate">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.origin}</p>
        <p className="text-lg font-bold text-gold mt-1">KSH {product.price.toFixed(2)}</p>
      </div>
    </Card>
  );
}
export function PosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await api<{ items: Product[] }>('/api/products');
        setProducts(fetchedData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const filteredProducts = useMemo(() => products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm, products]);
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.product.id !== productId);
      }
      return prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + tax;
  const handlePayment = async (method: 'Mpesa' | 'Cash') => {
    if (cart.length === 0) {
      toast.error('Empty Cart', { description: 'Please add items to the cart before proceeding.' });
      return;
    }
    if (method === 'Mpesa' && !phoneNumber.match(/^254\d{9}$/)) {
      toast.error('Invalid Phone Number', { description: 'Please enter a valid Safaricom number starting with 254.' });
      return;
    }
    setIsProcessing(true);
    const toastId = toast.loading('Processing Sale...', { description: `Using ${method} for KSH ${total.toFixed(2)}` });
    try {
      const salePayload = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: total,
        paymentMethod: method,
        customerName: customerName || 'Walk-in',
      };
      await api<Sale>('/api/sales', {
        method: 'POST',
        body: JSON.stringify(salePayload),
      });
      // Mocking payment success flow
      setTimeout(() => {
        toast.success('Payment Successful!', { id: toastId, description: `Completed payment of KSH ${total.toFixed(2)}.` });
        setCart([]);
        setPhoneNumber('');
        setCustomerName('');
      }, 1500);
    } catch (error) {
      toast.error('Sale Failed', { id: toastId, description: error instanceof Error ? error.message : 'Could not process the sale.' });
    } finally {
      setIsProcessing(false);
    }
  };
  const renderProductGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-full">
          <ServerCrash className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold text-destructive">Failed to Load Products</h3>
          <p className="text-muted-foreground mt-2 text-sm">{error}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pr-4">
        {filteredProducts.map(product => (
          <PosProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    );
  };
  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <Toaster richColors position="top-right" />
      <div className="flex-[2] flex flex-col bg-card/30 p-4 rounded-lg border border-border/50">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="flex-1">
          {renderProductGrid()}
        </ScrollArea>
      </div>
      <div className="flex-1 flex flex-col bg-card/30 p-6 rounded-lg border border-border/50">
        <h2 className="text-2xl font-display font-bold text-foreground mb-4">Current Order</h2>
        <ScrollArea className="flex-1 -mr-4 pr-4">
          {cart.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-4">
                  <img src={item.product.imageUrl || 'https://placehold.co/64x64/1a1a1a/d4af37?text=No+Image'} alt={item.product.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">KSH {item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <p className="w-20 text-right font-semibold">KSH {(item.product.price * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => updateQuantity(item.product.id, 0)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <Separator className="my-4 bg-border/50" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>KSH {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (16%)</span>
            <span>KSH {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gold">
            <span>Total</span>
            <span>KSH {total.toFixed(2)}</span>
          </div>
        </div>
        <Separator className="my-4 bg-border/50" />
        <div className="space-y-4">
            <Input
                placeholder="Customer Name (Optional)"
                className="bg-background/50"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
                type="tel"
                placeholder="M-Pesa Number: 2547..."
                className="bg-background/50"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handlePayment('Mpesa')}
                  disabled={cart.length === 0 || isProcessing}
              >
                  <CreditCard className="mr-2 h-4 w-4" /> {isProcessing ? 'Processing...' : 'M-Pesa'}
              </Button>
              <Button
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                  onClick={() => handlePayment('Cash')}
                  disabled={cart.length === 0 || isProcessing}
              >
                  <Wallet className="mr-2 h-4 w-4" /> {isProcessing ? 'Processing...' : 'Cash'}
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}