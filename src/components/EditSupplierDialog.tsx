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
import type { Supplier } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
const supplierSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  contactPerson: z.string().min(3, "Contact person is required"),
  phone: z.string().regex(/^254\d{9}$/, "Phone must be in the format 254xxxxxxxxx"),
  email: z.string().email("Invalid email address"),
  category: z.enum(['Wine', 'Spirits', 'International Imports', 'Local Craft']),
});
type EditSupplierFormData = z.infer<typeof supplierSchema>;
interface EditSupplierDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  supplier: Supplier | null;
  onSupplierUpdated: (supplier: Supplier) => void;
}
export function EditSupplierDialog({ isOpen, setIsOpen, supplier, onSupplierUpdated }: EditSupplierDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<EditSupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });
  useEffect(() => {
    if (supplier) {
      reset(supplier);
    }
  }, [supplier, reset]);
  const onSubmit = async (data: EditSupplierFormData) => {
    if (!supplier) return;
    try {
      const updatedSupplier = await api<Supplier>(`/api/suppliers/${supplier.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      onSupplierUpdated(updatedSupplier);
      toast.success("Supplier Updated!", { description: `${updatedSupplier.name}'s details have been updated.` });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update supplier", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Supplier</DialogTitle>
          <DialogDescription>
            Update the details for {supplier?.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" {...register("contactPerson")} />
              {errors.contactPerson && <p className="text-red-500 text-xs">{errors.contactPerson.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="254712345678" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wine">Wine</SelectItem>
                      <SelectItem value="Spirits">Spirits</SelectItem>
                      <SelectItem value="International Imports">International Imports</SelectItem>
                      <SelectItem value="Local Craft">Local Craft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
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