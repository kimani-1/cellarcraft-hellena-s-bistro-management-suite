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
import type { StaffMember } from "@shared/types";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
const staffSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^254\d{9}$/, "Phone must be in the format 254xxxxxxxxx"),
  role: z.enum(["Owner", "Manager", "Clerk", "Sommelier"]),
});
type EditStaffFormData = z.infer<typeof staffSchema>;
interface EditStaffDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  staffMember: StaffMember | null;
  onStaffUpdated: (staffMember: StaffMember) => void;
}
export function EditStaffDialog({ isOpen, setIsOpen, staffMember, onStaffUpdated }: EditStaffDialogProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<EditStaffFormData>({
    resolver: zodResolver(staffSchema),
  });
  useEffect(() => {
    if (staffMember) {
      reset({
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone,
        role: staffMember.role,
      });
    }
  }, [staffMember, reset]);
  const onSubmit = async (data: EditStaffFormData) => {
    if (!staffMember) return;
    try {
      const updatedStaff = await api<StaffMember>(`/api/staff/${staffMember.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      onStaffUpdated(updatedStaff);
      toast.success("Staff Member Updated!", { description: `${updatedStaff.name}'s details have been updated.` });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to update staff member", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit Staff Member</DialogTitle>
          <DialogDescription>
            Update the details for {staffMember?.name}.
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}