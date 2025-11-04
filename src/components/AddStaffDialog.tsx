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
import type { StaffMember } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
const staffSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^254\d{9}$/, "Phone must be in the format 254xxxxxxxxx"),
  role: z.enum(["Owner", "Manager", "Clerk", "Sommelier"]),
});
type AddStaffFormData = z.infer<typeof staffSchema>;
interface AddStaffDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onStaffAdded: (staffMember: StaffMember) => void;
}
export function AddStaffDialog({ isOpen, setIsOpen, onStaffAdded }: AddStaffDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<AddStaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Clerk',
    }
  });
  const onSubmit = async (data: AddStaffFormData) => {
    try {
      const newStaffMember = await api<StaffMember>('/api/staff', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      onStaffAdded(newStaffMember);
      toast.success("Staff Member Added!", { description: `${newStaffMember.name} has been added.` });
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to add staff member", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add New Staff Member</DialogTitle>
          <DialogDescription>
            Enter the details for the new staff member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="254712345678" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clerk">Clerk</SelectItem>
                      <SelectItem value="Sommelier">Sommelier</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Staff Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}