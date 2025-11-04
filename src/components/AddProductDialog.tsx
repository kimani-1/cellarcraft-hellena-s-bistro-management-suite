import { useRef } from "react";
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
import { ImageIcon } from "lucide-react";
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["Wine", "Spirit", "Liqueur", "Beer"]),
  origin: z.string().min(2, "Origin is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  stockLevel: z.coerce.number().int().min(0, "Stock must be a positive integer"),
  lowStockThreshold: z.coerce.number().int().min(0, "Threshold must be a positive integer"),
  imageUrl: z.string().optional(),
});
type AddProductFormData = z.infer<typeof productSchema>;
interface AddProductDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onProductAdded: (product: Product) => void;
}
export function AddProductDialog({ isOpen, setIsOpen, onProductAdded }: AddProductDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      type: 'Wine' as const,
      origin: '',
      price: 0,
      cost: 0,
      stockLevel: 0,
      lowStockThreshold: 10,
      imageUrl: '',
    }
  });
  const imageUrl = watch("imageUrl");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) { // 100KB limit
        toast.error("Image too large", { description: "Please select an image smaller than 100KB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("imageUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: AddProductFormData) => {
    try {
      const productData = {
        ...data,
        imageUrl: data.imageUrl || '',
      };
      const newProduct = await api<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      onProductAdded(newProduct);
      toast.success("Product Added!", { description: `${newProduct.name} has been added to the inventory.` });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to add product", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product to add it to your inventory.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Input id="price" type="number" step="0.01" {...register("price")} className="col-span-3" />
              {errors.price && <p className="col-span-4 text-red-500 text-xs text-right">{errors.price.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">Cost (KSH)</Label>
              <Input id="cost" type="number" step="0.01" {...register("cost")} className="col-span-3" />
              {errors.cost && <p className="col-span-4 text-red-500 text-xs text-right">{errors.cost.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockLevel" className="text-right">Stock Level</Label>
              <Input id="stockLevel" type="number" {...register("stockLevel")} className="col-span-3" />
              {errors.stockLevel && <p className="col-span-4 text-red-500 text-xs text-right">{errors.stockLevel.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lowStockThreshold" className="text-right">Low Stock Threshold</Label>
              <Input id="lowStockThreshold" type="number" {...register("lowStockThreshold")} className="col-span-3" />
              {errors.lowStockThreshold && <p className="col-span-4 text-red-500 text-xs text-right">{errors.lowStockThreshold.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Image</Label>
              <div className="col-span-3 flex items-center gap-4">
                <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted/50">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Product preview" className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Upload Image
                </Button>
              </div>
              {errors.imageUrl && <p className="col-span-4 text-red-500 text-xs text-right">{errors.imageUrl.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}