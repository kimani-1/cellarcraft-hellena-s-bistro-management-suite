import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from '@/lib/api-client';
import type { OnlineOrder } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ServerCrash } from 'lucide-react';
const salesData = [
  { name: 'In-Store', sales: 8750 },
  { name: 'Online', sales: 2340 },
];
const statusConfig = {
  'Pending Fulfillment': 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  'Shipped': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  'Delivered': 'bg-green-400/20 text-green-300 border-green-400/30',
}
export function EcommercePage() {
  const [orders, setOrders] = useState<OnlineOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await api<{ items: OnlineOrder[] }>('/api/online-orders');
        setOrders(fetchedData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch online orders.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);
  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-28" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
        </TableRow>
      ));
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center text-destructive">
            {error}
          </TableCell>
        </TableRow>
      );
    }
    if (orders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            No recent online orders.
          </TableCell>
        </TableRow>
      );
    }
    return orders.map((order) => (
      <TableRow key={order.id}>
        <TableCell className="font-medium">{order.id}</TableCell>
        <TableCell>{order.customerName}</TableCell>
        <TableCell>{format(new Date(order.orderDate), "PPP")}</TableCell>
        <TableCell>
          <Badge variant="outline" className={cn("font-semibold", statusConfig[order.status])}>
            {order.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">KSH {order.total.toFixed(2)}</TableCell>
      </TableRow>
    ));
  };
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-display font-bold text-foreground">E-commerce</h1>
        <p className="text-lg text-muted-foreground">Monitor and manage your online store operations.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Online vs. In-Store Sales (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `KSH ${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value: number) => [`KSH ${value.toFixed(2)}`, 'Sales']} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sync Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
              <span className="text-green-400 font-bold text-lg">Synced</span>
            </div>
            <p className="text-muted-foreground text-sm">Last sync: Just now</p>
            <p className="text-center text-sm">Inventory and orders are up to date with your online platform.</p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Recent Online Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableBody()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}