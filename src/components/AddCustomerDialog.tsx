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
import type { Customer } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
const customerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^254\d{9}$/, "Phone must be in the format 254xxxxxxxxx"),
  email: z.string().email("Invalid email address").or(z.literal('')).optional(),
  loyaltyTier: z.enum(["Bronze", "Silver", "Gold", "VIP"]),
});
type AddCustomerFormData = z.infer<typeof customerSchema>;
interface AddCustomerDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCustomerAdded: (customer: Customer) => void;
}
export function AddCustomerDialog({ isOpen, setIsOpen, onCustomerAdded }: AddCustomerDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<AddCustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      loyaltyTier: "Bronze",
    }
  });
  const onSubmit = async (data: AddCustomerFormData) => {
    try {
      const newCustomer = await api<Customer>('/api/customers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      onCustomerAdded(newCustomer);
      toast.success("Customer Added!", { description: `${newCustomer.name} has been added.` });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to add customer", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add New Customer</DialogTitle>
          <DialogDescription>
            Enter the details for the new customer.
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
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" {...register("phone")} className="col-span-3" placeholder="254712345678" />
              {errors.phone && <p className="col-span-4 text-red-500 text-xs text-right">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" {...register("email")} className="col-span-3" placeholder="Optional" />
              {errors.email && <p className="col-span-4 text-red-500 text-xs text-right">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loyaltyTier" className="text-right">Loyalty Tier</Label>
              <Controller
                name="loyaltyTier"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.loyaltyTier && <p className="col-span-4 text-red-500 text-xs text-right">{errors.loyaltyTier.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}