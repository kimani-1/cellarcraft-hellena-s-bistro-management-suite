import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Sale, Product } from "@shared/types";
import { format } from "date-fns";
import { Printer } from "lucide-react";
import { useRef } from "react";
interface SaleReceiptDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sale: Sale | null;
  products: Product[];
}
export function SaleReceiptDialog({ isOpen, setIsOpen, sale, products }: SaleReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const productsById = new Map(products.map(p => [p.id, p]));
  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Receipt</title>');
        printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } .text-right { text-align: right; } .font-bold { font-weight: bold; } .mt-4 { margin-top: 1rem; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
  if (!sale) return null;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Sale Receipt</DialogTitle>
          <DialogDescription>
            Details for sale ID: {sale.id}
          </DialogDescription>
        </DialogHeader>
        <div ref={receiptRef} className="text-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-lg">Hellena's Bistro</h3>
            <p>Sale ID: {sale.id}</p>
            <p>Date: {format(new Date(sale.timestamp), "PPP p")}</p>
            <p>Customer: {sale.customerName}</p>
            <p>Payment: {sale.paymentMethod}</p>
          </div>
          <Separator className="my-4" />
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left font-bold">Item</th>
                <th className="text-center font-bold">Qty</th>
                <th className="text-right font-bold">Price</th>
                <th className="text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => {
                const product = productsById.get(item.productId);
                return (
                  <tr key={index}>
                    <td>{product?.name || 'Unknown Product'}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">KSH {item.price.toFixed(2)}</td>
                    <td className="text-right">KSH {(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Separator className="my-4" />
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-right">KSH {(sale.total / 1.16).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (16%)</span>
              <span className="text-right">KSH {(sale.total - sale.total / 1.16).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-right">KSH {sale.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePrint} className="bg-gold text-charcoal hover:bg-gold/90">
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}