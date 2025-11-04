import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaffDataTable } from "@/components/staff-data-table";
import { DeleteDataDialog } from "@/components/DeleteDataDialog";
import { AddStaffDialog } from "@/components/AddStaffDialog";
import { api } from "@/lib/api-client";
import type { StaffMember } from "@shared/types";
export function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedData = await api<{ items: StaffMember[] }>('/api/staff');
        setStaff(fetchedData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleStaffAdded = (newStaffMember: StaffMember) => {
    setStaff(prev => [newStaffMember, ...prev]);
  };
  return (
    <div className="space-y-8">
      <DeleteDataDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} />
      <AddStaffDialog
        isOpen={isAddStaffDialogOpen}
        setIsOpen={setIsAddStaffDialogOpen}
        onStaffAdded={handleStaffAdded}
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
            <CardContent className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="profileName">Name</Label>
                <Input id="profileName" defaultValue="Hellena Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileEmail">Email</Label>
                <Input id="profileEmail" type="email" defaultValue="owner@cellarcraft.com" />
              </div>
              <Button className="bg-gold text-charcoal hover:bg-gold/90">Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="bg-gold text-charcoal hover:bg-gold/90">Change Password</Button>
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
                isLoading={isLoading}
                error={error}
                onAddStaff={() => setIsAddStaffDialogOpen(true)}
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
            <CardContent className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="Hellena's Bistro" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input id="taxRate" type="number" defaultValue="16" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency Symbol</Label>
                <Input id="currency" defaultValue="KSH" />
              </div>
              <Button className="bg-gold text-charcoal hover:bg-gold/90">Save Changes</Button>
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