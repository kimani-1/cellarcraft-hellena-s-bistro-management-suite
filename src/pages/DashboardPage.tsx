import { useState, useEffect, useMemo } from 'react';
import { KpiCard } from '@/components/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api-client';
import type { Sale, Product, Kpi } from '@shared/types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { ServerCrash, Bot } from 'lucide-react';
export function DashboardPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const kpis = useMemo<Kpi[]>(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const todaysSalesList = sales.filter(s => s.timestamp >= todayStart.getTime() && s.timestamp <= todayEnd.getTime());
    const todaysSales = todaysSalesList.reduce((sum, s) => sum + s.total, 0);
    const productsById = new Map(products.map(p => [p.id, p]));
    const todaysCost = todaysSalesList.flatMap(s => s.items).reduce((sum, item) => {
        const product = productsById.get(item.productId);
        return sum + (product?.cost || 0) * item.quantity;
    }, 0);
    const todaysProfit = todaysSales - todaysCost;
    const inventoryLevel = products.reduce((sum, p) => sum + p.stockLevel, 0);
    const lowStockItems = products.filter(p => p.stockLevel <= p.lowStockThreshold).length;
    return [
      { title: "Today's Sales", value: `KSH ${todaysSales.toLocaleString()}`, change: '+12.5%', changeType: 'increase' },
      { title: "Today's Profit", value: `KSH ${todaysProfit.toLocaleString()}`, change: '+15.1%', changeType: 'increase' },
      { title: 'Inventory Level', value: `${inventoryLevel.toLocaleString()} Units`, change: '-1.5%', changeType: 'decrease' },
      { title: 'Low Stock Alerts', value: `${lowStockItems} Items`, change: '+2', changeType: 'increase' },
    ];
  }, [sales, products]);
  const weeklySalesData = useMemo(() => {
    const weekData: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const dayKey = format(day, 'E'); // Mon, Tue, etc.
      weekData[dayKey] = 0;
    }
    sales.forEach(sale => {
      const saleDate = new Date(sale.timestamp);
      if (saleDate >= subDays(new Date(), 7)) {
        const dayKey = format(saleDate, 'E');
        weekData[dayKey] = (weekData[dayKey] || 0) + sale.total;
      }
    });
    return Object.entries(weekData).map(([name, sales]) => ({ name, sales }));
  }, [sales]);
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">Failed to Load Dashboard</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">A real-time overview of Hellena's Bistro.</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card/50">
              <CardHeader className="pb-2"><Skeleton className="h-5 w-2/3" /></CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          kpis.map((kpi) => <KpiCard key={kpi.title} {...kpi} />)
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Weekly Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `KSH ${value/1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                      formatter={(value: number) => [`KSH ${value.toLocaleString()}`, 'Sales']}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bot className="h-6 w-6 text-gold" />
            <CardTitle className="font-display text-2xl">Smart Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">AI-powered insights to help you grow.</p>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/30 rounded-md border border-border/50">
                <p className="font-semibold text-foreground">Restock Alert</p>
                <p className="text-muted-foreground">Consider reordering <span className="text-gold">Tusker Lager</span>. Sales are up 25% this week.</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-md border border-border/50">
                <p className="font-semibold text-foreground">Upsell Opportunity</p>
                <p className="text-muted-foreground">Customers buying <span className="text-gold">Gilbeys Gin</span> also frequently buy <span className="text-gold">Tonic Water</span>.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}