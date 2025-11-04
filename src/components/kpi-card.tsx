import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Kpi } from '@shared/types';
export function KpiCard({ title, value, change, changeType }: Kpi) {
  const isIncrease = changeType === 'increase';
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-display text-foreground">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span
            className={cn(
              'flex items-center gap-1',
              isIncrease ? 'text-green-400' : 'text-red-400'
            )}
          >
            {isIncrease ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {change}
          </span>
          <span className="ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}