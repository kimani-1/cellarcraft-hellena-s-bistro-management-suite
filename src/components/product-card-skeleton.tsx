import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-w-4 aspect-h-5 w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/20">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </CardFooter>
    </Card>
  );
}