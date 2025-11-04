import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
interface DeleteDataDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
export function DeleteDataDialog({ isOpen, setIsOpen }: DeleteDataDialogProps) {
  const handleClearData = async () => {
    const toastId = toast.loading("Clearing all data...");
    try {
      await api('/api/all-data', { method: 'DELETE' });
      toast.success("All Data Cleared", {
        id: toastId,
        description: "The application has been reset to its initial state.",
      });
      // Optionally, force a page reload to reflect the cleared state everywhere
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error("Failed to clear data", {
        id: toastId,
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all inventory, sales, customer, and other records from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearData}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, delete all data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}