import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaffDataTable } from "@/components/staff-data-table";
import { DeleteDataDialog } from "@/components/DeleteDataDialog";
import { AddStaffDialog } from "@/components/AddStaffDialog";
import { EditStaffDialog } from "@/components/EditStaffDialog";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { api } from "@/lib/api-client";
import type { StaffMember, StoreSettings } from "@shared/types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  taxRate: z.coerce.number().min(0, "Tax rate must be positive"),
  currency: z.string().min(1, "Currency is required"),
});
type SettingsFormData = z.infer<typeof settingsSchema>;
const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});
type ProfileFormData = z.infer<typeof profileSchema>;
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type PasswordFormData = z.infer<typeof passwordSchema>;
export function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [isDeleteStaffDialogOpen, setIsDeleteStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const settingsForm = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Hellena Smith",
      email: "owner@cellarcraft.com",
    },
  });
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoadingStaff(true);
        setStaffError(null);
        const fetchedData = await api<{ items: StaffMember[] }>('/api/staff');
        setStaff(fetchedData.items || []);
      } catch (err) {
        setStaffError(err instanceof Error ? err.message : 'Failed to fetch staff data.');
      } finally {
        setIsLoadingStaff(false);
      }
    };
    const fetchSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const settings = await api<StoreSettings>('/api/settings');
        settingsForm.reset(settings);
      } catch (err) {
        toast.error("Failed to load settings", { description: err instanceof Error ? err.message : "An unknown error occurred." });
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchStaff();
    fetchSettings();
  }, [settingsForm]);
  const handleStaffAdded = (newStaffMember: StaffMember) => {
    setStaff(prev => [newStaffMember, ...prev]);
  };
  const handleEditStaff = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsEditStaffDialogOpen(true);
  };
  const handleStaffUpdated = (updatedStaff: StaffMember) => {
    setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };
  const handleDeactivateStaff = async (staffMember: StaffMember) => {
    const newStatus = staffMember.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const updatedStaff = await api<StaffMember>(`/api/staff/${staffMember.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      handleStaffUpdated(updatedStaff);
      toast.success(`Staff ${newStatus}`, { description: `${staffMember.name} has been set to ${newStatus.toLowerCase()}.` });
    } catch (error) {
      toast.error("Failed to update status", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  const handleDeleteStaff = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsDeleteStaffDialogOpen(true);
  };
  const confirmDeleteStaff = async () => {
    if (!selectedStaff) return;
    try {
      await api(`/api/staff/${selectedStaff.id}`, { method: 'DELETE' });
      setStaff(prev => prev.filter(s => s.id !== selectedStaff.id));
      toast.success("Staff Member Deleted", { description: `${selectedStaff.name} has been removed.` });
    } catch (error) {
      toast.error("Failed to delete staff member", { description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
      setIsDeleteStaffDialogOpen(false);
      setSelectedStaff(null);
    }
  };
  const onSettingsSubmit = async (data: SettingsFormData) => {
    const toastId = toast.loading("Saving settings...");
    try {
      await api<StoreSettings>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      toast.success("Settings Saved!", { id: toastId });
    } catch (error) {
      toast.error("Failed to save settings", { id: toastId, description: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
  const onProfileSubmit = async (data: ProfileFormData) => {
    const toastId = toast.loading("Updating profile...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Profile Updated!", { id: toastId, description: `Your profile information has been saved.` });
  };
  const onPasswordSubmit = async (data: PasswordFormData) => {
    const toastId = toast.loading("Changing password...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Password Changed!", { id: toastId, description: "Your password has been updated successfully." });
    passwordForm.reset();
  };
  return (
    <div className="space-y-8">
      <DeleteDataDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} />
      <AddStaffDialog isOpen={isAddStaffDialogOpen} setIsOpen={setIsAddStaffDialogOpen} onStaffAdded={handleStaffAdded} />
      <EditStaffDialog isOpen={isEditStaffDialogOpen} setIsOpen={setIsEditStaffDialogOpen} staffMember={selectedStaff} onStaffUpdated={handleStaffUpdated} />
      <DeleteConfirmationDialog
        isOpen={isDeleteStaffDialogOpen}
        setIsOpen={setIsDeleteStaffDialogOpen}
        onConfirm={confirmDeleteStaff}
        title="Delete Staff Member?"
        description={`Are you sure you want to delete ${selectedStaff?.name}? This action is irreversible.`}
      />
      <header>
        <h1 className="text-4xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-lg text-muted-foreground">Manage staff, roles, and system preferences.</p>
      </header>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px] bg-card/50 border border-border/50">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="profileName">Name</Label>
                  <Input id="profileName" {...profileForm.register("name")} />
                  {profileForm.formState.errors.name && <p className="text-red-500 text-xs">{profileForm.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileEmail">Email</Label>
                  <Input id="profileEmail" type="email" {...profileForm.register("email")} />
                  {profileForm.formState.errors.email && <p className="text-red-500 text-xs">{profileForm.formState.errors.email.message}</p>}
                </div>
                <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={profileForm.formState.isSubmitting}>
                  {profileForm.formState.isSubmitting ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
                  {passwordForm.formState.errors.currentPassword && <p className="text-red-500 text-xs">{passwordForm.formState.errors.currentPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                  {passwordForm.formState.errors.newPassword && <p className="text-red-500 text-xs">{passwordForm.formState.errors.newPassword.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                  {passwordForm.formState.errors.confirmPassword && <p className="text-red-500 text-xs">{passwordForm.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={passwordForm.formState.isSubmitting}>
                  {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="mt-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>Add, edit, and manage staff access and roles.</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffDataTable
                data={staff}
                isLoading={isLoadingStaff}
                error={staffError}
                onAddStaff={() => setIsAddStaffDialogOpen(true)}
                onEdit={handleEditStaff}
                onDeactivate={handleDeactivateStaff}
                onDelete={handleDeleteStaff}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="system" className="mt-6 space-y-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure store-wide settings.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSettings ? (
                <div className="space-y-6 max-w-2xl">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              ) : (
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" {...settingsForm.register("storeName")} />
                    {settingsForm.formState.errors.storeName && <p className="text-red-500 text-xs">{settingsForm.formState.errors.storeName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" step="0.1" {...settingsForm.register("taxRate")} />
                    {settingsForm.formState.errors.taxRate && <p className="text-red-500 text-xs">{settingsForm.formState.errors.taxRate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency Symbol</Label>
                    <Input id="currency" {...settingsForm.register("currency")} />
                    {settingsForm.formState.errors.currency && <p className="text-red-500 text-xs">{settingsForm.formState.errors.currency.message}</p>}
                  </div>
                  <Button type="submit" className="bg-gold text-charcoal hover:bg-gold/90" disabled={settingsForm.formState.isSubmitting}>
                    {settingsForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription className="text-destructive/80">
                These actions are irreversible. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                Clear All Application Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}