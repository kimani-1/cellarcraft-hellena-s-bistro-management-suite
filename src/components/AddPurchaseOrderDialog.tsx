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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PurchaseOrder, Supplier } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
const poSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  expectedDeliveryDate: z.date(),
  itemCount: z.coerce.number().int().min(1, "Item count must be at least 1"),
  totalValue: z.coerce.number().min(0, "Total value must be a positive number"),
});
type AddPOFormData = z.infer<typeof poSchema>;
interface AddPurchaseOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  suppliers: Supplier[];
  onPurchaseOrderAdded: (order: PurchaseOrder) => void;
}
export function AddPurchaseOrderDialog({ isOpen, setIsOpen, suppliers, onPurchaseOrderAdded }: AddPurchaseOrderDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<AddPOFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      itemCount: 1,
      totalValue: 0,
      expectedDeliveryDate: new Date(),
    }
  });
  const onSubmit = async (data: AddPOFormData) => {
    try {
      const supplier = suppliers.find(s => s.id === data.supplierId);
      if (!supplier) {
        toast.error("Invalid supplier selected.");
        return;
      }
      const poData = {
        ...data,
        supplierName: supplier.name,
        expectedDeliveryDate: data.expectedDeliveryDate.getTime(),
      };
      const newOrder = await api<PurchaseOrder>('/api/purchase-orders', {
        method: 'POST',
        body: JSON.stringify(poData),
      });
      onPurchaseOrderAdded(newOrder);
      toast.success("Purchase Order Created!", { description: `PO #${newOrder.id} has been created.` });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create Purchase Order", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create Purchase Order</DialogTitle>
          <DialogDescription>
            Select a supplier and enter the order details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplierId">Supplier</Label>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.supplierId && <p className="text-red-500 text-xs">{errors.supplierId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDeliveryDate">Expected Delivery</Label>
              <Controller
                name="expectedDeliveryDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.expectedDeliveryDate && <p className="text-red-500 text-xs">{errors.expectedDeliveryDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemCount">Number of Items</Label>
              <Input id="itemCount" type="number" {...register("itemCount")} />
              {errors.itemCount && <p className="text-red-500 text-xs">{errors.itemCount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalValue">Total Value (KSH)</Label>
              <Input id="totalValue" type="number" step="0.01" {...register("totalValue")} />
              {errors.totalValue && <p className="text-red-500 text-xs">{errors.totalValue.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}