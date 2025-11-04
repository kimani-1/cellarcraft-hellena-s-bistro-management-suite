import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Product } from '@shared/types';
import { MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
}
export function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  const isLowStock = product.stockLevel <= product.lowStockThreshold;
  return (
    <Card className="flex flex-col overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 group">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70">
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="aspect-w-4 aspect-h-5">
          <img
            src={product.imageUrl || 'https://placehold.co/400x500/1a1a1a/d4af37?text=No+Image'}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <Badge variant="secondary" className="mb-2 bg-gold/20 text-gold border-gold/30">{product.type}</Badge>
        <h3 className="text-lg font-display font-bold text-foreground">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.origin}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/20">
        <div>
          <div className="text-2xl font-bold text-gold">
            KSH {product.price.toFixed(2)}
          </div>
          <div className="text-xs text-muted-foreground">
            Cost: KSH {(product.cost || 0).toFixed(2)}
          </div>
        </div>
        <div
          className={cn(
            'text-right text-sm font-semibold',
            isLowStock ? 'text-red-400' : 'text-green-400'
          )}
        >
          {product.stockLevel} in stock
        </div>
      </CardFooter>
    </Card>
  );
}