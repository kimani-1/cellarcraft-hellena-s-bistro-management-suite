import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format } from 'date-fns';
import { api } from '@/lib/api-client';
import type { Sale, Product } from '@shared/types';
import { ServerCrash } from 'lucide-react';
import { ChartSkeleton } from '@/components/chart-skeleton';
const COLORS = ['#d4af37', '#a07d28', '#581c1c', '#8a6d4a', '#b08f57'];
export function AnalyticsPage() {
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
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const salesByDay = useMemo(() => {
    const salesMap = sales.reduce((acc, sale) => {
      const day = format(new Date(sale.timestamp), 'MMM dd');
      acc[day] = (acc[day] || 0) + sale.total;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(salesMap).map(([name, sales]) => ({ name, sales })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [sales]);
  const profitByDay = useMemo(() => {
    const productsById = new Map(products.map(p => [p.id, p]));
    const profitMap = sales.reduce((acc, sale) => {
      const day = format(new Date(sale.timestamp), 'MMM dd');
      const costOfSale = sale.items.reduce((sum, item) => {
        const product = productsById.get(item.productId);
        return sum + (product?.cost || 0) * item.quantity;
      }, 0);
      const profit = sale.total - costOfSale;
      acc[day] = (acc[day] || 0) + profit;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(profitMap).map(([name, profit]) => ({ name, profit })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [sales, products]);
  const topSellingProducts = useMemo(() => {
    const productSales = sales.flatMap(sale => sale.items).reduce((acc, item) => {
      acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(productSales)
      .map(([productId, quantity]) => ({
        productId,
        name: products.find(p => p.id === productId)?.name || 'Unknown',
        quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales, products]);
  const salesByCategory = useMemo(() => {
    const categorySales = sales.flatMap(sale => sale.items).reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        acc[product.type] = (acc[product.type] || 0) + item.price * item.quantity;
      }
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(categorySales).map(([name, value]) => ({ name, value }));
  }, [sales, products]);
  if (isLoading) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-lg text-muted-foreground">Insights into your sales and product performance.</p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">Failed to Load Analytics</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-lg text-muted-foreground">Insights into your sales and product performance.</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `KSH ${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value: number) => [`KSH ${value.toFixed(2)}`, 'Sales']} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Profit Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profitByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `KSH ${value}`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value: number) => [`KSH ${value.toFixed(2)}`, 'Profit']} />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Top 5 Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={120} tick={{ width: 110, textAnchor: 'end' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} />
                  <Legend />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                      return (
                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value: number) => `KSH ${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}