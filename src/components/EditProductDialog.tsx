import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["Wine", "Spirit", "Liqueur", "Beer"]),
  origin: z.string().min(2, "Origin is required"),
  price: z.string().min(1, "Price is required").transform(Number).pipe(z.number().min(0, "Price must be a positive number")),
  cost: z.string().min(1, "Cost is required").transform(Number).pipe(z.number().min(0, "Cost must be a positive number")),
  stockLevel: z.string().min(1, "Stock is required").transform(Number).pipe(z.number().int().min(0, "Stock must be a positive integer")),
  lowStockThreshold: z.string().min(1, "Threshold is required").transform(Number).pipe(z.number().int().min(0, "Threshold must be a positive integer")),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal('')).optional(),
});
type EditProductFormData = z.infer<typeof productSchema>;
interface EditProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: Product | null;
  onProductUpdated: (product: Product) => void;
}
export function EditProductDialog({ isOpen, setIsOpen, product, onProductUpdated }: EditProductDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<EditProductFormData>({
    resolver: zodResolver(productSchema),
  });
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        type: product.type,
        origin: product.origin,
        price: String(product.price),
        cost: String(product.cost || 0),
        stockLevel: String(product.stockLevel),
        lowStockThreshold: String(product.lowStockThreshold),
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product, reset]);
  const onSubmit = async (data: EditProductFormData) => {
    if (!product) return;
    try {
      const updatedProduct = await api<Product>(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      onProductUpdated(updatedProduct);
      toast.success("Product Updated!", { description: `${updatedProduct.name} has been updated.` });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update product", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Product</DialogTitle>
          <DialogDescription>
            Update the details for {product?.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wine">Wine</SelectItem>
                      <SelectItem value="Spirit">Spirit</SelectItem>
                      <SelectItem value="Liqueur">Liqueur</SelectItem>
                      <SelectItem value="Beer">Beer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="col-span-4 text-red-500 text-xs text-right">{errors.type.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origin" className="text-right">Origin</Label>
              <Input id="origin" {...register("origin")} className="col-span-3" />
              {errors.origin && <p className="col-span-4 text-red-500 text-xs text-right">{errors.origin.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (KSH)</Label>
              <Input id="price" type="text" inputMode="decimal" {...register("price")} className="col-span-3" />
              {errors.price && <p className="col-span-4 text-red-500 text-xs text-right">{errors.price.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost (KSH)</Label>
              <Input id="cost" type="text" inputMode="decimal" {...register("cost")} className="col-span-3" />
              {errors.cost && <p className="col-span-4 text-red-500 text-xs text-right">{errors.cost.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockLevel" className="text-right">Stock Level</Label>
              <Input id="stockLevel" type="text" inputMode="numeric" {...register("stockLevel")} className="col-span-3" />
              {errors.stockLevel && <p className="col-span-4 text-red-500 text-xs text-right">{errors.stockLevel.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Threshold</Label>
              <Input id="lowStockThreshold" type="text" inputMode="numeric" {...register("lowStockThreshold")} className="col-span-3" />
              {errors.lowStockThreshold && <p className="col-span-4 text-red-500 text-xs text-right">{errors.lowStockThreshold.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input id="imageUrl" {...register("imageUrl")} className="col-span-3" placeholder="https://example.com/image.jpg" />
              {errors.imageUrl && <p className="col-span-4 text-red-500 text-xs text-right">{errors.imageUrl.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}